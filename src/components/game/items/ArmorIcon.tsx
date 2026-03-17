import { motion } from "framer-motion";

interface ArmorIconProps {
  armorId: string;
  size?: string;
  large?: boolean;
}

export function ArmorIcon({ armorId, size = "w-6 h-6", large = false }: ArmorIconProps) {
  if (large) {
    return (
      <svg viewBox="0 0 48 48" className="w-24 h-24">
        <path d="M14 12 L24 6 L34 12 L34 38 L14 38 Z" fill="#9370DB"/>
        <path d="M18 16 L24 12 L30 16 L30 34 L18 34 Z" fill="#4B0082"/>
        <motion.rect 
          x="20" y="20" width="8" height="4" fill="#FFD700" 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className={size}>
      <path d="M5 4 L8 2 L11 4 L11 13 L5 13 Z" fill="#9370DB"/>
    </svg>
  );
}
