import { useState, useEffect, type FormEvent } from "react";
import { getCurrentCharacter, getAllCharacters, createCharacter as dbCreateCharacter, deleteCharacter, type CharacterClass } from "./lib/indexeddb";
import { CHARACTER_CLASSES, getStarterItems, getInitialCharacterStats, QUESTS } from "./lib/game-data";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, InventoryItem, Quest, QuestChoice, QuestState, QuestResult, Tab, Enemy } from "./types/game";
import { Inventory, Quests, QuestBattle } from "./components/game";
import { getQuestEnemy } from "./lib/game-data";

function statusBar(label: string, value: number, max: number) {
  const progress = max > 0 ? Math.min(100, Math.floor((value / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-300">
        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [createName, setCreateName] = useState("");
  const [createClass, setCreateClass] = useState<CharacterClass>("mage");
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>(getStarterItems("mage"));
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
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

  const handleDeleteCharacter = async (characterId: number) => {
    if (!character) return;
    
    await deleteCharacter(characterId);
    
    // If we deleted the current character, switch to another one or clear state
    if (character.id === characterId) {
      const remainingChars = allCharacters.filter(c => c.id !== characterId);
      if (remainingChars.length > 0) {
        const newChar = remainingChars[0];
        setCharacter(newChar);
        setInventory(getStarterItems(newChar.class));
      } else {
        setCharacter(null);
        setInventory(getStarterItems("mage"));
      }
    }
    
    // Update the list
    setAllCharacters(allCharacters.filter(c => c.id !== characterId));
    setShowDeleteConfirm(null);
  };

  const startQuest = (quest: Quest) => {
    setActiveQuest(quest);
    setQuestState("active");
  };

  const attemptQuestChoice = (choice: QuestChoice) => {
    if (!character || !activeQuest) return;
    
    // Store the selected choice
    setSelectedChoice(choice);
    
    // Get the enemy for this quest
    const enemy = getQuestEnemy(activeQuest.id);
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
      
      setCharacter({
        ...character,
        xp: newXp,
        gold: newGold,
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
        gold: choice.goldReward
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
      setCompletedQuests([...completedQuests, activeQuest.id]);
    }
    
    setQuestState("result");
  };

  const handleBattleVictory = (xp: number, gold: number) => {
    if (!character || !selectedChoice) return;
    
    // Add battle rewards + quest bonus
    const newXp = character.xp + xp + selectedChoice.xpReward;
    const newGold = character.gold + gold + selectedChoice.goldReward;
    
    setCharacter({
      ...character,
      xp: newXp,
      gold: newGold,
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
      gold: gold + selectedChoice.goldReward
    });
    
    if (activeQuest && !completedQuests.includes(activeQuest.id)) {
      setCompletedQuests([...completedQuests, activeQuest.id]);
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
      setCompletedQuests([...completedQuests, activeQuest.id]);
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
      setCharacter(char);
      if (char) {
        setInventory(getStarterItems(char.class));
      }
      setIsLoading(false);
    });
  }, []);

  const handleToggleEquip = (item: InventoryItem) => {
    setInventory(inventory.map(i => 
      i.id === item.id 
        ? { ...i, equipped: !i.equipped }
        : i.type === item.type 
          ? { ...i, equipped: false }
          : i
    ));
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
      ...stats,
    };

    const created = await dbCreateCharacter(newCharacter);
    setCharacter(created);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mx-auto max-w-6xl mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">VibeRPG Web</h1>
            <p className="text-sm text-slate-500">Play in your browser or on mobile — same world, same adventures</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs items-center">
            <span className="rounded-full bg-green-100 text-green-800 px-2 py-1">Ready to play!</span>
            <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-1">
              {character ? `Player: ${character.name}` : "No character loaded"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowCharacterSelect(!showCharacterSelect);
                getAllCharacters().then(chars => setAllCharacters(chars));
              }}
              className="rounded-full bg-purple-100 text-purple-800 px-2 py-1 hover:bg-purple-200"
            >
              Switch Character
            </motion.button>
          </div>
        </div>
      </header>

      {/* Character Selection Modal */}
      <AnimatePresence>
        {showCharacterSelect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCharacterSelect(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Select Character</h2>
                <button onClick={() => setShowCharacterSelect(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
              </div>
              
              <div className="space-y-3 mb-4">
                {allCharacters.map((char) => (
                  <motion.div
                    key={char.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg border-2 ${
                      character?.id === char.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          setCharacter(char);
                          setInventory(getStarterItems(char.class));
                          setShowCharacterSelect(false);
                        }}
                      >
                        <span className="font-semibold">{char.name}</span>
                        <span className="text-xs text-slate-500 ml-2">
                          {char.class === 'mage' && '🔮'}
                          {char.class === 'warrior' && '⚔️'}
                          {char.class === 'priest' && '⛑️'}
                          {char.class.toUpperCase()}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">Lv. {char.level}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(char.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-slate-500 text-center mb-4">Create a new character to play a different class!</p>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Create New Character</h3>
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
                    ...stats,
                  };
                  const created = await dbCreateCharacter(newCharacter);
                  setCharacter(created);
                  setAllCharacters([...allCharacters, created]);
                  setShowCharacterSelect(false);
                  setCreateName("");
                }}>
                  <input
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Character name"
                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <select
                      value={createClass}
                      onChange={(e) => setCreateClass(e.target.value as CharacterClass)}
                      className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
                    >
                      {CHARACTER_CLASSES.map((c) => (
                        <option key={c} value={c}>
                          {c === 'mage' && '🔮 '}{c === 'warrior' && '⚔️ '}{c === 'priest' && '⛑️ '}{c}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700">Create</button>
                  </div>
                </form>
              </div>

              {/* Delete Confirmation Dialog */}
              {showDeleteConfirm !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-xl p-6 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">Delete Character</h2>
                      <button onClick={() => setShowDeleteConfirm(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4">
                      Are you sure you want to delete this character? This action cannot be undone.
                    </p>
                    
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-4 py-2 text-slate-600 border border-slate-300 rounded hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteCharacter(showDeleteConfirm)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete Character
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">Loading character...</div>
      ) : !character ? (
        <main className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Create your first character</h2>
          <form className="space-y-4" onSubmit={submitCreate}>
            <input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Name"
              className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={createClass}
              onChange={(e) => setCreateClass(e.target.value as CharacterClass)}
              className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CHARACTER_CLASSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Create Character</button>
          </form>
        </main>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-12">
          <aside className="lg:col-span-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["Overview", "Quests", "Shop"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded px-3 py-2 text-sm ${activeTab === tab ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-slate-200 p-3">
              <h3 className="text-sm font-semibold">Character</h3>
              <p>{character.name} ({character.class})</p>
              <p>Level {character.level} · {character.gold} gold</p>
            </div>
          </aside>

          <section className="lg:col-span-9 space-y-4">
            {activeTab === "Overview" && (
              <div className="space-y-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Overview</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {statusBar("HP", character.hp, character.maxHp)}
                    {statusBar("MP", character.mp, character.maxMp)}
                    {statusBar("XP", character.xp, character.xpToNext)}
                    {statusBar("Attack", character.attack, character.attack + 20)}
                  </div>
                </div>

                <Inventory
                  inventory={inventory}
                  selectedItem={selectedItem}
                  onSelectItem={setSelectedItem}
                  onToggleEquip={handleToggleEquip}
                  characterClass={character.class}
                />
              </div>
            )}

            {activeTab === "Shop" && (
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shop</h2>
                <p className="text-sm text-slate-600">The shop is coming soon! Keep completing quests to earn gold.</p>
              </div>
            )}

            {activeTab === "Quests" && character && (
              <>
                {questState === "battle" && activeEnemy ? (
                  <QuestBattle
                    character={character}
                    enemy={activeEnemy}
                    onVictory={handleBattleVictory}
                    onDefeat={handleBattleDefeat}
                    onFlee={handleBattleFlee}
                    onUpdateCharacter={(updates) => setCharacter(prev => prev ? { ...prev, ...updates } : null)}
                  />
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
  );
}

export default App;
