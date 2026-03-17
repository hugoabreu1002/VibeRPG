import { motion } from "framer-motion";
import type { InventoryItem } from "../../../types/game";
import { WeaponIcon } from "../items/WeaponIcon";
import { ArmorIcon } from "../items/ArmorIcon";
import { HatIcon } from "../items/HatIcon";
import { BootIcon } from "../items/BootIcon";

interface EquipmentSlotProps { 
  type: "weapon" | "armor" | "boot" | "hat"; 
  item?: InventoryItem; 
  items: InventoryItem[];
  onSelect: (item: InventoryItem) => void;
}

export function EquipmentSlot({ type, item, items, onSelect }: EquipmentSlotProps) {
  const getColors = () => {
    switch (type) {
      case "weapon": return { border: "amber-500", from: "amber-900", to: "slate-800" };
      case "armor": return { border: "blue-500", from: "blue-900", to: "slate-800" };
      case "boot": return { border: "purple-500", from: "purple-900", to: "slate-800" };
      case "hat": return { border: "indigo-500", from: "indigo-900", to: "slate-800" };
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
          type === "weapon" && <WeaponIcon weaponId={item.id} large={true} />
        ) : (
          <span className="text-xs text-slate-500">Empty</span>
        )}
        {item && type === "armor" && <ArmorIcon armorId={item.id} large={true} />}
        {item && type === "boot" && <BootIcon bootId={item.id} large={true} />}
        {item && type === "hat" && <HatIcon hatId={item.id} large={true} />}
      </div>
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-600 font-medium whitespace-nowrap">
        {item ? item.name : type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    </motion.div>
  );
}

export { WeaponIcon };
