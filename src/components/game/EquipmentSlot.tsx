import { motion } from "framer-motion";
import type { InventoryItem } from "../../types/game";

// Weapon icon component based on weapon type
function WeaponIcon({ weaponId, size = "w-6 h-6" }: { weaponId: string; size?: string }) {
  if (weaponId.includes("sword")) {
    return (
      <svg viewBox="0 0 16 16" className={size}>
        <rect x="7" y="2" width="2" height="10" fill="#C0C0C0"/>
        <rect x="5" y="10" width="6" height="2" fill="#8B4513"/>
        <rect x="6" y="12" width="4" height="3" fill="#8B4513"/>
      </svg>
    );
  } else if (weaponId.includes("mace")) {
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
    return (
      <svg viewBox="0 0 16 16" className={size}>
        <rect x="7" y="2" width="2" height="12" fill="#8B4513"/>
        <circle cx="8" cy="2" r="2" fill="#00CED1"/>
      </svg>
    );
  }
}

function getWeaponIconLarge(item: InventoryItem) {
  if (item.id.includes("sword")) {
    return (
      <svg viewBox="0 0 32 32" className="w-14 h-14">
        <rect x="14" y="4" width="4" height="20" fill="#C0C0C0"/>
        <rect x="10" y="20" width="12" height="4" fill="#8B4513"/>
        <rect x="12" y="24" width="8" height="6" fill="#8B4513"/>
        <rect x="14" y="6" width="4" height="4" fill="#E8E8E8"/>
      </svg>
    );
  } else if (item.id.includes("mace")) {
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
  } else {
    return (
      <svg viewBox="0 0 32 32" className="w-14 h-14">
        <rect x="14" y="4" width="4" height="24" fill="#8B4513"/>
        <circle cx="16" cy="4" r="4" fill="#00CED1"/>
        <circle cx="16" cy="4" r="2" fill="#FFFFFF"/>
      </svg>
    );
  }
}

interface EquipmentSlotProps { 
  type: "weapon" | "armor" | "accessory"; 
  item?: InventoryItem; 
  items: InventoryItem[];
  onSelect: (item: InventoryItem) => void;
}

export function EquipmentSlot({ type, item, items, onSelect }: EquipmentSlotProps) {
  const getColors = () => {
    switch (type) {
      case "weapon": return { border: "amber-500", from: "amber-900", to: "slate-800" };
      case "armor": return { border: "blue-500", from: "blue-900", to: "slate-800" };
      case "accessory": return { border: "purple-500", from: "purple-900", to: "slate-800" };
    }
  };
  
  const colors = getColors();
  
  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={item ? { scale: 1.05 } : {}}
      onClick={() => {
        if (items.length > 0) {
          onSelect(items[0]);
        }
      }}
    >
      <div className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center ${
        item 
          ? `border-${colors.border} bg-gradient-to-br from-${colors.from}/40 to-${colors.to}` 
          : "border-dashed border-slate-400 bg-slate-800/50"
      }`}>
        {item ? (
          type === "weapon" && getWeaponIconLarge(item)
        ) : (
          <span className="text-xs text-slate-500">Empty</span>
        )}
        {item && type === "armor" && (
          <svg viewBox="0 0 32 32" className="w-14 h-14">
            <path d="M10 8 L16 4 L22 8 L22 26 L10 26 Z" fill="#9370DB"/>
            <path d="M12 10 L16 7 L20 10 L20 24 L12 24 Z" fill="#4B0082"/>
            <rect x="14" y="24" width="4" height="4" fill="#4B0082"/>
          </svg>
        )}
        {item && type === "accessory" && (
          <svg viewBox="0 0 32 32" className="w-14 h-14">
            <rect x="8" y="18" width="6" height="10" fill="#8B4513" rx="1"/>
            <rect x="18" y="18" width="6" height="10" fill="#8B4513" rx="1"/>
            <rect x="7" y="26" width="8" height="3" fill="#654321" rx="1"/>
            <rect x="17" y="26" width="8" height="3" fill="#654321" rx="1"/>
          </svg>
        )}
      </div>
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-600 font-medium whitespace-nowrap">
        {item ? item.name : type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    </motion.div>
  );
}

export { WeaponIcon };
