import { motion, AnimatePresence } from "framer-motion";
import type { InventoryItem } from "../../../types/game";
import { WeaponIcon } from "./WeaponIcon";
import { ArmorIcon } from "./ArmorIcon";
import { HatIcon } from "./HatIcon";
import { BootIcon } from "./BootIcon";
import { FoodIcon } from "./FoodIcon";

const getRarityColor = (rarity: InventoryItem["rarity"]) => {
  switch (rarity) {
    case "common": return "text-slate-300";
    case "rare": return "text-blue-400";
    case "epic": return "text-purple-400";
    case "legendary": return "text-amber-400";
  }
};

const getRarityBadge = (rarity: InventoryItem["rarity"]) => {
  switch (rarity) {
    case "common": return "bg-slate-800/60 border-slate-700/30 text-slate-300";
    case "rare": return "bg-blue-950/50 border-blue-700/30 text-blue-400";
    case "epic": return "bg-purple-950/50 border-purple-700/30 text-purple-400";
    case "legendary": return "bg-amber-950/40 border-amber-700/30 text-amber-400";
  }
};

interface ItemDetailModalProps {
  item: InventoryItem;
  onClose: () => void;
  onToggleEquip: () => void;
  onConsumeFood?: () => void;
}

export function ItemDetailModal({ item, onClose, onToggleEquip, onConsumeFood }: ItemDetailModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="fantasy-card rounded-xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-full h-32 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br ${item.type === "weapon" ? "from-amber-900/30 to-slate-900" :
            item.type === "armor" ? "from-blue-900/30 to-slate-900" :
              item.type === "boot" ? "from-purple-900/30 to-slate-900" :
                item.type === "food" ? "from-green-900/30 to-slate-900" :
                  "from-indigo-900/30 to-slate-900"
          } border border-slate-700/30`}>
          {item.type === "weapon" && <WeaponIcon weaponId={item.id} large={true} />}
          {item.type === "armor" && <ArmorIcon armorId={item.id} large={true} />}
          {item.type === "hat" && <HatIcon hatId={item.id} large={true} />}
          {item.type === "boot" && <BootIcon bootId={item.id} large={true} />}
          {item.type === "food" && <FoodIcon foodId={item.id} size="w-16 h-16" />}
        </div>

        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-xl font-bold ${getRarityColor(item.rarity)}`}>
            {item.name}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className={`inline-block px-3 py-1 rounded text-xs uppercase font-medium mb-4 border ${getRarityBadge(item.rarity)}`}>
          {item.rarity} {item.type}
        </div>

        <p className="text-sm text-slate-400 mb-4">{item.description}</p>

        <div className="space-y-2 mb-4 bg-slate-900/40 border border-slate-700/30 p-3 rounded-lg">
          <h4 className="text-xs font-bold text-amber-200/60 uppercase">{item.type === "food" ? "Effects" : "Stats"}</h4>
          {Object.entries(item.stats).map(([stat, value]) => value ? (
            <div key={stat} className="flex justify-between text-sm">
              <span className="text-slate-400 capitalize">{stat === 'magicPower' ? 'Magic Power' : stat}</span>
              <span className="font-bold text-emerald-400">+{value}</span>
            </div>
          ) : null)}
          {item.restores && Object.entries(item.restores).map(([stat, value]) => value ? (
            <div key={`restores-${stat}`} className="flex justify-between text-sm">
              <span className="text-slate-400 capitalize">Restores {stat.toUpperCase()}</span>
              <span className="font-bold text-emerald-400">{value}</span>
            </div>
          ) : null)}
        </div>

        {item.type === "food" ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConsumeFood}
            className="w-full py-3 rounded-lg font-bold bg-emerald-800 text-emerald-100 hover:bg-emerald-700 border border-emerald-700 transition-colors"
          >
            CONSUME
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleEquip}
            className={`w-full py-3 rounded-lg font-bold transition-colors ${item.equipped
                ? "bg-red-900/60 text-red-300 hover:bg-red-800/60 border border-red-700/40"
                : "btn-fantasy"
              }`}
          >
            {item.equipped ? "UNEQUIP" : "EQUIP"}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
