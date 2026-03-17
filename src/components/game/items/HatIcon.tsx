import { motion } from "framer-motion";

interface HatIconProps {
  hatId: string;
  size?: string;
  large?: boolean;
}

export function HatIcon({ hatId, size = "w-6 h-6", large = false }: HatIconProps) {
  if (large) {
    return (
      <svg viewBox="0 0 48 48" className="w-24 h-24">
        {hatId.includes("warrior") ? (
          // Warrior Helmet
          <g>
            <path d="M12 18 Q24 6 36 18 L36 30 Q24 36 12 30 Z" fill="#A9A9A9" />
            <path d="M15 21 L33 21 L33 27 L15 27 Z" fill="#696969" />
            <rect x="22.5" y="21" width="3" height="9" fill="#D3D3D3" />
            <circle cx="24" cy="24" r="2.5" fill="#FFD700" />
            <motion.circle 
              cx="24" cy="24" r="2.5" fill="#FFD700"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </g>
        ) : hatId.includes("priest") ? (
          // Priest Hat
          <g>
            <path d="M12 30 Q24 6 36 30 Z" fill="#FFFFFF" stroke="#FFD700" strokeWidth="3" />
            <rect x="22.5" y="15" width="3" height="12" fill="#FFD700" />
            <rect x="18" y="19" width="12" height="3" fill="#FFD700" />
            <motion.circle 
              cx="24" cy="9" r="6" fill="none" stroke="#FFD700" strokeWidth="2"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </g>
        ) : (
          // Mage Hat (default)
          <g>
            <rect x="9" y="9" width="30" height="12" fill="#9370DB" rx="3" />
            <rect x="12" y="6" width="24" height="6" fill="#4B0082" rx="2" />
            <rect x="18" y="18" width="12" height="24" fill="#FFDDC1" rx="2" />
            <rect x="21" y="21" width="6" height="6" fill="#2F1B0C" />
            <motion.rect 
              x="18" y="18" width="12" height="24" fill="none" stroke="#4B0082" strokeWidth="2"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </g>
        )}
      </svg>
    );
  }

  // Small size
  return (
    <svg viewBox="0 0 16 16" className={size}>
      {hatId.includes("warrior") ? (
        // Warrior Helmet
        <g>
          <path d="M4 6 Q8 2 12 6 L12 10 Q8 12 4 10 Z" fill="#A9A9A9" />
          <path d="M5 7 L11 7 L11 9 L5 9 Z" fill="#696969" />
          <rect x="7.5" y="7" width="1" height="3" fill="#D3D3D3" />
          <circle cx="8" cy="8" r="0.5" fill="#FFD700" />
        </g>
      ) : hatId.includes("priest") ? (
        // Priest Hat
        <g>
          <path d="M4 10 Q8 2 12 10 Z" fill="#FFFFFF" stroke="#FFD700" strokeWidth="1" />
          <rect x="7.5" y="5" width="1" height="4" fill="#FFD700" />
          <rect x="6" y="6.5" width="4" height="1" fill="#FFD700" />
          <circle cx="8" cy="3" r="1.5" fill="none" stroke="#FFD700" strokeWidth="0.5" />
        </g>
      ) : (
        // Mage Hat
        <g>
          <rect x="3" y="3" width="10" height="4" fill="#9370DB" rx="1" />
          <rect x="4" y="2" width="8" height="2" fill="#4B0082" rx="1" />
          <rect x="6" y="6" width="4" height="8" fill="#FFDDC1" rx="1" />
          <rect x="7" y="7" width="2" height="2" fill="#2F1B0C" />
        </g>
      )}
    </svg>
  );
}
