import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InventoryItem } from "../../../types/game";
import type { CharacterClass } from "../../../lib/storage";
import { EquipmentSlot } from "./EquipmentSlot";
import { ItemDetailModal } from "../items/ItemDetailModal";
import { WeaponIcon } from "../items/WeaponIcon";
import { ArmorIcon } from "../items/ArmorIcon";
import { HatIcon } from "../items/HatIcon";
import { BootIcon } from "../items/BootIcon";
import { FoodIcon } from "../items/FoodIcon";
import { InventorySprite } from "./InventorySprite";
import { InventoryTabIcon, SwordIcon, ShieldIcon, HealthIcon, ManaIcon } from "../ui/GameIcons";

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

interface InventoryProps {
  inventory: InventoryItem[];
  selectedItem: InventoryItem | null;
  onSelectItem: (item: InventoryItem | null) => void;
  onToggleEquip: (item: InventoryItem) => void;
  onConsumeFood?: (item: InventoryItem) => void;
  onSellItem?: (item: InventoryItem) => void;
  characterClass?: CharacterClass;
}

export function Inventory({ inventory, selectedItem, onSelectItem, onToggleEquip, onConsumeFood, onSellItem, characterClass }: InventoryProps) {
  const equippedWeapon = inventory.find(i => i.type === "weapon" && i.equipped);
  const equippedArmor = inventory.find(i => i.type === "armor" && i.equipped);
  const equippedBoot = inventory.find(i => i.type === "boot" && i.equipped);
  const equippedHat = inventory.find(i => i.type === "hat" && i.equipped);

  const equipments = inventory.filter(i => i.type !== "food");
  const bagItems = inventory.filter(i => i.type === "food");

  const [spriteAnimation, setSpriteAnimation] = useState<"idle" | "spell">("idle");

  const handleConsume = (item: InventoryItem) => {
    if (onConsumeFood) {
      onConsumeFood(item);
      setSpriteAnimation("spell");
      setTimeout(() => setSpriteAnimation("idle"), 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fantasy-card rounded-xl p-5"
    >
      <h2 className="text-xl font-bold mb-5 text-gold flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
        <InventoryTabIcon size={28} /> Inventory
      </h2>

      {/* Equipment Slots */}
      <div className="mb-6">
        <h3 className="text-xs font-bold mb-3 text-amber-200/60 uppercase tracking-wider">Currently Equipped</h3>
        <div className="grid grid-cols-3 grid-rows-3 gap-6 sm:gap-8 max-w-md mx-auto items-center justify-items-center bg-slate-900/40 p-6 sm:p-8 rounded-xl border border-slate-700/30">
          {/* Top: Hat */}
          <div className="col-start-2 row-start-1 flex justify-center">
            <EquipmentSlot
              type="hat"
              item={equippedHat}
              items={inventory.filter(i => i.type === "hat")}
              onSelect={(item) => onSelectItem(item)}
            />
          </div>

          {/* Left: Weapon */}
          <div className="col-start-1 row-start-2 flex justify-center">
            <EquipmentSlot
              type="weapon"
              item={equippedWeapon}
              items={inventory.filter(i => i.type === "weapon")}
              onSelect={(item) => onSelectItem(item)}
            />
          </div>

          {/* Center: Character */}
          <div className="col-start-2 row-start-2 flex justify-center min-w-[64px] min-h-[64px]">
            {characterClass && (
              <InventorySprite
                characterClass={characterClass}
                animationType={spriteAnimation as any}
                equippedWeapon={equippedWeapon}
                equippedArmor={equippedArmor}
                equippedBoot={equippedBoot}
                equippedHat={equippedHat}
              />
            )}
          </div>

          {/* Right: Armor */}
          <div className="col-start-3 row-start-2 flex justify-center">
            <EquipmentSlot
              type="armor"
              item={equippedArmor}
              items={inventory.filter(i => i.type === "armor")}
              onSelect={(item) => onSelectItem(item)}
            />
          </div>

          {/* Bottom: Boots */}
          <div className="col-start-2 row-start-3 flex justify-center">
            <EquipmentSlot
              type="boot"
              item={equippedBoot}
              items={inventory.filter(i => i.type === "boot")}
              onSelect={(item) => onSelectItem(item)}
            />
          </div>
        </div>
      </div>

      {/* Equipments Grid */}
      <div className="mb-6">
        <h3 className="text-xs font-bold mb-3 text-amber-200/60 uppercase tracking-wider">Equipments ({equipments.length})</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {equipments.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => onSelectItem(selectedItem?.id === item.id ? null : item)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedItem?.id === item.id
                  ? "border-amber-500/50 bg-amber-950/30"
                  : item.equipped
                    ? "border-emerald-500/40 bg-emerald-950/20"
                    : `${getRarityBorder(item.rarity)} ${getRarityBg(item.rarity)}`
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900/60 border border-slate-700/30 flex items-center justify-center">
                    {item.type === "weapon" && <WeaponIcon weaponId={item.id} size="w-6 h-6" />}
                    {item.type === "armor" && <ArmorIcon armorId={item.id} size="w-6 h-6" />}
                    {item.type === "hat" && <HatIcon hatId={item.id} size="w-6 h-6" />}
                    {item.type === "boot" && <BootIcon bootId={item.id} size="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm text-slate-100">{item.name}</span>
                  </div>
                  {item.equipped && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs bg-emerald-700 text-emerald-100 px-1.5 py-0.5 rounded font-bold"
                    >
                      E
                    </motion.span>
                  )}
                </div>
                <div className={`text-xs capitalize mb-1 ${getRarityLabel(item.rarity)}`}>{item.rarity} {item.type}</div>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.entries(item.stats).map(([stat, value]) => (
                    <span key={stat} className="text-[10px] bg-slate-800/60 border border-slate-700/30 px-1.5 py-1 rounded text-slate-300 flex items-center gap-1">
                      {stat === 'attack' && <SwordIcon size={10} />}
                      {stat === 'defense' && <ShieldIcon size={10} />}
                      {stat === 'hp' && <HealthIcon size={10} />}
                      {stat === 'mp' && <ManaIcon size={10} />}
                      <span className="font-bold">+{value}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bag / Food Grid */}
      <div>
        <h3 className="text-xs font-bold mb-3 text-amber-200/60 uppercase tracking-wider">Bag ({bagItems.length})</h3>
        {bagItems.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Your bag is empty.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {bagItems.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => onSelectItem(selectedItem?.id === item.id ? null : item)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedItem?.id === item.id
                    ? "border-amber-500/50 bg-amber-950/30"
                    : `${getRarityBorder(item.rarity)} ${getRarityBg(item.rarity)}`
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900/60 border border-slate-700/30 flex items-center justify-center">
                      <FoodIcon foodId={item.id} size="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-sm text-slate-100">{item.name}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 capitalize mb-1">{item.type}</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {item.restores && Object.entries(item.restores).map(([stat, value]) => (
                      <span key={`restores-${stat}`} className="text-[10px] bg-emerald-950/40 border border-emerald-800/30 px-2 py-1 rounded text-emerald-400 font-bold flex items-center gap-1.5 uppercase letter-spacing-1">
                        {stat === 'hp' && <HealthIcon size={12} />}
                        {stat === 'mp' && <ManaIcon size={12} />}
                        <span>{stat}: {value}</span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            onClose={() => onSelectItem(null)}
            onToggleEquip={() => onToggleEquip(selectedItem)}
            onConsumeFood={onConsumeFood ? () => {
              handleConsume(selectedItem);
              onSelectItem(null);
            } : undefined}
            onSell={onSellItem ? () => {
              onSellItem(selectedItem);
              onSelectItem(null);
            } : undefined}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
