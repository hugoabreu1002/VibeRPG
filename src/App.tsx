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

type Tab = "Overview" | "Battle" | "Inventory" | "Shop" | "Quests";

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
                {(["Overview", "Battle", "Inventory", "Shop", "Quests"] as Tab[]).map((tab) => (
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
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Inventory</h2>
                <p className="text-sm text-slate-600">Inventory is under construction. Keep battling to earn rewards!</p>
              </div>
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
