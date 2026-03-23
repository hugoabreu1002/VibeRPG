import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CelebrationProps {
  type: "quest-complete" | "level-up" | "item-obtained" | "first-victory";
  title: string;
  subtitle?: string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

const CONFETTI_COUNT = 30;

export function CelebrationOverlay({ 
  type, 
  title, 
  subtitle, 
  onDismiss,
  autoDismissMs = 4000 
}: CelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    // Generate confetti particles
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
    const newConfetti = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    }));
    setConfetti(newConfetti);

    // Auto dismiss
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [onDismiss, autoDismissMs]);

  const icons: Record<string, string> = {
    "quest-complete": "🏆",
    "level-up": "⬆️",
    "item-obtained": "🎁",
    "first-victory": "⚔️",
  };

  const gradients: Record<string, string> = {
    "quest-complete": "from-amber-500/20 to-yellow-600/20",
    "level-up": "from-emerald-500/20 to-green-600/20",
    "item-obtained": "from-purple-500/20 to-pink-600/20",
    "first-victory": "from-red-500/20 to-orange-600/20",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
        onClick={onDismiss}
      >
        {/* Background blur */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Confetti */}
        {confetti.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: "-10px",
              backgroundColor: particle.color,
            }}
            initial={{ y: -10, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 10,
              opacity: [1, 1, 0],
              rotate: 720,
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Main celebration card */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`relative fantasy-card rounded-2xl p-8 max-w-sm mx-4 text-center bg-gradient-to-br ${gradients[type]} border-2 border-amber-500/30 shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glowing ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-amber-400/50"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Icon */}
          <motion.div
            className="text-6xl mb-4"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {icons[type]}
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-amber-200 mb-2"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {title}
          </motion.h2>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-slate-300"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Sparkle effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 0.5 + i * 0.2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}

          {/* Dismiss hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest"
          >
            Click anywhere to continue
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Quick celebration toast (less intrusive)
interface QuickToastProps {
  message: string;
  icon: string;
  onDismiss: () => void;
}

export function QuickToast({ message, icon, onDismiss }: QuickToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -50, x: "-50%" }}
      className="fixed top-20 left-1/2 z-[100] bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-amber-200">{message}</span>
    </motion.div>
  );
}