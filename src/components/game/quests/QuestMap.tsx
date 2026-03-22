import { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Quest, QuestMapData, NPC, TileType, InventoryItem, CharacterClass } from "../../../types/game";
import { NPCSprite } from "../world/NPCSprites";
import { InventorySprite } from "../character/InventorySprite";
import { audioManager } from "../../../lib/audio";
import { 
  TileTreeIcon, TileWaterIcon, TileMountainIcon, TileHouseIcon, 
  TileCaveIcon, TileLavaIcon, ExclamationIndicator 
} from "../ui/GameIcons";

const TILE_SIZE = 80;

const TILE_COLORS: Record<TileType, { bg: string; border: string; accent: string; icon?: React.ReactNode }> = {
  grass:    { bg: "linear-gradient(135deg, #166534, #14532D)", border: "#064E3B", accent: "#10B98120", icon: <TileTreeIcon size={20} className="opacity-20 filter grayscale" /> },
  path:     { bg: "linear-gradient(135deg, #78350F, #451A03)", border: "#422006", accent: "#F59E0B10", icon: undefined },
  water:    { bg: "linear-gradient(180deg, #1E40AF, #1E3A8A)", border: "#172554", accent: "#3B82F630", icon: <TileWaterIcon /> },
  mountain: { bg: "linear-gradient(135deg, #44403C, #1C1917)", border: "#0C0A09", accent: "#A8A29E20", icon: <TileMountainIcon /> },
  forest:   { bg: "linear-gradient(135deg, #064E3B, #022C22)", border: "#064E3B", accent: "#05966920", icon: <TileTreeIcon /> },
  town:     { bg: "linear-gradient(135deg, #92400E, #78350F)", border: "#451A03", accent: "#FBBF2410", icon: <TileHouseIcon /> },
  cave:     { bg: "linear-gradient(135deg, #1C1917, #000000)", border: "#0C0A09", accent: "#44403C20", icon: <TileCaveIcon /> },
  lava:     { bg: "linear-gradient(180deg, #991B1B, #450A0A)", border: "#450A0A", accent: "#EF444430", icon: <TileLavaIcon /> },
};

interface QuestMapProps {
  quest?: Quest;
  mapData: QuestMapData;
  playerClass?: CharacterClass;
  playerRank?: string;
  inventory?: InventoryItem[];
  completedQuests?: string[];
  activeQuestId?: string;
  allQuests?: Quest[];
  onNPCInteract: (npc: NPC) => void;
  onBack: () => void;
}

const MapCanvas = memo(({ 
  mapData, tileSize, playerPos, isWideView, viewScale, getIsoPos, onTileClick
}: { 
  mapData: QuestMapData, tileSize: number, playerPos: { x: number, y: number },
  isWideView: boolean, viewScale: number,
  getIsoPos: (x: number, y: number) => { x: number, y: number },
  onTileClick: (x: number, y: number) => void
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
    const { x: camX, y: camY } = getIsoPos(playerPos.x, playerPos.y);
    const worldX = mx + camX;
    const worldY = my + camY;
    const xPlusY = worldY / (tileSize / 4);
    const xMinusY = worldX / (tileSize / 2);
    const x = Math.round((xPlusY + xMinusY) / 2);
    const y = Math.round((xPlusY - xMinusY) / 2);
    if (x >= 0 && x < mapData.width && y >= 0 && y < mapData.height) onTileClick(x, y);
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
    ctx.fillStyle = "#0a2412"; // Very dark forest/void color
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    ctx.save();
    ctx.translate(dimensions.width / 2, dimensions.height / 2);
    ctx.scale(viewScale, viewScale);

    const { x: camX, y: camY } = getIsoPos(playerPos.x, playerPos.y);
    ctx.translate(-camX, -camY);

    // 2. Base Procedural Grid (Infinite feel)
    ctx.strokeStyle = "rgba(16, 185, 129, 0.05)";
    ctx.lineWidth = 1;
    const gridRange = isWideView ? 40 : 25;
    for(let gx = playerPos.x - gridRange; gx <= playerPos.x + gridRange; gx++) {
      for(let gy = playerPos.y - gridRange; gy <= playerPos.y + gridRange; gy++) {
        const { x: ix, y: iy } = getIsoPos(gx, gy);
        ctx.beginPath();
        ctx.moveTo(ix, iy - tileSize/4);
        ctx.lineTo(ix + tileSize/2, iy);
        ctx.lineTo(ix, iy + tileSize/4);
        ctx.lineTo(ix - tileSize/2, iy);
        ctx.closePath();
        ctx.stroke();
      }
    }

    // 3. Render Real Tiles
    mapData.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        const { x: ix, y: iy } = getIsoPos(x, y);
        
        // Generous Culling
        const buffer = 500; // Extra wide buffer to prevent pop-in
        const sx = (ix - camX) * viewScale + dimensions.width/2;
        const sy = (iy - camY) * viewScale + dimensions.height/2;
        if (sx < -buffer || sx > dimensions.width + buffer || sy < -buffer || sy > dimensions.height + buffer) return;

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.moveTo(ix-tileSize/2, iy); ctx.lineTo(ix, iy+tileSize/4); ctx.lineTo(ix, iy+tileSize/4+8); ctx.lineTo(ix-tileSize/2, iy+8);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(ix, iy - tileSize/4); ctx.lineTo(ix + tileSize/2, iy); ctx.lineTo(ix, iy + tileSize/4); ctx.lineTo(ix - tileSize/2, iy);
        ctx.closePath();

        let colors = ["#166534", "#14532D"]; // Default grass
        if (tile === "water") colors = ["#1D4ED8", "#1E3A8A"];
        else if (tile === "lava")  colors = ["#B91C1C", "#7F1D1D"];
        else if (tile === "mountain") colors = ["#44403C", "#1C1917"];
        else if (tile === "forest")   colors = ["#064E3B", "#022C22"];
        else if (tile === "town")     colors = ["#92400E", "#78350F"];
        else if (tile === "path")     colors = ["#78350F", "#451A03"];

        const grad = ctx.createLinearGradient(ix, iy - tileSize/4, ix, iy + tileSize/4);
        grad.addColorStop(0, colors[0]); grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.stroke();

        // Procedural Textures
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = (x * 7 + y * 13) % 2 === 0 ? "#fff" : "#000";
        for(let i=0; i<3; i++) ctx.fillRect(ix + Math.sin(x+i)*12, iy + Math.cos(y+i)*6, 2, 2);
        ctx.globalAlpha = 1.0;

        // Environmental Decorations
        if (tile === "forest") {
          ctx.fillStyle = "#022C22"; ctx.beginPath();
          ctx.moveTo(ix, iy-15); ctx.lineTo(ix+10, iy+5); ctx.lineTo(ix-10, iy+5); ctx.fill();
        } else if (tile === "mountain") {
          ctx.fillStyle = "#222"; ctx.beginPath();
          ctx.moveTo(ix, iy-22); ctx.lineTo(ix+18, iy+5); ctx.lineTo(ix-18, iy+5); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.beginPath();
          ctx.moveTo(ix, iy-22); ctx.lineTo(ix+6, iy-14); ctx.lineTo(ix-6, iy-14); ctx.fill();
        } else if (tile === "water") {
          ctx.strokeStyle = "rgba(255,255,255,0.15)";
          ctx.beginPath(); ctx.arc(ix, iy, 12, 0, Math.PI); ctx.stroke();
        } else if (tile === "town") {
          ctx.fillStyle = "#78350F"; ctx.fillRect(ix-6, iy-12, 12, 10);
          ctx.fillStyle = "#451A03"; ctx.beginPath(); ctx.moveTo(ix-8, iy-12); ctx.lineTo(ix, iy-18); ctx.lineTo(ix+8, iy-12); ctx.fill();
        }
      });
    });
    ctx.restore();
  }, [mapData, tileSize, playerPos, isWideView, viewScale, getIsoPos, dimensions]);

  return (
    <canvas 
      ref={canvasRef} 
      onClick={handleCanvasClick}
      className="absolute inset-0 w-full h-full cursor-pointer pointer-events-auto"
    />
  );
});


export function QuestMap({ 
  quest, 
  mapData, 
  playerClass = "warrior", 
  playerRank = "F",
  inventory = [], 
  completedQuests = [],
  activeQuestId,
  allQuests = [],
  onNPCInteract, 
  onBack 
}: QuestMapProps) {
  const [isWideView, setIsWideView] = useState(false);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [playerPos, setPlayerPos] = useState(mapData.playerStart);
  
  // Reset player position when map changes
  useEffect(() => {
    setPlayerPos(mapData.playerStart);
  }, [mapData]);
  const viewScale = isWideView ? 0.65 : 1.0;
  const viewportHeight = (isWideView ? 10 : 7) * TILE_SIZE;

  const equippedWeapon = inventory?.find(i => i.type === "weapon" && i.equipped);
  const equippedHat = inventory?.find(i => i.type === "hat" && i.equipped);
  const equippedArmor = inventory?.find(i => i.type === "armor" && i.equipped);
  const equippedBoot = inventory?.find(i => i.type === "boot" && i.equipped);

  const handleDialogAdvance = useCallback(() => {
    if (!selectedNPC) return;
    if (dialogIndex < selectedNPC.dialog.length - 1) {
      setDialogIndex(dialogIndex + 1);
      audioManager.playSfx("click");
    } else {
      onNPCInteract(selectedNPC);
      setSelectedNPC(null);
      setDialogIndex(0);
      audioManager.playSfx("questAccept");
    }
  }, [selectedNPC, dialogIndex, onNPCInteract]);

  const getIsoPos = useCallback((x: number, y: number) => {
    return {
      x: (x - y) * (TILE_SIZE / 2),
      y: (x + y) * (TILE_SIZE / 4),
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedNPC) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleDialogAdvance();
        }
        return;
      }

      let nextX = playerPos.x;
      let nextY = playerPos.y;

      if (e.key === "ArrowUp") nextY--;
      else if (e.key === "ArrowDown") nextY++;
      else if (e.key === "ArrowLeft") nextX--;
      else if (e.key === "ArrowRight") nextX++;
      else return;

      e.preventDefault();

      if (nextX >= 0 && nextX < mapData.width && nextY >= 0 && nextY < mapData.height) {
        const tile = mapData.tiles[nextY]?.[nextX];
        const npc = mapData.npcs.find(n => n.position.x === nextX && n.position.y === nextY);
        if (npc) {
          setSelectedNPC(npc);
          setDialogIndex(0);
          return;
        }

        if (tile && tile !== "water" && tile !== "mountain" && tile !== "lava") {
          setPlayerPos({ x: nextX, y: nextY });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos, selectedNPC, mapData, handleDialogAdvance]);

  const { x: isoPlayerX, y: isoPlayerY } = getIsoPos(playerPos.x, playerPos.y);
  const targetCamX = isoPlayerX;
  const targetCamY = isoPlayerY;

  const [camPos, setCamPos] = useState({ x: targetCamX, y: targetCamY });

  useEffect(() => {
    setCamPos({ x: targetCamX, y: targetCamY });
  }, [playerPos.x, playerPos.y, targetCamX, targetCamY, setCamPos]);

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
      }
    }
  }, [playerPos, mapData]);

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-950 rounded-2xl border-4 border-slate-900 shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/50"
      style={{ height: viewportHeight }}
      tabIndex={0}
    >
      <MapCanvas 
        mapData={mapData}
        tileSize={TILE_SIZE}
        playerPos={playerPos}
        isWideView={isWideView}
        viewScale={viewScale}
        getIsoPos={getIsoPos}
        onTileClick={handleTileClick}
      />

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
                {/* Character Sprite - Lifted up */}
                <div className="translate-y-[-32px] filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.5)]">
                  <NPCSprite type={npc.sprite} className="w-16 h-16" />
                </div>
                
                {/* Ground Shadow */}
                <div className="absolute bottom-2 w-12 h-5 bg-black/40 rounded-full blur-[6px] -z-10" />

                {/* Quest Indicator */}
                {npc.questId && (
                  <motion.div
                    animate={{ y: [-10, 0, -10] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`absolute -top-20 left-1/2 -translate-x-1/2 ${
                      (() => {
                        if (completedQuests.includes(npc.questId)) return "text-emerald-400 drop-shadow-[0_0_15px_#10B981]";
                        if (activeQuestId === npc.questId) return "text-amber-400 drop-shadow-[0_0_15px_#F59E0B]";
                        
                        const questData = allQuests.find(q => q.id === npc.questId);
                        if (questData && questData.class !== playerClass) return "text-slate-500 opacity-40";
                        
                        return "text-red-500 drop-shadow-[0_0_15px_#EF4444]";
                      })()
                    }`}
                  >
                    <ExclamationIndicator size={32} />
                  </motion.div>
                )}
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
             {/* Player Sprite */}
            <div className="relative z-10 scale-125 translate-y-[-36px] filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]">
               <InventorySprite
                 characterClass={playerClass}
                 rank={playerRank}
                 equippedWeapon={equippedWeapon}
                 equippedHat={equippedHat}
                 equippedArmor={equippedArmor}
                 equippedBoot={equippedBoot}
               />
            </div>

            {/* Ground Shadow */}
            <div className="absolute bottom-2 w-16 h-6 bg-amber-500/20 rounded-full blur-[8px] -z-10 animate-pulse" />
            <div className="absolute bottom-2 w-14 h-5 bg-black/60 rounded-full blur-[4px] -z-20" />
            
            {/* Soft Glow */}
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl -z-30" />
          </div>
        </motion.div>
      </motion.div>

      {/* Region Badge & Controls - Fixed UI Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-slate-950/40" />
      
      <div className="absolute top-6 right-6 pointer-events-none flex flex-col gap-3 items-end">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsWideView(!isWideView)}
          className="pointer-events-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 group transition-all hover:border-amber-500/40 hover:shadow-amber-500/10"
        >
          <div className="text-xl group-hover:rotate-12 transition-transform duration-300">
            {isWideView ? "🔎" : "🔍"}
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">Map View</span>
            <span className="text-sm font-bold text-white uppercase">{isWideView ? "Standard" : "Wide View"}</span>
          </div>
        </motion.button>
      </div>

      <div className="absolute top-6 left-6 pointer-events-none">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 px-5 py-3 rounded-2xl shadow-2xl"
        >
          <div className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] mb-1">Current Region</div>
          <div className="text-2xl font-black text-white flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif" }}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
            {mapData.name} <span className="text-slate-500 font-normal text-sm">Realm</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="px-6 py-2.5 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/10 flex gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest shadow-2xl">
          <div className="flex items-center gap-2"><span className="bg-slate-800 px-2 py-1 rounded border border-white/20 text-white">ARROWS</span> MOVE</div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2"><span className="bg-slate-800 px-2 py-1 rounded border border-white/20 text-white">ENTER</span> TALK</div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 font-black text-amber-400">QUESTS ACTIVE</div>
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-slate-500 text-center mb-4">
        Click or walk into NPCs to interact. Arrows to move, Enter to advance.
      </p>

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
              <div className="fantasy-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/50 border border-slate-700/50 shadow-inner overflow-hidden uppercase">
                    <NPCSprite type={selectedNPC.sprite} className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-200" style={{ fontFamily: "'Cinzel', serif" }}>
                      {selectedNPC.name}
                    </h3>
                    <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">NPC ({selectedNPC.sprite})</p>
                  </div>
                </div>

                <motion.p
                  key={dialogIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-slate-300 leading-relaxed mb-4 min-h-[48px]"
                >
                  {selectedNPC.dialog[dialogIndex]}
                </motion.p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {dialogIndex + 1} / {selectedNPC.dialog.length}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDialogAdvance}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      dialogIndex < selectedNPC.dialog.length - 1
                        ? "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
                        : "btn-fantasy"
                    }`}
                  >
                    {dialogIndex < selectedNPC.dialog.length - 1 
                      ? "Continue (Enter) ▶" 
                      : selectedNPC.questId 
                        ? (() => {
                            if (completedQuests.includes(selectedNPC.questId)) return "Close (Enter) ✕";
                            const questData = allQuests.find(q => q.id === selectedNPC.questId);
                            if (questData && questData.class !== playerClass) return "Wait (Enter) ...";
                            return "Accept Quest (Enter) ⚔️";
                          })()
                        : "Close (Enter) ✕"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
