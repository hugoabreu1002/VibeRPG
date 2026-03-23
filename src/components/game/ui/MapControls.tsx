import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { Character } from "../../../types/game";
import { getCurrentRegion, getAvailableRegions, getRegionProgress } from "../../../lib/region-utils";
import { audioManager } from "../../../lib/audio";

interface MapControlsProps {
  character: Character;
  currentRegion: string;
  onRegionChange: (regionId: string) => void;
}

export function MapControls({ character, currentRegion, onRegionChange }: MapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>(currentRegion);

  useEffect(() => {
    setSelectedRegion(currentRegion);
  }, [currentRegion]);

  const availableRegions = getAvailableRegions(character);
  const currentRegionData = getCurrentRegion(character);
  const currentProgress = getRegionProgress(character);

  const handleRegionSelect = (regionId: string) => {
    if (regionId !== currentRegion) {
      setSelectedRegion(regionId);
      onRegionChange(regionId);
      audioManager.playSfx("click");
    }
  };

  return (
    <div className="space-y-4">
      {/* Combined Map Header and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fantasy-card rounded-xl p-4"
      >
        {/* Current Map Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-amber-200" style={{ fontFamily: "'Cinzel', serif" }}>
              🗺️ {currentRegionData.name}
            </h3>
            <p className="text-sm text-slate-400">{currentRegionData.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-amber-500/60 uppercase tracking-widest font-bold">Region Progress</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 bg-slate-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentProgress.percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  />
                </div>
                <span className="text-sm text-slate-300 font-mono">
                  {currentProgress.current}/{currentProgress.total}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Selection Toggle */}
        <div className="border-t border-slate-700/30 pt-3">
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
              <span className="text-sm font-bold text-amber-200/80 uppercase tracking-wider">🗺️ Map Selection</span>
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                className="ml-auto text-slate-500"
              >
                ▶
              </motion.div>
            </button>
          </motion.div>
        </div>

        {/* Map List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pl-6 mt-3"
            >
              {availableRegions.map((region) => {
                const progress = getRegionProgress({ ...character, currentRegion: region.id });
                const isCurrent = region.id === currentRegion;
                const isUnlocked = region.id !== "Hub Town" || true; // Hub Town is always unlocked

                return (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`group cursor-pointer transition-all duration-300 ${
                      isCurrent 
                        ? "bg-amber-900/20 border-amber-500/30" 
                        : "bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50"
                    } rounded-lg border p-3`}
                    onClick={() => handleRegionSelect(region.id)}
                  >
                    {/* Map Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isCurrent ? "bg-amber-400" : "bg-slate-500"
                        }`} />
                        <span className={`font-medium text-sm ${
                          isCurrent ? "text-amber-200" : "text-slate-300"
                        }`}>
                          {region.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-mono">
                          {progress.current}/{progress.total}
                        </span>
                        {isCurrent && (
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Progress</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.percentage}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            isCurrent 
                              ? "bg-gradient-to-r from-amber-500 to-amber-400" 
                              : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Region Description */}
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {region.description}
                    </p>

                    {/* Unlock Requirements */}
                    {region.unlockedBy.length > 0 && !isUnlocked && (
                      <div className="mt-2 p-2 bg-slate-900/50 rounded border border-slate-700/30">
                        <span className="text-xs text-slate-500">Unlocks when:</span>
                        <ul className="text-xs text-slate-400 mt-1 space-y-1">
                          {region.unlockedBy.map((questId) => {
                            const isCompleted = character.completedQuests.includes(questId);
                            return (
                              <li key={questId} className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  isCompleted ? "bg-emerald-500" : "bg-slate-600"
                                }`} />
                                <span>{isCompleted ? "✓" : "○"} Complete {questId}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Map Status */}
        <div className="mt-4 p-3 bg-slate-900/40 border border-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Current Map</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded border border-amber-500/30">
              {currentRegionData.name}
            </span>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            {currentRegionData.description}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Available Quests: {getRegionProgress(character).total}</span>
            <span>Completed: {getRegionProgress(character).current}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}