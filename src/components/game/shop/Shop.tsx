import { motion } from "framer-motion";
import type { InventoryItem } from "../../../types/game";
import { WeaponIcon } from "../items/WeaponIcon";
import { ArmorIcon } from "../items/ArmorIcon";
import { HatIcon } from "../items/HatIcon";
import { BootIcon } from "../items/BootIcon";
import { FoodIcon } from "../items/FoodIcon";

interface ShopProps {
  gold: number;
  shopItems: InventoryItem[];
  onBuyItem: (item: InventoryItem) => void;
}

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

export function Shop({ gold, shopItems, onBuyItem }: ShopProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white p-4 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Shop</h2>
        <div className="font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
          {gold} Gold
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shopItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 flex flex-col justify-between ${getRarityColor(item.rarity)}/20 ${getRarityBg(item.rarity)}`}
          >
            <div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center shrink-0">
                  {item.type === "weapon" && <WeaponIcon weaponId={item.id} size="w-8 h-8" />}
                  {item.type === "armor" && <ArmorIcon armorId={item.id} size="w-8 h-8" />}
                  {item.type === "hat" && <HatIcon hatId={item.id} size="w-8 h-8" />}
                  {item.type === "boot" && <BootIcon bootId={item.id} size="w-8 h-8" />}
                  {item.type === "food" && <FoodIcon foodId={item.id} size="w-8 h-8" />}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-slate-800 block text-sm leading-tight">{item.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{item.type}</span>
                </div>
                <div className="font-bold text-amber-600 bg-white/50 px-2 rounded">
                  {item.price}g
                </div>
              </div>
              
              <p className="text-xs text-slate-600 mb-3 line-clamp-2 min-h-[32px]">
                {item.description}
              </p>

              <div className="flex gap-1 flex-wrap mb-4">
                {Object.entries(item.stats).map(([stat, value]) => value ? (
                  <span key={stat} className="text-xs bg-white/50 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                    {stat}: +{value}
                  </span>
                ) : null)}
                {item.restores && Object.entries(item.restores).map(([stat, value]) => value ? (
                  <span key={`restores-${stat}`} className="text-xs bg-green-100/50 px-1.5 py-0.5 rounded text-green-700 font-medium">
                    Restores {stat.toUpperCase()}: {value}
                  </span>
                ) : null)}
              </div>
            </div>

            <button
              onClick={() => onBuyItem(item)}
              disabled={gold < item.price}
              className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
                gold >= item.price 
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {gold >= item.price ? "Buy" : "Not enough gold"}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
