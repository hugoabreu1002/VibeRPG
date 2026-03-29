import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Play, Trophy, Users } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Inventory, MapControls, QuestBattle, WorldMap, Quests, Shop } from "./components/game";
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
  RankIcon
} from "./components/game/ui/GameIcons";
import { GuildEvolution } from "./components/game/ui/GuildEvolution";
import { audioManager } from "./lib/audio";
import { pokiService } from "./lib/poki";
import { ALL_ITEMS, CHARACTER_CLASSES, ENEMIES, getEnemy, getInitialCharacterStats, getStarterItems, QUEST_ENEMIES, QUESTS, SHOP_ITEMS } from "./lib/game-data";
import { getQuestMap } from "./lib/map-data";
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

  // Celebration state
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);

  // Poki Compliance States
  const [gameStarted, setGameStarted] = useState(false);

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

    if (isMusicEnabled && gameStarted) {
      audioManager.start();
      if (activeTab === "World Map" || activeTab === "Inventory" || activeTab === "Shop" || activeTab === "Guild") {
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
      setActiveTab("World Map");
      setQuestToast({
        message: `New Quest: ${quest.title}`,
        icon: "⚔️"
      });
      // Poki: gameplayStart when quest begins
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

  const handleBattleVictory = (xpReward: number, goldReward: number) => {
    if (!character) return;

    // Check for bounty progress
    let updatedCharacter = { ...character };
    if (activeQuest?.bounty && activeEnemy) {
      if (activeEnemy.id === activeQuest.bounty.targetMonsterId) {
        const currentProgress = (character.questProgress || {})[activeQuest.id] || 0;
        const newProgress = currentProgress + 1;

        updatedCharacter = {
          ...updatedCharacter,
          questProgress: {
            ...(character.questProgress || {}),
            [activeQuest.id]: newProgress
          }
        };

        if (newProgress >= activeQuest.bounty.targetCount) {
          setToast({ message: `Bounty Target Reached! Return to Guild.`, icon: "🎯" });
          audioManager.playSfx("victory");
        } else {
          setToast({ message: `Bounty Progress: ${newProgress}/${activeQuest.bounty.targetCount}`, icon: "⚔️" });
        }
      }
    }

    const newXp = updatedCharacter.xp + xpReward;
    let newLevel = updatedCharacter.level;
    let newXpToNext = updatedCharacter.xpToNext;

    if (newXp >= updatedCharacter.xpToNext) {
      newLevel++;
      newXpToNext = Math.floor(updatedCharacter.xpToNext * 1.5);
      setToast({ message: "Level Up!", icon: "✨" });
      audioManager.playSfx("victory");
    }

    const finalCharacter = {
      ...updatedCharacter,
      xp: newXp,
      level: newLevel,
      xpToNext: newXpToNext,
      gold: updatedCharacter.gold + goldReward
    };

    setCharacter(finalCharacter);
    saveCharacter(finalCharacter);
    setQuestState("map");
  };

  const handleBattleDefeat = () => {
    if (!character) return;

    // Wild mob defeat
    if (!selectedChoice) {
      const newHp = Math.max(1, Math.floor(character.maxHp / 2));
      setCharacter({
        ...character,
        hp: newHp
      });
      setActiveEnemy(null);
      setQuestState("map");
      setActiveTab("World Map");
      setToast({ message: "Defeated by a wild monster!", icon: "💀" });
      return;
    }

    // Take HP damage on defeat - restore half HP
    const newHp = Math.max(1, Math.floor(character.maxHp / 2));

    // Reset quest state instead of completing it - quest can be attempted again
    setCharacter({
      ...character,
      hp: newHp,
      questState: "list" as QuestState
    });

    // Clear quest state without marking quest as completed
    setActiveQuest(null);
    setQuestState("list");
    setActiveEnemy(null);
    setSelectedChoice(null);

    // Redirect to shop on defeat to allow buying healing items
    setActiveTab("Shop");
    setQuestToast({
      message: "Defeated! Visit the shop to buy healing items, then try the quest again.",
      icon: "💀"
    });
  };

  const handleBattleFlee = () => {
    setActiveEnemy(null);
    setQuestState("map");
    if (!selectedChoice) {
      setActiveTab("World Map");
    }
  };

  const handleMobBattle = (enemyId: string) => {
    const enemyTemplate = ENEMIES[enemyId];
    if (enemyTemplate && character) {
      setActiveEnemy({ ...enemyTemplate });
      setSelectedChoice(null); // Explicitly clear for wild battle
      setQuestState("battle");
      audioManager.playSfx("click");
    }
  };

  const handleUpdateCharacter = useCallback((updates: Partial<Character>) => {
    setCharacter(prev => prev ? { ...prev, ...updates } : null);
  }, []);

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
          currentRegion: char.currentRegion || "Hub Town",
          discoveredTiles: char.discoveredTiles || {}
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
      // Poki: gameplayStart when game begins
      pokiService.gameplayStart();
    } catch (err) {
      console.error("Error starting game:", err);
      // Ensure we still try to start even if SDK/Audio fails
      setGameStarted(true);
    }
  };

  const handleStopGame = () => {
    // Poki: gameplayStop when game ends
    pokiService.gameplayStop();
    setGameStarted(false);
    audioManager.stopBgm();
  };

  // Map selection handler
  const handleRegionChange = (regionId: string) => {
    if (!character) return;

    // Check if player can leave the current region
    const canLeave = canLeaveRegion(character);
    if (!canLeave.can) {
      setToast({ message: canLeave.reason || "Complete region quests first!", icon: "🔒" });
      audioManager.playSfx("click");
      return;
    }

    const updatedCharacter = { ...character, currentRegion: regionId };
    setCharacter(updatedCharacter);
    saveCharacter(updatedCharacter);
    setToast({ message: `Traveling to ${regionId}...`, icon: "🗺️" });
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
      discoveredTiles: {},
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
    <div className="h-full flex flex-col overflow-y-auto bg-background text-foreground ambient-particles custom-scrollbar">
      {/* Poki Ad Overlay */}
      {pokiService.isAdActive() && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center">
          <div className="text-white text-2xl font-bold animate-pulse">Advertisement playing...</div>
        </div>
      )}

      {/* Start Game Landing Overlay - Poki Compliance */}
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

      {/* Fantasy Header - Only show when game started */}
      {gameStarted && (
        <header className="fantasy-header px-4 py-1 relative shrink-0">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
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

            {/* Audio Controls & Stop Button */}
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
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleStopGame}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-500/40 bg-red-900/30 text-red-400 hover:bg-red-800/50 hover:text-red-300 shadow-lg transition-all duration-300"
                title="Stop Game"
              >
                <span className="text-lg">⏹️</span>
              </motion.button>
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
      )}

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

      {/* Main Content Area - Only show when game started */}
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
              <aside className="md:col-span-3 flex flex-col gap-2 overflow-y-auto min-h-0 max-h-[calc(100vh-120px)] custom-scrollbar">
                <div className="fantasy-card rounded-xl p-4">
                  <div className="flex flex-wrap md:flex-col gap-1">
                    <button
                      onClick={() => setActiveTab("World Map")}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "World Map" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <MapTabIcon size={18} />
                      World Map
                    </button>
                    <button
                      onClick={() => setActiveTab("Inventory")}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "Inventory" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <InventoryTabIcon size={18} />
                      Inventory
                    </button>
                    <button
                      onClick={() => setActiveTab("Shop")}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "Shop" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <ShopTabIcon size={18} />
                      Shop
                    </button>
                    <button
                      onClick={() => setActiveTab("Guild")}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === "Guild" ? "bg-amber-600/20 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-900/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <RankIcon size={18} className="translate-y-[-1px]" />
                      Guild
                    </button>
                  </div>
                </div>

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
                    setActiveTab("World Map");
                  }}
                  onCompleteQuest={handleCompleteQuest}
                  activeQuestId={activeQuest?.id}
                />
              </aside>

              {/* Main Content */}
              <section className="md:col-span-9 h-full flex flex-col min-h-[400px]">
                <AnimatePresence mode="wait">
                  {/* Monster Battle - Takes priority over normal tabs */}
                  {questState === "battle" && activeEnemy && character && (
                    <motion.div
                      key="monster-battle"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <MonsterBattle
                        character={character}
                        enemy={activeEnemy}
                        onVictory={handleBattleVictory}
                        onDefeat={handleBattleDefeat}
                        onFlee={handleBattleFlee}
                        onUpdateCharacter={handleUpdateCharacter}
                      />
                    </motion.div>
                  )}

                  {activeTab === "Inventory" && questState !== "battle" && (
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

                  {activeTab === "Shop" && character && questState !== "battle" && (
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

                  {activeTab === "Guild" && character && questState !== "battle" && (
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

                  {activeTab === "World Map" && character && questState !== "battle" && (
                    <motion.div
                      key="world-map"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid gap-2 h-full md:grid-cols-12 relative"
                    >
                      {/* Map Section */}
                      <div className="md:col-span-12 flex-1 md:h-full min-h-[50vh] md:min-h-0 overflow-hidden relative border border-amber-500/10 rounded-2xl">
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
                              onMobInteract={handleMobBattle}
                              onUpdateCharacter={(updates) => character && setCharacter({ ...character, ...updates })}
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