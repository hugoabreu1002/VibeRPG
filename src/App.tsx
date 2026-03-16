import { useMemo, useState, useEffect, type FormEvent } from "react";
import { getCurrentCharacter, createCharacter as dbCreateCharacter, updateCharacter, type CharacterClass } from "./lib/indexeddb";
import { motion, AnimatePresence } from "framer-motion";
import { BattleScene } from "./components/game";
import type { BattleAnimationType } from "./components/game/animations/types";

const ENEMIES = [
  "Flamme's Construct",
  "Aura's Undead Knight",
  "Spiegel's Mirror Shade",
  "Serie's Rejected Pupil",
  "Ruins Guardian",
  "Wirbel's Shade Soldier",
  "Northern Demon Scout",
  "Berserk Mana Elemental",
];

type BattleAction = "attack" | "spell" | "defend" | "flee";
const ACTIONS: BattleAction[] = ["attack", "spell", "defend", "flee"];

const CHARACTER_CLASSES: CharacterClass[] = ["mage", "warrior", "priest"];

type Tab = "Overview" | "Inventory" | "Battle" | "Shop" | "Quests";

interface InventoryItem {
  id: string;
  name: string;
  type: "weapon" | "armor" | "accessory";
  rarity: "common" | "rare" | "epic" | "legendary";
  stats: {
    attack?: number;
    defense?: number;
    magicPower?: number;
    hp?: number;
  };
  equipped: boolean;
  description: string;
}

// Starter inventory items
const STARTER_ITEMS: InventoryItem[] = [
  {
    id: "wooden-staff",
    name: "Apprentice Staff",
    type: "weapon",
    rarity: "common",
    stats: { attack: 3, magicPower: 5 },
    equipped: true,
    description: "A basic staff for aspiring mages."
  },
  {
    id: "cloth-robe",
    name: "Novice Robe",
    type: "armor",
    rarity: "common",
    stats: { defense: 2, hp: 10 },
    equipped: true,
    description: "Simple robes worn by magic apprentices."
  },
  {
    id: "leather-shoes",
    name: "Traveler's Boots",
    type: "accessory",
    rarity: "common",
    stats: { hp: 5 },
    equipped: true,
    description: "Comfortable boots for long journeys."
  }
];

const getRarityColor = (rarity: InventoryItem["rarity"]) => {
  switch (rarity) {
    case "common": return "text-slate-400 border-slate-400";
    case "rare": return "text-blue-400 border-blue-400";
    case "epic": return "text-purple-400 border-purple-400";
    case "legendary": return "text-amber-400 border-amber-400";
  }
};

const getRarityBg = (rarity: InventoryItem["rarity"]) => {
  switch (rarity) {
    case "common": return "bg-slate-100";
    case "rare": return "bg-blue-50";
    case "epic": return "bg-purple-50";
    case "legendary": return "bg-amber-50";
  }
};

interface BattleLog {
  actor: string;
  message: string;
}

interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
}

function getInitialEnemy(name: string): Enemy {
  return {
    name,
    hp: 50,
    maxHp: 50,
    attack: 10,
  };
}

function getInitialCharacterStats(charClass: CharacterClass) {
  switch (charClass) {
    case "mage":
      return { hp: 60, maxHp: 60, mp: 100, maxMp: 100, attack: 15, defense: 5, magicPower: 20 };
    case "warrior":
      return { hp: 100, maxHp: 100, mp: 30, maxMp: 30, attack: 20, defense: 15, magicPower: 5 };
    case "priest":
      return { hp: 80, maxHp: 80, mp: 80, maxMp: 80, attack: 12, defense: 10, magicPower: 15 };
  }
}

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

interface Character {
  id: number;
  createdAt: number;
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  gold: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  magicPower: number;
  xpToNext: number;
}

// Equipment Slot Component
function EquipmentSlot({ 
  type, 
  item, 
  items, 
  onSelect 
}: { 
  type: "weapon" | "armor" | "accessory"; 
  item?: InventoryItem; 
  items: InventoryItem[];
  onSelect: (item: InventoryItem) => void;
}) {
  const getColors = () => {
    switch (type) {
      case "weapon": return { border: "amber-500", from: "amber-900", to: "slate-800" };
      case "armor": return { border: "blue-500", from: "blue-900", to: "slate-800" };
      case "accessory": return { border: "purple-500", from: "purple-900", to: "slate-800" };
    }
  };
  
  const colors = getColors();
  
  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={item ? { scale: 1.05 } : {}}
      onClick={() => {
        if (items.length > 0) {
          onSelect(items[0]);
        }
      }}
    >
      <div className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center ${
        item 
          ? `border-${colors.border} bg-gradient-to-br from-${colors.from}/40 to-${colors.to}` 
          : "border-dashed border-slate-400 bg-slate-800/50"
      }`}>
        {item ? (
          type === "weapon" && (
            <svg viewBox="0 0 32 32" className="w-14 h-14">
              <rect x="14" y="4" width="4" height="24" fill="#8B4513"/>
              <circle cx="16" cy="4" r="4" fill="#00CED1"/>
              <circle cx="16" cy="4" r="2" fill="#FFFFFF"/>
            </svg>
          )
        ) : (
          <span className="text-xs text-slate-500">Empty</span>
        )}
        {item && type === "armor" && (
          <svg viewBox="0 0 32 32" className="w-14 h-14">
            <path d="M10 8 L16 4 L22 8 L22 26 L10 26 Z" fill="#9370DB"/>
            <path d="M12 10 L16 7 L20 10 L20 24 L12 24 Z" fill="#4B0082"/>
            <rect x="14" y="24" width="4" height="4" fill="#4B0082"/>
          </svg>
        )}
        {item && type === "accessory" && (
          <svg viewBox="0 0 32 32" className="w-14 h-14">
            <rect x="8" y="18" width="6" height="10" fill="#8B4513" rx="1"/>
            <rect x="18" y="18" width="6" height="10" fill="#8B4513" rx="1"/>
            <rect x="7" y="26" width="8" height="3" fill="#654321" rx="1"/>
            <rect x="17" y="26" width="8" height="3" fill="#654321" rx="1"/>
          </svg>
        )}
      </div>
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-600 font-medium whitespace-nowrap">
        {item ? item.name : type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    </motion.div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [enemy, setEnemy] = useState<string>(ENEMIES[0]);
  const [spell, setSpell] = useState<string>("Zoltraak");
  const [createName, setCreateName] = useState("");
  const [createClass, setCreateClass] = useState<CharacterClass>("mage");
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [battleEnemy, setBattleEnemy] = useState<Enemy | null>(null);
  const [battleStatus, setBattleStatus] = useState<string>("");
  const [battleRound, setBattleRound] = useState(0);
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const [lastAction, setLastAction] = useState<BattleAnimationType | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>(STARTER_ITEMS);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    getCurrentCharacter().then((char) => {
      setCharacter(char);
      setIsLoading(false);
    });
  }, []);

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

  const startNewBattle = () => {
    if (!character) return;
    setBattleEnemy(getInitialEnemy(enemy));
    setBattleStatus("active");
    setBattleRound(1);
    setBattleLogs([{ actor: "System", message: `Battle started against ${enemy}!` }]);
    setActiveTab("Battle");
  };

  const doBattleAction = (action: BattleAction) => {
    if (!character || !battleEnemy) return;

    let newLogs = [...battleLogs];
    let newCharHp = character.hp;
    let newEnemyHp = battleEnemy.hp;
    let xpGain = 0;
    let goldGain = 0;
    let message = "";

    // Player action
    switch (action) {
      case "attack":
        const damage = Math.max(1, character.attack - Math.floor(battleEnemy.attack / 3));
        newEnemyHp -= damage;
        message = `${character.name} attacks for ${damage} damage!`;
        setLastAction("attack");
        break;
      case "spell":
        if (character.class === "mage") {
          if (spell === "Zoltraak") {
            const spellDamage = character.magicPower + 10;
            newEnemyHp -= spellDamage;
            message = `${character.name} casts Zoltraak for ${spellDamage} damage!`;
          } else if (spell === "Jetzt") {
            const heal = Math.floor(character.maxMp * 0.3);
            newCharHp = Math.min(character.maxHp, character.hp + heal);
            message = `${character.name} casts Jetzt and heals ${heal} HP!`;
          } else {
            message = `${character.name} casts Sense Magic! (No effect in battle)`;
          }
          setLastAction("spell");
        }
        break;
      case "defend":
        message = `${character.name} takes a defensive stance!`;
        setLastAction("defend");
        break;
      case "flee":
        setBattleStatus("fled");
        newLogs.push({ actor: character.name, message: "You fled from battle!" });
        setBattleLogs(newLogs);
        return;
    }

    newLogs.push({ actor: character.name, message });

    // Enemy counter-attack (only if enemy still alive)
    if (newEnemyHp > 0) {
      const enemyDamage = Math.max(1, battleEnemy.attack - Math.floor(character.defense / 2));
      if (action !== "defend") {
        newCharHp -= enemyDamage;
        newLogs.push({ actor: battleEnemy.name, message: `${battleEnemy.name} attacks for ${enemyDamage} damage!` });
      } else {
        const reducedDamage = Math.floor(enemyDamage / 2);
        newCharHp -= reducedDamage;
        newLogs.push({ actor: battleEnemy.name, message: `${battleEnemy.name} attacks! Blocked for ${reducedDamage} damage!` });
      }
    }

    // Determine if battle ended
    const battleEnded = newEnemyHp <= 0 || newCharHp <= 0;
    const newBattleStatus = newEnemyHp <= 0 ? "won" : (newCharHp <= 0 ? "lost" : "active");
    
    // Update battle status
    if (newBattleStatus !== "active") {
      setBattleStatus(newBattleStatus);
    }

    // Update state
    setBattleEnemy({ ...battleEnemy, hp: Math.max(0, newEnemyHp) });
    setBattleRound(battleRound + 1);
    setBattleLogs(newLogs.slice(-6));

    // Update character
    const updatedChar = {
      ...character,
      hp: Math.max(0, newCharHp),
      xp: character.xp + xpGain,
      gold: character.gold + goldGain,
    };
    
    // Level up check
    if (updatedChar.xp >= updatedChar.xpToNext) {
      updatedChar.level += 1;
      updatedChar.xp -= updatedChar.xpToNext;
      updatedChar.xpToNext = Math.floor(updatedChar.xpToNext * 1.5);
      updatedChar.maxHp += 10;
      updatedChar.hp = updatedChar.maxHp;
      updatedChar.maxMp += 5;
      updatedChar.mp = updatedChar.maxMp;
      updatedChar.attack += 2;
      updatedChar.defense += 1;
      newLogs.push({ actor: "System", message: `Level up! Now level ${updatedChar.level}!` });
      setBattleLogs(newLogs.slice(-6));
    }
    
    setCharacter(updatedChar);
    
    // Save to IndexedDB when battle ends
    if (battleEnded) {
      updateCharacter(updatedChar);
    }
  };

  const battleLog = useMemo(
    () => battleLogs.slice(-6),
    [battleLogs],
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mx-auto max-w-6xl mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">VibeRPG Web</h1>
            <p className="text-sm text-slate-500">Play in your browser or on mobile — same world, same adventures</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-green-100 text-green-800 px-2 py-1">
              Ready to play!
            </span>
            <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-1">
              {character ? `Player: ${character.name}` : "No character loaded"}
            </span>
          </div>
        </div>
      </header>

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
            <button
              type="submit"
              className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Create Character
            </button>
          </form>
        </main>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-12">
          <aside className="lg:col-span-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["Overview", "Inventory", "Battle", "Shop", "Quests"] as Tab[]).map((tab) => (
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
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {statusBar("HP", character.hp, character.maxHp)}
                  {statusBar("MP", character.mp, character.maxMp)}
                  {statusBar("XP", character.xp, character.xpToNext)}
                  {statusBar("Attack", character.attack, character.attack + 20)}
                </div>
              </div>
            )}

            {activeTab === "Battle" && (
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Battle</h2>

                {/* Animated Battle Scene */}
                {battleEnemy && character && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    <BattleScene
                      character={{
                        name: character.name,
                        class: character.class,
                        hp: character.hp,
                        maxHp: character.maxHp,
                        mp: character.mp,
                        maxMp: character.maxMp,
                      }}
                      enemy={battleEnemy}
                      battleStatus={battleStatus}
                      lastAction={lastAction || undefined}
                      onAnimationComplete={() => setLastAction(null)}
                    />
                  </motion.div>
                )}

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Enemy</label>
                    <select
                      value={enemy}
                      onChange={(e) => setEnemy(e.target.value)}
                      className="w-full rounded border p-2"
                      disabled={battleStatus === "active"}
                    >
                      {ENEMIES.map((e) => (<option key={e} value={e}>{e}</option>))}
                    </select>
                    <button
                      onClick={startNewBattle}
                      className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                      disabled={battleStatus === "active"}
                    >
                      {battleStatus === "active" ? "In Battle..." : "Start Battle"}
                    </button>
                  </div>

                  {battleEnemy ? (
                    <div className="rounded-lg border border-slate-200 p-3">
                      <div className="mb-3">
                        <strong>{battleEnemy.name}</strong> ({battleStatus})
                        <p className="text-xs text-slate-500">Round {battleRound}</p>
                        <div className="text-xs mt-1">
                          HP: {battleEnemy.hp}/{battleEnemy.maxHp}
                        </div>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {ACTIONS.filter((a) => a !== "spell" || character.class === "mage").map((action) => (
                          <motion.button
                            key={action}
                            onClick={() => doBattleAction(action)}
                            className="rounded bg-slate-700 px-2 py-1 text-white hover:bg-slate-800 disabled:opacity-50"
                            disabled={battleStatus !== "active" || !!lastAction}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {action === "spell" ? "Cast Spell" : action.charAt(0).toUpperCase() + action.slice(1)}
                          </motion.button>
                        ))}
                      </div>
                      {character.class === "mage" && (
                        <div className="mt-3">
                          <label className="mb-1 block text-sm font-medium">Spell</label>
                          <select
                            value={spell}
                            onChange={(e) => setSpell(e.target.value)}
                            className="w-full rounded border border-slate-300 px-2 py-1"
                            disabled={battleStatus !== "active"}
                          >
                            <option value="Zoltraak">Zoltraak (Attack)</option>
                            <option value="Jetzt">Jetzt (Heal)</option>
                            <option value="Sense Magic">Sense Magic</option>
                          </select>
                        </div>
                      )}
                      <div className="mt-3">
                        <h4 className="mb-1 text-sm font-semibold">Battle Log</h4>
                        <ul className="max-h-48 overflow-y-auto space-y-1 text-xs">
                          {battleLog.map((log, idx) => (
                            <motion.li 
                              key={`${log.actor}-${idx}`} 
                              className="rounded border border-slate-200 p-2 bg-slate-50"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <span className="font-bold">[{log.actor}]</span> {log.message}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p>Select an enemy and start a battle.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Inventory" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white p-4 shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-4">Inventory</h2>
                
                {/* Equipment Slots - Now showing equipped items */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-slate-500 uppercase tracking-wide">Currently Equipped</h3>
                  <div className="flex gap-4 justify-center">
                    {/* Weapon Slot */}
                    <EquipmentSlot 
                      type="weapon" 
                      item={inventory.find(i => i.type === "weapon" && i.equipped)}
                      items={inventory.filter(i => i.type === "weapon")}
                      onSelect={setSelectedItem}
                    />
                    
                    {/* Armor Slot */}
                    <EquipmentSlot 
                      type="armor" 
                      item={inventory.find(i => i.type === "armor" && i.equipped)}
                      items={inventory.filter(i => i.type === "armor")}
                      onSelect={setSelectedItem}
                    />
                    
                    {/* Accessory Slot */}
                    <EquipmentSlot 
                      type="accessory" 
                      item={inventory.find(i => i.type === "accessory" && i.equipped)}
                      items={inventory.filter(i => i.type === "accessory")}
                      onSelect={setSelectedItem}
                    />
                  </div>
                </div>

                {/* Inventory Grid */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-slate-500 uppercase tracking-wide">All Items ({inventory.length})</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {inventory.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                            selectedItem?.id === item.id
                              ? "border-indigo-500 bg-indigo-50"
                              : item.equipped
                                ? "border-green-400 bg-green-50"
                                : `${getRarityColor(item.rarity)}/20 ${getRarityBg(item.rarity)}`
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {/* Item Icon */}
                            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                              {item.type === "weapon" && (
                                <svg viewBox="0 0 16 16" className="w-6 h-6">
                                  <rect x="7" y="2" width="2" height="12" fill="#8B4513"/>
                                  <circle cx="8" cy="2" r="2" fill="#00CED1"/>
                                </svg>
                              )}
                              {item.type === "armor" && (
                                <svg viewBox="0 0 16 16" className="w-6 h-6">
                                  <path d="M5 4 L8 2 L11 4 L11 13 L5 13 Z" fill="#9370DB"/>
                                </svg>
                              )}
                              {item.type === "accessory" && (
                                <svg viewBox="0 0 16 16" className="w-6 h-6">
                                  <rect x="4" y="9" width="3" height="5" fill="#8B4513" rx="1"/>
                                  <rect x="9" y="9" width="3" height="5" fill="#8B4513" rx="1"/>
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-sm">{item.name}</span>
                            </div>
                            {item.equipped && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded"
                              >
                                E
                              </motion.span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 capitalize mb-1">{item.type}</div>
                          <div className="flex gap-1 flex-wrap">
                            {Object.entries(item.stats).map(([stat, value]) => (
                              <span key={stat} className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                +{value}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Item Detail Modal */}
                <AnimatePresence>
                  {selectedItem && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                      onClick={() => setSelectedItem(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-xl p-6 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Large Item Display */}
                        <div className={`w-full h-32 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br ${
                          selectedItem.type === "weapon" ? "from-amber-900/30 to-slate-800" :
                          selectedItem.type === "armor" ? "from-blue-900/30 to-slate-800" :
                          "from-purple-900/30 to-slate-800"
                        }`}>
                          {selectedItem.type === "weapon" && (
                            <svg viewBox="0 0 48 48" className="w-24 h-24">
                              <rect x="21" y="6" width="6" height="36" fill="#8B4513"/>
                              <circle cx="24" cy="6" r="6" fill="#00CED1"/>
                              <circle cx="24" cy="6" r="3" fill="#FFFFFF"/>
                              {/* Magic glow */}
                              <motion.circle 
                                cx="24" cy="6" r="10" fill="none" stroke="#00CED1" strokeWidth="2"
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              />
                            </svg>
                          )}
                          {selectedItem.type === "armor" && (
                            <svg viewBox="0 0 48 48" className="w-24 h-24">
                              <path d="M14 12 L24 6 L34 12 L34 38 L14 38 Z" fill="#9370DB"/>
                              <path d="M18 16 L24 12 L30 16 L30 34 L18 34 Z" fill="#4B0082"/>
                              <motion.rect 
                                x="20" y="20" width="8" height="4" fill="#FFD700" 
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              />
                            </svg>
                          )}
                          {selectedItem.type === "accessory" && (
                            <svg viewBox="0 0 48 48" className="w-24 h-24">
                              <rect x="10" y="26" width="10" height="16" fill="#8B4513" rx="2"/>
                              <rect x="28" y="26" width="10" height="16" fill="#8B4513" rx="2"/>
                              <rect x="8" y="38" width="14" height="4" fill="#654321" rx="1"/>
                              <rect x="26" y="38" width="14" height="4" fill="#654321" rx="1"/>
                              {/* Sparkle effect */}
                              <motion.circle 
                                cx="24" cy="20" r="4" fill="#FFD700"
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              />
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-xl font-bold ${getRarityColor(selectedItem.rarity)}`}>
                            {selectedItem.name}
                          </h3>
                          <button
                            onClick={() => setSelectedItem(null)}
                            className="text-slate-400 hover:text-slate-600 text-xl"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className={`inline-block px-3 py-1 rounded text-xs uppercase font-medium mb-4 ${getRarityBg(selectedItem.rarity)} ${getRarityColor(selectedItem.rarity)}`}>
                          {selectedItem.rarity} {selectedItem.type}
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-4">{selectedItem.description}</p>
                        
                        <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-lg">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase">Stats</h4>
                          {Object.entries(selectedItem.stats).map(([stat, value]) => (
                            <div key={stat} className="flex justify-between text-sm">
                              <span className="text-slate-600 capitalize">{stat === 'magicPower' ? 'Magic Power' : stat}</span>
                              <span className="font-bold text-green-600">+{value}</span>
                            </div>
                          ))}
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setInventory(inventory.map(item => 
                              item.id === selectedItem.id 
                                ? { ...item, equipped: !item.equipped }
                                : item.type === selectedItem.type 
                                  ? { ...item, equipped: false }
                                  : item
                            ));
                          }}
                          className={`w-full py-3 rounded-lg font-bold ${
                            selectedItem.equipped
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {selectedItem.equipped ? "UNEQUIP" : "EQUIP"}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === "Shop" && (
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shop</h2>
                <p className="text-sm text-slate-600">The shop is coming soon! Keep battling to earn gold.</p>
              </div>
            )}

            {activeTab === "Quests" && (
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Quests</h2>
                <p className="text-sm text-slate-600">Quests are coming in a future update!</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
