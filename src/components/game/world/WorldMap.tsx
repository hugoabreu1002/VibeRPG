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

const TILE_SIZE = 80;
const WANDER_RADIUS = 5;
const COMBAT_INTERVAL_MS = 850;
const MOB_COUNT_MIN = 4;
const MOB_COUNT_MAX = 6;
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

  // Cache iso positions
  const getIso = useCallback((x: number, y: number) => ({
    x: (x - y) * (tileSize / 2),
    y: (x + y) * (tileSize / 4),
  }), [tileSize]);

  const isSettlementMap = mapData.mapType === "town";
  const isHubTown = mapData.name === "Hub Town";

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
  useEffect(() => { scheduleRedraw(); }, [mapData, playerPos]);

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

    ctx.fillStyle = mapData.mapType === "dungeon" ? "#05070d" : "#0a1710";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);

    const { x: camX, y: camY } = getIso(playerPos.x, playerPos.y);
    ctx.translate(-camX, -camY);

    const cullBuf = Math.max(width, height) * 0.8;

    const isTile = (x: number, y: number, type: QuestMapData["tiles"][0][0]) => mapData.tiles[y]?.[x] === type;

    const hubTownBuildings = [
      { id: "elder-hall", x: 12, y: 1, w: 6, h: 3, style: "manor" as const },
      { id: "market", x: 8, y: 6, w: 4, h: 3, style: "market" as const },
      { id: "temple", x: 2, y: 7, w: 5, h: 3, style: "temple" as const },
      { id: "guild", x: 18, y: 6, w: 5, h: 3, style: "guild" as const },
      { id: "barracks", x: 22, y: 7, w: 5, h: 3, style: "barracks" as const },
      { id: "tower", x: 13, y: 12, w: 4, h: 3, style: "tower" as const },
    ];

    const drawSettlementStreet = (ctx: CanvasRenderingContext2D, ix: number, iy: number, x: number, y: number) => {
      ctx.strokeStyle = "rgba(241, 245, 249, 0.18)";
      ctx.lineWidth = 1;
      for (let offset = -12; offset <= 12; offset += 8) {
        ctx.beginPath();
        ctx.moveTo(ix - 10 + offset / 3, iy - 5 + Math.abs(offset) / 9);
        ctx.lineTo(ix - 4 + offset / 3, iy - 1 + Math.abs(offset) / 11);
        ctx.stroke();
      }

      if ((x + y) % 2 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.fillRect(ix - 8, iy - 2, 4, 2);
        ctx.fillRect(ix + 2, iy + 1, 4, 2);
      }
    };

    const isLargeTownBuildingAnchor = (x: number, y: number) =>
      isTile(x, y, "town") &&
      x % 2 === 0 &&
      y % 2 === 0 &&
      isTile(x + 1, y, "town") &&
      isTile(x, y + 1, "town") &&
      isTile(x + 1, y + 1, "town");

    const drawTownBuilding = (ctx: CanvasRenderingContext2D, ix: number, iy: number, x: number, y: number) => {
      const variant = Math.abs((x * 17 + y * 31) % 3);
      const centerX = ix;
      const centerY = iy + tileSize / 4;
      const width = 42 + variant * 6;
      const height = 28 + variant * 3;
      const roofLift = 16 + variant * 2;
      const wallColors = ["#D6C6A5", "#CBB694", "#BFA27A"];
      const roofColors = ["#9A3412", "#7C2D12", "#92400E"];
      const wallColor = wallColors[variant];
      const roofColor = roofColors[variant];
      const hasStreetFront = isTile(x + 1, y, "path") || isTile(x - 1, y, "path") || isTile(x, y + 1, "path") || isTile(x, y - 1, "path");

      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(centerX - width / 2, centerY - 5, width, 5);

      ctx.fillStyle = wallColor;
      ctx.fillRect(centerX - width / 2, centerY - height, width, height);
      ctx.strokeStyle = "#5B4636";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(centerX - width / 2, centerY - height, width, height);

      ctx.fillStyle = roofColor;
      ctx.beginPath();
      ctx.moveTo(centerX - width / 2 - 5, centerY - height + 4);
      ctx.lineTo(centerX, centerY - height - roofLift);
      ctx.lineTo(centerX + width / 2 + 5, centerY - height + 4);
      ctx.lineTo(centerX + width / 2 - 2, centerY - height + 13);
      ctx.lineTo(centerX - width / 2 + 2, centerY - height + 13);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#451A03";
      ctx.stroke();

      ctx.fillStyle = "#FDE68A";
      ctx.fillRect(centerX - width / 2 + 7, centerY - height + 8, 5, 5);
      ctx.fillRect(centerX + width / 2 - 12, centerY - height + 8, 5, 5);

      if (hasStreetFront) {
        ctx.fillStyle = "#78350F";
        ctx.fillRect(centerX - 3, centerY - 10, 6, 10);
        ctx.fillStyle = "#B45309";
        ctx.fillRect(centerX - 10, centerY - 4, 20, 3);
      }

      if (variant === 2) {
        ctx.fillStyle = "#6B7280";
        ctx.fillRect(centerX + width / 2 - 8, centerY - height - roofLift + 8, 5, 12);
      }
    };

    const drawHubTownBuilding = (
      ctx: CanvasRenderingContext2D,
      building: typeof hubTownBuildings[number]
    ) => {
      const center = getIso(building.x + building.w / 2 - 0.5, building.y + building.h / 2 - 0.2);
      const centerX = center.x;
      const centerY = center.y + tileSize / 4;
      const width = (building.w + building.h) * (tileSize * 0.34);
      const height =
        building.style === "tower"
          ? 112
          : building.style === "manor"
            ? 82
            : 68;
      const roofLift =
        building.style === "tower"
          ? 54
          : building.style === "temple"
            ? 34
            : 28;

      const styleMap = {
        manor: { wall: "#CBB694", roof: "#7C2D12", trim: "#FBBF24", banner: "#7C3AED" },
        market: { wall: "#BFA27A", roof: "#92400E", trim: "#FDE68A", banner: "#10B981" },
        temple: { wall: "#E7E5E4", roof: "#D97706", trim: "#FBBF24", banner: "#F8FAFC" },
        guild: { wall: "#9CA3AF", roof: "#78350F", trim: "#F59E0B", banner: "#B45309" },
        barracks: { wall: "#94A3B8", roof: "#475569", trim: "#E2E8F0", banner: "#DC2626" },
        tower: { wall: "#C4B5FD", roof: "#5B21B6", trim: "#DDD6FE", banner: "#8B5CF6" },
      } as const;

      const palette = styleMap[building.style];

      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(centerX - width / 2, centerY - 6, width, 6);

      if (building.style === "tower") {
        const towerWidth = width * 0.5;
        ctx.fillStyle = palette.wall;
        ctx.fillRect(centerX - towerWidth / 2, centerY - height, towerWidth, height);
        ctx.strokeStyle = "#4C1D95";
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - towerWidth / 2, centerY - height, towerWidth, height);

        ctx.fillStyle = palette.roof;
        ctx.beginPath();
        ctx.moveTo(centerX - towerWidth / 2 - 4, centerY - height + 10);
        ctx.lineTo(centerX, centerY - height - roofLift);
        ctx.lineTo(centerX + towerWidth / 2 + 4, centerY - height + 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = palette.trim;
        ctx.fillRect(centerX - 4, centerY - height + 18, 8, 16);
        ctx.fillRect(centerX - 8, centerY - height + 46, 5, 5);
        ctx.fillRect(centerX + 3, centerY - height + 46, 5, 5);
        return;
      }

      ctx.fillStyle = palette.wall;
      ctx.fillRect(centerX - width / 2, centerY - height, width, height);
      ctx.strokeStyle = "#4B5563";
      ctx.lineWidth = 1;
      ctx.strokeRect(centerX - width / 2, centerY - height, width, height);

      ctx.fillStyle = palette.roof;
      ctx.beginPath();
      ctx.moveTo(centerX - width / 2 - 8, centerY - height + 8);
      ctx.lineTo(centerX, centerY - height - roofLift);
      ctx.lineTo(centerX + width / 2 + 8, centerY - height + 8);
      ctx.lineTo(centerX + width / 2 - 4, centerY - height + 20);
      ctx.lineTo(centerX - width / 2 + 4, centerY - height + 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#451A03";
      ctx.stroke();

      ctx.fillStyle = palette.trim;
      ctx.fillRect(centerX - width / 2 + 12, centerY - height + 16, 8, 8);
      ctx.fillRect(centerX + width / 2 - 20, centerY - height + 16, 8, 8);

      if (building.style === "market") {
        ctx.fillStyle = "#DC2626";
        ctx.fillRect(centerX - width / 2 + 10, centerY - height + 34, width - 20, 7);
        ctx.fillStyle = "#FDE68A";
        for (let stripe = -2; stripe <= 2; stripe++) {
          ctx.fillRect(centerX + stripe * 12 - 4, centerY - height + 34, 8, 7);
        }
      }

      if (building.style === "guild" || building.style === "barracks" || building.style === "manor") {
        ctx.fillStyle = palette.banner;
        ctx.fillRect(centerX - 4, centerY - height + 24, 8, 26);
        ctx.fillStyle = palette.trim;
        ctx.fillRect(centerX - 4, centerY - height + 48, 8, 6);
      }

      if (building.style === "temple") {
        ctx.fillStyle = palette.trim;
        ctx.fillRect(centerX - 3, centerY - height - 6, 6, 20);
        ctx.fillRect(centerX - 10, centerY - height + 2, 20, 5);
      }

      ctx.fillStyle = "#78350F";
      ctx.fillRect(centerX - 6, centerY - 16, 12, 16);
      ctx.fillStyle = "#B45309";
      ctx.fillRect(centerX - 14, centerY - 8, 28, 5);
    };

    for (let y = 0; y < mapData.height; y++) {
      for (let x = 0; x < mapData.width; x++) {
        const { x: ix, y: iy } = getIso(x, y);

        // Viewport culling
        const sx = ix - camX + width / 2;
        const sy = iy - camY + height / 2;
        if (sx < -cullBuf || sx > width + cullBuf || sy < -cullBuf || sy > height + cullBuf) continue;

        ctx.save();

        // Side face (Depth)
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.moveTo(ix - tileSize / 2, iy);
        ctx.lineTo(ix, iy + tileSize / 4);
        ctx.lineTo(ix, iy + tileSize / 4 + 6);
        ctx.lineTo(ix - tileSize / 2, iy + 6);
        ctx.fill();

        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.moveTo(ix + tileSize / 2, iy);
        ctx.lineTo(ix, iy + tileSize / 4);
        ctx.lineTo(ix, iy + tileSize / 4 + 6);
        ctx.lineTo(ix + tileSize / 2, iy + 6);
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
          grass:    ["#1a7a3a", "#145c2a"],
          water:    ["#1a56e8", "#1530a0"],
          lava:     ["#cc1a10", "#8c1208"],
          mountain: ["#5c5652", "#2c2a28"],
          forest:   ["#0c6040", "#053828"],
          town:     ["#92400E", "#78350F"],
          path:     ["#8a6040", "#604028"],
          cave:     ["#2a3340", "#141c24"],
        };
        const [c0, c1] =
          tile === "town" && isSettlementMap
            ? ["#7C6F64", "#5B5148"]
            : tile === "path" && isSettlementMap
              ? ["#8B7355", "#6E5A46"]
              : palette[tile] ?? palette.grass;
        grad.addColorStop(0, c0);
        grad.addColorStop(1, c1);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Decorations
        if (tile === "forest") {
          // Rich layered tree — dark trunk + canopy
          const variant = (x * 13 + y * 7) % 3;
          ctx.fillStyle = variant === 0 ? "#065e28" : variant === 1 ? "#044a20" : "#0a6a30";
          ctx.beginPath();
          ctx.moveTo(ix, iy - 20); ctx.lineTo(ix + 12, iy + 4); ctx.lineTo(ix - 12, iy + 4);
          ctx.fill();
          ctx.fillStyle = variant === 0 ? "#086830" : "#0a5428";
          ctx.beginPath();
          ctx.moveTo(ix, iy - 28); ctx.lineTo(ix + 8, iy - 10); ctx.lineTo(ix - 8, iy - 10);
          ctx.fill();
          // Trunk
          ctx.fillStyle = "#5c3a10";
          ctx.fillRect(ix - 2, iy + 2, 4, 6);
        } else if (tile === "mountain") {
          const variant = (x * 11 + y * 19) % 3;
          // Shadow face
          ctx.fillStyle = "#1c1a18";
          ctx.beginPath();
          ctx.moveTo(ix + 6, iy - 22); ctx.lineTo(ix + 20, iy + 4); ctx.lineTo(ix + 6, iy + 4);
          ctx.fill();
          // Main face
          ctx.fillStyle = variant === 0 ? "#5c5250" : variant === 1 ? "#504c48" : "#605a58";
          ctx.beginPath();
          ctx.moveTo(ix, iy - 26); ctx.lineTo(ix + 20, iy + 4); ctx.lineTo(ix - 20, iy + 4);
          ctx.fill();
          // Snow cap
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.beginPath();
          ctx.moveTo(ix, iy - 26); ctx.lineTo(ix + 6, iy - 14); ctx.lineTo(ix - 6, iy - 14);
          ctx.fill();
        } else if (tile === "grass") {
          // Field/dungeon grass detail — scattered blades
          if ((x + y) % 3 === 0) {
            ctx.strokeStyle = "rgba(60,200,80,0.25)";
            ctx.lineWidth = 0.8;
            for (let b = -6; b <= 6; b += 4) {
              ctx.beginPath();
              ctx.moveTo(ix + b, iy + 2);
              ctx.lineTo(ix + b - 1, iy - 5);
              ctx.stroke();
            }
          }
        } else if (tile === "lava") {
          // Lava glow pulse spots
          if ((x + y) % 2 === 0) {
            const grd = ctx.createRadialGradient(ix, iy - 2, 0, ix, iy - 2, 12);
            grd.addColorStop(0, "rgba(255,120,0,0.55)");
            grd.addColorStop(1, "rgba(180,20,0,0)");
            ctx.fillStyle = grd;
            ctx.beginPath(); ctx.arc(ix, iy - 2, 12, 0, Math.PI * 2); ctx.fill();
          }
        } else if (tile === "cave") {
          // Cave stalactite
          ctx.fillStyle = "#0a1220";
          ctx.beginPath();
          ctx.arc(ix, iy - 10, 10, 0, Math.PI * 2);
          ctx.fill();
          if ((x + y) % 2 === 0) {
            ctx.fillStyle = "rgba(80,160,220,0.18)";
            ctx.fillRect(ix - 2, iy - 14, 3, 8);
          }
        } else if (tile === "water") {
          // Water shimmer
          if ((x * 3 + y) % 4 === 0) {
            ctx.strokeStyle = "rgba(120,200,255,0.35)";
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(ix - 8, iy - 1); ctx.lineTo(ix + 8, iy - 1);
            ctx.stroke();
          }
        } else if (tile === "town") {
          if (isSettlementMap) {
            if (isHubTown) {
              ctx.fillStyle = "rgba(255,255,255,0.04)";
              ctx.fillRect(ix - 10, iy - 3, 20, 4);
            } else if (isLargeTownBuildingAnchor(x, y)) {
              drawTownBuilding(ctx, ix, iy, x, y);
            } else {
              ctx.fillStyle = "rgba(255,255,255,0.05)";
              ctx.beginPath();
              ctx.arc(ix, iy, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        
        // Final Shadow Pass for groundedness
        if (tile === "forest" || tile === "mountain") {
          ctx.fillStyle = "rgba(0,0,0,0.2)";
          ctx.beginPath();
          ctx.ellipse(ix, iy + 8, 14, 6, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    if (isHubTown) {
      hubTownBuildings
        .slice()
        .sort((a, b) => (a.y + a.h) - (b.y + b.h))
        .forEach(building => drawHubTownBuilding(ctx, building));
    }

    // Atmospheric Overlay
    ctx.restore(); // Back to screen space
    const grd = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.7);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1, mapData.mapType === "dungeon" ? "rgba(0,0,0,0.7)" : "rgba(10,23,16,0.5)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    ctx.restore(); // Final balance
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
    }, 160);
    return () => clearInterval(id);
  }, []);

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
          const { x: ix, y: iy } = getIsoPos(npc.position.x, npc.position.y);
          return (
            <div
              key={npc.id}
              className="absolute cursor-pointer pointer-events-auto"
              style={{ left: ix, top: iy, width: TILE_SIZE, height: TILE_SIZE / 2, zIndex: npc.position.x + npc.position.y + 1 }}
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
              <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                <div className="translate-y-[-24px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                  <NPCSprite type={npc.sprite} className="w-12 h-12" />
                </div>
                {/* Guild balloon — single floating pip above the NPC */}
                {npc.service === "guild" && (
                  <motion.div
                    animate={{ y: [-4, 0, -4] }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                    className="absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-none"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="bg-amber-500/90 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase tracking-wide">
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
                    className="absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-none"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="bg-emerald-500/90 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase tracking-wide">
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
          {isSafeSettlement ? (
            <span className="flex items-center gap-2 text-emerald-300">🏛️ Safe City • Visit NPCs</span>
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
                    <NPCSprite type={selectedNPC.sprite} className="w-10 h-10" />
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
