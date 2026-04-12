import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { Character } from "../../../types/game";
import { getCurrentRegion, getAvailableRegions, getRegionProgress } from "../../../lib/region-utils";
import { getQuestMap } from "../../../lib/map-data";
import { audioManager } from "../../../lib/audio";

interface MapSelectionProps {
  character: Character;
  currentRegion: string;
  onRegionChange: (regionId: string) => void;
}

const MAP_TYPE_META = {
  town:    { label: "Town",    icon: "🏙️", color: "amber",   desc: "Safe hub — no monsters" },
  field:   { label: "Field",   icon: "⚔️", color: "emerald", desc: "Open combat zone" },
  dungeon: { label: "Dungeon", icon: "💀", color: "violet",  desc: "Dangerous interior" },
} as const;

const colorMap = {
  amber:   { badge: "bg-amber-500/20 text-amber-300 border-amber-500/30", dot: "bg-amber-400", bar: "from-amber-500 to-amber-400", card: "bg-amber-900/20 border-amber-500/30", section: "text-amber-300/70" },
  emerald: { badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400", bar: "from-emerald-500 to-emerald-400", card: "bg-emerald-900/20 border-emerald-500/30", section: "text-emerald-300/70" },
  violet:  { badge: "bg-violet-500/20 text-violet-300 border-violet-500/30", dot: "bg-violet-400", bar: "from-violet-500 to-violet-400", card: "bg-violet-900/20 border-violet-500/30", section: "text-violet-300/70" },
};

function getMapType(regionId: string): "town" | "field" | "dungeon" {
  const map = getQuestMap(regionId);
  return map?.mapType ?? "field";
}

export function MapSelection({ character, currentRegion, onRegionChange }: MapSelectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>(currentRegion);

  useEffect(() => {
    setSelectedRegion(currentRegion);
  }, [currentRegion]);

  const availableRegions = getAvailableRegions(character);
  const currentRegionData = getCurrentRegion(character);
  const currentMapType = getMapType(currentRegion);
  const currentMeta = MAP_TYPE_META[currentMapType];
  const currentColors = colorMap[currentMeta.color];

  const handleRegionSelect = (regionId: string) => {
    if (regionId !== currentRegion) {
      setSelectedRegion(regionId);
      onRegionChange(regionId);
      audioManager.playSfx("click");
    }
  };

  // Group regions by map type
  const grouped = {
    town:    availableRegions.filter(r => getMapType(r.id) === "town"),
    field:   availableRegions.filter(r => getMapType(r.id) === "field"),
    dungeon: availableRegions.filter(r => getMapType(r.id) === "dungeon"),
  };

  return (
    <div className="space-y-3">
      {/* Travel Header with Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 w-full text-left"
        >
          <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50" />
          <span className="text-sm font-bold text-amber-200/80 uppercase tracking-wider">🗺️ Teleport</span>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            className="ml-auto text-slate-500"
          >
            ▶
          </motion.div>
        </button>
      </motion.div>

      {/* Map List — grouped by type */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pl-2"
          >
            {(["town", "field", "dungeon"] as const).map(type => {
              const regions = grouped[type];
              if (regions.length === 0) return null;
              const meta = MAP_TYPE_META[type];
              const colors = colorMap[meta.color];

              return (
                <div key={type} className="space-y-1.5">
                  {/* Section header */}
                  <div className={`flex items-center gap-2 px-1 mb-2`}>
                    <span className="text-base leading-none">{meta.icon}</span>
                    <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${colors.section}`}>
                      {meta.label}s
                    </span>
                    <div className="flex-1 h-px bg-slate-700/40" />
                    <span className="text-[9px] text-slate-600">{meta.desc}</span>
                  </div>

                  {regions.map((region) => {
                    const progress = getRegionProgress({ ...character, currentRegion: region.id });
                    const isCurrent = region.id === currentRegion;

                    return (
                      <motion.div
                        key={region.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`group cursor-pointer transition-all duration-300 ml-1 ${
                          isCurrent
                            ? `${colors.card} border`
                            : "bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50 border"
                        } rounded-lg p-2.5`}
                        onClick={() => handleRegionSelect(region.id)}
                      >
                        {/* Map Header */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isCurrent ? colors.dot : "bg-slate-500"} ${isCurrent ? "animate-pulse" : ""}`} />
                            <span className={`font-semibold text-sm ${isCurrent ? "text-white" : "text-slate-300"}`}>
                              {region.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border ${colors.badge}`}>
                              {meta.icon} {meta.label}
                            </span>
                            {progress.total > 0 && (
                              <span className="text-xs text-slate-500 font-mono">
                                {progress.current}/{progress.total}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {progress.total > 0 && (
                          <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden mb-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress.percentage}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className={`h-full rounded-full bg-gradient-to-r ${isCurrent ? colors.bar : "from-slate-500 to-slate-400"}`}
                            />
                          </div>
                        )}

                        {/* Region Description */}
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          {region.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Region Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-3 ${currentColors.card}`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500 uppercase tracking-widest">Current Location</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] px-1.5 py-0.5 rounded border ${currentColors.badge}`}>
              {currentMeta.icon} {currentMeta.label}
            </span>
            <span className={`text-xs font-bold ${currentColors.section}`}>
              {currentRegionData.name}
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-400 leading-relaxed">
          {currentRegionData.description}
        </div>
        {getRegionProgress(character).total > 0 && (
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Quests Available: {getRegionProgress(character).total}</span>
            <span>Completed: {getRegionProgress(character).current}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
