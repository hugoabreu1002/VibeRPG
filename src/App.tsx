import { AnimatePresence, motion } from "framer-motion";
import {
  Gamepad2,
  Play,
  Square,
  Trophy,
  Users
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Inventory, MapControls, QuestBattle, QuestMap, Quests, Shop } from "./components/game";
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
  XPIcon
} from "./components/game/ui/GameIcons";
import { GuildEvolution } from "./components/game/ui/GuildEvolution";
import { audioManager } from "./lib/audio";
import { ALL_ITEMS, CHARACTER_CLASSES, getEnemy, getInitialCharacterStats, getStarterItems, QUEST_ENEMIES, QUESTS, SHOP_ITEMS } from "./lib/game-data";
import { getQuestMap } from "./lib/map-data";
import { pokiService } from "./lib/poki";
import { acceptQuestFromNPC, completeQuestAfterBattle, hasFinishedMainStory } from "./lib/quest-logic";
import { RANKS } from "./lib/rank-utils";
import { getRegionMapData } from "./lib/region-utils";
import { createCharacter as dbCreateCharacter, updateCharacter as dbUpdateCharacter, deleteCharacter, getAllCharacters, getCurrentCharacter, type CharacterClass } from "./lib/storage";
import type { Character, Enemy, InventoryItem, NPC, Quest, QuestChoice, QuestResult, QuestState, Tab } from "./types/game";

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


  // Celebration state
  const [celebration, setCelebration] = useState<{
    type: "quest-complete" | "level-up" | "item-obtained" | "first-victory";
    title: string;
    subtitle?: string;
  } | null>(null);

  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null);
  const [questToast, setQuestToast] = useState<{ message: string; icon: string } | null>(null);

  // Track previous level for level-up detection
  const [isMapControlsMinimized, setIsMapControlsMinimized] = useState(false);
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);
  const [showReviveOverlay, setShowReviveOverlay] = useState(false);

  // Load all characters
  useEffect(() => {
    getAllCharacters().then(chars => {
      setAllCharacters(chars);
    });
  }, []);

  // Poki Compliance States
  const [gameStarted, setGameStarted] = useState(false);

  // Audio initialization and BGM control
  useEffect(() => {
    // Synchronize master mute with our local state
    audioManager.setMasterMute(!isMusicEnabled);

    if (isMusicEnabled && gameStarted) {
      audioManager.start();
      if (activeTab === "World Map" || activeTab === "Inventory" || activeTab === "Shop") {
        audioManager.playBgm("main");
      }
    } else {
      audioManager.stopBgm();
    }
  }, [isMusicEnabled, activeTab, gameStarted]);

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

  const handleAcceptQuestFromNPC = async (quest: Quest) => {
    if (!character) return;

    // Trigger commercial break before starting a quest
    await pokiService.commercialBreak(() => {
      audioManager.setAdMute(true);
    });
    audioManager.setAdMute(false);

    const result = await acceptQuestFromNPC(character, quest);
    if (result.success) {
      setCharacter(result.updatedCharacter);
      setActiveQuest(quest);
      setQuestState("active");
      setActiveTab("Quests");
      setQuestToast({
        message: `New Quest: ${quest.title}`,
        icon: "⚔️"
      });
      pokiService.gameplayStart();
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

    pokiService.gameplayStop();

    // Update local state with the result
    if (result.updatedCharacter) {
      setCharacter(result.updatedCharacter);
      setCompletedQuests(result.updatedCharacter.completedQuests);
      setInventory(result.updatedCharacter.inventory || []);
    }

    // Clear active quest and reset state
    setActiveQuest(null);
    setQuestState("list");

    // Redirect to World Map
    setActiveTab("World Map");

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
      setActiveTab("Shop");
      setQuestToast({
        message: "Defeated! Visit the shop to buy healing items, then try the quest again.",
        icon: "💀"
      });
    }
  };

  const startQuest = (quest: Quest) => {
    if (!character) return;
    acceptQuestFromNPC(character, quest);
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

  const handleBattleVictory = async (xp: number, gold: number) => {
    if (!character || !selectedChoice) return;

    // Handle item reward
    let rewardedItem: InventoryItem | undefined;
    if (selectedChoice.rewardItemId) {
      const itemTemplate = ALL_ITEMS.find(i => i.id === selectedChoice.rewardItemId);
      if (itemTemplate) {
        rewardedItem = { ...itemTemplate, id: `${itemTemplate.id}-${Date.now()}` };
      }
    }

    // Use centralized quest completion function
    await handleCompleteQuestAfterBattle(
      true,
      xp + selectedChoice.xpReward,
      gold + selectedChoice.goldReward,
      rewardedItem,
      selectedChoice.rewardSkill
    );

    setActiveEnemy(null);
  };

  const handleBattleDefeat = () => {
    if (!character || !selectedChoice) return;

    // Signal gameplay stop on defeat
    pokiService.gameplayStop();

    // Show Revive Overlay instead of direct defeat
    setShowReviveOverlay(true);
  };

  const handleReviveWithAd = async () => {
    if (!character) return;

    const success = await pokiService.rewardedBreak({
      onStart: () => audioManager.setAdMute(true)
    });

    audioManager.setAdMute(false);

    if (success) {
      // Revive with full HP/MP
      setCharacter({
        ...character,
        hp: character.maxHp,
        mp: character.maxMp
      });
      setShowReviveOverlay(false);
      setQuestState("active"); // Resume quest
      setActiveEnemy(null); // Clear enemy to allow retry/continue

      // Signal gameplay start after revive
      pokiService.gameplayStart();

      setToast({
        message: "Revived with full energy!",
        icon: "✨"
      });
      audioManager.playSfx("victory");
    }
  };

  const handleAcceptDefeat = () => {
    if (!character) return;

    // Take HP damage on defeat - restore half HP
    const newHp = Math.max(1, Math.floor(character.maxHp / 2));

    setCharacter({
      ...character,
      hp: newHp,
    });

    // Clear quest state
    setActiveQuest(null);
    setQuestState("list");
    setActiveEnemy(null);
    setSelectedChoice(null);
    setShowReviveOverlay(false);

    // Redirect to shop
    setActiveTab("Shop");
    setQuestToast({
      message: "Defeated! Visit the shop to buy healing items.",
      icon: "💀"
    });
  };

  const handleBattleFlee = () => {
    // Reset to quest list, don't complete the quest
    setQuestState("list");
    setActiveEnemy(null);
    setSelectedChoice(null);
  };

  const handleUpdateCharacter = useCallback((updates: Partial<Character>) => {
    setCharacter(prev => prev ? { ...prev, ...updates } : null);
  }, []);

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
          completedQuests: char.completedQuests || [],
          acceptedQuests: char.acceptedQuests || [],
          currentRegion: char.currentRegion || "Hub Town"
        };
        setCharacter(enrichedChar);
        setInventory(enrichedChar.inventory);
        setCompletedQuests(enrichedChar.completedQuests);
      }
      setIsLoading(false);
    });
  }, []);

  const handleWatchAd = async () => {
    if (!character) return;

    const success = await pokiService.rewardedBreak({
      onStart: () => audioManager.setAdMute(true)
    });

    audioManager.setAdMute(false);

    if (success) {
      const newGold = character.gold + 50;
      setCharacter({ ...character, gold: newGold });
      setToast({
        message: "Watched ad! +50 Gold awarded.",
        icon: "💰"
      });
      audioManager.playSfx("victory");
    }
  };

  const handleStartGame = async () => {
    console.log("Start Game Button Clicked");
    try {
      // Show commercial break before starting game as per Poki recommendations
      await pokiService.commercialBreak(() => {
        audioManager.setAdMute(true);
      });
      audioManager.setAdMute(false);

      setGameStarted(true);
      audioManager.start();
      pokiService.gameplayStart();
    } catch (err) {
      console.error("Error starting game:", err);
      // Ensure we still try to start even if SDK/Audio fails
      setGameStarted(true);
    }
  };

  const handleStopGame = () => {
    pokiService.gameplayStop();
    setGameStarted(false);
    audioManager.stopBgm();
  };

  // Map selection handler
  const handleRegionChange = async (regionId: string) => {
    if (character) {
      // Signal commercial break on region change (natural transition)
      await pokiService.commercialBreak(() => {
        audioManager.setAdMute(true);
      });
      audioManager.setAdMute(false);

      setCharacter({ ...character, currentRegion: regionId });
      audioManager.playSfx("click");
    }
  };

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

  // Show toast for quest completion
  useEffect(() => {
    if (questState === "result" && questResult?.success) {
      setToast({
        message: `Quest Complete! +${questResult.xp} XP, +${questResult.gold} Gold`,
        icon: "🏆"
      });
    }
  }, [questState, questResult]);

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
      rank: "F" as const,
      activeQuestId: undefined,
      questState: "list",
      ...stats,
    };

    const created = await dbCreateCharacter(newCharacter);
    setCharacter(created);
    setInventory(created.inventory);
  };

  const tabConfig: { tab: Tab; icon: React.ReactNode; label: string }[] = [
    { tab: "World Map", icon: <MapTabIcon />, label: "World Map" },
    { tab: "Inventory", icon: <InventoryTabIcon />, label: "Inventory" },
    { tab: "Shop", icon: <ShopTabIcon />, label: "Shop" },
    { tab: "Guild", icon: <GuildTabIcon />, label: "Guild" },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-background text-foreground ambient-particles custom-scrollbar">
      {/* Poki Ad Overlay */}
      {pokiService.isAdActive() && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center">
          <div className="text-white text-2xl font-bold animate-pulse">Advertisement playing...</div>
        </div>
      )}
      {/* Fantasy Header */}
      <header className="fantasy-header px-4 py-1.5 relative shrink-0">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 group cursor-pointer" style={{ fontFamily: "var(--font-serif)" }} onClick={() => setActiveTab("Inventory")}>
              <span className="bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-all">VIBE</span>
              <span className="text-amber-500 font-extralight opacity-50">/</span>
              <span className="text-slate-100 group-hover:text-white transition-colors">RPG</span>
            </h1>

            {/* Poki STOP Button */}
            {gameStarted && (
              <button
                onClick={handleStopGame}
                className="ml-4 flex items-center gap-1.5 bg-red-950/40 border border-red-900/40 px-3 py-1 rounded-lg text-red-400 text-xs font-bold hover:bg-red-900/30 transition-all active:scale-95"
              >
                <Square size={12} fill="currentColor" />
                STOP
              </button>
            )}
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-3 mr-auto ml-6">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMusic}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 shadow-lg transition-all duration-500 ${isMusicEnabled
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
                    acceptedQuests: [],
                    questState: "list",
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
                          {c.charAt(0).toUpperCase() + c.slice(1)}
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

      {/* Start Game Landing Overlay */}
      {!gameStarted && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-md w-full fantasy-card p-10 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="mb-8 relative">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-amber-900/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Gamepad2 size={48} className="text-slate-950" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xl shadow-lg animate-bounce">⚔️</div>
            </div>

            <h2 className="text-4xl font-bold mb-4 text-white uppercase tracking-widest" style={{ fontFamily: "var(--font-serif)" }}>
              Vibe <span className="text-amber-500">RPG</span>
            </h2>

            <p className="text-slate-400 mb-10 text-lg leading-relaxed">
              Embark on a mythical journey where your choices shape destiny.
            </p>

            <button
              onClick={handleStartGame}
              className="w-full btn-fantasy py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-amber-500/20 relative z-[10001] pointer-events-auto cursor-pointer"
            >
              <Play fill="currentColor" size={24} />
              START JOURNEY
            </button>

            <div className="mt-8 pt-8 border-t border-slate-800/50 flex justify-center gap-6 opacity-60">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold uppercase tracking-tighter">
                <Trophy size={14} className="text-gold" /> Epic Loot
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold uppercase tracking-tighter">
                <Users size={14} className="text-blue-400" /> Deep Lore
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {gameStarted && (
        <div className="flex-1 min-h-0 overflow-hidden px-3 py-2">
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-amber-200/60 font-medium">Class</label>
                      <span className="text-amber-400">{CLASS_ICONS[createClass]}</span>
                    </div>
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
            <div className="w-full min-h-full grid gap-2 md:grid-cols-12">
              {/* Sidebar */}
              <aside className="md:col-span-3 flex flex-col gap-2 overflow-y-auto min-h-0">
                <div className="fantasy-card rounded-xl p-4">
                  <div className="flex flex-wrap md:flex-col gap-1">
                    {tabConfig.map(({ tab, icon, label }) => (
                      <motion.button
                        key={tab}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveTab(tab);
                          audioManager.playSfx("click");
                        }}
                        className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-all ${activeTab === tab
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
                <div className="fantasy-card rounded-xl p-3">
                  <h3 className="text-[10px] font-bold text-amber-200/60 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-serif)" }}>Hero Stats</h3>
                  <div className="space-y-2">
                    {statusBar("HP", character.hp, character.maxHp, "hp")}
                    {statusBar("MP", character.mp, character.maxMp, "mp")}
                    {statusBar("XP", character.xp, character.xpToNext, "xp")}
                    <div className="h-px bg-slate-800/50 my-1"></div>
                    {statusBar("Attack Power", character.attack, character.attack + 20, "attack")}
                  </div>
                </div>
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
                        shopItems={SHOP_ITEMS}
                        onBuyItem={handleBuyItem}
                        onWatchAd={handleWatchAd}
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
                    >
                      <GuildEvolution
                        character={character}
                        onEvolve={(updatedCharacter) => {
                          setCharacter(updatedCharacter);
                          audioManager.playSfx("victory");
                        }}
                        onClose={() => setActiveTab("World Map")}
                      />
                    </motion.div>
                  )}

                  {activeTab === "World Map" && character && (
                    <motion.div
                      key="world-map"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid gap-2 h-full md:grid-cols-12 relative"
                    >
                      {/* Map - takes more columns when controls are minimized */}
                      <div className={`${isMapControlsMinimized ? "md:col-span-12" : "md:col-span-8"} flex-1 md:h-full min-h-[50vh] md:min-h-0 overflow-hidden relative border border-amber-500/10 rounded-2xl`}>
                        <button
                          onClick={() => setIsMapControlsMinimized(!isMapControlsMinimized)}
                          className="absolute top-4 right-4 z-[4000] px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-amber-500/40 text-amber-200 hover:text-white transition-all shadow-xl pointer-events-auto flex items-center gap-2 text-xs font-bold"
                          title={isMapControlsMinimized ? "Show Quests" : "Maximize Map"}
                        >
                          {isMapControlsMinimized ? "📜 Show Quests ◀" : "🗺️ Maximize Map ▶"}
                        </button>
                        {(() => {
                          const mapData = getRegionMapData(character.currentRegion);
                          return mapData && (
                            <QuestMap
                              mapData={mapData}
                              character={character}
                              playerClass={character.class}
                              inventory={inventory}
                              onNPCInteract={(npc: NPC) => {
                                if (npc.questId && !completedQuests.includes(npc.questId) && activeQuest?.id !== npc.questId) {
                                  const quest = QUESTS.find(q => q.id === npc.questId);
                                  if (quest && (quest.class === character.class || hasFinishedMainStory(character))) {
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
                            />
                          );
                        })()}
                      </div>

                      {/* Map Controls - collapsible */}
                      {!isMapControlsMinimized && (
                        <motion.aside
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="md:col-span-4 flex flex-col gap-2 min-h-0 overflow-y-auto"
                        >
                          <MapControls
                            character={character}
                            currentRegion={character.currentRegion}
                            onRegionChange={handleRegionChange}
                          />
                        </motion.aside>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "Quests" && character && (
                    <motion.div
                      key="quests"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {questState === "battle" && activeEnemy ? (
                        <QuestBattle
                          character={{ ...character, inventory }}
                          enemy={activeEnemy}
                          onVictory={handleBattleVictory}
                          onDefeat={handleBattleDefeat}
                          onFlee={handleBattleFlee}
                          onUpdateCharacter={handleUpdateCharacter}
                          onBattleComplete={(result) => {
                            if (result.success) {
                              handleBattleVictory(result.xp, result.gold);
                            }
                          }}
                        />
                      ) : questState === "map" && activeQuest ? (
                        (() => {
                          const mapData = getQuestMap(activeQuest.region);
                          return mapData ? (
                            <QuestMap
                              quest={activeQuest}
                              mapData={getQuestMap(activeQuest.region)}
                              character={character}
                              playerClass={character.class}
                              inventory={inventory}
                              completedQuests={completedQuests}
                              activeQuestId={activeQuest?.id}
                              allQuests={QUESTS}
                              onNPCInteract={(npc: NPC) => {
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </div>
          )}
        </div>
      )}

      {/* Celebration Overlay */}
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

      {/* Revive Overlay */}
      <AnimatePresence>
        {showReviveOverlay && (
          <div className="fixed inset-0 z-[10005] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-sm w-full fantasy-card p-8 text-center"
            >
              <div className="text-5xl mb-4">💀</div>
              <h2 className="text-2xl font-bold text-red-400 mb-2" style={{ fontFamily: "var(--font-serif)" }}>Hero Defeated</h2>
              <p className="text-slate-400 mb-8 text-sm">
                You have fallen in battle. Would you like to watch a short vision to revive with full strength?
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleReviveWithAd}
                  className="w-full btn-fantasy py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>🎬</span> Revive with Full HP/MP
                </button>
                <button
                  onClick={handleAcceptDefeat}
                  className="w-full py-3 rounded-xl font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Return to Town
                </button>
              </div>
            </motion.div>
          </div>
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

const MIN_WIDTH = 800;
const MIN_HEIGHT = 450;

/**
 * IframeScaleWrapper
 * - On viewports >= 800×450: renders children at full viewport size (responsive).
 * - On smaller viewports: scales down so the minimum 800×450 layout fits.
 */
function IframeScaleWrapper({ children }: { children: React.ReactNode }) {
  const [{ scale, innerW, innerH, vw, vh }, setState] = useState({
    scale: 1,
    innerW: typeof window !== "undefined" ? window.innerWidth : MIN_WIDTH,
    innerH: typeof window !== "undefined" ? window.innerHeight : MIN_HEIGHT,
    vw: typeof window !== "undefined" ? window.innerWidth : MIN_WIDTH,
    vh: typeof window !== "undefined" ? window.innerHeight : MIN_HEIGHT,
  });

  useEffect(() => {
    function update() {
      const v_w = window.innerWidth;
      const v_h = window.innerHeight;
      // Only scale DOWN when the viewport is smaller than the minimum target.
      const s = parseFloat(Math.min(1, v_w / MIN_WIDTH, v_h / MIN_HEIGHT).toFixed(4));

      // We want to avoid extreme aspect ratios (like 1800x450).
      // If the viewport is very wide/short, we'll cap the logical size and center it.
      const logicalW = Math.min(1200, Math.round(v_w / s));
      const logicalH = Math.min(900, Math.round(v_h / s));

      setState({
        scale: s,
        innerW: logicalW,
        innerH: logicalH,
        vw: v_w,
        vh: v_h
      });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Align top for portrait/landscape consistency
  const left = scale < 1 ? (vw - innerW * scale) / 2 : (vw - innerW) / 2;
  const top = 0; // Always start from top as requested

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#020617" }}>
      <div
        style={{
          width: innerW,
          height: innerH,
          position: "absolute",
          left,
          top,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
        }}
      >
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
