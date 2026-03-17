import { motion } from "framer-motion";

interface WeaponIconProps {
  weaponId: string;
  size?: string;
  large?: boolean;
}

export function WeaponIcon({ weaponId, size = "w-6 h-6", large = false }: WeaponIconProps) {
  if (weaponId.includes("sword")) {
    if (large) {
      return (
        <svg viewBox="0 0 32 32" className="w-14 h-14">
          <rect x="14" y="4" width="4" height="20" fill="#C0C0C0"/>
          <rect x="10" y="20" width="12" height="4" fill="#8B4513"/>
          <rect x="12" y="24" width="8" height="6" fill="#8B4513"/>
          <rect x="14" y="6" width="4" height="4" fill="#E8E8E8"/>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 16 16" className={size}>
        <rect x="7" y="2" width="2" height="10" fill="#C0C0C0"/>
        <rect x="5" y="10" width="6" height="2" fill="#8B4513"/>
        <rect x="6" y="12" width="4" height="3" fill="#8B4513"/>
      </svg>
    );
  } else if (weaponId.includes("mace")) {
    if (large) {
      return (
        <svg viewBox="0 0 32 32" className="w-14 h-14">
          <rect x="14" y="12" width="4" height="18" fill="#8B4513"/>
          <circle cx="16" cy="8" r="8" fill="#696969"/>
          <circle cx="12" cy="4" r="2" fill="#404040"/>
          <circle cx="20" cy="4" r="2" fill="#404040"/>
          <circle cx="10" cy="8" r="2" fill="#404040"/>
          <circle cx="22" cy="8" r="2" fill="#404040"/>
          <circle cx="16" cy="2" r="2" fill="#404040"/>
          <circle cx="14" cy="6" r="2" fill="#808080"/>
          <circle cx="18" cy="6" r="2" fill="#808080"/>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 16 16" className={size}>
        <rect x="7" y="6" width="2" height="8" fill="#8B4513"/>
        <circle cx="8" cy="4" r="4" fill="#696969"/>
        <circle cx="6" cy="2" r="1" fill="#404040"/>
        <circle cx="10" cy="2" r="1" fill="#404040"/>
        <circle cx="5" cy="4" r="1" fill="#404040"/>
        <circle cx="11" cy="4" r="1" fill="#404040"/>
        <circle cx="8" cy="1" r="1" fill="#404040"/>
      </svg>
    );
  } else {
    if (large) {
      return (
        <svg viewBox="0 0 32 32" className="w-14 h-14">
          <rect x="14" y="4" width="4" height="24" fill="#8B4513"/>
          <circle cx="16" cy="4" r="4" fill="#00CED1"/>
          <circle cx="16" cy="4" r="2" fill="#FFFFFF"/>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 16 16" className={size}>
        <rect x="7" y="2" width="2" height="12" fill="#8B4513"/>
        <circle cx="8" cy="2" r="2" fill="#00CED1"/>
      </svg>
    );
  }
}
