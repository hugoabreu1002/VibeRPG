import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Inventory, MapSelection, WorldMap, Shop } from "./components/game";
import { InventorySprite } from "./components/game/character/InventorySprite";

import { GuildMenu } from "./components/game/ui/GuildMenu";
import { QuestBoard } from "./components/game/ui/QuestBoard";
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
  ClassArcherIcon,
  WorldTabIcon
} from "./components/game/ui/GameIcons";
import { GuildEvolution } from "./components/game/ui/GuildEvolution";
import { audioManager } from "./lib/audio";
import { ALL_ITEMS, CHARACTER_CLASSES, ENEMIES, getInitialCharacterStats, getStarterItems, QUESTS, SHOP_ITEMS } from "./lib/game-data";

import { acceptQuestFromNPC, completeQuestAfterBattle, hasFinishedMainStory } from "./lib/quest-logic";
import { RANKS } from "./lib/rank-utils";
import { getAvailableRegions, getRegionMapData } from "./lib/region-utils";
import { createCharacter as dbCreateCharacter, updateCharacter as dbUpdateCharacter, deleteCharacter, getAllCharacters, getCurrentCharacter, type CharacterClass } from "./lib/storage";
import type { Character, InventoryItem, NPC, Quest, Tab } from "./types/game";

const CLASS_ICONS: Record<CharacterClass, React.ReactNode> = {
  mage: <ClassMageIcon size={20} />,
  warrior: <ClassWarriorIcon size={20} />,
  priest: <ClassPriestIcon size={20} />,
  rogue: <ClassRogueIcon size={20} />,
  archer: <ClassArcherIcon size={20} />,
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
  const [activeTab, setActiveTab] = useState<Tab>("World");
  const [createName, setCreateName] = useState("");
  const [createClass, setCreateClass] = useState<CharacterClass>("mage");
  const [createSkinColor, setCreateSkinColor] = useState("#FDE68A");
  const [createHairColor, setCreateHairColor] = useState("#8B5CF6");
  const [createClothingColor, setCreateClothingColor] = useState("#4C1D95");
  const [createFaceStyle, setCreateFaceStyle] = useState<"heroic" | "friendly" | "fierce" | "mysterious">("heroic");
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);

  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [questState, setQuestState] = useState<"list" | "map" | "active" | "battle" | "result">("list");
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);


  // Celebration state
  const [celebration, setCelebration] = useState<{
    type: "quest-complete" | "level-up" | "item-obtained" | "first-victory";
    title: string;
    subtitle?: string;
  } | null>(null);

  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null);
  const [questToast, setQuestToast] = useState<{ message: string; icon: string } | null>(null);
  const [deathNotice, setDeathNotice] = useState<{
    title: string;
    message: string;
    buttonLabel: string;
  } | null>(null);
  const [cityServiceContext, setCityServiceContext] = useState<{ service: "shop" | "guild"; npcName: string; regionName: string } | null>(null);
  const [showTeleportMenu, setShowTeleportMenu] = useState(false);

  // Celebration state
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);

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
      if (activeTab === "World" || activeTab === "Inventory" || activeTab === "Shop" || activeTab === "Guild") {
        audioManager.playBgm("main");
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
  const saveCharacter = (char: Character) => {
    dbUpdateCharacter({
      ...char,
      inventory: inventory
    });
  };

  useEffect(() => {
    if (character) {
      saveCharacter(character);
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

  const handleAcceptQuestFromNPC = async (quest: Quest) => {
    if (!character) return;

    const result = await acceptQuestFromNPC(character, quest);
    if (result.success) {
      const questRegionCharacter: Character = {
        ...result.updatedCharacter,
        currentRegion: quest.region,
        questState: "map",
        lastPosition: undefined,
      };
      const savedCharacter = await dbUpdateCharacter(questRegionCharacter);
      setCharacter(savedCharacter);
      setActiveQuest(quest);
      setQuestState("map");
      setCityServiceContext(null);
      setActiveTab("World");
      setQuestToast({
        message: `New Quest: ${quest.title} - Travel to ${quest.region}`,
        icon: "⚔️"
      });
    }
  };

  const handleCompleteQuestAfterBattle = async (success: boolean, xpReward: number, goldReward: number, rewardItem?: InventoryItem, rewardSkill?: string) => {
    if (!character || !activeQuest) return;

    // Use centralized quest completion function
    const result = await completeQuestAfterBattle(
      character,
      activeQuest,
      success,
      xpReward,
      goldReward,
      rewardItem,
      rewardSkill
    );

    // Update local state with the result
    if (result.updatedCharacter) {
      setCharacter(result.updatedCharacter);
      setCompletedQuests(result.updatedCharacter.completedQuests);
      setInventory(result.updatedCharacter.inventory || []);
    }

    // Clear active quest and reset state
    setActiveQuest(null);
    setQuestState("list");
    setCityServiceContext(null);

    // Redirect to World
    setActiveTab("World");

    // Show completion toast
    setQuestToast({
      message: result.message,
      icon: success ? "🏆" : "💀"
    });

    // Show level up celebration if leveled up
    if (result.leveledUp) {
      setCelebration({
        type: "level-up",
        title: "Level Up!",
        subtitle: `You reached Level ${result.updatedCharacter?.level}! Your stats have increased.`
      });
    }

    // Handle redirect to shop on defeat
    if (result.redirectToShop) {
      setActiveTab("World");
      setCityServiceContext(null);
      setQuestToast({
        message: "Defeated! Return to a city merchant for healing supplies, then try the quest again.",
        icon: "💀"
      });
    }
  };






  /** Called when the hero defeats a wild mob directly on the map (new in-world combat) */
  const handleMobKilled = (enemyId: string, xp: number, gold: number) => {
    if (!character) return;

    // Bounty tracking
    let updatedCharacter = { ...character };
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

    // XP & gold
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
    saveCharacter(finalChar);
  };

  const handleUpdateCharacter = useCallback((updates: Partial<Character>) => {
    setCharacter(prev => {
      if (!prev) return null;

      const updatedCharacter = { ...prev, ...updates };
      if ((updates.hp ?? updatedCharacter.hp) > 0) {
        return updatedCharacter;
      }

      const respawnedCharacter: Character = {
        ...updatedCharacter,
        hp: updatedCharacter.maxHp,
        mp: updatedCharacter.maxMp,
        currentRegion: "Hub Town",
        lastPosition: undefined,
      };

      setActiveTab("World");
      setCityServiceContext(null);
      setShowTeleportMenu(false);
      setDeathNotice({
        title: "You Died",
        message: "You died... and your body was found by the closest villagers, who began a resurrection ritual and brought you back in Hub Town.",
        buttonLabel: "Awaken in Hub Town",
      });
      audioManager.playSfx("defeat");

      void dbUpdateCharacter({
        ...respawnedCharacter,
        inventory,
      });

      return respawnedCharacter;
    });
  }, [inventory]);

  const handleAwakenInHubTown = useCallback(() => {
    setCharacter(prev => {
      if (!prev) return null;

      const awakenedCharacter: Character = {
        ...prev,
        hp: prev.maxHp,
        mp: prev.maxMp,
        currentRegion: "Hub Town",
        lastPosition: undefined,
      };

      void dbUpdateCharacter({
        ...awakenedCharacter,
        inventory,
      });

      return awakenedCharacter;
    });

    setActiveTab("World");
    setCityServiceContext(null);
    setShowTeleportMenu(false);
    setDeathNotice(null);
  }, [inventory]);

  const handleCompleteQuest = async (quest: Quest) => {
    if (!character) return;

    const xp = quest.choices[0]?.xpReward || 50;
    const gold = quest.choices[0]?.goldReward || 25;

    // Use centralized quest completion function which handles region progression
    const result = await completeQuestAfterBattle(
      character,
      quest,
      true,
      xp,
      gold
    );

    // Update local state with the result
    if (result.updatedCharacter) {
      setCharacter(result.updatedCharacter);
      setCompletedQuests(result.updatedCharacter.completedQuests);
      setInventory(result.updatedCharacter.inventory || []);
    }

    // Show completion toast
    setToast({ message: result.message, icon: "📜" });
    audioManager.playSfx("victory");

    // Show level up celebration if leveled up
    if (result.leveledUp) {
      setCelebration({
        type: "level-up",
        title: "Level Up!",
        subtitle: `You reached Level ${result.updatedCharacter?.level}! Your stats have increased.`
      });
    }
  };



  useEffect(() => {
    getCurrentCharacter().then((char) => {
      if (char) {
        const enrichedChar = {
          ...char,
          skills: char.skills || getInitialCharacterStats(char.class).skills,
          inventory: char.inventory || getStarterItems(char.class),
          completedQuests: char.completedQuests || [],
          acceptedQuests: char.acceptedQuests || [],
          currentRegion: char.currentRegion || "Hub Town",
          discoveredTiles: char.discoveredTiles || {}
        };
        setCharacter(enrichedChar);
        setInventory(enrichedChar.inventory);
        setCompletedQuests(enrichedChar.completedQuests);
        setQuestState(enrichedChar.questState || "list");
        setActiveQuest(enrichedChar.activeQuestId ? (QUESTS.find(q => q.id === enrichedChar.activeQuestId) || null) : null);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!character) {
      setActiveQuest(null);
      setQuestState("list");
      return;
    }

    setQuestState(character.questState || (character.activeQuestId ? "map" : "list"));
    setActiveQuest(character.activeQuestId ? (QUESTS.find(q => q.id === character.activeQuestId) || null) : null);
  }, [character]);

  // Map selection handler
  const handleRegionChange = (regionId: string) => {
    if (!character) return;

    const unlockedRegions = getAvailableRegions(character);
    const canTravelTo = unlockedRegions.some(region => region.id === regionId);
    if (!canTravelTo) {
      setToast({ message: "That destination is still locked.", icon: "🔒" });
      audioManager.playSfx("click");
      return;
    }

    if (regionId === character.currentRegion) {
      setShowTeleportMenu(false);
      return;
    }

    const updatedCharacter = { ...character, currentRegion: regionId };
    delete updatedCharacter.lastPosition; // Reset position for new region
    setCharacter(updatedCharacter);
    setCityServiceContext(null);
    setShowTeleportMenu(false);
    saveCharacter(updatedCharacter);
    setActiveTab("World");
    setToast({ message: `Teleporting to ${regionId}...`, icon: "🗺️" });
  };

  const handleOpenCityService = useCallback((npc: NPC) => {
    if (!character || !npc.service) return;

    setCityServiceContext({
      service: npc.service,
      npcName: npc.name,
      regionName: character.currentRegion,
    });
    setActiveTab(npc.service === "shop" ? "Shop" : "Guild");
  }, [character]);

  const handleCloseCityService = useCallback(() => {
    setCityServiceContext(null);
    setActiveTab("World");
  }, []);

  const handleOpenInventory = useCallback(() => {
    setCityServiceContext(null);
    setShowTeleportMenu(false);
    setActiveTab("Inventory");
  }, []);

  const handleOpenWorld = useCallback(() => {
    setCityServiceContext(null);
    setShowTeleportMenu(false);
    setActiveTab("World");
  }, []);

  // Celebration triggers for quest completion and level ups
  useEffect(() => {
    if (!character) return;

    // Detect level up
    if (previousLevel !== null && character.level > previousLevel) {
      setCelebration({
        type: "level-up",
        title: "Level Up!",
        subtitle: `You reached Level ${character.level}! Your stats have increased.`
      });
      audioManager.playSfx("victory");
    }
    setPreviousLevel(character.level);
  }, [character?.level]);



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
      acceptedQuests: [],
      discoveredTiles: {},
      skinColor: createSkinColor,
      hairColor: createHairColor,
      clothingColor: createClothingColor,
      faceStyle: createFaceStyle,
      rank: "F" as const,
      activeQuestId: undefined,
      questState: "list",
      ...stats,
    };

    const created = await dbCreateCharacter(newCharacter);
    setCharacter(created);
    setInventory(created.inventory);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-background text-foreground ambient-particles custom-scrollbar">
      {/* Fantasy Header */}
      <header className="fantasy-header px-4 py-1 relative shrink-0">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="text-2xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">✨</div>
              <h1 className="text-lg font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-700 uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}>
                VibeRPG
              </h1>
            </motion.div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2 mr-auto ml-4">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMusic}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-lg transition-all duration-500 ${isMusicEnabled
                ? "bg-gradient-to-br from-amber-400/30 to-amber-600/40 border-amber-400/60 text-amber-100 shadow-amber-500/30 animate-pulse-slow"
                : "bg-slate-900/60 border-slate-700/50 text-slate-500 grayscale opacity-70"
                }`}
              title={isMusicEnabled ? "Mute All Sounds" : "Unmute All Sounds"}
            >
              <span className="text-lg filter drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                {isMusicEnabled ? "🔊" : "🔇"}
              </span>
            </motion.button>

                {character && (
              <>
                <button
                  onClick={handleOpenWorld}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "World" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "bg-slate-900/50 text-slate-400 border border-slate-700/40 hover:text-slate-200 hover:bg-slate-800/60"}`}
                >
                  <WorldTabIcon size={16} />
                  World
                </button>
                <button
                  onClick={() => setShowTeleportMenu(prev => !prev)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${showTeleportMenu ? "bg-emerald-600/20 text-emerald-200 border border-emerald-500/30 shadow-lg shadow-emerald-900/10" : "bg-slate-900/50 text-slate-400 border border-slate-700/40 hover:text-slate-200 hover:bg-slate-800/60"}`}
                >
                  <MapTabIcon size={16} />
                  Teleport
                </button>
                <button
                  onClick={handleOpenInventory}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "Inventory" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "bg-slate-900/50 text-slate-400 border border-slate-700/40 hover:text-slate-200 hover:bg-slate-800/60"}`}
                >
                  <InventoryTabIcon size={16} />
                  Inventory
                </button>
              </>
            )}
          </div>

          {character && (
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center gap-3 bg-slate-900/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-amber-500/10 shadow-inner"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-amber-500/60 uppercase tracking-widest leading-none">Rank</span>
                  <span
                    className="text-lg font-black leading-none"
                    style={{ color: RANKS.find(r => r.rank === character.rank)?.color || "#94A3B8" }}
                  >
                    {character.rank}
                  </span>
                </div>
                <div className="w-px h-6 bg-slate-800"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-amber-500/60 uppercase tracking-widest leading-none">Level</span>
                  <span className="text-lg font-bold text-amber-100 leading-none">{character.level}</span>
                </div>
                <div className="w-px h-6 bg-slate-800"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-amber-500/60 uppercase tracking-widest leading-none">Gold</span>
                  <div className="flex items-center gap-1 leading-none">
                    <GoldIcon size={14} />
                    <span className="text-lg font-bold text-amber-300">{character.gold}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 bg-amber-900/20 px-2 py-1 rounded-lg border border-amber-600/20"
              >
                <div className="flex flex-col items-end mr-1">
                  <span className="text-[8px] font-bold text-amber-500/60 uppercase tracking-tight leading-none">Hero</span>
                  <span className="text-xs font-bold text-amber-50 leading-none">{character.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowCharacterSelect(!showCharacterSelect);
                    getAllCharacters().then(chars => setAllCharacters(chars));
                  }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-b from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-lg shadow-amber-900/20 border border-amber-400/30"
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
                <h3 className="font-semibold text-amber-200/80 mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Create a new character</h3>
                <div className="flex gap-3 items-start">
                  <div className="w-20 h-24 bg-slate-900/60 rounded-lg border border-slate-700/50 flex justify-center items-center shrink-0 shadow-inner overflow-hidden">
                    <div className="transform scale-[1.5] translate-y-2">
                      <InventorySprite
                        characterClass={createClass}
                        skinColor={createSkinColor}
                        hairColor={createHairColor}
                        clothingColor={createClothingColor}
                        faceStyle={createFaceStyle}
                      />
                    </div>
                  </div>
                  <form className="flex-1 space-y-2" onSubmit={async (e) => {
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
                    acceptedQuests: [],
                    questState: "list",
                    rank: "F" as const,
                    skinColor: createSkinColor,
                    hairColor: createHairColor,
                    clothingColor: createClothingColor,
                    faceStyle: createFaceStyle,
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
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn-fantasy rounded-lg px-4 py-2 text-sm font-semibold">Create</button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-amber-200/60 mb-0.5 font-medium">Skin Tone</label>
                      <input
                        type="color"
                        value={createSkinColor}
                        onChange={(e) => setCreateSkinColor(e.target.value)}
                        className="w-full h-8 rounded border border-slate-700 bg-slate-800/60 p-0.5 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-amber-200/60 mb-0.5 font-medium">Hair Color</label>
                      <input
                        type="color"
                        value={createHairColor}
                        onChange={(e) => setCreateHairColor(e.target.value)}
                        className="w-full h-8 rounded border border-slate-700 bg-slate-800/60 p-0.5 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-amber-200/60 mb-0.5 font-medium">Outfit Color</label>
                      <input
                        type="color"
                        value={createClothingColor}
                        onChange={(e) => setCreateClothingColor(e.target.value)}
                        className="w-full h-8 rounded border border-slate-700 bg-slate-800/60 p-0.5 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-amber-200/60 mb-0.5 font-medium">Face Type</label>
                      <select
                        value={createFaceStyle}
                        onChange={(e) => setCreateFaceStyle(e.target.value as any)}
                        className="w-full h-8 rounded border border-slate-700 bg-slate-800/60 px-1 text-[10px] text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      >
                        <option value="heroic">Heroic</option>
                        <option value="friendly">Friendly</option>
                        <option value="fierce">Fierce</option>
                        <option value="mysterious">Mysterious</option>
                      </select>
                    </div>
                  </div>
                </form>
               </div>
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

      <div className="flex-1 min-h-0 overflow-hidden px-1 py-1 md:px-2 md:py-2">
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
          <main className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="fantasy-card rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start"
            >
              <div className="w-48 h-56 bg-slate-900/60 rounded-xl border border-slate-700/50 flex justify-center items-center shrink-0 shadow-inner overflow-hidden pb-4">
                <div className="transform scale-[2.5] translate-y-2">
                  <InventorySprite
                    characterClass={createClass}
                    skinColor={createSkinColor}
                    hairColor={createHairColor}
                    clothingColor={createClothingColor}
                    faceStyle={createFaceStyle}
                    animationType="idle"
                    rank="F"
                  />
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="text-center md:text-left mb-6">
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
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-amber-200/60 mb-1 font-medium">Skin Tone</label>
                    <input
                      type="color"
                      value={createSkinColor}
                      onChange={(e) => setCreateSkinColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/60 p-1 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-amber-200/60 mb-1 font-medium">Hair Color</label>
                    <input
                      type="color"
                      value={createHairColor}
                      onChange={(e) => setCreateHairColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/60 p-1 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-amber-200/60 mb-1 font-medium">Outfit Color</label>
                    <input
                      type="color"
                      value={createClothingColor}
                      onChange={(e) => setCreateClothingColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/60 p-1 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-amber-200/60 mb-1 font-medium">Face Type</label>
                    <select
                      value={createFaceStyle}
                      onChange={(e) => setCreateFaceStyle(e.target.value as any)}
                      className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/60 px-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      <option value="heroic">Heroic</option>
                      <option value="friendly">Friendly</option>
                      <option value="fierce">Fierce</option>
                      <option value="mysterious">Mysterious</option>
                    </select>
                  </div>
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
             </div>
            </motion.div>
          </main>
        ) : (
          <div className="w-full min-h-full grid gap-2 md:grid-cols-12">
            {/* Sidebar */}
            <aside className="md:col-span-3 h-full flex flex-col gap-2 overflow-y-auto min-h-0 custom-scrollbar">
              {cityServiceContext && (
                <div className="fantasy-card rounded-xl p-3 border border-amber-500/20">
                  <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500/60 mb-1">
                    City Service
                  </div>
                  <div className="text-sm font-bold text-amber-100">
                    {cityServiceContext.service === "shop" ? "Merchant Stall" : "Guild Hall"}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {cityServiceContext.npcName} is assisting you in {cityServiceContext.regionName}.
                  </p>
                </div>
              )}

              {/* Character Info */}
              <div className="fantasy-card rounded-xl p-2">
                <h3 className="text-[9px] font-bold text-amber-200/60 uppercase tracking-wider mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Hero Stats</h3>
                <div className="space-y-1">
                  {statusBar("HP", character.hp, character.maxHp, "hp")}
                  {statusBar("MP", character.mp, character.maxMp, "mp")}
                  {statusBar("XP", character.xp, character.xpToNext, "xp")}
                </div>
              </div>

              {/* Quest Board */}
              <QuestBoard
                character={character}
                completedQuests={completedQuests}
                onAcceptQuest={(quest) => {
                  handleAcceptQuestFromNPC(quest);
                  setCityServiceContext(null);
                  setActiveTab("World");
                }}
                onCompleteQuest={handleCompleteQuest}
                activeQuestId={activeQuest?.id}
              />
            </aside>

            {/* Main Content */}
            <section className="md:col-span-9 h-full flex flex-col min-h-[400px]">
              <AnimatePresence mode="wait">

                {activeTab === "Inventory" && (
                  <motion.div
                    key="inventory"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Inventory
                      inventory={inventory}
                      selectedItem={selectedItem}
                      onSelectItem={setSelectedItem}
                      onToggleEquip={handleToggleEquip}
                      onConsumeFood={handleConsumeFood}
                      onSellItem={handleSellItem}
                      characterClass={character.class}
                      rank={character.rank}
                      skinColor={character.skinColor}
                      hairColor={character.hairColor}
                      clothingColor={character.clothingColor}
                      faceStyle={character.faceStyle}
                    />
                  </motion.div>
                )}

                {activeTab === "Shop" && character && (
                  <motion.div
                    key="shop"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Shop
                      gold={character.gold}
                      shopItems={SHOP_ITEMS.filter(item => !item.allowedClasses || item.allowedClasses.includes(character.class))}
                      onBuyItem={handleBuyItem}
                      title={cityServiceContext?.npcName ? `${cityServiceContext.npcName}'s Goods` : "Shop"}
                      subtitle={cityServiceContext ? `${cityServiceContext.regionName} marketplace` : undefined}
                      onClose={handleCloseCityService}
                    />
                  </motion.div>
                )}

                {activeTab === "Guild" && character && (
                  <motion.div
                    key="guild"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <GuildMenu
                      character={character}
                      completedQuests={completedQuests}
                      activeQuestId={activeQuest?.id}
                      onEvolve={(updatedCharacter) => {
                        setCharacter(updatedCharacter);
                        saveCharacter(updatedCharacter);
                        audioManager.playSfx("victory");
                      }}
                      onAcceptQuest={(quest) => {
                        handleAcceptQuestFromNPC(quest);
                        setCityServiceContext(null);
                        setActiveTab("World");
                      }}
                      onCompleteQuest={handleCompleteQuest}
                      onClose={handleCloseCityService}
                    />
                  </motion.div>
                )}

                {activeTab === "World" && character && questState !== "battle" && (
                  <motion.div
                    key="world-map"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-0.5 h-full md:grid-cols-12 relative"
                  >
                    {/* Map Section */}
                    <div className="md:col-span-12 flex-1 md:h-full min-h-[56vh] md:min-h-0 overflow-hidden relative">
                      {/* Active Bounty Progress Bar */}
                      {activeQuest?.bounty && character && (
                        <motion.div
                          initial={{ y: -50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute top-4 left-1/2 -translate-x-1/2 z-[4000] w-full max-w-sm pointer-events-none px-4"
                        >
                          <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-3 shadow-2xl flex flex-col gap-2">
                            <div className="flex justify-between items-center px-1">
                              <div className="flex items-center gap-2">
                                <SwordIcon size={14} className="text-amber-500" />
                                <span className="text-[10px] font-black text-amber-100 uppercase tracking-widest whitespace-nowrap">
                                  Tracked Bounty: {activeQuest.bounty.targetMonsterId.replace(/-/g, ' ')}s
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-amber-400">
                                {character.questProgress?.[activeQuest.id] || 0} / {activeQuest.bounty.targetCount}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                              <motion.div
                                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (((character.questProgress?.[activeQuest.id] || 0) / activeQuest.bounty.targetCount) * 100))}%` }}
                                transition={{ type: "spring", stiffness: 50 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {(() => {
                        const mapData = getRegionMapData(character.currentRegion);
                        return mapData && (
                          <WorldMap
                            mapData={mapData}
                            character={character}
                            playerClass={character.class}
                            playerRank={character.rank}
                            inventory={inventory}
                            onNPCInteract={(npc: NPC) => {
                              if (npc.service) {
                                handleOpenCityService(npc);
                                return;
                              }
                              if (npc.questId && !completedQuests.includes(npc.questId) && activeQuest?.id !== npc.questId) {
                                const quest = QUESTS.find(q => q.id === npc.questId);
                                if (quest) {
                                  handleAcceptQuestFromNPC(quest);
                                }
                              }
                            }}
                            onQuestAccepted={(quest: Quest) => {
                              handleAcceptQuestFromNPC(quest);
                            }}
                            completedQuests={completedQuests}
                            activeQuestId={activeQuest?.id}
                            allQuests={QUESTS}
                            onBack={() => { }}
                            onNavigateToRegion={handleRegionChange}
                            onMobKilled={handleMobKilled}
                            onUpdateCharacter={handleUpdateCharacter}
                          />
                        );
                      })()}
                    </div>

                    {/* Map Controls Removed as requested */}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        )}
      </div>


      {/* Celebration Overlay */}
      <AnimatePresence>
        {showTeleportMenu && character && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTeleportMenu(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              className="fantasy-card rounded-xl p-5 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gold" style={{ fontFamily: "'Cinzel', serif" }}>Teleport</h2>
                  <p className="text-sm text-slate-400">Travel instantly to any unlocked region.</p>
                </div>
                <button onClick={() => setShowTeleportMenu(false)} className="text-slate-500 hover:text-slate-300 text-xl transition-colors">✕</button>
              </div>

              <MapSelection
                character={character}
                currentRegion={character.currentRegion}
                onRegionChange={handleRegionChange}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deathNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              className="fantasy-card w-full max-w-lg rounded-2xl border border-red-500/30 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),_transparent_50%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-6 shadow-2xl"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-950/40 text-3xl shadow-[0_0_40px_rgba(239,68,68,0.18)]">
                  💀
                </div>
                <h2
                  className="mb-3 text-2xl font-bold text-red-300"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {deathNotice.title}
                </h2>
                <p className="mx-auto max-w-md text-sm leading-6 text-slate-300">
                  {deathNotice.message}
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleAwakenInHubTown}
                  className="rounded-xl border border-amber-500/40 bg-amber-500/15 px-5 py-3 text-sm font-bold text-amber-100 transition hover:bg-amber-500/25"
                >
                  {deathNotice.buttonLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {celebration && (
          <CelebrationOverlay
            type={celebration.type}
            title={celebration.title}
            subtitle={celebration.subtitle}
            onDismiss={() => setCelebration(null)}
          />
        )}
      </AnimatePresence>

      {/* Quick Toast */}
      <AnimatePresence>
        {toast && (
          <QuickToast
            message={toast.message}
            icon={toast.icon}
            onDismiss={() => setToast(null)}
          />
        )}
        {questToast && (
          <QuickToast
            message={questToast.message}
            icon={questToast.icon}
            onDismiss={() => setQuestToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function IframeScaleWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "#020617" }}>
      {children}
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
