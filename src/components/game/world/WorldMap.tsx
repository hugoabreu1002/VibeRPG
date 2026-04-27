import { AnimatePresence, motion } from "framer-motion";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { audioManager } from "../../../lib/audio";
import { ENEMIES, REGION_MOBS } from "../../../lib/game-data";
import { acceptQuestFromNPC, hasFinishedMainStory } from "../../../lib/quest-logic";
import type { Character, CharacterClass, InventoryItem, NPC, Quest, QuestMapData } from "../../../types/game";
import { EnemySpriteBody } from "../battle/EnemySprites";
import { InventorySprite } from "../character/InventorySprite";
import { ExclamationIndicator, GuildTabIcon, ShopTabIcon } from "../ui/GameIcons";
import { NPCSprite } from "./NPCSprites";

const TILE_SIZE = 64;
const WANDER_RADIUS = 5;
const COMBAT_INTERVAL_MS = 850;
const WALK_STEP_MS = 220;
const MOB_COUNT_MIN = 4;
const MOB_COUNT_MAX = 6;
const SCENE_TILT = "perspective(1700px) rotateX(17deg) scale(1.04)";

type LandmarkStyle = "house" | "tower" | "guild" | "shrine" | "ruin" | "camp";

interface MapLandmark {
  x: number;
  y: number;
  w: number;
  h: number;
  style: LandmarkStyle;
}

const MAP_LANDMARKS: Record<string, MapLandmark[]> = {
  "Hub Town": [
    { x: 11, y: 1, w: 3, h: 3, style: "guild" },
    { x: 16, y: 1, w: 3, h: 3, style: "tower" },
    { x: 7, y: 6, w: 3, h: 3, style: "house" },
    { x: 20, y: 6, w: 3, h: 3, style: "house" },
    { x: 13, y: 12, w: 4, h: 3, style: "shrine" },
  ],
  "Northern Field": [
    { x: 4, y: 3, w: 3, h: 2, style: "house" },
    { x: 18, y: 4, w: 3, h: 2, style: "camp" },
  ],
  "Whispering Woods": [
    { x: 10, y: 7, w: 3, h: 3, style: "ruin" },
    { x: 20, y: 5, w: 2, h: 3, style: "tower" },
  ],
  "Mountain Pass": [
    { x: 13, y: 3, w: 3, h: 2, style: "camp" },
    { x: 8, y: 11, w: 3, h: 3, style: "ruin" },
  ],
  "Trade Route": [
    { x: 10, y: 3, w: 3, h: 2, style: "house" },
    { x: 19, y: 10, w: 3, h: 2, style: "camp" },
  ],
  "Training Grounds": [
    { x: 12, y: 7, w: 4, h: 3, style: "guild" },
    { x: 5, y: 12, w: 3, h: 2, style: "camp" },
  ],
  "Dark Forest": [
    { x: 8, y: 8, w: 3, h: 3, style: "ruin" },
    { x: 18, y: 6, w: 2, h: 3, style: "tower" },
  ],
  "Dragon Peak": [
    { x: 12, y: 2, w: 4, h: 3, style: "shrine" },
    { x: 7, y: 8, w: 3, h: 2, style: "camp" },
  ],
  "Capital City": [
    { x: 7, y: 4, w: 4, h: 3, style: "guild" },
    { x: 12, y: 4, w: 4, h: 3, style: "shrine" },
    { x: 4, y: 10, w: 3, h: 2, style: "house" },
  ],
};
// A map is a safe settlement (no monsters) when its mapType is "town".
// Fields and dungeons are combat zones.
const isSafeSettlementMap = (mapType: string) => mapType === "town";


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
  mapData, tileSize, playerPos
}: {
  mapData: QuestMapData;
  tileSize: number;
  playerPos: { x: number; y: number };
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimsRef   = useRef({ width: 0, height: 0 });
  const rafRef    = useRef<number>(0);

  const getGrid = useCallback((x: number, y: number) => ({
    x: x * tileSize + tileSize / 2,
    y: y * tileSize + tileSize / 2,
  }), [tileSize]);

  const isSettlementMap = mapData.mapType === "town";

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

  useEffect(() => { scheduleRedraw(); }, [mapData, playerPos]);

  function scheduleRedraw() {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = dimsRef.current;
    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = mapData.mapType === "dungeon" ? "#05080a" : "#101514";
    ctx.fillRect(0, 0, width, height);

    const palette: Record<string, { base: string; shade: string; detail: string }> = {
      grass: { base: "#2f6f2f", shade: "#214d21", detail: "#4c9f4c" },
      path: { base: "#8a7756", shade: "#66573f", detail: "#b09a6e" },
      town: { base: "#6f6760", shade: "#4f4842", detail: "#938981" },
      forest: { base: "#1e4a2f", shade: "#143222", detail: "#347c46" },
      water: { base: "#215c8b", shade: "#163f61", detail: "#4da0d4" },
      mountain: { base: "#6b6765", shade: "#4c4947", detail: "#95908c" },
      cave: { base: "#343b44", shade: "#21262c", detail: "#566272" },
      lava: { base: "#9f351a", shade: "#702413", detail: "#ff8a3d" },
    };

    const drawLandmark = (landmark: MapLandmark) => {
      const bx = landmark.x * tileSize + 3;
      const by = landmark.y * tileSize - tileSize * 0.78;
      const bw = landmark.w * tileSize - 6;
      const bh = landmark.h * tileSize + 6;

      const stylePalette: Record<LandmarkStyle, {
        wall: string;
        wallDark: string;
        roof: string;
        roofDark: string;
        trim: string;
        window: string;
        door: string;
      }> = {
        house: {
          wall: "#c8b497",
          wallDark: "#9e8c76",
          roof: "#8b4f31",
          roofDark: "#6b3a24",
          trim: "#e7cfad",
          window: "#f6df9b",
          door: "#5d3a26",
        },
        tower: {
          wall: "#a9a8b2",
          wallDark: "#7b7a85",
          roof: "#5f3f32",
          roofDark: "#472f26",
          trim: "#d7d7de",
          window: "#efe7bd",
          door: "#4a3427",
        },
        guild: {
          wall: "#8b909f",
          wallDark: "#646a75",
          roof: "#73422d",
          roofDark: "#5a3223",
          trim: "#f0cd73",
          window: "#f2e2ac",
          door: "#473126",
        },
        shrine: {
          wall: "#d8d5cb",
          wallDark: "#acaaa0",
          roof: "#9b6a39",
          roofDark: "#7d532d",
          trim: "#f2ddaf",
          window: "#f8ecc8",
          door: "#66513e",
        },
        ruin: {
          wall: "#8b8279",
          wallDark: "#625b53",
          roof: "#6f6a63",
          roofDark: "#504b45",
          trim: "#b3a697",
          window: "#c7bba8",
          door: "#4d443b",
        },
        camp: {
          wall: "#b08a62",
          wallDark: "#7a5e42",
          roof: "#9b6a44",
          roofDark: "#744f32",
          trim: "#d8ba8f",
          window: "#f4db9a",
          door: "#5d422e",
        },
      };
      const p = stylePalette[landmark.style];

      const roofPeak = by + 6;
      const roofBase = by + Math.max(18, Math.round(bh * 0.28));
      const bodyTop = roofBase + 6;
      const bodyBottom = by + bh - 6;
      const bodyHeight = Math.max(16, bodyBottom - bodyTop);

      ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
      ctx.fillRect(bx + 8, by + bh - 8, Math.max(12, bw - 16), 7);

      if (landmark.style === "tower") {
        const tx = bx + bw * 0.22;
        const tw = bw * 0.56;
        ctx.fillStyle = p.wallDark;
        ctx.fillRect(tx + tw * 0.62, bodyTop + 6, tw * 0.38, bodyHeight - 2);
        ctx.fillStyle = p.wall;
        ctx.fillRect(tx, bodyTop, tw * 0.72, bodyHeight);

        ctx.fillStyle = p.roofDark;
        ctx.fillRect(tx + tw * 0.16, roofPeak - 3, tw * 0.74, 10);
        ctx.fillStyle = p.roof;
        ctx.fillRect(tx + tw * 0.04, roofPeak + 1, tw * 0.74, 8);

        ctx.fillStyle = p.trim;
        for (let c = 0; c < 4; c++) {
          ctx.fillRect(tx + 4 + c * ((tw - 12) / 4), roofPeak - 6, 4, 6);
        }
        ctx.fillStyle = p.window;
        ctx.fillRect(tx + tw * 0.24, bodyTop + 12, 6, 8);
        ctx.fillRect(tx + tw * 0.24, bodyTop + 26, 6, 8);
        ctx.fillStyle = p.door;
        ctx.fillRect(tx + tw * 0.28, bodyBottom - 13, 10, 13);
      } else if (landmark.style === "camp") {
        const tentTop = by + bh * 0.38;
        ctx.fillStyle = p.roofDark;
        ctx.beginPath();
        ctx.moveTo(bx + 8, bodyBottom);
        ctx.lineTo(bx + bw * 0.46, tentTop);
        ctx.lineTo(bx + bw - 8, bodyBottom);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = p.roof;
        ctx.beginPath();
        ctx.moveTo(bx + 12, bodyBottom);
        ctx.lineTo(bx + bw * 0.46, tentTop + 4);
        ctx.lineTo(bx + bw - 12, bodyBottom);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = p.trim;
        ctx.fillRect(bx + bw * 0.46 - 2, tentTop + 6, 4, bodyBottom - tentTop - 6);
        ctx.fillStyle = p.window;
        ctx.fillRect(bx + bw * 0.46 - 3, bodyBottom - 16, 6, 6);
      } else if (landmark.style === "ruin") {
        ctx.fillStyle = p.wallDark;
        ctx.fillRect(bx + 8, bodyTop + 6, bw - 16, bodyHeight - 4);
        ctx.fillStyle = p.wall;
        ctx.fillRect(bx + 4, bodyTop, bw * 0.38, bodyHeight);
        ctx.fillRect(bx + bw * 0.52, bodyTop + 10, bw * 0.34, bodyHeight - 10);
        ctx.fillStyle = p.trim;
        ctx.fillRect(bx + 14, bodyTop + 8, 8, 10);
        ctx.fillRect(bx + bw * 0.6, bodyTop + 14, 7, 8);
      } else {
        ctx.fillStyle = p.wallDark;
        ctx.fillRect(bx + bw * 0.7, bodyTop + 5, bw * 0.3, bodyHeight - 1);
        ctx.fillStyle = p.wall;
        ctx.fillRect(bx, bodyTop, bw * 0.74, bodyHeight);

        ctx.fillStyle = p.roofDark;
        ctx.beginPath();
        ctx.moveTo(bx - 4, roofBase + 9);
        ctx.lineTo(bx + bw * 0.44, roofPeak - 5);
        ctx.lineTo(bx + bw + 5, roofBase + 9);
        ctx.lineTo(bx + bw - 3, roofBase + 14);
        ctx.lineTo(bx + 3, roofBase + 14);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = p.roof;
        ctx.beginPath();
        ctx.moveTo(bx - 2, roofBase + 7);
        ctx.lineTo(bx + bw * 0.44, roofPeak);
        ctx.lineTo(bx + bw + 3, roofBase + 7);
        ctx.lineTo(bx + bw - 2, roofBase + 11);
        ctx.lineTo(bx + 2, roofBase + 11);
        ctx.closePath();
        ctx.fill();

        if (landmark.style === "guild") {
          ctx.fillStyle = "#bc3930";
          ctx.fillRect(bx + bw * 0.46, roofBase + 2, 6, 20);
          ctx.fillStyle = p.trim;
          ctx.fillRect(bx + bw * 0.46, roofBase + 20, 6, 5);
        }
        if (landmark.style === "shrine") {
          ctx.fillStyle = p.trim;
          ctx.fillRect(bx + bw * 0.36, roofPeak - 12, 8, 22);
        }

        const winY = bodyTop + 10;
        ctx.fillStyle = p.window;
        ctx.fillRect(bx + 10, winY, 8, 8);
        ctx.fillRect(bx + bw * 0.52, winY + 1, 8, 8);
        ctx.fillStyle = p.door;
        ctx.fillRect(bx + bw * 0.3, bodyBottom - 15, 12, 15);
      }

      ctx.strokeStyle = "rgba(0,0,0,0.45)";
      ctx.lineWidth = 1;
      ctx.strokeRect(bx + 0.5, bodyTop + 0.5, bw - 1, Math.max(8, bodyHeight - 1));
    };

    const { x: camX, y: camY } = getGrid(playerPos.x, playerPos.y);
    const worldLeft = camX - width / 2 - tileSize;
    const worldRight = camX + width / 2 + tileSize;
    const worldTop = camY - height / 2 - tileSize;
    const worldBottom = camY + height / 2 + tileSize;

    const startX = Math.max(0, Math.floor(worldLeft / tileSize));
    const endX = Math.min(mapData.width - 1, Math.ceil(worldRight / tileSize));
    const startY = Math.max(0, Math.floor(worldTop / tileSize));
    const endY = Math.min(mapData.height - 1, Math.ceil(worldBottom / tileSize));

    ctx.save();
    ctx.translate(width / 2 - camX, height / 2 - camY);

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const tile = mapData.tiles[y]?.[x] ?? "grass";
        const style = palette[tile] ?? palette.grass;
        const tx = x * tileSize;
        const ty = y * tileSize;

        ctx.fillStyle = style.base;
        ctx.fillRect(tx, ty, tileSize, tileSize);

        ctx.fillStyle = style.shade;
        ctx.fillRect(tx, ty + tileSize - 6, tileSize, 6);
        ctx.fillRect(tx + tileSize - 6, ty, 6, tileSize);

        ctx.strokeStyle = "rgba(0,0,0,0.22)";
        ctx.lineWidth = 1;
        ctx.strokeRect(tx + 0.5, ty + 0.5, tileSize - 1, tileSize - 1);

        if ((x + y) % 2 === 0) {
          ctx.fillStyle = style.detail;
          ctx.fillRect(tx + 8, ty + 8, 4, 4);
          ctx.fillRect(tx + tileSize - 14, ty + tileSize - 14, 4, 4);
        }

        if (tile === "grass") {
          ctx.fillStyle = "#3f8a3f";
          ctx.fillRect(tx + 20, ty + 28, 2, 10);
          ctx.fillRect(tx + 24, ty + 26, 2, 12);
          ctx.fillRect(tx + 28, ty + 30, 2, 8);
        } else if (tile === "forest") {
          ctx.fillStyle = "#2a6c3e";
          ctx.fillRect(tx + 12, ty + 10, tileSize - 24, tileSize - 24);
          ctx.fillStyle = "#174028";
          ctx.fillRect(tx + 18, ty + 14, tileSize - 36, tileSize - 36);
          ctx.fillStyle = "#5a3b20";
          ctx.fillRect(tx + tileSize / 2 - 3, ty + tileSize - 20, 6, 12);
        } else if (tile === "mountain") {
          ctx.fillStyle = "#8e8782";
          ctx.fillRect(tx + 12, ty + 14, tileSize - 24, tileSize - 20);
          ctx.fillStyle = "#595652";
          ctx.fillRect(tx + 24, ty + 20, tileSize - 34, tileSize - 18);
          ctx.fillStyle = "#c9c4be";
          ctx.fillRect(tx + 24, ty + 10, tileSize - 42, 8);
        } else if (tile === "water") {
          ctx.fillStyle = "#6fc3f0";
          ctx.fillRect(tx + 12, ty + 16, tileSize - 24, 2);
          ctx.fillRect(tx + 20, ty + 28, tileSize - 36, 2);
          ctx.fillRect(tx + 8, ty + 40, tileSize - 16, 2);
        } else if (tile === "lava") {
          ctx.fillStyle = "#ffb04a";
          ctx.fillRect(tx + 10, ty + 12, 8, 8);
          ctx.fillRect(tx + 30, ty + 26, 10, 10);
          ctx.fillStyle = "#ffd089";
          ctx.fillRect(tx + 13, ty + 15, 2, 2);
          ctx.fillRect(tx + 34, ty + 30, 2, 2);
        } else if (tile === "cave") {
          ctx.fillStyle = "#728395";
          ctx.fillRect(tx + 18, ty + 16, tileSize - 36, tileSize - 26);
          ctx.fillStyle = "#252b32";
          ctx.fillRect(tx + 24, ty + 20, tileSize - 48, tileSize - 34);
        } else if (tile === "path") {
          ctx.fillStyle = "rgba(255, 241, 214, 0.22)";
          ctx.fillRect(tx + 6, ty + 30, tileSize - 12, 2);
          ctx.fillRect(tx + 30, ty + 6, 2, tileSize - 12);
        } else if (tile === "town" && isSettlementMap) {
          const hasAdjacentPath =
            mapData.tiles[y - 1]?.[x] === "path" ||
            mapData.tiles[y + 1]?.[x] === "path" ||
            mapData.tiles[y]?.[x - 1] === "path" ||
            mapData.tiles[y]?.[x + 1] === "path";

          if (!hasAdjacentPath && x % 2 === 0 && y % 2 === 0) {
            ctx.fillStyle = "#4f3828";
            ctx.fillRect(tx + 8, ty + 16, tileSize - 16, tileSize - 22);
            ctx.fillStyle = "#8f4f2b";
            ctx.fillRect(tx + 6, ty + 8, tileSize - 12, 12);
            ctx.fillStyle = "#f0c78a";
            ctx.fillRect(tx + 22, ty + 24, 8, 8);
          }
        }
      }
    }

    const mapLandmarks = MAP_LANDMARKS[mapData.name] ?? [];
    for (const landmark of mapLandmarks) {
      const landmarkRight = (landmark.x + landmark.w) * tileSize;
      const landmarkBottom = (landmark.y + landmark.h) * tileSize;
      const landmarkTop = landmark.y * tileSize - tileSize * 0.7;
      if (
        landmarkRight < worldLeft ||
        landmark.x * tileSize > worldRight ||
        landmarkBottom < worldTop ||
        landmarkTop > worldBottom
      ) {
        continue;
      }
      drawLandmark(landmark);
    }

    ctx.restore();

    // Fog and vignette removed
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ imageRendering: "pixelated" }}
    />
  );
});

// ─── Helper ──────────────────────────────────────────────────────────────────
function getIsoPos(x: number, y: number) {
  return { x: x * TILE_SIZE + TILE_SIZE / 2, y: y * TILE_SIZE + TILE_SIZE / 2 };
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
  const [playerPos,      setPlayerPos]      = useState(character.lastPosition || mapData.playerStart);
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
  const heldKeysRef      = useRef<string[]>([]);

  useEffect(() => { mobsRef.current         = mobs;           }, [mobs]);
  useEffect(() => { characterRef.current    = character;      }, [character]);
  useEffect(() => { activeCombatRef.current = activeCombatId; }, [activeCombatId]);
  useEffect(() => { playerPosRef.current    = playerPos;      }, [playerPos]);
  useEffect(() => { walkPathRef.current     = walkPath;       }, [walkPath]);
  useEffect(() => { chasingMobRef.current   = chasingMobId;   }, [chasingMobId]);

  const isSafeSettlement = isSafeSettlementMap(mapData.mapType);


  const equippedWeapon = inventory?.find(i => i.type === "weapon" && i.equipped);
  const equippedHat    = inventory?.find(i => i.type === "hat"    && i.equipped);
  const equippedArmor  = inventory?.find(i => i.type === "armor"  && i.equipped);
  const equippedBoot   = inventory?.find(i => i.type === "boot"   && i.equipped);

  useEffect(() => {
    const spawnPosition = character.lastPosition || mapData.playerStart;
    setPlayerPos(spawnPosition);
    playerPosRef.current = spawnPosition;
    setWalkPath([]);
    walkPathRef.current = [];
    setDestination(null);
    setSelectedNPC(null);
    setDialogIndex(0);
    setChasingMobId(null);
    chasingMobRef.current = null;
    setActiveCombatId(null);
  }, [character.lastPosition, mapData.name, mapData.playerStart]);

  // Sync player position back to character state periodically or when moving
  useEffect(() => {
    if (activeCombatId) return; // Don't sync during combat to avoid jitter
    const timer = setTimeout(() => {
      onUpdateCharacter({ lastPosition: playerPos });
    }, 1000); // 1s debounce to prevent database spam
    return () => clearTimeout(timer);
  }, [playerPos, activeCombatId, onUpdateCharacter]);

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
    }, WALK_STEP_MS);
    return () => clearInterval(id);
  }, []);

  const isWalkableTile = useCallback((x: number, y: number) => {
    if (x < 0 || x >= mapData.width || y < 0 || y >= mapData.height) return false;
    const tile = mapData.tiles[y]?.[x];
    if (!tile || tile === "water" || tile === "mountain" || tile === "lava") return false;
    if (mapData.npcs.some(npc => npc.position.x === x && npc.position.y === y)) return false;
    if (mobsRef.current.some(mob => mob.position.x === x && mob.position.y === y)) return false;
    return true;
  }, [mapData]);

  // ── Keyboard movement (WASD + arrows) ─────────────────────────────────────
  useEffect(() => {
    const keyToDir: Record<string, { x: number; y: number }> = {
      w: { x: 0, y: -1 },
      arrowup: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      arrowdown: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      arrowleft: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
      arrowright: { x: 1, y: 0 },
    };
    const movePriority = ["arrowup", "w", "arrowdown", "s", "arrowleft", "a", "arrowright", "d"];
    let lastStep = 0;

    const tryStep = () => {
      if (selectedNPC || activeCombatRef.current) return;
      const now = performance.now();
      if (now - lastStep < WALK_STEP_MS - 10) return;
      const activeKey = movePriority.find(key => heldKeysRef.current.includes(key));
      if (!activeKey) return;

      const dir = keyToDir[activeKey];
      const current = playerPosRef.current;
      const nx = current.x + dir.x;
      const ny = current.y + dir.y;
      if (!isWalkableTile(nx, ny)) return;

      if (walkPathRef.current.length > 0) {
        setWalkPath([]);
        walkPathRef.current = [];
        setDestination(null);
      }

      if (chasingMobRef.current) {
        setChasingMobId(null);
        chasingMobRef.current = null;
      }

      const next = { x: nx, y: ny };
      setPlayerPos(next);
      playerPosRef.current = next;
      lastStep = now;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!keyToDir[key]) return;
      e.preventDefault();
      if (!heldKeysRef.current.includes(key)) {
        heldKeysRef.current = [...heldKeysRef.current, key];
      }
      tryStep();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!keyToDir[key]) return;
      heldKeysRef.current = heldKeysRef.current.filter(k => k !== key);
    };

    const mover = setInterval(tryStep, 40);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      clearInterval(mover);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isWalkableTile, selectedNPC]);

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
    if (isSafeSettlement) {
      setMobs([]);
      setActiveCombatId(null);
      return;
    }

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
  }, [mapData, activeQuestId, isSafeSettlement]);

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
    if (npc.service === "shop") {
      return [...npc.dialog, "Take a look at my wares whenever you're ready."];
    }
    if (npc.service === "guild") {
      return [...npc.dialog, "Step inside and I'll open the guild records for you."];
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
  const lungeY = targetMob ? Math.sign(targetMob.position.y - playerPos.y) * 12 : 0;

  return (
    <div
      className="relative h-full w-full overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl"
      style={{ height: "100%" }}
    >
      <div
        className="absolute inset-0 overflow-visible"
        style={{
          transform: SCENE_TILT,
          transformOrigin: "50% 60%",
          willChange: "transform",
        }}
      >
        {/* Tile canvas */}
        <div className="w-full h-full">
          <MapCanvas
            mapData={mapData}
            tileSize={TILE_SIZE}
            playerPos={playerPos}
          />
        </div>

        {/* Vignette removed */}

        {/* ── Sprite layer — CSS translate (no spring, GPU-composited) ────────── */}
        <div
          className="absolute pointer-events-none overflow-visible"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(${-isoPlayerX}px, ${-isoPlayerY}px)`,
            transition: "transform 0.16s linear",
            willChange: "transform",
          }}
        >
        {/* NPCs */}
        {mapData.npcs.map(npc => {
          const { x: ix, y: iy } = getIsoPos(npc.position.x, npc.position.y);
          return (
            <div
              key={npc.id}
              className="absolute cursor-pointer pointer-events-auto"
              style={{
                left: ix - TILE_SIZE / 2,
                top: iy - TILE_SIZE * 0.78,
                width: TILE_SIZE,
                height: TILE_SIZE * 1.35,
                zIndex: npc.position.y * mapData.width + npc.position.x + 1000,
              }}
              onClick={e => {
                e.stopPropagation();
                if (npc.service) {
                  // Service NPCs → directly open, no dialog required
                  onNPCInteract(npc);
                } else {
                  setSelectedNPC(npc);
                  setDialogIndex(0);
                }
              }}
            >
              <div className="relative h-full w-full pointer-events-none">
                <div className="pixel-sprite absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[62%] drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                  <NPCSprite type={npc.sprite} className="h-[96px] w-[96px] pixel-sprite" />
                </div>
                {/* Guild balloon — single floating pip above the NPC */}
                {npc.service === "guild" && (
                  <motion.div
                    animate={{ y: [-4, 0, -4] }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="bg-amber-500/90 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-sm shadow-lg uppercase tracking-wide">
                        Guild
                      </div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-amber-500/90" />
                    </div>
                  </motion.div>
                )}
                {/* Shop balloon */}
                {npc.service === "shop" && (
                  <motion.div
                    animate={{ y: [-4, 0, -4] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="bg-emerald-500/90 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-sm shadow-lg uppercase tracking-wide">
                        Shop
                      </div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-emerald-500/90" />
                    </div>
                  </motion.div>
                )}
                {npc.questId && (
                  <motion.div
                    animate={{ y: [-8, 0, -8] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 ${completedQuests.includes(npc.questId) ? "text-emerald-400" : activeQuestId === npc.questId ? "text-cyan-400" : "text-amber-400"}`}
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
        {!isSafeSettlement && mobs.map(mob => {
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
                left: ix - TILE_SIZE / 2,
                top: iy - TILE_SIZE * 0.72,
                width: TILE_SIZE,
                height: TILE_SIZE * 1.2,
                zIndex: mob.position.y * mapData.width + mob.position.x + 1100,
                // CSS transition for smooth roaming (no spring overhead)
                transition: isTargeted ? "left 0.2s linear, top 0.2s linear" : "left 0.34s linear, top 0.34s linear",
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
                  <div className="h-1.5 bg-slate-800/80 rounded-sm overflow-hidden border border-slate-600/40">
                    <div
                      className={`h-full rounded-sm transition-all duration-200 ${hpPct > 0.5 ? "bg-green-500" : hpPct > 0.25 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${hpPct * 100}%` }}
                    />
                  </div>
                </div>

                {/* Mob sprite with hit/roar/idle animations */}
                <motion.div
                  className="pixel-sprite translate-y-[-8px] origin-bottom"
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
                  <svg width="100" height="100" viewBox="-50 -50 100 100" className="pixel-sprite overflow-visible">
                    <EnemySpriteBody sprite={enemyData?.sprite || "slime"} />
                  </svg>
                </motion.div>

                {/* Combat target ring */}
                {isTargeted && !isHit && (
                  <motion.div
                    className="absolute inset-[8px] border-2 border-red-500/60 pointer-events-none"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                  />
                )}

                <div className="absolute bottom-2 left-1/2 h-2 w-9 -translate-x-1/2 bg-red-500/20 blur-[3px]" />
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
              style={{ left: dx - TILE_SIZE / 2, top: dy - TILE_SIZE / 2, width: TILE_SIZE, height: TILE_SIZE, zIndex: 1 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0.9, 0.4, 0.9], scale: [0.9, 1.05, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 0.9 }}
            >
              <svg viewBox="0 0 64 64" className="h-full w-full pixel-sprite">
                <rect x="6" y="6" width="52" height="52" fill="rgba(251,191,36,0.18)" stroke="rgba(251,191,36,0.85)" strokeWidth="2" strokeDasharray="6 4" />
              </svg>
            </motion.div>
          );
        })()}

        {/* Player sprite */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: isoPlayerX - TILE_SIZE / 2,
            top: isoPlayerY - TILE_SIZE * 0.72,
            width: TILE_SIZE,
            height: TILE_SIZE * 1.2,
            zIndex: playerPos.y * mapData.width + playerPos.x + 1200,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              className="pixel-sprite relative z-10 scale-95 translate-y-[-10px] origin-bottom"
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
                className="absolute inset-[6px] border-2 border-amber-400/50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 0.85 }}
              />
            )}

            <div className="absolute bottom-2 h-2 w-10 bg-amber-500/20 blur-[3px]" />
          </div>
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
          <span className="flex items-center gap-2">⌨️ WASD / Arrows Move</span>
          <span className="w-px h-4 bg-white/10" />
          {isSafeSettlement ? (
            <span className="flex items-center gap-2 text-emerald-300">🏛️ Safe City • Click NPCs</span>
          ) : (
            <span className={`flex items-center gap-2 ${activeCombatId ? "text-red-400 animate-pulse font-black" : ""}`}>
              ⚔️ {activeCombatId ? "Fighting! (click mob to flee)" : "Click Monster to Fight"}
            </span>
          )}
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
                    <NPCSprite type={selectedNPC.sprite} className="w-[60px] h-[60px]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-200" style={{ fontFamily: "'Cinzel', serif" }}>{selectedNPC.name}</h3>
                    <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">
                      {selectedNPC.service === "shop" ? "City Merchant" : selectedNPC.service === "guild" ? "Guild Officer" : "NPC"}
                    </p>
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
