import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Quest, QuestMapData, NPC, TileType, InventoryItem, CharacterClass } from "../../../types/game";
import { NPCSprite } from "../world/NPCSprites";
import { InventorySprite } from "../character/InventorySprite";
import { audioManager } from "../../../lib/audio";

const TILE_SIZE = 64;

const TILE_COLORS: Record<TileType, { bg: string; border: string; icon?: string }> = {
  grass:    { bg: "#2D5016", border: "#1A3409", icon: undefined },
  path:     { bg: "#92720A", border: "#6B5208", icon: undefined },
  water:    { bg: "#1E40AF", border: "#1E3A8A", icon: "~" },
  mountain: { bg: "#57534E", border: "#44403C", icon: "▲" },
  forest:   { bg: "#14532D", border: "#0D3B1F", icon: "🌲" },
  town:     { bg: "#78350F", border: "#5C2A0A", icon: undefined },
  cave:     { bg: "#292524", border: "#1C1917", icon: undefined },
  lava:     { bg: "#9A1B0A", border: "#7C1508", icon: "🔥" },
};

interface QuestMapProps {
  quest?: Quest;
  mapData: QuestMapData;
  playerClass?: CharacterClass;
  inventory?: InventoryItem[];
  onNPCInteract: (npc: NPC) => void;
  onBack: () => void;
}

export function QuestMap({ quest, mapData, playerClass = "warrior", inventory = [], onNPCInteract, onBack }: QuestMapProps) {
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [playerPos, setPlayerPos] = useState(mapData.playerStart);

  const equippedWeapon = inventory.find(i => i.type === "weapon" && i.equipped);
  const equippedHat = inventory.find(i => i.type === "hat" && i.equipped);
  const equippedArmor = inventory.find(i => i.type === "armor" && i.equipped);
  const equippedBoot = inventory.find(i => i.type === "boot" && i.equipped);

  const handleDialogAdvance = useCallback(() => {
    if (!selectedNPC) return;

    if (dialogIndex < selectedNPC.dialog.length - 1) {
      setDialogIndex(dialogIndex + 1);
      audioManager.playSfx("click");
    } else {
      // Last dialog line — trigger quest interaction
      onNPCInteract(selectedNPC);
      setSelectedNPC(null);
      setDialogIndex(0);
      audioManager.playSfx("questAccept");
    }
  }, [selectedNPC, dialogIndex, onNPCInteract]);

  const mapWidth = mapData.width * TILE_SIZE;
  const mapHeight = mapData.height * TILE_SIZE;

  // Keyboard movement and dialog interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If a dialog is open, 'Enter' advances it
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
      else if (e.key === "Enter") {
        return;
      } else return;

      // Prevent scrolling the page
      e.preventDefault();

      // Check boundaries
      if (nextX >= 0 && nextX < mapData.width && nextY >= 0 && nextY < mapData.height) {
        const tile = mapData.tiles[nextY]?.[nextX];
        
        // Check for NPC at the new position
        const npc = mapData.npcs.find(n => n.position.x === nextX && n.position.y === nextY);
        if (npc) {
          setSelectedNPC(npc);
          setDialogIndex(0);
          return;
        }

        // Collision check for terrain
        if (tile && tile !== "water" && tile !== "mountain" && tile !== "lava") {
          setPlayerPos({ x: nextX, y: nextY });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos, selectedNPC, mapData, handleDialogAdvance]);

  const handleTileClick = (x: number, y: number) => {
    // Check if NPC is at this position
    const npc = mapData.npcs.find(n => n.position.x === x && n.position.y === y);
    if (npc) {
      setSelectedNPC(npc);
      setDialogIndex(0);
      return;
    }

    // Move player to adjacent tile if valid
    const dx = Math.abs(x - playerPos.x);
    const dy = Math.abs(y - playerPos.y);
    if (dx + dy <= 2) {
      const tile = mapData.tiles[y]?.[x];
      if (tile && tile !== "water" && tile !== "mountain" && tile !== "lava") {
        setPlayerPos({ x, y });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fantasy-card rounded-xl p-5"
    >
      {/* Map Grid */}
      <div className="flex justify-center mb-6">
        <div
          className="relative rounded-xl overflow-hidden border-2 border-slate-700/50 shadow-xl shrink-0"
          style={{ width: mapWidth, height: mapHeight }}
        >
          {/* Render tiles */}
          {mapData.tiles.map((row, y) =>
            row.map((tile, x) => {
              const tileStyle = TILE_COLORS[tile];
              return (
                <div
                  key={`${x}-${y}`}
                  onClick={() => handleTileClick(x, y)}
                  className="absolute cursor-pointer transition-all hover:brightness-125"
                  style={{
                    left: x * TILE_SIZE,
                    top: y * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    backgroundColor: tileStyle.bg,
                    borderRight: `1px solid ${tileStyle.border}`,
                    borderBottom: `1px solid ${tileStyle.border}`,
                  }}
                >
                  {tile === "grass" && (x + y) % 3 === 0 && (
                    <span className="text-[8px] opacity-40 flex items-center justify-center h-full">🌿</span>
                  )}
                  {tile === "forest" && (
                    <span className="text-[10px] opacity-60 flex items-center justify-center h-full">🌲</span>
                  )}
                  {tile === "water" && (
                    <span className="text-[10px] opacity-40 flex items-center justify-center h-full">~</span>
                  )}
                  {tile === "mountain" && (
                    <span className="text-[10px] opacity-50 flex items-center justify-center h-full">⛰️</span>
                  )}
                  {tile === "town" && (
                    <span className="text-[9px] opacity-50 flex items-center justify-center h-full">🏠</span>
                  )}
                  {tile === "cave" && (
                    <span className="text-[10px] opacity-30 flex items-center justify-center h-full">🕳️</span>
                  )}
                </div>
              );
            })
          )}

          {/* Render NPCs */}
          {mapData.npcs.map((npc) => (
            <motion.div
              key={npc.id}
              onClick={() => { setSelectedNPC(npc); setDialogIndex(0); }}
              className="absolute cursor-pointer z-10 flex items-center justify-center p-2"
              style={{
                left: npc.position.x * TILE_SIZE,
                top: npc.position.y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
              title={npc.name}
            >
              <div className="relative group flex flex-col items-center">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/40 rounded-[50%] blur-[3px] scale-x-150 transition-transform group-hover:scale-x-175" />
                
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="relative flex items-center justify-center w-full h-full filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)]"
                >
                  <NPCSprite type={npc.sprite} className="w-12 h-12" />
                  
                  {npc.questId && (
                    <motion.div
                      animate={{ y: [-6, 6, -6] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute -top-10 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-yellow-600 drop-shadow-[0_0_10px_#F59E0B]"
                    >
                      !
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Player marker */}
          <motion.div
            animate={{
              left: playerPos.x * TILE_SIZE,
              top: playerPos.y * TILE_SIZE,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute z-20 flex items-center justify-center p-2"
            style={{ width: TILE_SIZE, height: TILE_SIZE }}
          >
            <div className="relative group flex flex-col items-center">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-500/40 rounded-[50%] blur-[4px] scale-x-150 animate-pulse" />
              
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="relative flex items-center justify-center w-full h-full filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              >
                <div className="relative pt-6">
                   <InventorySprite
                     characterClass={playerClass}
                     equippedWeapon={equippedWeapon}
                     equippedHat={equippedHat}
                     equippedArmor={equippedArmor}
                     equippedBoot={equippedBoot}
                   />
                </div>
              </motion.div>
            </div>
          </motion.div>
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
                    {dialogIndex < selectedNPC.dialog.length - 1 ? "Continue (Enter) ▶" : "Accept Quest (Enter) ⚔️"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
