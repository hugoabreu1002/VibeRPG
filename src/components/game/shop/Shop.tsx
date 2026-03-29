import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InventoryItem } from "../../../types/game";
import { WeaponIcon } from "../items/WeaponIcon";
import { ArmorIcon } from "../items/ArmorIcon";
import { HatIcon } from "../items/HatIcon";
import { BootIcon } from "../items/BootIcon";
import { FoodIcon } from "../items/FoodIcon";
import { audioManager } from "../../../lib/audio";
import {
  ShopTabIcon, GoldIcon, SwordIcon, ShieldIcon, HealthIcon, ManaIcon
} from "../ui/GameIcons";

interface ShopProps {
  gold: number;
  shopItems: InventoryItem[];
  onBuyItem: (item: InventoryItem) => void;
}

const getRarityBorder = (rarity: InventoryItem["rarity"]) => {
  switch (rarity) {
    case "common": return "border-slate-600/40";
    case "rare": return "border-blue-500/40 rarity-rare";
    case "epic": return "border-purple-500/40 rarity-epic";
    case "legendary": return "border-amber-400/40 rarity-legendary";
  }
};

const getRarityBg = (rarity: InventoryItem["rarity"]) => {
  switch (rarity) {
    case "common": return "bg-slate-800/40";
    case "rare": return "bg-blue-950/30";
    case "epic": return "bg-purple-950/30";
    case "legendary": return "bg-amber-950/20";
  }
};

const getRarityLabel = (rarity: InventoryItem["rarity"]) => {
  switch (rarity) {
    case "common": return "text-slate-400";
    case "rare": return "text-blue-400";
    case "epic": return "text-purple-400";
    case "legendary": return "text-amber-400";
  }
};

export function Shop({ gold, shopItems, onBuyItem }: ShopProps) {
  // const { t } = useI18n();
  const [purchasedItem, setPurchasedItem] = useState<string | null>(null);

  const handleBuy = (item: InventoryItem) => {
    onBuyItem(item);
    audioManager.playSfx("click");
    setPurchasedItem(item.id);
    setTimeout(() => setPurchasedItem(null), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fantasy-card rounded-xl p-5"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gold flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
          <ShopTabIcon size={28} /> Shop
        </h2>
        <div className="font-bold text-amber-400 bg-amber-950/40 px-4 py-1.5 rounded-lg border border-amber-700/30 flex items-center gap-2 shadow-inner">
          <GoldIcon size={20} /> {gold} Gold
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {shopItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 flex flex-col justify-between ${getRarityBorder(item.rarity)} ${getRarityBg(item.rarity)}`}
          >
            <div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900/60 border border-slate-700/30 flex items-center justify-center shrink-0">
                  {item.type === "weapon" && <WeaponIcon weaponId={item.id} size="w-8 h-8" />}
                  {item.type === "armor" && <ArmorIcon armorId={item.id} size="w-8 h-8" />}
                  {item.type === "hat" && <HatIcon hatId={item.id} size="w-8 h-8" />}
                  {item.type === "boot" && <BootIcon bootId={item.id} size="w-8 h-8" />}
                  {item.type === "food" && <FoodIcon foodId={item.id} size="w-8 h-8" />}
                </div>
                <div className="flex-1 text-left">
                  <span className="font-semibold text-slate-100 block text-sm leading-tight">{item.name}</span>
                  <span className={`text-xs capitalize ${getRarityLabel(item.rarity)}`}>{item.rarity} {item.type}</span>
                </div>
                <div className="font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg text-sm border border-amber-800/20 flex items-center gap-1">
                  <GoldIcon size={14} /> {item.price}
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-3 line-clamp-2 min-h-[32px] text-left">
                {item.description}
              </p>

              <div className="flex gap-1.5 flex-wrap mb-4">
                {Object.entries(item.stats).map(([stat, value]) => value ? (
                  <span key={stat} className="text-[10px] bg-slate-800/60 border border-slate-700/30 px-2 py-1 rounded text-slate-300 font-bold flex items-center gap-1 uppercase">
                    {stat === 'attack' && <SwordIcon size={12} />}
                    {stat === 'defense' && <ShieldIcon size={12} />}
                    {stat === 'hp' && <HealthIcon size={12} />}
                    {stat === 'mp' && <ManaIcon size={12} />}
                    <span className="opacity-70">|</span> +{value}
                  </span>
                ) : null)}
                {item.restores && Object.entries(item.restores).map(([stat, value]) => value ? (
                  <span key={`restores-${stat}`} className="text-[10px] bg-emerald-950/40 border border-emerald-800/30 px-2 py-1 rounded text-emerald-400 font-bold flex items-center gap-1.5 uppercase">
                    {stat === 'hp' && <HealthIcon size={12} />}
                    {stat === 'mp' && <ManaIcon size={12} />}
                    {stat}: +{value}
                  </span>
                ) : null)}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBuy(item)}
              disabled={gold < item.price}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all relative overflow-hidden ${gold >= item.price
                  ? "btn-fantasy"
                  : "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/30"
                }`}
            >
              <AnimatePresence>
                {purchasedItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 flex items-center justify-center bg-emerald-600/90 text-white font-bold"
                  >
                    Purchased!
                  </motion.div>
                )}
              </AnimatePresence>
              {gold >= item.price ? "Buy" : "Not Enough Gold"}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
