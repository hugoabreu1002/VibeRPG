import { motion } from "framer-motion";

interface BootIconProps {
  bootId: string;
  size?: string;
  large?: boolean;
}

export function BootIcon({ bootId, size = "w-6 h-6", large = false }: BootIconProps) {
  if (large) {
    return (
      <svg viewBox="0 0 48 48" className="w-24 h-24">
        <g>
          <rect x="10" y="26" width="10" height="16" fill="#8B4513" rx="2" />
          <rect x="28" y="26" width="10" height="16" fill="#8B4513" rx="2" />
          <rect x="8" y="38" width="14" height="4" fill="#654321" rx="1" />
          <rect x="26" y="38" width="14" height="4" fill="#654321" rx="1" />
          <motion.circle 
            cx="24" cy="20" r="4" fill="#FFD700"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </g>
      </svg>
    );
  }

  // Small size
  return (
    <svg viewBox="0 0 16 16" className={size}>
      <g>
        <rect x="4" y="9" width="3" height="5" fill="#8B4513" rx="1" />
        <rect x="9" y="9" width="3" height="5" fill="#8B4513" rx="1" />
      </g>
    </svg>
  );
}
