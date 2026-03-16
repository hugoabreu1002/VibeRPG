import { motion, AnimatePresence } from "framer-motion";
import type { InventoryItem } from "../../types/game";
import { WeaponIcon } from "./EquipmentSlot";

const getRarityColor = (rarity: InventoryItem["rarity"]) => {
  switch (rarity) {
    case "common": return "text-slate-400 border-slate-400";
    case "rare": return "text-blue-400 border-blue-400";
    case "epic": return "text-purple-400 border-purple-400";
    case "legendary": return "text-amber-400 border-amber-400";
  }
};

const getRarityBg = (rarity: InventoryItem["rarity"]) => {
  switch (rarity) {
    case "common": return "bg-slate-100";
    case "rare": return "bg-blue-50";
    case "epic": return "bg-purple-50";
    case "legendary": return "bg-amber-50";
  }
};

interface ItemDetailModalProps {
  item: InventoryItem;
  onClose: () => void;
  onToggleEquip: () => void;
}

function getWeaponIconLarge(item: InventoryItem) {
  if (item.id.includes("sword")) {
    return (
      <svg viewBox="0 0 48 48" className="w-24 h-24">
        <rect x="21" y="8" width="6" height="30" fill="#C0C0C0"/>
        <rect x="15" y="32" width="18" height="6" fill="#8B4513"/>
        <rect x="18" y="38" width="12" height="8" fill="#8B4513"/>
        <rect x="21" y="12" width="6" height="6" fill="#E8E8E8"/>
      </svg>
    );
  } else if (item.id.includes("mace")) {
    return (
      <svg viewBox="0 0 48 48" className="w-24 h-24">
        <rect x="21" y="18" width="6" height="26" fill="#8B4513"/>
        <circle cx="24" cy="12" r="12" fill="#696969"/>
        <circle cx="18" cy="6" r="3" fill="#404040"/>
        <circle cx="30" cy="6" r="3" fill="#404040"/>
        <circle cx="15" cy="12" r="3" fill="#404040"/>
        <circle cx="33" cy="12" r="3" fill="#404040"/>
        <circle cx="24" cy="3" r="3" fill="#404040"/>
        <circle cx="21" cy="9" r="3" fill="#808080"/>
        <circle cx="27" cy="9" r="3" fill="#808080"/>
      </svg>
    );
  } else {
    return (
      <svg viewBox="0 0 48 48" className="w-24 h-24">
        <rect x="21" y="6" width="6" height="36" fill="#8B4513"/>
        <circle cx="24" cy="6" r="6" fill="#00CED1"/>
        <circle cx="24" cy="6" r="3" fill="#FFFFFF"/>
        <motion.circle 
          cx="24" cy="6" r="10" fill="none" stroke="#00CED1" strokeWidth="2"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </svg>
    );
  }
}

export function ItemDetailModal({ item, onClose, onToggleEquip }: ItemDetailModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Large Item Display */}
        <div className={`w-full h-32 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br ${
          item.type === "weapon" ? "from-amber-900/30 to-slate-800" :
          item.type === "armor" ? "from-blue-900/30 to-slate-800" :
          "from-purple-900/30 to-slate-800"
        }`}>
          {item.type === "weapon" && getWeaponIconLarge(item)}
          {item.type === "armor" && (
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
          )}
          {item.type === "accessory" && (
            <svg viewBox="0 0 48 48" className="w-24 h-24">
              <rect x="10" y="26" width="10" height="16" fill="#8B4513" rx="2"/>
              <rect x="28" y="26" width="10" height="16" fill="#8B4513" rx="2"/>
              <rect x="8" y="38" width="14" height="4" fill="#654321" rx="1"/>
              <rect x="26" y="38" width="14" height="4" fill="#654321" rx="1"/>
              <motion.circle 
                cx="24" cy="20" r="4" fill="#FFD700"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </svg>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-xl font-bold ${getRarityColor(item.rarity)}`}>
            {item.name}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className={`inline-block px-3 py-1 rounded text-xs uppercase font-medium mb-4 ${getRarityBg(item.rarity)} ${getRarityColor(item.rarity)}`}>
          {item.rarity} {item.type}
        </div>
        
        <p className="text-sm text-slate-600 mb-4">{item.description}</p>
        
        <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-lg">
          <h4 className="text-xs font-semibold text-slate-500 uppercase">Stats</h4>
          {Object.entries(item.stats).map(([stat, value]) => (
            <div key={stat} className="flex justify-between text-sm">
              <span className="text-slate-600 capitalize">{stat === 'magicPower' ? 'Magic Power' : stat}</span>
              <span className="font-bold text-green-600">+{value}</span>
            </div>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleEquip}
          className={`w-full py-3 rounded-lg font-bold ${
            item.equipped
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {item.equipped ? "UNEQUIP" : "EQUIP"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
