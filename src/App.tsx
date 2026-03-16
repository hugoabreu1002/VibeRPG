import { useMemo, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useHealthCheck,
  useGetCurrentCharacter,
  useCreateCharacter,
  useStartBattle,
  useBattleAction,
  CharacterClass,
  BattleAction,
} from "@workspace/api-client-react";

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

const ACTIONS: BattleAction[] = ["attack", "spell", "defend", "flee"];

const CHARACTER_CLASSES: CharacterClass[] = ["mage", "warrior", "priest"];

type Tab = "Overview" | "Battle" | "Inventory" | "Shop" | "Quests";

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

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as any).status === 404
  );
}

function App() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [enemy, setEnemy] = useState<string>(ENEMIES[0]);
  const [spell, setSpell] = useState<string>("Zoltraak");
  const [createName, setCreateName] = useState("");
  const [createClass, setCreateClass] = useState<CharacterClass>("mage");

  const healthQuery = useHealthCheck();
  const currentCharacterQuery = useGetCurrentCharacter();
  const character = currentCharacterQuery.data;


  const startBattle = useStartBattle({
    mutation: {
      onSuccess: (battle: any) => {
        setBattle(battle);
        queryClient.invalidateQueries({ queryKey: ["/api/characters/current"] });
      },
    },
  });

  const battleAction = useBattleAction({
    mutation: {
      onSuccess: (result: any) => {
        setBattle(result.battle);
        queryClient.invalidateQueries({ queryKey: ["/api/characters/current"] });
      },
    },
  });

  const [battle, setBattle] = useState<null | any>(null);

  const isWaitingForCharacter = currentCharacterQuery.isLoading;
  const missingCharacter = currentCharacterQuery.isError && isNotFound(currentCharacterQuery.error);

  const battleLog = useMemo(
    () => (battle?.logs || []).slice(-6),
    [battle],
  );

  const createCharacterMutation = useCreateCharacter({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/characters/current"] }),
    },
  });

  const submitCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createName.trim()) return;

    createCharacterMutation.mutate({ data: { name: createName.trim(), class: createClass } });
  };

  const startNewBattle = () => {
    if (!character) return;
    startBattle.mutate({ data: { characterId: character.id, enemyName: enemy } });
    setActiveTab("Battle");
  };

  const doBattleAction = (action: BattleAction) => {
    if (!battle) return;
    const spellName = action === "spell" ? spell : undefined;
    battleAction.mutate({ id: battle.id, data: { action, spellName: spellName ?? null } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mx-auto max-w-6xl mb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">VibeRPG Web</h1>
            <p className="text-sm text-slate-500">Browser first, mobile responsive, same game API</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-green-100 text-green-800 px-2 py-1">
              API: {healthQuery.data?.status ?? (healthQuery.isLoading ? "loading" : "offline")}
            </span>
            <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-1">
              {character ? `Player: ${character.name}` : "No character loaded"}
            </span>
          </div>
        </div>
      </header>

      {isWaitingForCharacter ? (
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">Loading character...</div>
      ) : missingCharacter ? (
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
              disabled={createCharacterMutation.status === "pending"}
            >
              Create Character
            </button>
            {createCharacterMutation.isError && (
              <p className="text-sm text-red-600">Error: {(createCharacterMutation.error as any)?.message || "Request failed"}</p>
            )}
          </form>
        </main>
      ) : !character ? (
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">No character available.</div>
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

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Enemy</label>
                    <select
                      value={enemy}
                      onChange={(e) => setEnemy(e.target.value)}
                      className="w-full rounded border p-2"
                    >
                      {ENEMIES.map((e) => (<option key={e} value={e}>{e}</option>))}
                    </select>
                    <button
                      onClick={startNewBattle}
                      className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                      disabled={startBattle.status === "pending"}
                    >
                      {startBattle.status === "pending" ? "Starting..." : "Start Battle"}
                    </button>
                    {startBattle.isError && <p className="text-xs text-red-600">Error: {(startBattle.error as any)?.message || "Unable to start battle"}</p>}
                  </div>

                  {battle ? (
                    <div className="rounded-lg border border-slate-200 p-3">
                      <div className="mb-3">
                        <strong>{battle.enemy.name}</strong> ({battle.status})
                        <p className="text-xs text-slate-500">Round {battle.round}</p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {ACTIONS.filter((a) => a !== "spell" || character.class === "mage").map((action) => (
                          <button
                            key={action}
                            onClick={() => doBattleAction(action)}
                            className="rounded bg-slate-700 px-2 py-1 text-white hover:bg-slate-800"
                          >
                            {action === "spell" ? "Cast Spell" : action.charAt(0).toUpperCase() + action.slice(1)}
                          </button>
                        ))}
                      </div>
                      {character.class === "mage" && (
                        <div className="mt-3">
                          <label className="mb-1 block text-sm font-medium">Spell</label>
                          <select
                            value={spell}
                            onChange={(e) => setSpell(e.target.value)}
                            className="w-full rounded border border-slate-300 px-2 py-1"
                          >
                            <option value="Zoltraak">Zoltraak</option>
                            <option value="Jetzt">Jetzt</option>
                            <option value="Sense Magic">Sense Magic</option>
                          </select>
                        </div>
                      )}
                      <div className="mt-3">
                        <h4 className="mb-1 text-sm font-semibold">Battle Log</h4>
                        <ul className="max-h-48 overflow-y-auto space-y-1 text-xs">
                          {battleLog.map((log: any, idx: number) => (
                            <li key={`${log.actor}-${idx}`} className="rounded border border-slate-200 p-2 bg-slate-50">
                              <span className="font-bold">[{log.actor}]</span> {log.message}
                            </li>
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
                <p className="text-sm text-slate-600">Inventory is under construction for the browser UI. Keep playing with battles and create characters first.</p>
              </div>
            )}

            {activeTab === "Shop" && (
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shop</h2>
                <p className="text-sm text-slate-600">The shop module will populate from API items later. For now, battle and level up to get rewards.</p>
              </div>
            )}

            {activeTab === "Quests" && (
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Quests</h2>
                <p className="text-sm text-slate-600">Quest UI is planned in the next iteration. Check API and backend quest support already in place.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
