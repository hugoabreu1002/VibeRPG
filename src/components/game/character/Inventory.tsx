import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "../../../hooks/use-toast";
import type { CharacterClass } from "../../../lib/storage";
import type { InventoryItem } from "../../../types/game";
import { ArmorIcon } from "../items/ArmorIcon";
import { BootIcon } from "../items/BootIcon";
import { FoodIcon } from "../items/FoodIcon";
import { HatIcon } from "../items/HatIcon";
import { ItemDetailModal } from "../items/ItemDetailModal";
import { WeaponIcon } from "../items/WeaponIcon";
import { HealthIcon, ManaIcon, ShieldIcon, SwordIcon } from "../ui/GameIcons";
import { EquipmentSlot } from "./EquipmentSlot";
import { InventorySprite } from "./InventorySprite";

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
  rank?: string;
}

export function Inventory({ inventory, selectedItem, onSelectItem, onToggleEquip, onConsumeFood, onSellItem, characterClass, rank = 'F' }: InventoryProps) {
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

  const handleEquip = (item: InventoryItem) => {
    const wasEquipped = item.equipped;
    onToggleEquip(item);
    setSpriteAnimation("spell");
    setTimeout(() => setSpriteAnimation("idle"), 600);

    // Show toast notification
    if (wasEquipped) {
      toast({
        title: "Unequipped",
        description: `${item.name} has been unequipped`,
        variant: "default",
      });
    } else {
      toast({
        title: "Equipped",
        description: `${item.name} is now equipped`,
        variant: "default",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fantasy-card rounded-xl p-5"
    >


      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Currently Equipped & Preview */}
        <div className="lg:w-1/3 space-y-4">
          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-700/30">
            <h3 className="text-[10px] font-bold mb-4 text-amber-200/60 uppercase tracking-wider text-center">Currently Equipped</h3>
            <div className="grid grid-cols-3 grid-rows-3 gap-4 max-w-[240px] mx-auto items-center justify-items-center">
              <div className="text-xs text-slate-400 text-center mb-2">Hat</div>
              {/* Top: Hat */}
              <div className="col-start-2 row-start-1 flex justify-center">
                <EquipmentSlot
                  type="hat"
                  item={equippedHat}
                  items={inventory.filter(i => i.type === "hat")}
                  onSelect={(item) => onSelectItem(item)}
                />
              </div>

              <div className="text-xs text-slate-400 text-center mb-2">Weapon</div>
              <div className="col-start-1 row-start-2 flex justify-center">
                <EquipmentSlot
                  type="weapon"
                  item={equippedWeapon}
                  items={inventory.filter(i => i.type === "weapon")}
                  onSelect={(item) => onSelectItem(item)}
                />
              </div>

              {/* Center: Character */}
              <div className="col-start-2 row-start-2 flex justify-center min-w-[80px] min-h-[80px] scale-120">
                {characterClass && (
                  <InventorySprite
                    characterClass={characterClass}
                    rank={rank}
                    animationType={spriteAnimation as any}
                    equippedWeapon={equippedWeapon}
                    equippedArmor={equippedArmor}
                    equippedBoot={equippedBoot}
                    equippedHat={equippedHat}
                  />
                )}
              </div>

              <div className="text-xs text-slate-400 text-center mb-2">Armor</div>
              <div className="col-start-3 row-start-2 flex justify-center">
                <EquipmentSlot
                  type="armor"
                  item={equippedArmor}
                  items={inventory.filter(i => i.type === "armor")}
                  onSelect={(item) => onSelectItem(item)}
                />
              </div>

              <div className="text-xs text-slate-400 text-center mb-2">Boots</div>
              <div className="col-start-2 row-start-3 flex justify-center">
                <EquipmentSlot
                  type="boot"
                  item={equippedBoot}
                  items={inventory.filter(i => i.type === "boot")}
                  onSelect={(item) => onSelectItem(item)}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/30 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Power</span>
                <span className="text-amber-400 font-bold">
                  {inventory.filter(i => i.equipped).reduce((sum, i) => sum + (i.stats.attack || 0) + (i.stats.defense || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scrollable Lists */}
        <div className="lg:w-2/3 space-y-8">
          {/* Equipments Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-200/60 uppercase tracking-wider flex justify-between items-center">
              <span>Equipments ({equipments.length})</span>
            </h3>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar content-start">
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
                      <div className="flex-1 overflow-hidden">
                        <span className="font-semibold text-sm text-slate-100 block truncate">{item.name}</span>
                      </div>
                      {item.equipped && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      )}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(item.stats).map(([stat, value]) => value ? (
                        <span key={stat} className="text-[9px] bg-slate-800/60 border border-slate-700/30 px-1.5 py-0.5 rounded text-slate-300 flex items-center gap-1 uppercase">
                          {stat === 'attack' && <SwordIcon size={10} />}
                          {stat === 'defense' && <ShieldIcon size={10} />}
                          <span className="font-bold">+{value}</span>
                        </span>
                      ) : null)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Bag / Food Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-200/60 uppercase tracking-wider">Bag ({bagItems.length})</h3>
            {bagItems.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Your bag is empty</p>
            ) : (
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar content-start">
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
                        <div className="flex-1 overflow-hidden">
                          <span className="font-semibold text-sm text-slate-100 block truncate">{item.name}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {item.restores && Object.entries(item.restores).map(([stat, value]) => (
                          <span key={`restores-${stat}`} className="text-[9px] bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded text-emerald-400 font-bold flex items-center gap-1 uppercase">
                            {stat === 'hp' && <HealthIcon size={10} />}
                            {stat === 'mp' && <ManaIcon size={10} />}
                            <span>+{value}</span>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            onClose={() => onSelectItem(null)}
            onToggleEquip={() => handleEquip(selectedItem)}
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
