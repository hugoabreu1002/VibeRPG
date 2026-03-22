import { useState, useEffect, type FormEvent } from "react";
import { getCurrentCharacter, getAllCharacters, createCharacter as dbCreateCharacter, deleteCharacter, updateCharacter as dbUpdateCharacter, type CharacterClass } from "./lib/storage";
import { CHARACTER_CLASSES, getStarterItems, getInitialCharacterStats, QUESTS, SHOP_ITEMS, ALL_ITEMS, QUEST_ENEMIES, getEnemy } from "./lib/game-data";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, InventoryItem, Quest, QuestChoice, QuestState, QuestResult, Tab, Enemy, NPC } from "./types/game";
import { Inventory, Quests, QuestBattle, QuestMap, Shop } from "./components/game";
import { GuildEvolution } from "./components/game/ui/GuildEvolution";
import { getQuestMap } from "./lib/map-data";
import { audioManager } from "./lib/audio";
import { RANKS } from "./lib/rank-utils";
import {
  HealthIcon, ManaIcon, XPIcon, GoldIcon, SwordIcon, ShieldIcon,
  ClassMageIcon, ClassWarriorIcon, ClassPriestIcon, ClassRogueIcon,
  MapTabIcon, QuestTabIcon, InventoryTabIcon, ShopTabIcon, GuildTabIcon
} from "./components/game/ui/GameIcons";

const CLASS_ICONS: Record<CharacterClass, React.ReactNode> = {
  mage: <ClassMageIcon size={20} />,
  warrior: <ClassWarriorIcon size={20} />,
  priest: <ClassPriestIcon size={20} />,
  rogue: <ClassRogueIcon size={20} />,
};

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
  const [createName, setCreateName] = useState("");
  const [createClass, setCreateClass] = useState<CharacterClass>("mage");
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);

  // Quest state
  const [questState, setQuestState] = useState<QuestState>("list");
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [activeEnemy, setActiveEnemy] = useState<Enemy | null>(null);
  const [questResult, setQuestResult] = useState<QuestResult | null>(null);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<QuestChoice | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Load all characters
  useEffect(() => {
    getAllCharacters().then(chars => {
      setAllCharacters(chars);
    });
  }, []);

  // Audio initialization and BGM control
  useEffect(() => {
    // Synchronize master mute with our local state
    audioManager.setMasterMute(!isMusicEnabled);

    if (isMusicEnabled) {
      audioManager.start();
      if (activeTab === "World Map" || activeTab === "Inventory" || activeTab === "Shop") {
        audioManager.playBgm("main");
      } else if (activeTab === "Quests") {
        // Handle battle bgm if quest is active? 
        // For now just keep same logic
      }
    } else {
      audioManager.stopBgm();
    }
  }, [isMusicEnabled, activeTab]);

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
  // Auto-save character
  useEffect(() => {
    if (character) {
      dbUpdateCharacter({
        ...character,
        inventory: inventory // Ensure inventory state is saved with character
      });
    }
  }, [character, inventory]);

  const handleDeleteCharacter = async (characterId: number) => {
    if (!character) return;

    await deleteCharacter(characterId);

    // If we deleted the current character, switch to another one or clear state
    if (character.id === characterId) {
      const remainingChars = allCharacters.filter(c => c.id !== characterId);
      if (remainingChars.length > 0) {
        const newChar = remainingChars[0];
        setCharacter(newChar);
        setInventory(newChar.inventory || getStarterItems(newChar.class));
      } else {
        setCharacter(null);
        setInventory([]);
      }
    }

    // Update the list
    setAllCharacters(allCharacters.filter(c => c.id !== characterId));
    setShowDeleteConfirm(null);
  };

  const startQuest = (quest: Quest) => {
    setActiveQuest(quest);
    setQuestState("active");
    setActiveTab("Quests");
  };

  const attemptQuestChoice = (choice: QuestChoice) => {
    if (!character || !activeQuest) return;

    // Store the selected choice
    setSelectedChoice(choice);

    // Get the enemy for this quest
    const enemyId = QUEST_ENEMIES[activeQuest.id];
    const enemy = enemyId ? getEnemy(enemyId) : null;
    if (enemy) {
      // Start battle!
      setActiveEnemy(enemy);
      setQuestState("battle");
    } else {
      // Fallback to old behavior if no enemy found
      resolveQuest(choice, false, "You encounter an unexpected enemy!");
    }
  };

  const resolveQuest = (choice: QuestChoice, success: boolean, battleMessage?: string) => {
    if (!character || !activeQuest) return;

    let message = battleMessage || "";

    if (success) {
      message += choice.successMessage;
      const newXp = character.xp + choice.xpReward;
      const newGold = character.gold + choice.goldReward;

      // Handle item reward
      let rewardedItem: InventoryItem | undefined;
      if (choice.rewardItemId) {
        const itemTemplate = ALL_ITEMS.find(i => i.id === choice.rewardItemId);
        if (itemTemplate) {
          rewardedItem = { ...itemTemplate, id: `${itemTemplate.id}-${Date.now()}` };
          setInventory(prev => [...prev, rewardedItem!]);
        }
      }

      // Handle skill reward
      const newSkills = [...character.skills];
      if (choice.rewardSkill && !newSkills.includes(choice.rewardSkill)) {
        newSkills.push(choice.rewardSkill);
      }

      setCharacter({
        ...character,
        xp: newXp,
        gold: newGold,
        skills: newSkills,
        inventory: rewardedItem ? [...inventory, rewardedItem] : inventory,
        ...(newXp >= character.xpToNext ? {
          level: character.level + 1,
          xp: newXp - character.xpToNext,
          xpToNext: Math.floor(character.xpToNext * 1.5),
          maxHp: character.maxHp + 10,
          hp: character.maxHp + 10,
          maxMp: character.maxMp + 5,
          mp: character.maxMp + 5,
          attack: character.attack + 2,
          defense: character.defense + 1,
        } : {})
      });

      setQuestResult({
        success: true,
        message,
        xp: choice.xpReward,
        gold: choice.goldReward,
        rewardItem: rewardedItem,
        rewardSkill: choice.rewardSkill
      });
    } else {
      message += choice.failureMessage;
      setQuestResult({
        success: false,
        message,
        xp: 0,
        gold: 0
      });
    }

    if (activeQuest && !completedQuests.includes(activeQuest.id)) {
      const newCompleted = [...completedQuests, activeQuest.id];
      setCompletedQuests(newCompleted);
      if (character) setCharacter({ ...character, completedQuests: newCompleted });
    }

    setQuestState("result");
  };

  const handleBattleVictory = (xp: number, gold: number) => {
    if (!character || !selectedChoice) return;

    // Add battle rewards + quest bonus
    const newXp = character.xp + xp + selectedChoice.xpReward;
    const newGold = character.gold + gold + selectedChoice.goldReward;

    // Handle item reward
    let rewardedItem: InventoryItem | undefined;
    if (selectedChoice.rewardItemId) {
      const itemTemplate = ALL_ITEMS.find(i => i.id === selectedChoice.rewardItemId);
      if (itemTemplate) {
        rewardedItem = { ...itemTemplate, id: `${itemTemplate.id}-${Date.now()}` };
        setInventory(prev => [...prev, rewardedItem!]);
      }
    }

    // Handle skill reward
    const newSkills = [...character.skills];
    if (selectedChoice.rewardSkill && !newSkills.includes(selectedChoice.rewardSkill)) {
      newSkills.push(selectedChoice.rewardSkill);
    }

    setCharacter({
      ...character,
      xp: newXp,
      gold: newGold,
      skills: newSkills,
      inventory: rewardedItem ? [...inventory, rewardedItem] : inventory,
      ...(newXp >= character.xpToNext ? {
        level: character.level + 1,
        xp: newXp - character.xpToNext,
        xpToNext: Math.floor(character.xpToNext * 1.5),
        maxHp: character.maxHp + 10,
        hp: character.maxHp + 10,
        maxMp: character.maxMp + 5,
        mp: character.maxMp + 5,
        attack: character.attack + 2,
        defense: character.defense + 1,
      } : {})
    });

    setQuestResult({
      success: true,
      message: `🎉 Victory! ${selectedChoice.successMessage}\n\n+${xp + selectedChoice.xpReward} XP • +${gold + selectedChoice.goldReward} Gold`,
      xp: xp + selectedChoice.xpReward,
      gold: gold + selectedChoice.goldReward,
      rewardItem: rewardedItem,
      rewardSkill: selectedChoice.rewardSkill
    });

    if (activeQuest && !completedQuests.includes(activeQuest.id)) {
      const newCompleted = [...completedQuests, activeQuest.id];
      setCompletedQuests(newCompleted);
      if (character) setCharacter({ ...character, completedQuests: newCompleted });
    }

    setQuestState("result");
    setActiveEnemy(null);
  };

  const handleBattleDefeat = () => {
    if (!character || !selectedChoice) return;

    // Take HP damage on defeat - restore half HP
    const newHp = Math.max(1, Math.floor(character.maxHp / 2));

    setCharacter({
      ...character,
      hp: newHp
    });

    setQuestResult({
      success: false,
      message: `💀 ${selectedChoice.failureMessage}\n\nYou were injured in battle and need to recover.`,
      xp: 0,
      gold: 0
    });

    if (activeQuest && !completedQuests.includes(activeQuest.id)) {
      const newCompleted = [...completedQuests, activeQuest.id];
      setCompletedQuests(newCompleted);
      if (character) setCharacter({ ...character, completedQuests: newCompleted });
    }

    setQuestState("result");
    setActiveEnemy(null);
  };

  const handleBattleFlee = () => {
    // Reset to quest list, don't complete the quest
    setQuestState("list");
    setActiveEnemy(null);
    setSelectedChoice(null);
  };

  const resetQuest = () => {
    setQuestState("list");
    setActiveQuest(null);
    setQuestResult(null);
  };

  useEffect(() => {
    getCurrentCharacter().then((char) => {
      if (char) {
        const enrichedChar = {
          ...char,
          skills: char.skills || getInitialCharacterStats(char.class).skills,
          inventory: char.inventory || getStarterItems(char.class),
          completedQuests: char.completedQuests || []
        };
        setCharacter(enrichedChar);
        setInventory(enrichedChar.inventory);
        setCompletedQuests(enrichedChar.completedQuests);
      }
      setIsLoading(false);
    });
  }, []);

  const handleToggleEquip = (item: InventoryItem) => {
    const newEquipped = !item.equipped;
    setInventory(inventory.map(i =>
      i.id === item.id
        ? { ...i, equipped: newEquipped }
        : i.type === item.type
          ? { ...i, equipped: false }
          : i
    ));
    // Update selectedItem to reflect the new equipped state
    if (selectedItem?.id === item.id) {
      setSelectedItem({ ...item, equipped: newEquipped });
    }
  };

  const handleConsumeFood = (item: InventoryItem) => {
    if (!character || item.type !== "food" || !item.restores) return;

    // Remove one instance of this food from inventory
    const newInventory = [...inventory];
    const index = newInventory.findIndex(i => i.id === item.id);
    if (index !== -1) {
      newInventory.splice(index, 1);
      setInventory(newInventory);
    }

    // Apply stats
    const restoreHp = item.restores.hp || 0;
    const restoreMp = item.restores.mp || 0;

    setCharacter({
      ...character,
      hp: Math.min(character.maxHp, character.hp + restoreHp),
      mp: Math.min(character.maxMp, character.mp + restoreMp)
    });
  };

  const handleBuyItem = (item: InventoryItem) => {
    if (!character || character.gold < item.price) return;

    // Deduct gold
    setCharacter({
      ...character,
      gold: character.gold - item.price
    });

    // Add item to inventory with a unique ID
    const newItem = {
      ...item,
      id: `${item.id}-${Date.now()}`
    };

    setInventory([...inventory, newItem]);
  };

  const handleSellItem = (item: InventoryItem) => {
    if (!character) return;

    // Calculate sell price (50% of original price)
    const sellPrice = Math.floor((item.price || 10) / 2);

    // Add gold
    const newGold = character.gold + sellPrice;
    setCharacter({
      ...character,
      gold: newGold,
      inventory: inventory.filter(i => i.id !== item.id) // Also update character.inventory
    });

    // Remove from inventory state
    setInventory(prev => prev.filter(i => i.id !== item.id));
  };

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
      skills: getInitialCharacterStats(createClass).skills,
      completedQuests: [],
      rank: "F" as const,
      ...stats,
    };

    const created = await dbCreateCharacter(newCharacter);
    setCharacter(created);
    setInventory(created.inventory);
  };

  const tabConfig: { tab: Tab; icon: React.ReactNode; label: string }[] = [
    { tab: "World Map", icon: <MapTabIcon />, label: "World Map" },
    { tab: "Quests", icon: <QuestTabIcon />, label: "Quests" },
    { tab: "Inventory", icon: <InventoryTabIcon />, label: "Inventory" },
    { tab: "Shop", icon: <ShopTabIcon />, label: "Shop" },
    { tab: "Guild", icon: <GuildTabIcon />, label: "Guild" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground ambient-particles">
      {/* Fantasy Header */}
      <header className="fantasy-header px-4 md:px-8 py-3 mb-6 relative">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">✨</div>
              <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-700 uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}>
                VibeRPG
              </h1>
            </motion.div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-3 mr-auto ml-6">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMusic}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-all duration-500 ${isMusicEnabled
                ? "bg-gradient-to-br from-amber-400/30 to-amber-600/40 border-amber-400/60 text-amber-100 shadow-amber-500/30 animate-pulse-slow"
                : "bg-slate-900/60 border-slate-700/50 text-slate-500 grayscale opacity-70"
                }`}
              title={isMusicEnabled ? "Mute All Sounds" : "Unmute All Sounds"}
            >
              <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                {isMusicEnabled ? "🔊" : "🔇"}
              </span>

              {isMusicEnabled && (
                <motion.div
                  layoutId="sound-glow"
                  className="absolute inset-0 rounded-2xl bg-amber-400/10 blur-md -z-10"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
            <span className={`text-[10px] font-black uppercase tracking-tighter hidden md:block transition-colors duration-500 ${isMusicEnabled ? "text-amber-400" : "text-slate-600"
              }`}>
              {isMusicEnabled ? "Audio On" : "Audio Off"}
            </span>
          </div>

          {character && (
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center gap-4 bg-slate-900/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-500/10 shadow-inner"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest leading-none mb-1">Rank</span>
                  <span
                    className="text-xl font-black leading-none"
                    style={{ color: RANKS.find(r => r.rank === character.rank)?.color || "#94A3B8" }}
                  >
                    {character.rank}
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest leading-none mb-1">Level</span>
                  <span className="text-xl font-bold text-amber-100 leading-none">{character.level}</span>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest leading-none mb-1">Gold</span>
                  <div className="flex items-center gap-1.5 leading-none">
                    <GoldIcon size={18} />
                    <span className="text-xl font-bold text-amber-300">{character.gold}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-600/20"
              >
                <div className="flex flex-col items-end mr-1">
                  <span className="text-[9px] font-bold text-amber-500/60 uppercase tracking-tight leading-none mb-0.5">Hero</span>
                  <span className="text-sm font-bold text-amber-50 leading-none">{character.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowCharacterSelect(!showCharacterSelect);
                    getAllCharacters().then(chars => setAllCharacters(chars));
                  }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-b from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-lg shadow-amber-900/20 border border-amber-400/30"
                  title="Switch Character"
                >
                  {CLASS_ICONS[character.class]}
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </header>

      {/* Character Selection Modal */}

      {/* Character Selection Modal */}
      <AnimatePresence>
        {showCharacterSelect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCharacterSelect(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="fantasy-card rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gold" style={{ fontFamily: "'Cinzel', serif" }}>Select Character</h2>
                <button onClick={() => setShowCharacterSelect(false)} className="text-slate-500 hover:text-slate-300 text-xl transition-colors">✕</button>
              </div>

              <div className="space-y-3 mb-4">
                {allCharacters.map((char) => (
                  <motion.div
                    key={char.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg border-2 transition-colors ${character?.id === char.id
                      ? "border-amber-500/50 bg-amber-950/30"
                      : "border-slate-700/50 hover:border-amber-600/30 bg-slate-800/40"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          setCharacter(char);
                          setInventory(char.inventory || getStarterItems(char.class));
                          setShowCharacterSelect(false);
                        }}
                      >
                        <span className="font-semibold text-amber-100">{char.name}</span>
                        <span className="text-xs text-slate-400 ml-2">
                          {CLASS_ICONS[char.class]} {char.class.toUpperCase()}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">Lv. {char.level}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(char.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium border border-red-800/40 px-2 py-1 rounded hover:bg-red-950/50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-slate-500 text-center mb-4">Create a new character</p>

              <div className="border-t border-slate-700/50 pt-4">
                <h3 className="font-semibold mb-2 text-amber-200/80" style={{ fontFamily: "'Cinzel', serif" }}>Create a new character</h3>
                <form className="space-y-2" onSubmit={async (e) => {
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
                    skills: getInitialCharacterStats(createClass).skills,
                    completedQuests: [],
                    rank: "F" as const,
                    ...stats,
                  };
                  const created = await dbCreateCharacter(newCharacter);
                  setCharacter(created);
                  setInventory(created.inventory);
                  setAllCharacters([...allCharacters, created]);
                  setShowCharacterSelect(false);
                  setCreateName("");
                }}>
                  <input
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Character Name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-600/50"
                  />
                  <div className="flex gap-2">
                    <select
                      value={createClass}
                      onChange={(e) => setCreateClass(e.target.value as CharacterClass)}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      {CHARACTER_CLASSES.map((c) => (
                        <option key={c} value={c}>
                          {CLASS_ICONS[c]} {c}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn-fantasy rounded-lg px-4 py-2 text-sm font-semibold">Create</button>
                  </div>
                </form>
              </div>

              {/* Delete Confirmation Dialog */}
              {showDeleteConfirm !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="fantasy-card rounded-xl p-6 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-red-400">⚠️ Delete Character</h2>
                      <button onClick={() => setShowDeleteConfirm(null)} className="text-slate-500 hover:text-slate-300 text-xl">✕</button>
                    </div>

                    <p className="text-sm text-slate-400 mb-4">
                      Are you sure you want to delete this character? This action cannot be undone.
                    </p>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-4 py-2 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteCharacter(showDeleteConfirm)}
                        className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 border border-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 md:px-8">
        {isLoading ? (
          <div className="mx-auto max-w-3xl fantasy-card rounded-xl p-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                ⚙️
              </motion.div>
              <span className="text-slate-300">Loading...</span>
            </div>
          </div>
        ) : !character ? (
          <main className="mx-auto max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="fantasy-card rounded-xl p-8"
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-3"
                >
                  ⚔️
                </motion.div>
                <h2 className="text-2xl font-bold text-gold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                  Begin Your Adventure
                </h2>
                <p className="text-sm text-slate-400">Create your first hero to start your journey</p>
              </div>
              <form className="space-y-4" onSubmit={submitCreate}>
                <div>
                  <label className="block text-xs text-amber-200/60 mb-1 font-medium">Hero Name</label>
                  <input
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Enter Hero Name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-600/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-amber-200/60 mb-1 font-medium">Class</label>
                  <select
                    value={createClass}
                    onChange={(e) => setCreateClass(e.target.value as CharacterClass)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    {CHARACTER_CLASSES.map((c) => (
                      <option key={c} value={c}>{CLASS_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-fantasy w-full py-3 rounded-lg font-bold tracking-wide"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Create Character
                </motion.button>
              </form>
            </motion.div>
          </main>
        ) : (
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-12">
            {/* Sidebar */}
            <aside className="lg:col-span-2 space-y-4">
              <div className="fantasy-card rounded-xl p-4">
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {tabConfig.map(({ tab, icon, label }) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveTab(tab);
                        audioManager.playSfx("click");
                      }}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${activeTab === tab
                        ? "btn-fantasy"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Character Info */}
              <div className="fantasy-card rounded-xl p-4">
                <h3 className="text-xs font-bold text-amber-200/60 uppercase tracking-wider mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Hero Stats</h3>
                <div className="space-y-4 pt-1">
                  {statusBar("HP", character.hp, character.maxHp, "hp")}
                  {statusBar("MP", character.mp, character.maxMp, "mp")}
                  {statusBar("XP", character.xp, character.xpToNext, "xp")}
                  <div className="h-px bg-slate-800/50 my-1"></div>
                  {statusBar("Attack Power", character.attack, character.attack + 20, "attack")}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <section className="lg:col-span-10 space-y-4">
              {activeTab === "Inventory" && (
                <div className="space-y-4">
                  <Inventory
                    inventory={inventory}
                    selectedItem={selectedItem}
                    onSelectItem={setSelectedItem}
                    onToggleEquip={handleToggleEquip}
                    onConsumeFood={handleConsumeFood}
                    onSellItem={handleSellItem}
                    characterClass={character.class}
                  />
                </div>
              )}

              {activeTab === "Shop" && character && (
                <Shop
                  gold={character.gold}
                  shopItems={SHOP_ITEMS}
                  onBuyItem={handleBuyItem}
                />
              )}

              {activeTab === "Guild" && character && (
                <GuildEvolution
                  character={character}
                  onEvolve={(updatedCharacter) => {
                    setCharacter(updatedCharacter);
                    audioManager.playSfx("victory");
                  }}
                  onClose={() => setActiveTab("World Map")}
                />
              )}

              {activeTab === "World Map" && character && (
                <div className="space-y-4">
                  {(() => {
                    const mapData = getQuestMap("Hub Town");
                    return mapData && (
                      <QuestMap
                        mapData={mapData}
                        playerClass={character.class}
                        inventory={inventory}
                        onNPCInteract={(npc: NPC) => {
                          if (npc.questId && !completedQuests.includes(npc.questId) && activeQuest?.id !== npc.questId) {
                            const quest = QUESTS.find(q => q.id === npc.questId);
                            if (quest && quest.class === character.class && quest.minLevel <= character.level) {
                              startQuest(quest);
                              setActiveTab("Quests");
                            }
                          }
                        }}
                        completedQuests={completedQuests}
                        activeQuestId={activeQuest?.id}
                        allQuests={QUESTS}
                        onBack={() => { }}
                      />
                    );
                  })()}
                </div>
              )}

              {activeTab === "Quests" && character && (
                <>
                  {questState === "battle" && activeEnemy ? (
                    <QuestBattle
                      character={{ ...character, inventory }}
                      enemy={activeEnemy}
                      onVictory={handleBattleVictory}
                      onDefeat={handleBattleDefeat}
                      onFlee={handleBattleFlee}
                      onUpdateCharacter={(updates) => setCharacter(prev => prev ? { ...prev, ...updates } : null)}
                    />
                  ) : questState === "map" && activeQuest ? (
                    (() => {
                      const mapData = getQuestMap(activeQuest.region);
                      return mapData ? (
                        <QuestMap
                          quest={activeQuest}
                          mapData={getQuestMap(activeQuest.region)}
                          playerClass={character.class}
                          inventory={inventory}
                          completedQuests={completedQuests}
                          activeQuestId={activeQuest?.id}
                          allQuests={QUESTS}
                          onNPCInteract={(npc: NPC) => {
                            // If NPC on quest map has a quest, it must be the objective
                            if (npc.questId === activeQuest?.id) {
                              setQuestState("active");
                            }
                          }}
                          onBack={resetQuest}
                        />
                      ) : (
                        <Quests
                          character={character}
                          quests={QUESTS}
                          questState="active"
                          activeQuest={activeQuest}
                          questResult={questResult}
                          completedQuests={completedQuests}
                          onStartQuest={startQuest}
                          onAttemptChoice={attemptQuestChoice}
                          onResetQuest={resetQuest}
                        />
                      );
                    })()
                  ) : (
                    <Quests
                      character={character}
                      quests={QUESTS}
                      questState={questState}
                      activeQuest={activeQuest}
                      questResult={questResult}
                      completedQuests={completedQuests}
                      onStartQuest={startQuest}
                      onAttemptChoice={attemptQuestChoice}
                      onResetQuest={resetQuest}
                    />
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
