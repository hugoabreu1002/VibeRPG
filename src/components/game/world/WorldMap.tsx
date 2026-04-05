import { AnimatePresence, motion } from "framer-motion";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { audioManager } from "../../../lib/audio";
import { ENEMIES, REGION_MOBS } from "../../../lib/game-data";
import { acceptQuestFromNPC, hasFinishedMainStory } from "../../../lib/quest-logic";
import type { Character, CharacterClass, InventoryItem, NPC, Quest, QuestMapData } from "../../../types/game";
import { EnemySpriteBody } from "../battle/EnemySprites";
import { InventorySprite } from "../character/InventorySprite";
import { ExclamationIndicator } from "../ui/GameIcons";
import { NPCSprite } from "./NPCSprites";

const TILE_SIZE = 80;
const WANDER_RADIUS = 5;
const COMBAT_INTERVAL_MS = 850;
const MOB_COUNT_MIN = 4;
const MOB_COUNT_MAX = 6;

interface WorldMapProps {
  mapData: QuestMapData;
  character: Character;
  playerClass?: CharacterClass;
  playerRank?: string;
  inventory?: InventoryItem[];
  completedQuests?: string[];
  activeQuestId?: string | null;
  quest?: Quest;
  allQuests: Quest[];
  onNPCInteract: (npc: NPC) => void;
  onBack: () => void;
  onNavigateToRegion?: (regionId: string) => void;
  onQuestAccepted?: (quest: Quest) => void;
  onUpdateCharacter?: (updates: Partial<Character>) => void;
  onMobKilled?: (enemyId: string, xp: number, gold: number) => void;
}

interface MapMob {
  id: string;
  enemyId: string;
  position: { x: number; y: number };
  spawnPos: { x: number; y: number };
  hp: number;
  maxHp: number;
}

// ─── A* pathfinder ────────────────────────────────────────────────────────────
function findPath(
  start: { x: number; y: number },
  goal:  { x: number; y: number },
  tiles: string[][],
  width: number,
  height: number,
): { x: number; y: number }[] {
  const isWalkable = (x: number, y: number) => {
    const t = tiles[y]?.[x];
    return !!t && t !== "water" && t !== "mountain" && t !== "lava";
  };
  if (!isWalkable(goal.x, goal.y)) return [];
  if (start.x === goal.x && start.y === goal.y) return [];

  const key = (p: { x: number; y: number }) => p.x * 1000 + p.y;
  const h   = (p: { x: number; y: number }) => Math.abs(p.x - goal.x) + Math.abs(p.y - goal.y);

  const openSet  = new Map<number, { x: number; y: number }>();
  const cameFrom = new Map<number, number>();
  const gScore   = new Map<number, number>();

  const startKey = key(start);
  openSet.set(startKey, start);
  gScore.set(startKey, 0);

  const DIRS = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];

  while (openSet.size > 0) {
    // Pick lowest f-score node
    let cur = start;
    let curKey = startKey;
    let lowestF = Infinity;
    for (const [k, node] of Array.from(openSet.entries())) {
      const f = (gScore.get(k) ?? Infinity) + h(node);
      if (f < lowestF) { lowestF = f; cur = node; curKey = k; }
    }
    openSet.delete(curKey);

    if (cur.x === goal.x && cur.y === goal.y) {
      // Reconstruct
      const path: { x: number; y: number }[] = [];
      let k: number | undefined = curKey;
      while (k !== undefined && k !== startKey) {
        path.unshift(cur);
        k = cameFrom.get(k);
        if (k !== undefined) cur = { x: Math.floor(k / 1000), y: k % 1000 };
      }
      path.unshift(cur);
      return path.slice(1); // exclude current position
    }

    const g = gScore.get(curKey) ?? 0;
    for (const d of DIRS) {
      const nx = cur.x + d.x, ny = cur.y + d.y;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      if (!isWalkable(nx, ny)) continue;
      const nk = key({ x: nx, y: ny });
      const ng = g + 1;
      if (ng < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, curKey);
        gScore.set(nk, ng);
        openSet.set(nk, { x: nx, y: ny });
      }
    }
    if (cameFrom.size > 2000) return []; // guard against huge maps
  }
  return [];
}

// ─── Canvas tile renderer (memoised, only redraws on camera/map change) ──────
const MapCanvas = memo(({
  mapData, tileSize, playerPos, discoveredTiles
}: {
  mapData: QuestMapData;
  tileSize: number;
  playerPos: { x: number; y: number };
  discoveredTiles: string[];
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimsRef   = useRef({ width: 0, height: 0 });
  const rafRef    = useRef<number>(0);

  // Cache iso positions
  const getIso = useCallback((x: number, y: number) => ({
    x: (x - y) * (tileSize / 2),
    y: (x + y) * (tileSize / 4),
  }), [tileSize]);

  // Resize observer — update dims ref and trigger redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas?.parentElement) return;
    const obs = new ResizeObserver(([entry]) => {
      const { clientWidth, clientHeight } = entry.target as HTMLElement;
      dimsRef.current = { width: clientWidth, height: clientHeight };
      scheduleRedraw();
    });
    obs.observe(canvas.parentElement);
    const { clientWidth, clientHeight } = canvas.parentElement;
    dimsRef.current = { width: clientWidth, height: clientHeight };
    scheduleRedraw();
    return () => obs.disconnect();
  }, []);

  // Trigger redraw when camera-relevant props change
  useEffect(() => { scheduleRedraw(); }, [mapData, playerPos, discoveredTiles]);

  function scheduleRedraw() {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = dimsRef.current;
    if (width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width  = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#0a1710";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);

    const { x: camX, y: camY } = getIso(playerPos.x, playerPos.y);
    ctx.translate(-camX, -camY);

    const cullBuf = Math.max(width, height) * 0.8;

    for (let y = 0; y < mapData.height; y++) {
      for (let x = 0; x < mapData.width; x++) {
        const { x: ix, y: iy } = getIso(x, y);

        // Viewport culling
        const sx = ix - camX + width / 2;
        const sy = iy - camY + height / 2;
        if (sx < -cullBuf || sx > width + cullBuf || sy < -cullBuf || sy > height + cullBuf) continue;

        const disc = discoveredTiles.includes(`${x},${y}`);
        ctx.save();
        if (!disc) { ctx.globalAlpha = 0.2; ctx.filter = "grayscale(1) brightness(0.1)"; }

        // Shadow under tile
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.beginPath();
        ctx.moveTo(ix - tileSize / 2, iy);
        ctx.lineTo(ix, iy + tileSize / 4);
        ctx.lineTo(ix, iy + tileSize / 4 + 7);
        ctx.lineTo(ix - tileSize / 2, iy + 7);
        ctx.fill();

        // Top face
        ctx.beginPath();
        ctx.moveTo(ix, iy - tileSize / 4);
        ctx.lineTo(ix + tileSize / 2, iy);
        ctx.lineTo(ix, iy + tileSize / 4);
        ctx.lineTo(ix - tileSize / 2, iy);
        ctx.closePath();

        const tile = mapData.tiles[y]?.[x] || "grass";
        const grad = ctx.createLinearGradient(ix, iy - tileSize / 4, ix, iy + tileSize / 4);
        const palette: Record<string, [string, string]> = {
          grass:    ["#166534", "#14532D"],
          water:    ["#1D4ED8", "#1E3A8A"],
          lava:     ["#B91C1C", "#7F1D1D"],
          mountain: ["#44403C", "#1C1917"],
          forest:   ["#064E3B", "#022C22"],
          town:     ["#92400E", "#78350F"],
          path:     ["#78350F", "#451A03"],
          cave:     ["#374151", "#1F2937"],
        };
        const [c0, c1] = palette[tile] ?? palette.grass;
        grad.addColorStop(0, c0);
        grad.addColorStop(1, c1);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Decorations
        if (tile === "forest") {
          ctx.fillStyle = "#022C22";
          ctx.beginPath();
          ctx.moveTo(ix, iy - 16); ctx.lineTo(ix + 10, iy + 4); ctx.lineTo(ix - 10, iy + 4);
          ctx.fill();
        } else if (tile === "mountain") {
          ctx.fillStyle = "#292524";
          ctx.beginPath();
          ctx.moveTo(ix, iy - 22); ctx.lineTo(ix + 18, iy + 4); ctx.lineTo(ix - 18, iy + 4);
          ctx.fill();
        } else if (tile === "town") {
          ctx.fillStyle = "#451A03";
          ctx.beginPath();
          ctx.moveTo(ix - 8, iy - 12); ctx.lineTo(ix, iy - 20); ctx.lineTo(ix + 8, iy - 12);
          ctx.fill();
        } else if (tile === "cave") {
          ctx.fillStyle = "#111827";
          ctx.beginPath();
          ctx.arc(ix, iy - 8, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
    ctx.restore();
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ imageRendering: "pixelated" }}
    />
  );
});

// ─── Helper ──────────────────────────────────────────────────────────────────
function getIsoPos(x: number, y: number) {
  return { x: (x - y) * (TILE_SIZE / 2), y: (x + y) * (TILE_SIZE / 4) };
}

// ─── Main WorldMap component ─────────────────────────────────────────────────
export function WorldMap({
  mapData,
  character,
  playerClass = "warrior",
  playerRank = "F",
  inventory = [],
  completedQuests = [],
  activeQuestId,
  allQuests = [],
  onNPCInteract,
  onNavigateToRegion,
  onQuestAccepted,
  onUpdateCharacter,
  onMobKilled,
}: WorldMapProps) {
  const [selectedNPC,    setSelectedNPC]    = useState<NPC | null>(null);
  const [dialogIndex,    setDialogIndex]    = useState(0);
  const [playerPos,      setPlayerPos]      = useState(mapData.playerStart);
  const [mobs,           setMobs]           = useState<MapMob[]>([]);
  const [activeCombatId, setActiveCombatId] = useState<string | null>(null);
  const [timeOfDay,      setTimeOfDay]      = useState<"morning" | "day" | "dusk" | "night">("day");
  const [walkPath,       setWalkPath]       = useState<{ x: number; y: number }[]>([]);
  const [destination,    setDestination]    = useState<{ x: number; y: number } | null>(null);
  const [chasingMobId,   setChasingMobId]   = useState<string | null>(null);

  // Hit-flash state — brief, for visual feedback only
  const [hitMobId,    setHitMobId]    = useState<string | null>(null);
  const [playerIsHit, setPlayerIsHit] = useState(false);
  const [playerAttacks, setPlayerAttacks] = useState(false); // lunge trigger

  // Refs for stale-closure-free access inside intervals
  const mobsRef          = useRef(mobs);
  const characterRef     = useRef(character);
  const activeCombatRef  = useRef(activeCombatId);
  const playerPosRef     = useRef(playerPos);
  const walkPathRef      = useRef(walkPath);
  const chasingMobRef    = useRef(chasingMobId);

  useEffect(() => { mobsRef.current         = mobs;           }, [mobs]);
  useEffect(() => { characterRef.current    = character;      }, [character]);
  useEffect(() => { activeCombatRef.current = activeCombatId; }, [activeCombatId]);
  useEffect(() => { playerPosRef.current    = playerPos;      }, [playerPos]);
  useEffect(() => { walkPathRef.current     = walkPath;       }, [walkPath]);
  useEffect(() => { chasingMobRef.current   = chasingMobId;   }, [chasingMobId]);

  const regionDiscovery = character.discoveredTiles?.[mapData.name] || [];

  const equippedWeapon = inventory?.find(i => i.type === "weapon" && i.equipped);
  const equippedHat    = inventory?.find(i => i.type === "hat"    && i.equipped);
  const equippedArmor  = inventory?.find(i => i.type === "armor"  && i.equipped);
  const equippedBoot   = inventory?.find(i => i.type === "boot"   && i.equipped);

  // ── Walking step interval (A* path following) ─────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      // Intercept for chasing
      if (chasingMobRef.current) {
        const mobId = chasingMobRef.current;
        const mob = mobsRef.current.find(m => m.id === mobId);
        if (mob) {
          const charClass = characterRef.current.class;
          const isRanged = charClass === "mage" || charClass === "archer";
          const maxRange = isRanged ? 5 : 1;
          const dist = Math.abs(mob.position.x - playerPosRef.current.x) + Math.abs(mob.position.y - playerPosRef.current.y);
          
          if (dist <= maxRange) {
             // In range!
             setChasingMobId(null);
             chasingMobRef.current = null;
             setWalkPath([]);
             walkPathRef.current = [];
             setDestination(null);
             setActiveCombatId(mob.id);
             return; // Don't take a step, we are in range
          }
        } else {
          // Mob is gone
          setChasingMobId(null);
          chasingMobRef.current = null;
          setWalkPath([]);
          walkPathRef.current = [];
          setDestination(null);
          return;
        }
      }

      const path = walkPathRef.current;
      if (path.length === 0) return;
      const [next, ...rest] = path;
      setPlayerPos(next);
      walkPathRef.current = rest;
      setWalkPath(rest);
      if (rest.length === 0) setDestination(null);
    }, 160);
    return () => clearInterval(id);
  }, []);

  // ── Tile discovery ─────────────────────────────────────────────────────────
  useEffect(() => {
    const key = `${playerPos.x},${playerPos.y}`;
    if (!regionDiscovery.includes(key)) {
      onUpdateCharacter?.({
        discoveredTiles: {
          ...(character.discoveredTiles || {}),
          [mapData.name]: [...regionDiscovery, key],
        },
      });
    }
  }, [playerPos.x, playerPos.y, mapData.name]);

  // ── Time of day ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      if (h >= 6 && h < 12) setTimeOfDay("morning");
      else if (h >= 12 && h < 18) setTimeOfDay("day");
      else if (h >= 18 && h < 21) setTimeOfDay("dusk");
      else setTimeOfDay("night");
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const getTimeFilters = () => {
    switch (timeOfDay) {
      case "morning": return "sepia(0.2) saturate(1.2) hue-rotate(-10deg) brightness(1.05)";
      case "day":     return "brightness(1) saturate(1)";
      case "dusk":    return "sepia(0.5) saturate(1.4) hue-rotate(15deg) brightness(0.9)";
      case "night":   return "brightness(0.45) saturate(0.7) hue-rotate(200deg)";
    }
  };

  // ── Mob spawning ────────────────────────────────────────────────────────────
  useEffect(() => {
    const possible = REGION_MOBS[mapData.name] || ["green-slime"];
    const bountyTarget = activeQuestId && allQuests.find(q => q.id === activeQuestId)?.bounty?.targetMonsterId;
    const numMobs = MOB_COUNT_MIN + Math.floor(Math.random() * (MOB_COUNT_MAX - MOB_COUNT_MIN + 1));
    const newMobs: MapMob[] = [];

    for (let i = 0; i < numMobs; i++) {
      let tries = 0;
      while (tries++ < 40) {
        const x = 2 + Math.floor(Math.random() * (mapData.width - 4));
        const y = 2 + Math.floor(Math.random() * (mapData.height - 4));
        const tile = mapData.tiles[y]?.[x];
        if (!tile || tile === "water" || tile === "mountain" || tile === "lava" || tile === "town") continue;
        if (mapData.npcs.some(n => n.position.x === x && n.position.y === y)) continue;
        if (newMobs.some(m => m.position.x === x && m.position.y === y)) continue;
        if (Math.abs(x - mapData.playerStart.x) + Math.abs(y - mapData.playerStart.y) < 4) continue;

        const enemyId = (bountyTarget && possible.includes(bountyTarget) && Math.random() < 0.5)
          ? bountyTarget
          : possible[Math.floor(Math.random() * possible.length)];

        const maxHp = ENEMIES[enemyId]?.hp || 20;
        newMobs.push({ id: `mob-${i}-${Date.now()}`, enemyId, position: { x, y }, spawnPos: { x, y }, hp: maxHp, maxHp });
        break;
      }
    }
    setMobs(newMobs);
    setActiveCombatId(null);
  }, [mapData, activeQuestId]);

  // ── Monster AI — runs every 2 s (reduced tick for performance) ──────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setMobs(prev => prev.map(mob => {
        if (mob.id === activeCombatRef.current) return mob;
        if (Math.random() > 0.5) return mob;

        const dirs = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
        const { x: nx, y: ny } = dirs[Math.floor(Math.random() * 4)];
        const tx = mob.position.x + nx;
        const ty = mob.position.y + ny;

        if (tx < 0 || tx >= mapData.width || ty < 0 || ty >= mapData.height) return mob;
        const tile = mapData.tiles[ty]?.[tx];
        if (!tile || tile === "water" || tile === "mountain" || tile === "lava") return mob;
        if (Math.abs(tx - mob.spawnPos.x) > WANDER_RADIUS || Math.abs(ty - mob.spawnPos.y) > WANDER_RADIUS) return mob;
        if (prev.some(m => m.id !== mob.id && m.position.x === tx && m.position.y === ty)) return mob;
        if (tx === playerPosRef.current.x && ty === playerPosRef.current.y) return mob;

        return { ...mob, position: { x: tx, y: ty } };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [mapData]);

  // ── In-world combat loop ────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeCombatId) return;

    const interval = setInterval(() => {
      const mobId = activeCombatRef.current;
      if (!mobId) return;

      const mob = mobsRef.current.find(m => m.id === mobId);
      if (!mob) { setActiveCombatId(null); return; }

      const enemyData = ENEMIES[mob.enemyId];
      if (!enemyData) { setActiveCombatId(null); return; }

      const playerDmg = Math.max(1,
        characterRef.current.attack + Math.floor(Math.random() * 6) - 3
        - Math.floor((enemyData.defense || 0) / 3)
      );
      const mobDmg = Math.max(1,
        (enemyData.attack || 5) + Math.floor(Math.random() * 4) - 2
        - Math.floor(characterRef.current.defense / 4)
      );

      // ── Player attacks → lunge + mob hit-flash ──────────────────────────
      setPlayerAttacks(true);
      setTimeout(() => setPlayerAttacks(false), 280);

      setTimeout(() => {
        setHitMobId(mobId);
        setTimeout(() => setHitMobId(null), 260);
      }, 120);

      audioManager.playSfx("attack");

      // ── Mob attacks → player hit-flash ─────────────────────────────────
      setTimeout(() => {
        setPlayerIsHit(true);
        setTimeout(() => setPlayerIsHit(false), 260);
      }, COMBAT_INTERVAL_MS / 2);

      // Apply mob damage to player
      const newPlayerHp = Math.max(0, characterRef.current.hp - mobDmg);
      characterRef.current = { ...characterRef.current, hp: newPlayerHp };
      onUpdateCharacter?.({ hp: newPlayerHp });

      // Apply player damage to mob — check death
      setMobs(prev => {
        const target = prev.find(m => m.id === mobId);
        if (!target) return prev;
        const newMobHp = Math.max(0, target.hp - playerDmg);
        if (newMobHp <= 0) {
          setActiveCombatId(null);
          audioManager.playSfx("victory");
          setTimeout(() => onMobKilled?.(target.enemyId, enemyData.xpReward, enemyData.goldReward), 80);
          return prev.filter(m => m.id !== mobId);
        }
        return prev.map(m => m.id === mobId ? { ...m, hp: newMobHp } : m);
      });

      if (newPlayerHp <= 0) setActiveCombatId(null);
    }, COMBAT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [activeCombatId, onUpdateCharacter, onMobKilled]);

  // ── Click handler (move + mob target) ──────────────────────────────────────
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { x: camX, y: camY } = getIsoPos(playerPos.x, playerPos.y);

    const mx = (e.clientX - rect.left - rect.width  / 2);
    const my = (e.clientY - rect.top  - rect.height / 2);
    const wx = mx + camX;
    const wy = my + camY;

    const xPlusY  = wy / (TILE_SIZE / 4);
    const xMinusY = wx / (TILE_SIZE / 2);
    const tx = Math.round((xPlusY + xMinusY) / 2);
    const ty = Math.round((xPlusY - xMinusY) / 2);

    if (tx < 0 || tx >= mapData.width || ty < 0 || ty >= mapData.height) return;

    const npc = mapData.npcs.find(n => n.position.x === tx && n.position.y === ty);
    if (npc) { setSelectedNPC(npc); setDialogIndex(0); return; }

    // Cancel combat when clicking a tile
    if (activeCombatId) setActiveCombatId(null);

    const tile = mapData.tiles[ty]?.[tx];
    if (!tile || tile === "water" || tile === "mountain" || tile === "lava") return;

    // A* path to destination
    const path = findPath(
      playerPos,
      { x: tx, y: ty },
      mapData.tiles,
      mapData.width,
      mapData.height,
    );
    if (path.length > 0) {
      setWalkPath(path);
      walkPathRef.current = path;
      setDestination({ x: tx, y: ty });
    }
  }, [playerPos, mapData, activeCombatId]);

  // ── NPC dialog helpers ──────────────────────────────────────────────────────
  const getDialogsForNPC = useCallback((npc: NPC | null) => {
    if (!npc) return [];
    if (npc.questId && completedQuests.includes(npc.questId)) {
      const next = allQuests
        .filter(q => !completedQuests.includes(q.id) && !q.id.startsWith("guild-"))
        .sort((a, b) => a.minLevel - b.minLevel)[0];
      return next
        ? [`Head to ${next.region} to continue your journey.`]
        : ["You have become a legend. There are no more challenges for you."];
    }
    return npc.dialog;
  }, [completedQuests, allQuests]);

  const handleDialogAdvance = useCallback(async () => {
    if (!selectedNPC) return;
    const dialogs = getDialogsForNPC(selectedNPC);
    if (dialogIndex < dialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
      audioManager.playSfx("click");
    } else {
      if (selectedNPC.questId && !completedQuests.includes(selectedNPC.questId)) {
        const quest = allQuests.find(q => q.id === selectedNPC.questId);
        if (quest) {
          const result = await acceptQuestFromNPC(character, quest);
          if (result.success) { audioManager.playSfx("questAccept"); onQuestAccepted?.(quest); }
        }
      } else {
        onNPCInteract(selectedNPC);
        if (selectedNPC.questId && completedQuests.includes(selectedNPC.questId)) {
          const next = allQuests
            .filter(q => !completedQuests.includes(q.id) && !q.id.startsWith("guild-"))
            .sort((a, b) => a.minLevel - b.minLevel)[0];
          if (next && onNavigateToRegion && next.region !== character.currentRegion) onNavigateToRegion(next.region);
        }
      }
      setSelectedNPC(null);
      setDialogIndex(0);
    }
  }, [selectedNPC, dialogIndex, character, onQuestAccepted, allQuests, completedQuests, getDialogsForNPC, onNavigateToRegion, onNPCInteract]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (selectedNPC && e.key === "Enter") { e.preventDefault(); handleDialogAdvance(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [selectedNPC, handleDialogAdvance]);

  // ── Camera position (player-centered) ──────────────────────────────────────
  const { x: isoPlayerX, y: isoPlayerY } = getIsoPos(playerPos.x, playerPos.y);

  // Direction from player toward targeted mob (for lunge)
  const targetMob = mobs.find(m => m.id === activeCombatId);
  const lungeX = targetMob ? Math.sign(targetMob.position.x - playerPos.x) * 14 : 0;
  const lungeY = targetMob ? Math.sign(targetMob.position.y - playerPos.y) * 7  : 0;

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-950 rounded-2xl border-4 border-slate-900 shadow-2xl"
      style={{ height: "100%" }}
    >
      {/* Tile canvas */}
      <div className="w-full h-full" style={{ filter: getTimeFilters(), transition: "filter 3s ease" }}>
        <MapCanvas
          mapData={mapData}
          tileSize={TILE_SIZE}
          playerPos={playerPos}
          discoveredTiles={regionDiscovery}
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/20 via-transparent to-slate-950/30 pointer-events-none" />
      {timeOfDay === "night"  && <div className="absolute inset-0 bg-blue-900/20  pointer-events-none" />}
      {timeOfDay === "dusk"   && <div className="absolute inset-0 bg-orange-500/10 pointer-events-none" />}

      {/* Click overlay */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleOverlayClick} />

      {/* ── Sprite layer — CSS translate (no spring, GPU-composited) ────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          transform: `translate(${-isoPlayerX}px, ${-isoPlayerY}px)`,
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
      >
        {/* NPCs */}
        {mapData.npcs.map(npc => {
          if (npc.questId) {
            const qd = allQuests.find(q => q.id === npc.questId);
            if (qd && qd.class !== character.class && !hasFinishedMainStory(character)) return null;
          }
          const { x: ix, y: iy } = getIsoPos(npc.position.x, npc.position.y);
          return (
            <div
              key={npc.id}
              className="absolute cursor-pointer pointer-events-auto"
              style={{ left: ix, top: iy, width: TILE_SIZE, height: TILE_SIZE / 2, zIndex: npc.position.x + npc.position.y + 1 }}
              onClick={e => { e.stopPropagation(); setSelectedNPC(npc); setDialogIndex(0); }}
            >
              <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                <div className="translate-y-[-24px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                  <NPCSprite type={npc.sprite} className="w-12 h-12" />
                </div>
                {npc.questId && (
                  <motion.div
                    animate={{ y: [-10, 0, -10] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`absolute -top-20 left-1/2 -translate-x-1/2 ${completedQuests.includes(npc.questId) ? "text-emerald-400" : activeQuestId === npc.questId ? "text-cyan-400" : "text-amber-400"}`}
                  >
                    {completedQuests.includes(npc.questId)
                      ? <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                      : <ExclamationIndicator size={28} />}
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}

        {/* Wild Mobs */}
        {mobs.map(mob => {
          const { x: ix, y: iy } = getIsoPos(mob.position.x, mob.position.y);
          const enemyData   = ENEMIES[mob.enemyId];
          const hpPct       = mob.hp / mob.maxHp;
          const isTargeted  = mob.id === activeCombatId;
          const isHit       = mob.id === hitMobId;

          return (
            <div
              key={mob.id}
              className="absolute pointer-events-auto cursor-crosshair"
              style={{
                left: ix, top: iy,
                width: TILE_SIZE, height: TILE_SIZE / 2,
                zIndex: mob.position.x + mob.position.y + 1,
                // CSS transition for smooth roaming (no spring overhead)
                transition: isTargeted ? "left 0.15s ease-out, top 0.15s ease-out" : "left 0.45s ease-out, top 0.45s ease-out",
              }}
              onClick={e => {
                e.stopPropagation();
                if (activeCombatId === mob.id || chasingMobId === mob.id) {
                  setActiveCombatId(null);
                  setChasingMobId(null);
                  chasingMobRef.current = null;
                } else {
                  // Check Range
                  const charClass = character.class;
                  const isRanged = charClass === "mage" || charClass === "archer";
                  const maxRange = isRanged ? 5 : 1;
                  const dist = Math.abs(mob.position.x - playerPos.x) + Math.abs(mob.position.y - playerPos.y);
                  
                  if (dist <= maxRange) {
                    setWalkPath([]);
                    walkPathRef.current = [];
                    setDestination(null);
                    setChasingMobId(null);
                    chasingMobRef.current = null;
                    setActiveCombatId(mob.id);
                  } else {
                    // Start chase
                    const path = findPath(playerPos, mob.position, mapData.tiles, mapData.width, mapData.height);
                    if (path.length > 0) {
                      setDestination(mob.position);
                      setWalkPath(path);
                      walkPathRef.current = path;
                      setChasingMobId(mob.id);
                      chasingMobRef.current = mob.id;
                      setActiveCombatId(null);
                    }
                  }
                }
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                {/* HP bar */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-14 z-10">
                  <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-600/40">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${hpPct > 0.5 ? "bg-green-500" : hpPct > 0.25 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${hpPct * 100}%` }}
                    />
                  </div>
                </div>

                {/* Mob sprite with hit/roar/idle animations */}
                <motion.div
                  className="translate-y-[-20px] origin-bottom"
                  animate={
                    isHit ? {
                      x: [-10, 10, -7, 7, 0],
                      filter: ["brightness(4) saturate(0)", "brightness(2) saturate(0.3)", "brightness(1) saturate(1)"],
                    } : isTargeted ? {
                      y:      [0, -4, 0],
                      filter: ["drop-shadow(0 0 5px #ef4444)", "drop-shadow(0 0 14px #ef4444)", "drop-shadow(0 0 5px #ef4444)"],
                    } : {
                      y: [0, -2, 0],
                    }
                  }
                  transition={
                    isHit ? { duration: 0.28, ease: "easeOut" }
                    : { repeat: Infinity, duration: isTargeted ? 0.7 : 2.8, ease: "easeInOut" }
                  }
                >
                  <svg width="60" height="60" viewBox="-30 -30 60 60">
                    <EnemySpriteBody sprite={enemyData?.sprite || "slime"} />
                  </svg>
                </motion.div>

                {/* Combat target ring */}
                {isTargeted && !isHit && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-500/60 pointer-events-none"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                  />
                )}

                <div className="absolute bottom-1 w-8 h-2.5 bg-red-500/20 rounded-full blur-[5px]" />
              </div>
            </div>
          );
        })}

        {/* Destination marker */}
        {destination && (() => {
          const { x: dx, y: dy } = getIsoPos(destination.x, destination.y);
          return (
            <motion.div
              key={`${destination.x}-${destination.y}`}
              className="absolute pointer-events-none"
              style={{ left: dx - TILE_SIZE / 2, top: dy - 4, width: TILE_SIZE, zIndex: 1 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0.9, 0.4, 0.9], scale: [0.9, 1.05, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 0.9 }}
            >
              <svg viewBox="0 0 80 20" className="w-full">
                <ellipse cx="40" cy="10" rx="22" ry="7" fill="rgba(251,191,36,0.25)" stroke="rgba(251,191,36,0.7)" strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>
            </motion.div>
          );
        })()}

        {/* Player sprite */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: isoPlayerX, top: isoPlayerY,
            width: TILE_SIZE, height: TILE_SIZE / 2,
            zIndex: playerPos.x + playerPos.y + 2,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              className="relative z-10 scale-90 translate-y-[-28px] origin-bottom"
              animate={
                playerIsHit ? {
                  x:      [-6, 6, -4, 4, 0],
                  filter: ["brightness(1)", "brightness(3) hue-rotate(300deg) saturate(2)", "brightness(1)"],
                } : playerAttacks && activeCombatId ? {
                  x: [0, lungeX, 0],
                  y: [0, lungeY, 0],
                } : {}
              }
              transition={
                playerIsHit     ? { duration: 0.26, ease: "easeOut" }
                : playerAttacks ? { duration: 0.26, ease: "easeInOut" }
                : {}
              }
            >
              <InventorySprite
                characterClass={playerClass}
                rank={playerRank}
                equippedWeapon={equippedWeapon}
                equippedHat={equippedHat}
                equippedArmor={equippedArmor}
                equippedBoot={equippedBoot}
              />
            </motion.div>

            {/* Player pulse when in combat */}
            {activeCombatId && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-amber-400/50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 0.85 }}
              />
            )}

            <div className="absolute bottom-1.5 w-10 h-3 bg-amber-500/20 rounded-full blur-[5px]" />
          </div>
        </div>
      </div>

      {/* Region badge */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 px-5 py-3 rounded-2xl shadow-2xl"
        >
          <div className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] mb-1">Current Region</div>
          <div className="text-2xl font-black text-white flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif" }}>
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${timeOfDay === "day" ? "text-yellow-400 bg-yellow-400" : timeOfDay === "night" ? "text-blue-500 bg-blue-500" : timeOfDay === "morning" ? "text-orange-400 bg-orange-400" : "text-orange-600 bg-orange-600"}`} />
            {mapData.name}
            <span className="text-slate-500 font-normal text-sm capitalize">{timeOfDay}</span>
          </div>
        </motion.div>
      </div>

      {/* Hint bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="px-6 py-2.5 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/10 flex gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest shadow-2xl">
          <span className="flex items-center gap-2">🖱️ Click to Move</span>
          <span className="w-px h-4 bg-white/10" />
          <span className={`flex items-center gap-2 ${activeCombatId ? "text-red-400 animate-pulse font-black" : ""}`}>
            ⚔️ {activeCombatId ? "Fighting! (click mob to flee)" : "Click Monster to Fight"}
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className={`font-black ${timeOfDay === "night" ? "text-blue-400" : "text-amber-400"}`}>{timeOfDay.toUpperCase()}</span>
        </div>
      </div>

      {/* NPC dialog */}
      <AnimatePresence>
        {selectedNPC && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 p-4"
            onClick={handleDialogAdvance}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="w-full max-w-lg mb-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="rounded-xl p-5 bg-slate-900 border border-amber-500/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                    <NPCSprite type={selectedNPC.sprite} className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-200" style={{ fontFamily: "'Cinzel', serif" }}>{selectedNPC.name}</h3>
                    <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">NPC</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4 min-h-[48px]">
                  {getDialogsForNPC(selectedNPC)[dialogIndex]}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 px-3 py-1 bg-black/30 rounded-full border border-white/5">
                    {dialogIndex + 1} / {getDialogsForNPC(selectedNPC).length}
                  </span>
                  <button
                    onClick={handleDialogAdvance}
                    className="px-4 py-2 rounded-lg text-sm font-bold bg-amber-600 text-white shadow-lg active:scale-95 transition-transform"
                  >
                    {dialogIndex < getDialogsForNPC(selectedNPC).length - 1 ? "Next (Enter)" : "Close (Enter)"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
