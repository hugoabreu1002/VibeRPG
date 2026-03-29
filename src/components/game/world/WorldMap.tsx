import { AnimatePresence, motion } from "framer-motion";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { audioManager } from "../../../lib/audio";
import { ENEMIES, REGION_MOBS } from "../../../lib/game-data";
import { acceptQuestFromNPC, hasFinishedMainStory } from "../../../lib/quest-logic";
import type { Character, CharacterClass, InventoryItem, NPC, Quest, QuestMapData } from "../../../types/game";
import { EnemySpriteBody } from "../battle/EnemySprites";
import { InventorySprite } from "../character/InventorySprite";
import {
  ExclamationIndicator
} from "../ui/GameIcons";
import { NPCSprite } from "./NPCSprites";

const TILE_SIZE = 80;

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
  onMobInteract?: (enemyId: string) => void;
}

interface MapMob {
  id: string;
  enemyId: string;
  position: { x: number; y: number };
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

const MapCanvas = memo(({
  mapData, tileSize, playerPos, viewScale, getIsoPos, onTileClick, discoveredTiles
}: {
  mapData: QuestMapData, tileSize: number, playerPos: { x: number, y: number },
  viewScale: number,
  getIsoPos: (x: number, y: number) => { x: number, y: number },
  onTileClick: (x: number, y: number) => void,
  discoveredTiles: string[]
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const updateSize = () => {
      const { clientWidth, clientHeight } = canvas.parentElement!;
      setDimensions({ width: clientWidth, height: clientHeight });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(canvas.parentElement!);
    return () => observer.disconnect();
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left - dimensions.width / 2) / viewScale;
    const my = (e.clientY - rect.top - dimensions.height / 2) / viewScale;

    // Static camera centered on map center
    const centerX = Math.floor(mapData.width / 2);
    const centerY = Math.floor(mapData.height / 2);
    const { x: camX, y: camY } = getIsoPos(centerX, centerY);

    const worldX = mx + camX;
    const worldY = my + camY;

    const xPlusY = worldY / (tileSize / 4);
    const xMinusY = worldX / (tileSize / 2);
    const x = Math.round((xPlusY + xMinusY) / 2);
    const y = Math.round((xPlusY - xMinusY) / 2);

    if (x >= 0 && x < mapData.width && y >= 0 && y < mapData.height) {
      onTileClick(x, y);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // 1. Clear & Fill Background
    ctx.fillStyle = "#0a1710";
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    ctx.save();
    ctx.translate(dimensions.width / 2, dimensions.height / 2);
    ctx.scale(viewScale, viewScale);

    // Static camera centered on map center
    const centerX = Math.floor(mapData.width / 2);
    const centerY = Math.floor(mapData.height / 2);
    const { x: camX, y: camY } = getIsoPos(centerX, centerY);
    ctx.translate(-camX, -camY);

    // 2. Base Procedural Grid
    ctx.strokeStyle = "rgba(16, 185, 129, 0.05)";
    ctx.lineWidth = 1;
    const gridRange = 25;
    for (let gx = playerPos.x - gridRange; gx <= playerPos.x + gridRange; gx++) {
      for (let gy = playerPos.y - gridRange; gy <= playerPos.y + gridRange; gy++) {
        const { x: ix, y: iy } = getIsoPos(gx, gy);
        ctx.beginPath();
        ctx.moveTo(ix, iy - tileSize / 4);
        ctx.lineTo(ix + tileSize / 2, iy);
        ctx.lineTo(ix, iy + tileSize / 4);
        ctx.lineTo(ix - tileSize / 2, iy);
        ctx.closePath();
        ctx.stroke();
      }
    }

    // 3. Render Real Tiles
    mapData.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        const { x: ix, y: iy } = getIsoPos(x, y);

        const buffer = 500;
        const sx = (ix - camX) * viewScale + dimensions.width / 2;
        const sy = (iy - camY) * viewScale + dimensions.height / 2;
        if (sx < -buffer || sx > dimensions.width + buffer || sy < -buffer || sy > dimensions.height + buffer) return;

        const isDiscovered = discoveredTiles.includes(`${x},${y}`);

        ctx.save();
        if (!isDiscovered) {
          ctx.globalAlpha = 0.4;
          ctx.filter = "grayscale(1) brightness(0.2)";
        }

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.moveTo(ix - tileSize / 2, iy); ctx.lineTo(ix, iy + tileSize / 4); ctx.lineTo(ix, iy + tileSize / 4 + 8); ctx.lineTo(ix - tileSize / 2, iy + 8);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(ix, iy - tileSize / 4); ctx.lineTo(ix + tileSize / 2, iy); ctx.lineTo(ix, iy + tileSize / 4); ctx.lineTo(ix - tileSize / 2, iy);
        ctx.closePath();

        let colors = ["#166534", "#14532D"]; // Default grass
        if (tile === "water") colors = ["#1D4ED8", "#1E3A8A"];
        else if (tile === "lava") colors = ["#B91C1C", "#7F1D1D"];
        else if (tile === "mountain") colors = ["#44403C", "#1C1917"];
        else if (tile === "forest") colors = ["#064E3B", "#022C22"];
        else if (tile === "town") colors = ["#92400E", "#78350F"];
        else if (tile === "path") colors = ["#78350F", "#451A03"];

        const grad = ctx.createLinearGradient(ix, iy - tileSize / 4, ix, iy + tileSize / 4);
        grad.addColorStop(0, colors[0]); grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.stroke();

        // Environmental Decorations
        if (tile === "forest") {
          ctx.fillStyle = "#022C22"; ctx.beginPath();
          ctx.moveTo(ix, iy - 15); ctx.lineTo(ix + 10, iy + 5); ctx.lineTo(ix - 10, iy + 5); ctx.fill();
        } else if (tile === "mountain") {
          ctx.fillStyle = "#222"; ctx.beginPath();
          ctx.moveTo(ix, iy - 22); ctx.lineTo(ix + 18, iy + 5); ctx.lineTo(ix - 18, iy + 5); ctx.fill();
        } else if (tile === "town") {
          ctx.fillStyle = "#451A03"; ctx.beginPath(); ctx.moveTo(ix - 8, iy - 12); ctx.lineTo(ix, iy - 18); ctx.lineTo(ix + 8, iy - 12); ctx.fill();
        }
        ctx.restore();
      });
    });
    ctx.restore();
  }, [mapData, tileSize, playerPos, viewScale, getIsoPos, dimensions, discoveredTiles]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="absolute inset-0 w-full h-full cursor-pointer pointer-events-auto"
    />
  );
});

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
  onBack,
  onNavigateToRegion,
  onQuestAccepted,
  onUpdateCharacter,
  onMobInteract
}: WorldMapProps) {
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [playerPos, setPlayerPos] = useState(mapData.playerStart);

  const [mobs, setMobs] = useState<MapMob[]>([]);
  const [popups, setPopups] = useState<FloatingText[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "day" | "dusk" | "night">("day");

  const regionDiscovery = character.discoveredTiles?.[mapData.name] || [];

  // Discovery logic
  useEffect(() => {
    if (!regionDiscovery.includes(`${playerPos.x},${playerPos.y}`)) {
      const newDiscovery = [...regionDiscovery, `${playerPos.x},${playerPos.y}`];
      onUpdateCharacter?.({
        discoveredTiles: {
          ...(character.discoveredTiles || {}),
          [mapData.name]: newDiscovery
        }
      });

      // Add a "Discovered!" popup if it's a new tile? 
      // Maybe only for special tiles. For now just update.
    }
  }, [playerPos.x, playerPos.y, mapData.name, regionDiscovery, onUpdateCharacter, character.discoveredTiles]);

  // Time Cycle effect - Based on real world time
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) {
        setTimeOfDay("morning");
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay("day");
      } else if (hour >= 18 && hour < 21) {
        setTimeOfDay("dusk");
      } else {
        setTimeOfDay("night");
      }
    };

    // Set initial time
    updateTimeOfDay();

    // Update every minute to catch time changes
    const interval = setInterval(updateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTimeFilters = () => {
    switch (timeOfDay) {
      case "morning": return "sepia(0.2) saturate(1.2) hue-rotate(-10deg) brightness(1.05)";
      case "day": return "brightness(1) saturate(1)";
      case "dusk": return "sepia(0.5) saturate(1.4) hue-rotate(15deg) brightness(0.9)";
      case "night": return "brightness(0.5) saturate(0.8) hue-rotate(200deg) contrast(1.1)";
    }
  };

  // Wild Mob Spawning
  useEffect(() => {
    if (!mapData) return;
    const possibleEnemies = REGION_MOBS[mapData.name] || ["green-slime"];
    const numMobs = 3 + Math.floor(Math.random() * 2);
    const newMobs: MapMob[] = [];

    // Get bounty target if there's an active bounty quest
    const bountyTarget = activeQuestId && allQuests.find(q => q.id === activeQuestId)?.bounty?.targetMonsterId;

    for (let i = 0; i < numMobs; i++) {
      let x, y, valid = false;
      let attempts = 0;
      while (!valid && attempts < 20) {
        x = Math.floor(Math.random() * mapData.width);
        y = Math.floor(Math.random() * mapData.height);
        const tile = mapData.tiles[y]?.[x];
        const isNPC = mapData.npcs.some(n => n.position.x === x && n.position.y === y);
        const isOccupied = newMobs.some(m => m.position.x === x && m.position.y === y);

        if (tile === "grass" || tile === "path" || tile === "forest") {
          if (!isNPC && !isOccupied && (x !== mapData.playerStart.x || y !== mapData.playerStart.y)) {
            valid = true;
            // Prioritize bounty target if active (50% chance to spawn bounty monster)
            let enemyId: string;
            if (bountyTarget && possibleEnemies.includes(bountyTarget) && Math.random() < 0.5) {
              enemyId = bountyTarget;
            } else {
              enemyId = possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)];
            }
            newMobs.push({
              id: `mob-${Date.now()}-${i}`,
              enemyId,
              position: { x, y }
            });
          }
        }
        attempts++;
      }
    }
    setMobs(newMobs);
  }, [mapData, activeQuestId, allQuests]);

  const viewScale = 1.0;
  const equippedWeapon = inventory?.find(i => i.type === "weapon" && i.equipped);
  const equippedHat = inventory?.find(i => i.type === "hat" && i.equipped);
  const equippedArmor = inventory?.find(i => i.type === "armor" && i.equipped);
  const equippedBoot = inventory?.find(i => i.type === "boot" && i.equipped);

  const getIsoPos = useCallback((x: number, y: number) => {
    return {
      x: (x - y) * (TILE_SIZE / 2),
      y: (x + y) * (TILE_SIZE / 4),
    };
  }, []);

  const getDialogsForNPC = useCallback((npc: NPC | null) => {
    if (!npc) return [];
    if (npc.questId && completedQuests.includes(npc.questId)) {
      const nextQuest = allQuests
        .filter(q => (q.class === playerClass || hasFinishedMainStory(character)) && !completedQuests.includes(q.id) && !q.id.startsWith("guild-"))
        .sort((a, b) => a.minLevel - b.minLevel)[0];

      if (nextQuest) {
        return [`You've finished your work with me. You should head to ${nextQuest.region} to continue your journey.`];
      } else {
        return ["You have become a legend. There are no more challenges for you right now."];
      }
    }
    return npc.dialog;
  }, [completedQuests, allQuests, playerClass, character]);

  const handleDialogAdvance = useCallback(async () => {
    if (!selectedNPC) return;
    const dialogs = getDialogsForNPC(selectedNPC);
    if (dialogIndex < dialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
      audioManager.playSfx("click");
    } else {
      if (selectedNPC.questId) {
        if (completedQuests.includes(selectedNPC.questId)) {
          audioManager.playSfx("click");
          setSelectedNPC(null);
          setDialogIndex(0);
          const nextQuest = allQuests
            .filter(q => (q.class === playerClass || hasFinishedMainStory(character)) && !completedQuests.includes(q.id) && !q.id.startsWith("guild-"))
            .sort((a, b) => a.minLevel - b.minLevel)[0];
          if (nextQuest && onNavigateToRegion && nextQuest.region !== character.currentRegion) {
            onNavigateToRegion(nextQuest.region);
          }
          return;
        }
        try {
          const quest = allQuests.find(q => q.id === selectedNPC.questId);
          if (quest) {
            const result = await acceptQuestFromNPC(character, quest);
            if (result.success) {
              audioManager.playSfx("questAccept");
              setSelectedNPC(null);
              setDialogIndex(0);
              onQuestAccepted?.(quest);
            }
          }
        } catch (error) {
          console.error(error);
          setSelectedNPC(null);
          setDialogIndex(0);
        }
      } else {
        onNPCInteract(selectedNPC);
        setSelectedNPC(null);
        setDialogIndex(0);
      }
    }
  }, [selectedNPC, dialogIndex, character, onQuestAccepted, allQuests, completedQuests, getDialogsForNPC, onNavigateToRegion, playerClass, onNPCInteract]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedNPC && e.key === "Enter") {
        e.preventDefault();
        handleDialogAdvance();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNPC, handleDialogAdvance]);

  const addPopup = (text: string, x: number, y: number, color: string = "text-amber-400") => {
    const id = Date.now();
    setPopups(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 1500);
  };

  const handleTileClick = useCallback((x: number, y: number) => {
    const npc = mapData.npcs.find(n => n.position.x === x && n.position.y === y);
    if (npc) {
      setSelectedNPC(npc);
      setDialogIndex(0);
      return;
    }

    const dx = Math.abs(x - playerPos.x);
    const dy = Math.abs(y - playerPos.y);
    if (dx + dy <= 3) {
      const tile = mapData.tiles[y]?.[x];
      if (tile && tile !== "water" && tile !== "mountain" && tile !== "lava") {
        setPlayerPos({ x, y });
        const mobAtPos = mobs.find(m => m.position.x === x && m.position.y === y);
        if (mobAtPos && onMobInteract) {
          // Add a "Battle!" popup
          const { x: ix, y: iy } = getIsoPos(x, y);
          addPopup("BATTLE! ⚔️", ix, iy, "text-red-500");
          setTimeout(() => onMobInteract(mobAtPos.enemyId), 400);
        }
      }
    }
  }, [playerPos, mapData, mobs, onMobInteract, addPopup, getIsoPos]);

  const { x: isoPlayerX, y: isoPlayerY } = getIsoPos(playerPos.x, playerPos.y);
  const camPos = getIsoPos(Math.floor(mapData.width / 2), Math.floor(mapData.height / 2));

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-950 rounded-2xl border-4 border-slate-900 shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/50"
      style={{ height: "100%" }}
      tabIndex={0}
    >
      <div
        className="w-full h-full transition-all duration-[3000ms] ease-in-out"
        style={{ filter: getTimeFilters() }}
      >
        <MapCanvas
          mapData={mapData}
          tileSize={TILE_SIZE}
          playerPos={playerPos}
          viewScale={viewScale}
          getIsoPos={getIsoPos}
          onTileClick={handleTileClick}
          discoveredTiles={regionDiscovery}
        />
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          x: -camPos.x * viewScale,
          y: -camPos.y * viewScale,
          scale: viewScale
        }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
          left: '50%',
          top: '50%'
        }}
      >
        {/* NPCs */}
        {mapData.npcs.map((npc) => {
          if (npc.questId) {
            const questData = allQuests.find(q => q.id === npc.questId);
            if (questData && questData.class !== playerClass) return null;
          }
          const { x: ix, y: iy } = getIsoPos(npc.position.x, npc.position.y);
          return (
            <motion.div
              key={npc.id}
              className="absolute z-[1000] cursor-pointer pointer-events-auto"
              animate={{ left: ix, top: iy }}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE / 2,
                zIndex: npc.position.x + npc.position.y + 1
              }}
              onClick={() => { setSelectedNPC(npc); setDialogIndex(0); }}
            >
              <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                <div className="translate-y-[-24px] filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                  <NPCSprite type={npc.sprite} className="w-12 h-12" />
                </div>
                <div className="absolute bottom-2 w-8 h-3.5 bg-black/40 rounded-full blur-[4px] -z-10" />
                {npc.questId && (
                  <motion.div
                    animate={{ y: [-10, 0, -10] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`absolute -top-20 left-1/2 -translate-x-1/2 ${completedQuests.includes(npc.questId)
                      ? "text-emerald-400"
                      : activeQuestId === npc.questId
                        ? "text-cyan-400"
                        : "text-amber-400"
                      }`}
                  >
                    {completedQuests.includes(npc.questId) ? (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : activeQuestId === npc.questId ? (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    ) : (
                      <ExclamationIndicator size={32} />
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Wild Mobs */}
        {mobs.map((mob) => {
          const { x: ix, y: iy } = getIsoPos(mob.position.x, mob.position.y);
          const enemyData = ENEMIES[mob.enemyId];
          return (
            <motion.div
              key={mob.id}
              className="absolute z-[1000] cursor-pointer pointer-events-auto"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ left: ix, top: iy, opacity: 1, scale: 1 }}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE / 2,
                zIndex: mob.position.x + mob.position.y + 1
              }}
              onClick={() => onMobInteract?.(mob.enemyId)}
            >
              <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 + Math.random() }}
                  className="translate-y-[-20px] filter drop-shadow-[0_6px_8px_rgba(239,68,68,0.3)]"
                >
                  <svg width="32" height="32" viewBox="-24 -24 48 48">
                    <EnemySpriteBody sprite={enemyData?.sprite || 'slime'} />
                  </svg>
                </motion.div>
                <div className="absolute top-[-30px] text-xs text-red-500 font-black animate-pulse">!</div>
                <div className="absolute bottom-1.5 w-8 h-3 bg-red-950/20 rounded-full blur-[3px] -z-10" />
              </div>
            </motion.div>
          );
        })}

        {/* Player Marker */}
        <motion.div
          className="absolute z-[2000] pointer-events-none"
          animate={{ left: isoPlayerX, top: isoPlayerY }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE / 2,
            zIndex: playerPos.x + playerPos.y + 2
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative z-10 scale-90 translate-y-[-28px] filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]">
              <InventorySprite
                characterClass={playerClass}
                rank={playerRank}
                equippedWeapon={equippedWeapon}
                equippedHat={equippedHat}
                equippedArmor={equippedArmor}
                equippedBoot={equippedBoot}
              />
            </div>
            <div className="absolute bottom-2 w-10 h-4 bg-amber-500/20 rounded-full blur-[5px] -z-10 animate-pulse" />
            <div className="absolute bottom-2 w-10 h-4 bg-black/60 rounded-full blur-[3px] -z-20" />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Popups */}
      <AnimatePresence>
        {popups.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -50 }}
            exit={{ opacity: 0 }}
            className={`absolute pointer-events-none font-black text-lg z-[3000] ${p.color}`}
            style={{ left: p.x, top: p.y }}
          >
            {p.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Region Badge */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 px-5 py-3 rounded-2xl shadow-2xl"
        >
          <div className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] mb-1">Current Region</div>
          <div className="text-2xl font-black text-white flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif" }}>
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${timeOfDay === 'day' ? 'text-yellow-400 bg-yellow-400' :
              timeOfDay === 'night' ? 'text-blue-500 bg-blue-500' :
                timeOfDay === 'morning' ? 'text-orange-400 bg-orange-400' :
                  'text-orange-600 bg-orange-600'
              }`} />
            {mapData.name} <span className="text-slate-500 font-normal text-sm capitalize">{timeOfDay}</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="px-6 py-2.5 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/10 flex gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest shadow-2xl">
          <div className="flex items-center gap-2">🖱️ Move</div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">⚔️ Wild Mobs Roaming</div>
          <div className="w-px h-4 bg-white/10" />
          <div className={`flex items-center gap-2 font-black ${timeOfDay === 'night' ? 'text-blue-400' : 'text-amber-400'}`}>
            {timeOfDay.toUpperCase()}
          </div>
        </div>
      </div>

      {/* NPC Dialog Overlay */}
      <AnimatePresence>
        {selectedNPC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 p-4"
            onClick={handleDialogAdvance}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              className="w-full max-w-lg mb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="fantasy-card rounded-xl p-5 bg-slate-900 border border-amber-500/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                    <NPCSprite type={selectedNPC.sprite} className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-200" style={{ fontFamily: "'Cinzel', serif" }}>
                      {selectedNPC.name}
                    </h3>
                    <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">NPC</p>
                  </div>
                </div>
                <motion.p key={dialogIndex} className="text-sm text-slate-300 leading-relaxed mb-4 min-h-[48px]">
                  {getDialogsForNPC(selectedNPC)[dialogIndex]}
                </motion.p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 px-3 py-1 bg-black/30 rounded-full border border-white/5">
                    {dialogIndex + 1} / {getDialogsForNPC(selectedNPC).length}
                  </span>
                  <button onClick={handleDialogAdvance} className="px-4 py-2 rounded-lg text-sm font-bold bg-amber-600 text-white shadow-lg shadow-amber-900/20 active:scale-95 transition-transform">
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
