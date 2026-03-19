import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Quest, QuestMapData, NPC, TileType } from "../../../types/game";

const TILE_SIZE = 32;

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

const NPC_SPRITES: Record<string, { emoji: string; color: string }> = {
  elder:    { emoji: "👴", color: "#F59E0B" },
  villager: { emoji: "👤", color: "#6B7280" },
  guard:    { emoji: "💂", color: "#3B82F6" },
  merchant: { emoji: "🧑‍🌾", color: "#22C55E" },
  wizard:   { emoji: "🧙", color: "#8B5CF6" },
  knight:   { emoji: "🛡️", color: "#EF4444" },
  priest:   { emoji: "⛪", color: "#F5F5F5" },
  monster:  { emoji: "👹", color: "#DC2626" },
  fairy:    { emoji: "🧚", color: "#EC4899" },
  questgiver: { emoji: "❗", color: "#F59E0B" },
};

interface QuestMapProps {
  quest?: Quest;
  mapData: QuestMapData;
  onNPCInteract: (npc: NPC) => void;
  onBack: () => void;
}

export function QuestMap({ quest, mapData, onNPCInteract, onBack }: QuestMapProps) {
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [playerPos, setPlayerPos] = useState(mapData.playerStart);

  const handleTileClick = (x: number, y: number) => {
    // Check if NPC is at this position
    const npc = mapData.npcs.find(n => n.position.x === x && n.position.y === y);
    if (npc) {
      setSelectedNPC(npc);
      setDialogIndex(0);
      return;
    }

    // Move player to adjacent tile if valid (path, grass, town)
    const dx = Math.abs(x - playerPos.x);
    const dy = Math.abs(y - playerPos.y);
    if (dx + dy <= 2) {
      const tile = mapData.tiles[y]?.[x];
      if (tile && tile !== "water" && tile !== "mountain" && tile !== "lava") {
        setPlayerPos({ x, y });
      }
    }
  };

  const handleDialogAdvance = () => {
    if (!selectedNPC) return;
    if (dialogIndex < selectedNPC.dialog.length - 1) {
      setDialogIndex(dialogIndex + 1);
    } else {
      // Last dialog line — trigger quest interaction
      onNPCInteract(selectedNPC);
      setSelectedNPC(null);
      setDialogIndex(0);
    }
  };

  const mapWidth = mapData.width * TILE_SIZE;
  const mapHeight = mapData.height * TILE_SIZE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fantasy-card rounded-xl p-5"
    >
      {/* Map Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gold" style={{ fontFamily: "'Cinzel', serif" }}>
            🗺️ {mapData.name}
          </h2>
          {quest && <p className="text-xs text-slate-400 mt-1">📌 {quest.title}</p>}
        </div>
        {!mapData.name.includes("Hub") && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-amber-300 transition-colors px-3 py-1.5 border border-slate-700/30 rounded-lg"
          >
            ← Back
          </motion.button>
        )}
      </div>

      <p className="text-sm text-slate-300 mb-4">{quest ? quest.description : "Explore the world and talk to NPCs to find new adventures."}</p>

      {/* Map Grid */}
      <div className="flex justify-center mb-4">
        <div
          className="relative rounded-xl overflow-hidden border-2 border-slate-700/50 shadow-xl"
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
          {mapData.npcs.map((npc) => {
            const spriteInfo = NPC_SPRITES[npc.sprite] || NPC_SPRITES.villager;
            return (
              <motion.div
                key={npc.id}
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                onClick={() => { setSelectedNPC(npc); setDialogIndex(0); }}
                className="absolute cursor-pointer z-10 flex items-center justify-center"
                style={{
                  left: npc.position.x * TILE_SIZE,
                  top: npc.position.y * TILE_SIZE,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                }}
                title={npc.name}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-lg border relative"
                  style={{
                    backgroundColor: `${spriteInfo.color}22`,
                    borderColor: `${spriteInfo.color}66`,
                    boxShadow: `0 0 8px ${spriteInfo.color}44`,
                  }}
                >
                  {spriteInfo.emoji}
                  {npc.questId && (
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute -top-4 text-xs font-bold text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]"
                    >
                      !
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Player marker */}
          <motion.div
            animate={{
              left: playerPos.x * TILE_SIZE,
              top: playerPos.y * TILE_SIZE,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute z-20 flex items-center justify-center"
            style={{ width: TILE_SIZE, height: TILE_SIZE }}
          >
            <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-amber-300 flex items-center justify-center text-xs shadow-lg shadow-amber-500/40">
              🧑
            </div>
          </motion.div>
        </div>
      </div>

      {/* NPC Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mapData.npcs.map((npc) => {
          const spriteInfo = NPC_SPRITES[npc.sprite] || NPC_SPRITES.villager;
          return (
            <motion.button
              key={npc.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => { setSelectedNPC(npc); setDialogIndex(0); }}
              className="text-xs px-2 py-1 rounded-lg border transition-colors flex items-center gap-1"
              style={{
                borderColor: `${spriteInfo.color}44`,
                backgroundColor: `${spriteInfo.color}11`,
                color: spriteInfo.color,
              }}
            >
              <span>{spriteInfo.emoji}</span>
              <span>{npc.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-xs text-slate-500 text-center">
        Click on NPCs to interact. Tap tiles to move your character.
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
                {/* NPC Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2"
                    style={{
                      borderColor: (NPC_SPRITES[selectedNPC.sprite] || NPC_SPRITES.villager).color,
                      backgroundColor: `${(NPC_SPRITES[selectedNPC.sprite] || NPC_SPRITES.villager).color}22`,
                    }}
                  >
                    {(NPC_SPRITES[selectedNPC.sprite] || NPC_SPRITES.villager).emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-200" style={{ fontFamily: "'Cinzel', serif" }}>
                      {selectedNPC.name}
                    </h3>
                  </div>
                </div>

                {/* Dialog Text */}
                <motion.p
                  key={dialogIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-slate-300 leading-relaxed mb-4 min-h-[48px]"
                >
                  {selectedNPC.dialog[dialogIndex]}
                </motion.p>

                {/* Action */}
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
                    {dialogIndex < selectedNPC.dialog.length - 1 ? "Continue ▶" : "Accept Quest ⚔️"}
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
