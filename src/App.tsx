import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Play, Trophy, Users } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Inventory, WorldMap, Shop } from "./components/game";
import { InventorySprite } from "./components/game/character/InventorySprite";
import { MonsterBattle } from "./components/game/battle/MonsterBattle";

import { GuildMenu } from "./components/game/ui/GuildMenu";
import { QuestBoard } from "./components/game/ui/QuestBoard";
import { canLeaveRegion } from "./lib/region-utils";
import { CelebrationOverlay, QuickToast } from "./components/game/ui/CelebrationOverlay";
import {
  ClassMageIcon,
  ClassPriestIcon, ClassRogueIcon,
  ClassWarriorIcon,
  GoldIcon,
  GuildTabIcon,
  HealthIcon,
  InventoryTabIcon,
  ManaIcon,
  MapTabIcon,
  ShopTabIcon,
  SwordIcon,
  XPIcon,
  RankIcon,
  ClassArcherIcon
} from "./components/game/ui/GameIcons";
import { GuildEvolution } from "./components/game/ui/GuildEvolution";
import { audioManager } from "./lib/audio";
import { pokiService } from "./lib/poki";
import { ALL_ITEMS, CHARACTER_CLASSES, ENEMIES, getEnemy, getInitialCharacterStats, getStarterItems, QUEST_ENEMIES, QUESTS, SHOP_ITEMS } from "./lib/game-data";
import { getQuestMap } from "./lib/map-data";
import { acceptQuestFromNPC, completeQuestAfterBattle, hasFinishedMainStory, handleBattleFlee as logicHandleBattleFlee } from "./lib/quest-logic";
import { RANKS } from "./lib/rank-utils";
import { getRegionMapData } from "./lib/region-utils";
import { createCharacter as dbCreateCharacter, updateCharacter as dbUpdateCharacter, deleteCharacter, getAllCharacters, getCurrentCharacter, type CharacterClass } from "./lib/storage";
import type { Character, InventoryItem, NPC, Quest, Tab, Enemy, QuestState } from "./types/game";

const CLASS_ICONS: Record<CharacterClass, React.ReactNode> = {
  mage: <ClassMageIcon size={20} />,
  warrior: <ClassWarriorIcon size={20} />,
  priest: <ClassPriestIcon size={20} />,
  rogue: <ClassRogueIcon size={20} />,
  archer: <ClassArcherIcon size={20} />,
};

const MIN_WIDTH = 800;
const MIN_HEIGHT = 450;

function statusBar(label: string, value: number, max: number, type: "hp" | "mp" | "xp" | "attack" = "hp") {
  const progress = max > 0 ? Math.min(100, Math.floor((value / max) * 100)) : 0;
  const gradients: Record<string, string> = {
    hp: "from-red-700 to-red-500",
    mp: "from-blue-700 to-blue-500",
    xp: "from-emerald-700 to-emerald-500",
    attack: "from-amber-700 to-amber-500",
  };
  const bgColors: Record<string, string> = {
    hp: "bg-red-950/50",
    mp: "bg-blue-950/50",
    xp: "bg-emerald-950/50",
    attack: "bg-amber-950/50",
  };
  const labelIcons: Record<string, React.ReactNode> = {
    hp: <HealthIcon size={14} className="inline mr-1" />,
    mp: <ManaIcon size={14} className="inline mr-1" />,
    xp: <XPIcon size={14} className="inline mr-1" />,
    attack: <SwordIcon size={14} className="inline mr-1" />,
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-amber-200/80 flex items-center">
          {labelIcons[type]} {label}
        </span>
        <span className="text-slate-300 font-mono">{value}/{max}</span>
      </div>
      <div className={`h-6 rounded-full ${bgColors[type]} overflow-hidden border border-white/5 shadow-inner shadow-black/30`}>
        <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${gradients[type]}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("World Map");
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Quest and Battle States
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [questState, setQuestState] = useState<QuestState>("list");
  const [activeEnemy, setActiveEnemy] = useState<Enemy | null>(null);

  // Creation State
  const [createName, setCreateName] = useState("");
  const [createClass, setCreateClass] = useState<CharacterClass>("mage");
  const [createSkinColor, setCreateSkinColor] = useState("#FDE68A");
  const [createHairColor, setCreateHairColor] = useState("#8B5CF6");
  const [createClothingColor, setCreateClothingColor] = useState("#4C1D95");
  const [createFaceStyle, setCreateFaceStyle] = useState<"heroic" | "friendly" | "fierce" | "mysterious">("heroic");

  // UI Buffers
  const [celebration, setCelebration] = useState<{
    type: "quest-complete" | "level-up" | "item-obtained" | "first-victory";
    title: string;
    subtitle?: string;
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null);
  const [questToast, setQuestToast] = useState<{ message: string; icon: string } | null>(null);
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);

  // ── INITIALIZATION ─────────────────────────────────────
  useEffect(() => {
    Promise.all([
      getCurrentCharacter(),
      getAllCharacters()
    ]).then(([char, allChars]) => {
      if (char) {
        const enrichedChar = {
          ...char,
          skills: char.skills || getInitialCharacterStats(char.class).skills,
          inventory: char.inventory || getStarterItems(char.class),
          completedQuests: char.completedQuests || [],
          acceptedQuests: char.acceptedQuests || [],
          currentRegion: char.currentRegion || getInitialCharacterStats(char.class).currentRegion,
          discoveredTiles: char.discoveredTiles || {}
        };
        setCharacter(enrichedChar);
        setInventory(enrichedChar.inventory);
        setCompletedQuests(enrichedChar.completedQuests);
      }
      setAllCharacters(allChars);
      setIsLoading(false);
    });
  }, []);

  // Audio Sync
  useEffect(() => {
    audioManager.setMasterMute(!isMusicEnabled);
    if (isMusicEnabled && gameStarted) {
      audioManager.start();
      if (["World Map", "Inventory", "Shop", "Guild"].includes(activeTab)) {
        audioManager.playBgm("main");
      }
    } else {
      audioManager.stopBgm();
    }
  }, [isMusicEnabled, activeTab, gameStarted]);

  // Auto-save
  useEffect(() => {
    if (character) {
        dbUpdateCharacter({ ...character, inventory });
    }
  }, [character, inventory]);

  // ── CORE HANDLERS ──────────────────────────────────────
  const toggleMusic = () => {
    const nextState = !isMusicEnabled;
    setIsMusicEnabled(nextState);
    if (nextState) {
      audioManager.start();
      audioManager.setMasterMute(false);
      audioManager.playSfx("click");
    } else {
      audioManager.setMasterMute(true);
      audioManager.stopBgm();
    }
  };

  const handleStartGame = async () => {
    try {
      await pokiService.commercialBreak(() => audioManager.setAdMute(true));
      audioManager.setAdMute(false);
      setGameStarted(true);
      audioManager.start();
      pokiService.gameplayStart();
    } catch (err) {
      setGameStarted(true);
    }
  };

  const handleStopGame = () => {
    pokiService.gameplayStop();
    setGameStarted(false);
    audioManager.stopBgm();
  };

  const handleWatchAd = async () => {
    if (!character) return;
    const success = await pokiService.rewardedBreak({
      onStart: () => audioManager.setAdMute(true)
    });
    audioManager.setAdMute(false);
    if (success) {
      const newGold = character.gold + 50;
      setCharacter({ ...character, gold: newGold });
      setToast({ message: "Watched ad! +50 Gold awarded.", icon: "💰" });
      audioManager.playSfx("victory");
    }
  };

  // ── CHARACTER MANAGEMENT ────────────────────────────────
  const submitCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createName.trim()) return;

    const stats = getInitialCharacterStats(createClass);
    const newCharacter: Omit<Character, "id" | "createdAt"> = {
      name: createName.trim(),
      class: createClass,
      level: 1,
      xp: 0,
      gold: 100,
      xpToNext: 100,
      inventory: getStarterItems(createClass),
      skills: stats.skills,
      completedQuests: [],
      acceptedQuests: [],
      discoveredTiles: {},
      skinColor: createSkinColor,
      hairColor: createHairColor,
      clothingColor: createClothingColor,
      faceStyle: createFaceStyle,
      rank: "F",
      activeQuestId: undefined,
      questState: "list",
      ...stats,
    };

    const created = await dbCreateCharacter(newCharacter);
    setCharacter(created);
    setInventory(created.inventory);
    setAllCharacters(prev => [...prev, created]);
    setShowCharacterSelect(false);
  };

  const handleDeleteCharacter = async (characterId: number) => {
    await deleteCharacter(characterId);
    setAllCharacters(prev => prev.filter(c => c.id !== characterId));
    if (character?.id === characterId) {
      setCharacter(null);
      setInventory([]);
    }
    setShowDeleteConfirm(null);
  };

  // ── QUEST & BATTLE ─────────────────────────────────────
  const handleAcceptQuestFromNPC = async (quest: Quest) => {
    if (!character) return;
    await pokiService.commercialBreak(() => audioManager.setAdMute(true));
    audioManager.setAdMute(false);

    const result = await acceptQuestFromNPC(character, quest);
    if (result.success) {
      setCharacter(result.updatedCharacter);
      setActiveQuest(quest);
      setQuestState("active");
      setActiveTab("World Map");
      setQuestToast({ message: `New Quest: ${quest.title}`, icon: "⚔️" });
      pokiService.gameplayStart();
    }
  };

  const handleCompleteQuest = async (quest: Quest) => {
    if (!character) return;
    const result = await completeQuestAfterBattle(character, quest, true, quest.choices[0]?.xpReward || 50, quest.choices[0]?.goldReward || 25);
    if (result.updatedCharacter) {
      setCharacter(result.updatedCharacter);
      setCompletedQuests(result.updatedCharacter.completedQuests);
      setInventory(result.updatedCharacter.inventory || []);
    }
    setToast({ message: result.message, icon: "📜" });
    audioManager.playSfx("victory");
    if (result.leveledUp) {
      setCelebration({ type: "level-up", title: "Level Up!", subtitle: `Level ${result.updatedCharacter?.level} reached!` });
    }
  };

  const handleMobKilled = (enemyId: string, xp: number, gold: number) => {
    if (!character) return;
    let updatedCharacter = { ...character };
    
    // Bounty progress
    if (activeQuest?.bounty && activeQuest.bounty.targetMonsterId === enemyId) {
      const current = (character.questProgress || {})[activeQuest.id] || 0;
      const next = current + 1;
      updatedCharacter = {
        ...updatedCharacter,
        questProgress: { ...(character.questProgress || {}), [activeQuest.id]: next },
      };
      if (next >= activeQuest.bounty.targetCount) {
        setToast({ message: `Bounty Complete! Return to Guild.`, icon: "🎯" });
        audioManager.playSfx("victory");
      } else {
        setToast({ message: `Bounty: ${next}/${activeQuest.bounty.targetCount}`, icon: "⚔️" });
      }
    }

    // Reward application
    const newXp = updatedCharacter.xp + xp;
    let newLevel = updatedCharacter.level;
    let newXpToNext = updatedCharacter.xpToNext;
    if (newXp >= updatedCharacter.xpToNext) {
      newLevel++;
      newXpToNext = Math.floor(updatedCharacter.xpToNext * 1.5);
      setCelebration({ type: "level-up", title: "Level Up!", subtitle: `You reached Level ${newLevel}!` });
      audioManager.playSfx("victory");
    }

    const finalChar = {
      ...updatedCharacter,
      xp: newXp,
      level: newLevel,
      xpToNext: newXpToNext,
      gold: updatedCharacter.gold + gold,
    };
    setCharacter(finalChar);
  };

  const handleMobBattle = (enemy: Enemy) => {
    setActiveEnemy(enemy);
    setQuestState("battle");
  };

  const handleBattleVictory = (xp: number, gold: number) => {
    if (!character) return;
    handleMobKilled(activeEnemy?.id || "", xp, gold);
    setActiveEnemy(null);
    setQuestState("list");
  };

  const handleBattleDefeat = () => {
    if (!character) return;
    const newHp = Math.max(1, Math.floor(character.maxHp / 2));
    setCharacter({ ...character, hp: newHp });
    setActiveEnemy(null);
    setQuestState("list");
    setActiveTab("Shop");
    setToast({ message: "Defeated! Rest up at the shop.", icon: "💀" });
  };

  const handleBattleFlee = () => {
    setActiveEnemy(null);
    setQuestState("list");
  };

  // ── SHOP & INVENTORY ───────────────────────────────────
  const handleToggleEquip = (item: InventoryItem) => {
    const newEquipped = !item.equipped;
    setInventory(prev => prev.map(i =>
      i.id === item.id ? { ...i, equipped: newEquipped } : (i.type === item.type ? { ...i, equipped: false } : i)
    ));
    if (selectedItem?.id === item.id) setSelectedItem({ ...item, equipped: newEquipped });
  };

  const handleConsumeFood = (item: InventoryItem) => {
    if (!character || item.type !== "food" || !item.restores) return;
    setInventory(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
    setCharacter({
      ...character,
      hp: Math.min(character.maxHp, character.hp + (item.restores.hp || 0)),
      mp: Math.min(character.maxMp, character.mp + (item.restores.mp || 0))
    });
  };

  const handleBuyItem = (item: InventoryItem) => {
    if (!character || character.gold < item.price) return;
    setCharacter({ ...character, gold: character.gold - item.price });
    setInventory(prev => [...prev, { ...item, id: `${item.id}-${Date.now()}` }]);
  };

  const handleSellItem = (item: InventoryItem) => {
    if (!character) return;
    setCharacter({ ...character, gold: character.gold + Math.floor(item.price / 2) });
    setInventory(prev => prev.filter(i => i.id !== item.id));
  };

  const handleRegionChange = (regionId: string) => {
    if (!character) return;
    const check = canLeaveRegion(character);
    if (!check.can) {
      setToast({ message: check.reason || "Complete region quests first!", icon: "🔒" });
      return;
    }
    setCharacter({ ...character, currentRegion: regionId });
    setToast({ message: `Traveling to ${regionId}...`, icon: "🗺️" });
  };

  const handleUpdateCharacter = useCallback((updates: Partial<Character>) => {
    setCharacter(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // ── RENDER HELPERS ─────────────────────────────────────
  if (isLoading) return (
      <div className="h-full bg-slate-950 flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-4xl">⚙️</motion.div>
      </div>
  );

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-background text-foreground ambient-particles custom-scrollbar">
      {pokiService.isAdActive() && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center">
          <div className="text-white text-2xl font-bold animate-pulse">Advertisement playing...</div>
        </div>
      )}

      {!gameStarted && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-md w-full fantasy-card p-10 text-center">
            <div className="mb-8 rotate-12"><Gamepad2 size={48} className="mx-auto text-amber-500" /></div>
            <h2 className="text-4xl font-bold mb-4 text-white uppercase tracking-widest" style={{ fontFamily: "var(--font-serif)" }}>Vibe <span className="text-amber-500">RPG</span></h2>
            <button onClick={handleStartGame} className="w-full btn-fantasy py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3">
              <Play fill="currentColor" size={24} /> START JOURNEY
            </button>
          </div>
        </div>
      )}

      {gameStarted && (
        <>
          <header className="fantasy-header px-4 py-1 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
               <h1 className="text-lg font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-700 uppercase" style={{ fontFamily: "'Cinzel', serif" }}>VibeRPG</h1>
               <div className="flex gap-2">
                 <button onClick={toggleMusic} className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isMusicEnabled ? "bg-amber-500/20" : "bg-slate-900/60"}`}>{isMusicEnabled ? "🔊" : "🔇"}</button>
                 <button onClick={handleStopGame} className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-500/40 bg-red-900/30">⏹️</button>
               </div>
            </div>
            {character && (
                <div className="flex items-center gap-3 bg-slate-900/40 px-3 py-1 rounded-lg border border-amber-500/10">
                    <div className="flex flex-col items-end"><span className="text-[10px] text-amber-500/60">Rank</span><span className="font-bold" style={{ color: RANKS.find(r => r.rank === character.rank)?.color }}>{character.rank}</span></div>
                    <div className="w-px h-6 bg-slate-800" />
                    <div className="flex flex-col items-end"><span className="text-[10px] text-amber-500/60">Level</span><span className="font-bold">{character.level}</span></div>
                    <div className="w-px h-6 bg-slate-800" />
                    <div className="flex items-center gap-1.5"><GoldIcon size={14} /><span className="font-bold text-amber-300">{character.gold}</span></div>
                    <button onClick={() => setShowCharacterSelect(true)} className="ml-2 w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">{CLASS_ICONS[character.class]}</button>
                </div>
            )}
          </header>

          <main className="flex-1 min-h-0 overflow-hidden px-3 py-2">
            {!character ? (
                <div className="max-w-3xl mx-auto fantasy-card p-8 flex flex-col md:flex-row gap-8">
                     <div className="w-48 h-56 bg-slate-900/60 rounded-xl flex justify-center items-center overflow-hidden">
                        <div className="scale-[2.5] translate-y-2">
                            <InventorySprite characterClass={createClass} skinColor={createSkinColor} hairColor={createHairColor} clothingColor={createClothingColor} faceStyle={createFaceStyle} animationType="idle" rank="F" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gold mb-6" style={{ fontFamily: "'Cinzel', serif" }}>Begin Your Adventure</h2>
                        <form onSubmit={submitCreate} className="space-y-4">
                            <input value={createName} onChange={e => setCreateName(e.target.value)} placeholder="Hero Name" className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3" />
                            <select value={createClass} onChange={e => setCreateClass(e.target.value as any)} className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3">
                                {CHARACTER_CLASSES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="color" value={createSkinColor} onChange={e => setCreateSkinColor(e.target.value)} className="w-full h-10 rounded-lg bg-slate-800/60 p-1" />
                                <input type="color" value={createHairColor} onChange={e => setCreateHairColor(e.target.value)} className="w-full h-10 rounded-lg bg-slate-800/60 p-1" />
                            </div>
                            <button type="submit" className="w-full btn-fantasy py-3 font-bold">CREATE HERO</button>
                        </form>
                    </div>
                </div>
            ) : (
              <div className="w-full h-full grid gap-2 md:grid-cols-12">
                <aside className="md:col-span-3 flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
                    <nav className="fantasy-card p-4 flex flex-wrap md:flex-col gap-1">
                        {[
                            { id: "World Map", icon: MapTabIcon },
                            { id: "Inventory", icon: InventoryTabIcon },
                            { id: "Shop", icon: ShopTabIcon },
                            { id: "Guild", icon: RankIcon }
                        ].map(t => (
                            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold ${activeTab === t.id ? "bg-amber-600/20 text-amber-200 border border-amber-500/30" : "text-slate-400 hover:bg-slate-800/50"}`}>
                                <t.icon size={18} /> {t.id}
                            </button>
                        ))}
                    </nav>
                    <div className="fantasy-card p-3 space-y-1">
                        <h3 className="text-[9px] font-bold text-amber-200/60 uppercase mb-1">Hero Stats</h3>
                        {statusBar("HP", character.hp, character.maxHp, "hp")}
                        {statusBar("MP", character.mp, character.maxMp, "mp")}
                        {statusBar("XP", character.xp, character.xpToNext, "xp")}
                    </div>
                    <QuestBoard character={character} completedQuests={completedQuests} onAcceptQuest={handleAcceptQuestFromNPC} onCompleteQuest={handleCompleteQuest} activeQuestId={activeQuest?.id} />
                </aside>

                <section className="md:col-span-9 h-full flex flex-col min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {questState === "battle" && activeEnemy && (
                        <motion.div key="battle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <MonsterBattle character={character} enemy={activeEnemy} onVictory={handleBattleVictory} onDefeat={handleBattleDefeat} onFlee={handleBattleFlee} onUpdateCharacter={handleUpdateCharacter} />
                        </motion.div>
                    )}

                    {questState !== "battle" && activeTab === "World Map" && (
                        <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full relative border border-amber-500/10 rounded-2xl overflow-hidden">
                           {activeQuest?.bounty && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[4000] w-64 bg-slate-950/90 border border-amber-500/40 rounded-xl p-2">
                                    <div className="flex justify-between text-[10px] mb-1 font-bold"><span>BOUNTY: {activeQuest.bounty.targetMonsterId}</span><span>{character.questProgress?.[activeQuest.id] || 0}/{activeQuest.bounty.targetCount}</span></div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: `${((character.questProgress?.[activeQuest.id] || 0) / activeQuest.bounty.targetCount) * 100}%` }} /></div>
                                </div>
                           )}
                           <WorldMap 
                                mapData={getRegionMapData(character.currentRegion)} 
                                character={character} 
                                playerClass={character.class} 
                                playerRank={character.rank} 
                                inventory={inventory} 
                                onNPCInteract={(npc) => {
                                    if (npc.questId && !completedQuests.includes(npc.questId) && activeQuest?.id !== npc.questId) {
                                        const q = QUESTS.find(x => x.id === npc.questId);
                                        if (q && (q.class === character.class || hasFinishedMainStory(character))) handleAcceptQuestFromNPC(q);
                                    }
                                }}
                                onQuestAccepted={handleAcceptQuestFromNPC}
                                completedQuests={completedQuests}
                                activeQuestId={activeQuest?.id}
                                allQuests={QUESTS}
                                onNavigateToRegion={handleRegionChange}
                                onMobKilled={handleMobKilled}
                                onMobInteract={handleMobBattle}
                                onUpdateCharacter={(updates) => setCharacter({ ...character, ...updates })}
                           />
                        </motion.div>
                    )}

                    {questState !== "battle" && activeTab === "Inventory" && (
                        <motion.div key="inv" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                            <Inventory inventory={inventory} selectedItem={selectedItem} onSelectItem={setSelectedItem} onToggleEquip={handleToggleEquip} onConsumeFood={handleConsumeFood} onSellItem={handleSellItem} characterClass={character.class} rank={character.rank} skinColor={character.skinColor} hairColor={character.hairColor} clothingColor={character.clothingColor} faceStyle={character.faceStyle} />
                        </motion.div>
                    )}

                    {questState !== "battle" && activeTab === "Shop" && (
                        <motion.div key="shop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Shop gold={character.gold} shopItems={SHOP_ITEMS.filter(i => !i.allowedClasses || i.allowedClasses.includes(character.class))} onBuyItem={handleBuyItem} onWatchAd={handleWatchAd} />
                        </motion.div>
                    )}

                    {questState !== "battle" && activeTab === "Guild" && (
                         <motion.div key="guild" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <GuildEvolution character={character} onEvolve={(updated) => { setCharacter(updated); audioManager.playSfx("victory"); }} onClose={() => setActiveTab("World Map")} />
                         </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              </div>
            )}
          </main>
        </>
      )}

      {/* Overlays & Modals */}
      <AnimatePresence>
        {showCharacterSelect && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[11000] flex items-center justify-center p-4" onClick={() => setShowCharacterSelect(false)}>
            <div className="fantasy-card p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
               <h2 className="text-xl font-bold text-gold mb-4">Select Hero</h2>
               <div className="space-y-2 mb-4">
                 {allCharacters.map(c => (
                     <div key={c.id} className={`p-3 rounded-lg border-2 flex justify-between items-center ${character?.id === c.id ? "border-amber-500 bg-amber-950/20" : "border-slate-700 bg-slate-800/40"}`}>
                        <div className="cursor-pointer flex-1" onClick={() => { setCharacter(c); setInventory(c.inventory || []); setShowCharacterSelect(false); }}>
                            <div className="font-bold">{c.name}</div>
                            <div className="text-xs text-slate-400">{c.class.toUpperCase()} - Lv. {c.level}</div>
                        </div>
                        <button onClick={() => setShowDeleteConfirm(c.id)} className="text-red-500 text-xs">Delete</button>
                     </div>
                 ))}
               </div>
               <button onClick={() => { setCharacter(null); setShowCharacterSelect(false); }} className="w-full py-2 border border-slate-700 rounded-lg text-xs font-bold text-slate-400 hover:text-white">Create New Hero</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm !== null && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-[12000] flex items-center justify-center p-4">
                <div className="fantasy-card p-6 max-w-xs text-center">
                    <h3 className="text-lg font-bold text-red-500 mb-2">Delete Character?</h3>
                    <p className="text-sm text-slate-400 mb-4">This action is permanent.</p>
                    <div className="flex gap-2">
                        <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2 bg-slate-800 rounded-lg">Cancel</button>
                        <button onClick={() => handleDeleteCharacter(showDeleteConfirm)} className="flex-1 py-2 bg-red-900 rounded-lg">Delete</button>
                    </div>
                </div>
             </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {celebration && <CelebrationOverlay {...celebration} onDismiss={() => setCelebration(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <QuickToast {...toast} onDismiss={() => setToast(null)} />}
        {questToast && <QuickToast {...questToast} onDismiss={() => setQuestToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

function IframeScaleWrapper({ children }: { children: React.ReactNode }) {
  const [{ scale, innerW, innerH, vw, vh }, setState] = useState({
    scale: 1, innerW: typeof window !== "undefined" ? window.innerWidth : MIN_WIDTH, innerH: typeof window !== "undefined" ? window.innerHeight : MIN_HEIGHT, vw: typeof window !== "undefined" ? window.innerWidth : MIN_WIDTH, vh: typeof window !== "undefined" ? window.innerHeight : MIN_HEIGHT,
  });

  useEffect(() => {
    function update() {
      const v_w = window.innerWidth, v_h = window.innerHeight;
      const s = Math.min(1, v_w / MIN_WIDTH, v_h / MIN_HEIGHT);
      setState({ scale: s, innerW: Math.min(1200, Math.round(v_w / s)), innerH: Math.min(900, Math.round(v_h / s)), vw: v_w, vh: v_h });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#020617" }}>
      <div style={{ width: innerW, height: innerH, position: "absolute", left: (vw - innerW * scale) / 2, top: 0, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <IframeScaleWrapper>
      <AppContent />
    </IframeScaleWrapper>
  );
}