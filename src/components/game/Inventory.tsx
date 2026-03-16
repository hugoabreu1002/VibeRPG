import { motion, AnimatePresence } from "framer-motion";
import type { InventoryItem } from "../../types/game";
import type { CharacterClass } from "../../lib/indexeddb";
import { EquipmentSlot, WeaponIcon } from "./EquipmentSlot";
import { ItemDetailModal } from "./ItemDetailModal";
import { Sprite } from "./Sprite";

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

interface InventoryProps {
  inventory: InventoryItem[];
  selectedItem: InventoryItem | null;
  onSelectItem: (item: InventoryItem | null) => void;
  onToggleEquip: (item: InventoryItem) => void;
  characterClass?: CharacterClass;
}

export function Inventory({ inventory, selectedItem, onSelectItem, onToggleEquip, characterClass }: InventoryProps) {
  const equippedWeapon = inventory.find(i => i.type === "weapon" && i.equipped);
  const equippedArmor = inventory.find(i => i.type === "armor" && i.equipped);
  const equippedAccessory = inventory.find(i => i.type === "accessory" && i.equipped);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white p-4 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-4">Inventory</h2>
      
      {/* Equipment Slots */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3 text-slate-500 uppercase tracking-wide">Currently Equipped</h3>
        <div className="flex gap-8 items-center justify-center bg-slate-50 p-8 rounded-xl border border-slate-100">
          <div className="flex flex-col gap-4">
            <EquipmentSlot 
              type="weapon" 
              item={equippedWeapon}
              items={inventory.filter(i => i.type === "weapon")}
              onSelect={(item) => onSelectItem(item)}
            />
          </div>
          
          {characterClass && (
            <div className="transform scale-150 mx-4 flex flex-col items-center">
              <Sprite characterClass={characterClass} isPlayer={true} animationType="idle" />
            </div>
          )}

          <div className="flex flex-col gap-4">
            <EquipmentSlot 
              type="armor" 
              item={equippedArmor}
              items={inventory.filter(i => i.type === "armor")}
              onSelect={(item) => onSelectItem(item)}
            />
            <EquipmentSlot 
              type="accessory" 
              item={equippedAccessory}
              items={inventory.filter(i => i.type === "accessory")}
              onSelect={(item) => onSelectItem(item)}
            />
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-slate-500 uppercase tracking-wide">All Items ({inventory.length})</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {inventory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => onSelectItem(selectedItem?.id === item.id ? null : item)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedItem?.id === item.id
                    ? "border-indigo-500 bg-indigo-50"
                    : item.equipped
                      ? "border-green-400 bg-green-50"
                      : `${getRarityColor(item.rarity)}/20 ${getRarityBg(item.rarity)}`
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                    {item.type === "weapon" && <WeaponIcon weaponId={item.id} size="w-6 h-6" />}
                    {item.type === "armor" && (
                      <svg viewBox="0 0 16 16" className="w-6 h-6">
                        <path d="M5 4 L8 2 L11 4 L11 13 L5 13 Z" fill="#9370DB"/>
                      </svg>
                    )}
                    {item.type === "accessory" && (
                      <svg viewBox="0 0 16 16" className="w-6 h-6">
                        <rect x="4" y="9" width="3" height="5" fill="#8B4513" rx="1"/>
                        <rect x="9" y="9" width="3" height="5" fill="#8B4513" rx="1"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  {item.equipped && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded"
                    >
                      E
                    </motion.span>
                  )}
                </div>
                <div className="text-xs text-slate-500 capitalize mb-1">{item.type}</div>
                <div className="flex gap-1 flex-wrap">
                  {Object.entries(item.stats).map(([stat, value]) => (
                    <span key={stat} className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                      +{value}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal 
            item={selectedItem}
            onClose={() => onSelectItem(null)}
            onToggleEquip={() => onToggleEquip(selectedItem)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
