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
import { SwordIcon, ShieldIcon, HealthIcon, ManaIcon } from "../ui/GameIcons";
import { toast } from "../../../hooks/use-toast";

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

const getSlotLabel = (type: InventoryItem["type"]) => {
  switch (type) {
    case "weapon": return "Weapon";
    case "armor": return "Armor";
    case "hat": return "Hat";
    case "boot": return "Boots";
    case "food": return "Bag";
  }
};

const getItemIcon = (item: InventoryItem) => {
  switch (item.type) {
    case "weapon":
      return <WeaponIcon weaponId={item.id} size="w-6 h-6" />;
    case "armor":
      return <ArmorIcon armorId={item.id} size="w-6 h-6" />;
    case "hat":
      return <HatIcon hatId={item.id} size="w-6 h-6" />;
    case "boot":
      return <BootIcon bootId={item.id} size="w-6 h-6" />;
    case "food":
      return <FoodIcon foodId={item.id} size="w-6 h-6" />;
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
  clothingColor?: string;
  faceStyle?: "heroic" | "friendly" | "fierce" | "mysterious";
  skinColor?: string;
  hairColor?: string;
}

export function Inventory({ inventory, selectedItem, onSelectItem, onToggleEquip, onConsumeFood, onSellItem, characterClass, rank = 'F', clothingColor, faceStyle, skinColor, hairColor }: InventoryProps) {
  const equippedWeapon = inventory.find(i => i.type === "weapon" && i.equipped);
  const equippedArmor = inventory.find(i => i.type === "armor" && i.equipped);
  const equippedBoot = inventory.find(i => i.type === "boot" && i.equipped);
  const equippedHat = inventory.find(i => i.type === "hat" && i.equipped);
  const equippedItems = [equippedWeapon, equippedArmor, equippedBoot, equippedHat].filter((item): item is InventoryItem => Boolean(item));

  const equipments = inventory.filter(i => i.type !== "food");
  const bagItems = inventory.filter(i => i.type === "food");
  const totalAttack = equippedItems.reduce((sum, item) => sum + (item.stats.attack || 0), 0);
  const totalDefense = equippedItems.reduce((sum, item) => sum + (item.stats.defense || 0), 0);
  const totalHp = equippedItems.reduce((sum, item) => sum + (item.stats.hp || 0), 0);
  const totalMp = equippedItems.reduce((sum, item) => sum + (item.stats.mp || 0), 0);
  const totalMagicPower = equippedItems.reduce((sum, item) => sum + (item.stats.magicPower || 0), 0);
  const totalPower = equippedItems.reduce((sum, item) => sum + (item.stats.attack || 0) + (item.stats.defense || 0), 0);

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
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[10px] font-bold text-amber-200/60 uppercase tracking-wider">Hero Loadout</h3>
                <p className="mt-1 text-xs text-slate-400">Preview your current gear directly on the hero.</p>
              </div>
              <div className="rounded-full border border-emerald-500/20 bg-emerald-950/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                {equippedItems.length}/4 equipped
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/40 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.75))] p-4">
              <div className="grid grid-cols-3 grid-rows-3 gap-4 max-w-[260px] mx-auto items-center justify-items-center">
                <div className="col-start-2 row-start-1 flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <EquipmentSlot
                      type="hat"
                      item={equippedHat}
                      items={inventory.filter(i => i.type === "hat")}
                      onSelect={(item) => onSelectItem(item)}
                    />
                    {!equippedHat && (
                      <span className="text-[11px] font-medium text-slate-500">Hat</span>
                    )}
                  </div>
                </div>

                <div className="col-start-1 row-start-2 flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <EquipmentSlot
                      type="weapon"
                      item={equippedWeapon}
                      items={inventory.filter(i => i.type === "weapon")}
                      onSelect={(item) => onSelectItem(item)}
                    />
                    {!equippedWeapon && (
                      <span className="text-[11px] font-medium text-slate-500">Weapon</span>
                    )}
                  </div>
                </div>

                <div className="col-start-2 row-start-2 flex justify-center min-w-[96px] min-h-[96px]">
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-amber-400/15 bg-amber-400/5 shadow-[0_0_40px_rgba(251,191,36,0.08)]">
                    {characterClass && (
                      <InventorySprite
                        characterClass={characterClass}
                        rank={rank}
                        animationType={spriteAnimation as any}
                        equippedWeapon={equippedWeapon}
                        equippedArmor={equippedArmor}
                        equippedBoot={equippedBoot}
                        equippedHat={equippedHat}
                        skinColor={skinColor}
                        hairColor={hairColor}
                        clothingColor={clothingColor}
                        faceStyle={faceStyle}
                      />
                    )}
                  </div>
                </div>

                <div className="col-start-3 row-start-2 flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <EquipmentSlot
                      type="armor"
                      item={equippedArmor}
                      items={inventory.filter(i => i.type === "armor")}
                      onSelect={(item) => onSelectItem(item)}
                    />
                    {!equippedArmor && (
                      <span className="text-[11px] font-medium text-slate-500">Armor</span>
                    )}
                  </div>
                </div>

                <div className="col-start-2 row-start-3 flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <EquipmentSlot
                      type="boot"
                      item={equippedBoot}
                      items={inventory.filter(i => i.type === "boot")}
                      onSelect={(item) => onSelectItem(item)}
                    />
                    {!equippedBoot && (
                      <span className="text-[11px] font-medium text-slate-500">Boots</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-700/40 bg-slate-950/40 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">Power</div>
                <div className="mt-1 text-lg font-bold text-amber-300">{totalPower}</div>
              </div>
              <div className="rounded-xl border border-slate-700/40 bg-slate-950/40 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">Magic</div>
                <div className="mt-1 text-lg font-bold text-violet-300">+{totalMagicPower}</div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-950/40 px-3 py-2 text-xs">
                <span className="flex items-center gap-1 text-slate-400"><SwordIcon size={12} /> ATK</span>
                <span className="font-bold text-amber-300">+{totalAttack}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-950/40 px-3 py-2 text-xs">
                <span className="flex items-center gap-1 text-slate-400"><ShieldIcon size={12} /> DEF</span>
                <span className="font-bold text-blue-300">+{totalDefense}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-950/40 px-3 py-2 text-xs">
                <span className="flex items-center gap-1 text-slate-400"><HealthIcon size={12} /> HP</span>
                <span className="font-bold text-emerald-300">+{totalHp}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-950/40 px-3 py-2 text-xs">
                <span className="flex items-center gap-1 text-slate-400"><ManaIcon size={12} /> MP</span>
                <span className="font-bold text-cyan-300">+{totalMp}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Scrollable Lists */}
        <div className="lg:w-2/3 space-y-8">
          {/* Equipments Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-amber-200/60 uppercase tracking-wider">
                Equipments ({equipments.length})
              </h3>
              <div className="text-[11px] text-slate-500">
                Equipped: <span className="font-semibold text-emerald-400">{equipments.filter(item => item.equipped).length}</span>
              </div>
            </div>
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
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <span className="rounded-full border border-slate-700/40 bg-slate-900/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                        {getSlotLabel(item.type)}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wide ${getRarityLabel(item.rarity)}`}>
                        {item.rarity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-900/60 border border-slate-700/30 flex items-center justify-center">
                        {getItemIcon(item)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <span className="font-semibold text-sm text-slate-100 block truncate">{item.name}</span>
                        <span className="block truncate text-[11px] text-slate-500">
                          {item.equipped ? "Currently worn by hero" : "Tap to inspect or equip"}
                        </span>
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
