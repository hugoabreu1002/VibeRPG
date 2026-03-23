import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type TutorialStep = 
  | "welcome" 
  | "click-npc" 
  | "read-dialog" 
  | "accept-quest" 
  | "go-to-quests" 
  | "embark-quest" 
  | "choose-path" 
  | "complete";

interface OnboardingTutorialProps {
  currentStep: TutorialStep;
  npcPosition?: { x: number; y: number };
  onComplete: () => void;
  onSkip: () => void;
}

const STEP_CONTENT: Record<TutorialStep, { title: string; description: string; icon: string; highlight?: string }> = {
  welcome: {
    title: "Welcome, Adventurer!",
    description: "Your journey begins now. Let me show you how to play!",
    icon: "⚔️",
  },
  "click-npc": {
    title: "Talk to the Quest Giver",
    description: "Click on the NPC with the red exclamation mark (!) to start your first quest!",
    icon: "👆",
    highlight: "npc",
  },
  "read-dialog": {
    title: "Read the Story",
    description: "The NPC will tell you about the quest. Click 'Continue' or press Enter to advance.",
    icon: "📖",
  },
  "accept-quest": {
    title: "Accept the Quest",
    description: "Click 'Accept Quest' to begin your adventure!",
    icon: "✅",
  },
  "go-to-quests": {
    title: "Open Your Quest Log",
    description: "Click the 'Quests' tab in the sidebar to see your active quest.",
    icon: "📋",
    highlight: "quests-tab",
  },
  "embark-quest": {
    title: "Start the Quest",
    description: "Click 'Embark' to begin the quest and enter battle!",
    icon: "🚀",
  },
  "choose-path": {
    title: "Choose Your Path",
    description: "Select a battle option to fight the enemy. Each path uses different stats!",
    icon: "⚔️",
  },
  complete: {
    title: "You're Ready!",
    description: "Complete quests to earn XP, gold, and level up. Good luck, hero!",
    icon: "🎉",
  },
};

export function OnboardingTutorial({ 
  currentStep, 
  npcPosition,
  onComplete, 
  onSkip 
}: OnboardingTutorialProps) {
  const [isVisible, setIsVisible] = useState(true);
  const content = STEP_CONTENT[currentStep];

  // Auto-dismiss complete step after 3 seconds
  useEffect(() => {
    if (currentStep === "complete") {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  if (!isVisible || currentStep === "complete") {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-8 right-8 z-50 pointer-events-auto"
        >
        {/* Highlight overlay for specific elements */}
        {content.highlight === "npc" && npcPosition && (
          <motion.div
            className="fixed z-40 pointer-events-none"
            style={{
              left: npcPosition.x - 40,
              top: npcPosition.y - 80,
              width: 80,
              height: 80,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-full h-full rounded-full border-4 border-amber-400 bg-amber-400/20" />
            <motion.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-amber-400 text-2xl"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              👇
            </motion.div>
          </motion.div>
        )}

        {content.highlight === "quests-tab" && (
          <motion.div
            className="fixed z-40 pointer-events-none"
            style={{
              left: 20,
              top: 200,
              width: 120,
              height: 50,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-full h-full rounded-lg border-4 border-amber-400 bg-amber-400/20" />
            <motion.div
              className="absolute -right-8 top-1/2 -translate-y-1/2 text-amber-400 text-2xl"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              👈
            </motion.div>
          </motion.div>
        )}

        {/* Tutorial card */}
        <div className="fantasy-card rounded-2xl p-5 max-w-md shadow-2xl border-2 border-amber-500/30">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-4">
            {Object.keys(STEP_CONTENT).filter(s => s !== "complete").map((step, idx) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all ${
                  Object.keys(STEP_CONTENT).indexOf(currentStep) >= idx
                    ? "bg-amber-400 scale-125"
                    : "bg-slate-600"
                }`}
              />
            ))}
          </div>

          <div className="flex items-start gap-4">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 0.5 }}
              className="text-4xl flex-shrink-0"
            >
              {content.icon}
            </motion.div>
            <div className="flex-1">
              <h3 
                className="text-lg font-bold text-amber-200 mb-1"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {content.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {content.description}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700/50">
            <button
              onClick={onSkip}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Skip Tutorial
            </button>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">
              Step {Object.keys(STEP_CONTENT).indexOf(currentStep) + 1} of {Object.keys(STEP_CONTENT).length}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Utility to check if tutorial should be shown
export function shouldShowTutorial(): boolean {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem("viberpg-tutorial-complete");
}

// Mark tutorial as complete
export function markTutorialComplete(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("viberpg-tutorial-complete", "true");
  }
}

// Reset tutorial (for testing)
export function resetTutorial(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("viberpg-tutorial-complete");
  }
}