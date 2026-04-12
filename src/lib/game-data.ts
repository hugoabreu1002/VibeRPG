import type { CharacterClass } from "./storage";
import type { InventoryItem, Quest, Enemy } from "../types/game";

export const CHARACTER_CLASSES: CharacterClass[] = ["mage", "warrior", "priest", "rogue", "archer"];

// Starter inventory items by class
export function getStarterItems(charClass: CharacterClass): InventoryItem[] {
  switch (charClass) {
    case "mage":
      return [
        {
          id: "wooden-staff",
          name: "Apprentice Staff",
          type: "weapon",
          rarity: "common",
          price: 15,
          stats: { attack: 3, magicPower: 5 },
          equipped: true,
          description: "A basic staff for aspiring mages."
        },
        {
          id: "cloth-robe",
          name: "Novice Robe",
          type: "armor",
          rarity: "common",
          price: 20,
          stats: { defense: 2, hp: 10 },
          equipped: true,
          description: "Simple robes worn by magic apprentices."
        },
        {
          id: "apprentice-hat",
          name: "Apprentice Hat",
          type: "hat",
          rarity: "common",
          price: 10,
          stats: { magicPower: 2 },
          equipped: true,
          description: "A simple pointed hat for magic apprentices."
        },
        {
          id: "leather-shoes",
          name: "Traveler's Boots",
          type: "boot",
          rarity: "common",
          price: 12,
          stats: { hp: 5 },
          equipped: true,
          description: "Comfortable boots for long journeys."
        }
      ];
    case "warrior":
      return [
        {
          id: "iron-sword",
          name: "Iron Sword",
          type: "weapon",
          rarity: "common",
          price: 20,
          stats: { attack: 8, defense: 2 },
          equipped: true,
          description: "A sturdy iron sword for warriors."
        },
        {
          id: "leather-armor",
          name: "Leather Armor",
          type: "armor",
          rarity: "common",
          price: 25,
          stats: { defense: 5, hp: 15 },
          equipped: true,
          description: "Basic leather armor for beginners."
        },
        {
          id: "warrior-helmet",
          name: "Warrior Helmet",
          type: "hat",
          rarity: "common",
          price: 15,
          stats: { defense: 3 },
          equipped: true,
          description: "A sturdy helmet for protecting warriors in battle."
        },
        {
          id: "leather-boots",
          name: "Combat Boots",
          type: "boot",
          rarity: "common",
          price: 15,
          stats: { hp: 5, defense: 2 },
          equipped: true,
          description: "Durable boots for battle."
        }
      ];
    case "priest":
      return [
        {
          id: "holy-mace",
          name: "Holy Mace",
          type: "weapon",
          rarity: "common",
          price: 18,
          stats: { attack: 5, magicPower: 3 },
          equipped: true,
          description: "A blessed mace for priests."
        },
        {
          id: "priest-robes",
          name: "Priest's Robes",
          type: "armor",
          rarity: "common",
          price: 22,
          stats: { defense: 3, magicPower: 5, hp: 10 },
          equipped: true,
          description: "Holy robes blessed with divine magic."
        },
        {
          id: "priest-hat",
          name: "Priest's Hat",
          type: "hat",
          rarity: "common",
          price: 12,
          stats: { magicPower: 3, hp: 5 },
          equipped: true,
          description: "A holy hat blessed with divine energy."
        },
        {
          id: "holy-pendant",
          name: "Holy Pendant",
          type: "boot",
          rarity: "common",
          price: 15,
          stats: { hp: 10, magicPower: 3 },
          equipped: true,
          description: "A pendant imbued with holy energy."
        }
      ];
    case "rogue":
      return [
        {
          id: "iron-dagger",
          name: "Iron Dagger",
          type: "weapon",
          rarity: "common",
          price: 18,
          stats: { attack: 7 },
          equipped: true,
          description: "A small but sharp dagger."
        },
        {
          id: "leather-tunic",
          name: "Leather Tunic",
          type: "armor",
          rarity: "common",
          price: 22,
          stats: { defense: 4, hp: 10 },
          equipped: true,
          description: "Lightweight tunic for agile movements."
        }
      ];
    case "archer":
      return [
        {
          id: "shortbow",
          name: "Shortbow",
          type: "weapon",
          rarity: "common",
          price: 20,
          stats: { attack: 6 },
          equipped: true,
          description: "A simple wooden bow for beginners."
        },
        {
          id: "ranger-tunic",
          name: "Ranger Tunic",
          type: "armor",
          rarity: "common",
          price: 25,
          stats: { defense: 3, hp: 12 },
          equipped: true,
          description: "Green tunic that blends in with nature."
        },
        {
          id: "leather-boots",
          name: "Leather Boots",
          type: "boot",
          rarity: "common",
          price: 15,
          stats: { hp: 5 },
          equipped: true,
          description: "Light boots for quick movement."
        }
      ];
  }
}

export function getInitialCharacterStats(charClass: CharacterClass) {
  switch (charClass) {
    case "mage":
      return { hp: 60, maxHp: 60, mp: 100, maxMp: 100, attack: 15, defense: 5, magicPower: 20, speed: 10, rank: "F" as const, skills: ["bolt", "defend", "flee"], currentRegion: "Hub Town" };
    case "warrior":
      return { hp: 100, maxHp: 100, mp: 30, maxMp: 30, attack: 20, defense: 15, magicPower: 5, speed: 10, rank: "F" as const, skills: ["slash", "defend", "flee"], currentRegion: "Hub Town" };
    case "priest":
      return { hp: 80, maxHp: 80, mp: 80, maxMp: 80, attack: 12, defense: 10, magicPower: 15, speed: 10, rank: "F" as const, skills: ["smite", "defend", "flee"], currentRegion: "Hub Town" };
    case "rogue":
      return { hp: 75, maxHp: 75, mp: 50, maxMp: 50, attack: 18, defense: 8, magicPower: 10, speed: 15, rank: "F" as const, skills: ["slash", "defend", "flee"], currentRegion: "Hub Town" };
    case "archer":
      return { hp: 80, maxHp: 80, mp: 40, maxMp: 40, attack: 16, defense: 10, magicPower: 5, speed: 12, rank: "F" as const, skills: ["slash", "defend", "flee"], currentRegion: "Hub Town" };
  }
}

export const SHOP_ITEMS: InventoryItem[] = [
  // ── FOOD ITEMS ─────────────────────────────────────────
  {
    id: "food-bread",
    name: "Stale Bread",
    type: "food",
    rarity: "common",
    price: 5,
    stats: {},
    restores: { hp: 15 },
    equipped: false,
    description: "Tough to chew, but it fills the stomach."
  },
  {
    id: "food-milk",
    name: "Fresh Milk",
    type: "food",
    rarity: "common",
    price: 8,
    stats: {},
    restores: { mp: 20 },
    equipped: false,
    description: "A refreshing drink that restores magical energy."
  },
  {
    id: "food-meat",
    name: "Roasted Meat",
    type: "food",
    rarity: "common",
    price: 15,
    stats: {},
    restores: { hp: 40 },
    equipped: false,
    description: "A hearty piece of meat that satisfies hunger."
  },
  {
    id: "food-beer",
    name: "Dwarven Beer",
    type: "food",
    rarity: "common",
    price: 20,
    stats: {},
    restores: { hp: 20, mp: 20 },
    equipped: false,
    description: "A strong ale that vitalizes both body and mind."
  },
  {
    id: "food-honey-cake",
    name: "Honey Cake",
    type: "food",
    rarity: "common",
    price: 25,
    stats: {},
    restores: { hp: 35, mp: 15 },
    equipped: false,
    description: "A sweet treat baked with wild honey. Restores both health and mana."
  },
  {
    id: "food-elixir-soup",
    name: "Elixir Soup",
    type: "food",
    rarity: "common",
    price: 35,
    stats: {},
    restores: { hp: 50, mp: 30 },
    equipped: false,
    description: "A magical broth infused with rare herbs. Healers swear by its restorative properties."
  },
  {
    id: "food-dragon-fruit",
    name: "Dragon Fruit",
    type: "food",
    rarity: "rare",
    price: 60,
    stats: {},
    restores: { hp: 80, mp: 50 },
    equipped: false,
    description: "A fiery fruit that burns with inner warmth. Consumed by adventurers seeking great restoration."
  },
  // ── POTIONS ────────────────────────────────────────────
  {
    id: "potion-health-minor",
    name: "Minor Health Potion",
    type: "food",
    rarity: "common",
    price: 12,
    stats: {},
    restores: { hp: 25 },
    equipped: false,
    description: "A basic red potion that mends small wounds."
  },
  {
    id: "potion-health",
    name: "Health Potion",
    type: "food",
    rarity: "common",
    price: 30,
    stats: {},
    restores: { hp: 60 },
    equipped: false,
    description: "A potent red potion that accelerates natural healing."
  },
  {
    id: "potion-health-major",
    name: "Major Health Potion",
    type: "food",
    rarity: "rare",
    price: 75,
    stats: {},
    restores: { hp: 120 },
    equipped: false,
    description: "A powerful crimson elixir that can bring an adventurer back from the brink of death."
  },
  {
    id: "potion-mana-minor",
    name: "Minor Mana Potion",
    type: "food",
    rarity: "common",
    price: 10,
    stats: {},
    restores: { mp: 25 },
    equipped: false,
    description: "A shimmering blue potion that replenishes magical energy."
  },
  {
    id: "potion-mana",
    name: "Mana Potion",
    type: "food",
    rarity: "common",
    price: 28,
    stats: {},
    restores: { mp: 55 },
    equipped: false,
    description: "A deep blue elixir that surges with arcane power."
  },
  {
    id: "potion-mana-major",
    name: "Major Mana Potion",
    type: "food",
    rarity: "rare",
    price: 70,
    stats: {},
    restores: { mp: 110 },
    equipped: false,
    description: "A radiant azure draught that overflows with magical essence."
  },
  {
    id: "potion-elixir-vitality",
    name: "Elixir of Vitality",
    type: "food",
    rarity: "rare",
    price: 100,
    stats: {},
    restores: { hp: 100, mp: 80 },
    equipped: false,
    description: "A legendary golden potion that restores both body and spirit to peak condition."
  },
  {
    id: "potion-strength",
    name: "Potion of Strength",
    type: "food",
    rarity: "common",
    price: 45,
    stats: { attack: 5 },
    restores: {},
    equipped: false,
    description: "A bubbling red concoction that temporarily boosts physical power."
  },
  {
    id: "potion-defense",
    name: "Potion of Iron Skin",
    type: "food",
    rarity: "common",
    price: 45,
    stats: { defense: 5 },
    restores: {},
    equipped: false,
    description: "A metallic potion that hardens the skin like iron."
  },
  {
    id: "potion-magic",
    name: "Potion of Arcane Power",
    type: "food",
    rarity: "common",
    price: 50,
    stats: { magicPower: 8 },
    restores: {},
    equipped: false,
    description: "A swirling purple elixir that amplifies magical abilities."
  },
  // ── SPECIAL CONSUMABLES ────────────────────────────────
  {
    id: "scroll-teleport",
    name: "Scroll of Recall",
    type: "food",
    rarity: "common",
    price: 40,
    stats: {},
    restores: { hp: 30, mp: 30 },
    equipped: false,
    description: "A magical scroll that returns you to safety while mending minor injuries."
  },
  {
    id: "crystal-healing",
    name: "Healing Crystal",
    type: "food",
    rarity: "rare",
    price: 85,
    stats: {},
    restores: { hp: 90 },
    equipped: false,
    description: "A glowing crystal that channels restorative energy when crushed."
  },
  {
    id: "amulet-revival",
    name: "Phoenix Feather",
    type: "food",
    rarity: "legendary",
    price: 250,
    stats: {},
    restores: { hp: 200, mp: 150 },
    equipped: false,
    description: "A radiant feather from a phoenix. When used, it bestows incredible healing power."
  },
  // ── WARRIOR GEAR ──────────────────────────────────────
  {
    id: "bronze-sword",
    name: "Bronze Sword",
    type: "weapon",
    rarity: "common",
    price: 50,
    stats: { attack: 12 },
    description: "A basic bronze sword for new warriors.",
    equipped: false,
    allowedClasses: ["warrior"]
  },
  {
    id: "steel-greatsword",
    name: "Steel Greatsword",
    type: "weapon",
    rarity: "rare",
    price: 250,
    stats: { attack: 25, defense: 5 },
    description: "A heavy steel blade that offers both offense and defense.",
    equipped: false,
    allowedClasses: ["warrior"]
  },
  {
    id: "heavy-steel-axe",
    name: "Heavy Steel Axe",
    type: "weapon",
    rarity: "rare",
    price: 280,
    stats: { attack: 30 },
    description: "A powerful axe designed for crushing through enemy defenses.",
    equipped: false,
    allowedClasses: ["warrior"]
  },
  {
    id: "mithril-cleaver",
    name: "Mithril Cleaver",
    type: "weapon",
    rarity: "epic",
    price: 800,
    stats: { attack: 45, defense: 10 },
    description: "Forged from rare mithril, it cuts through armor like butter.",
    equipped: false,
    allowedClasses: ["warrior"]
  },
  {
    id: "ascalon-blade",
    name: "Ascalon, Dragon's Bane",
    type: "weapon",
    rarity: "legendary",
    price: 2500,
    stats: { attack: 85, defense: 15, hp: 50 },
    description: "A legendary blade said to have slain a thousand dragons.",
    equipped: false,
    allowedClasses: ["warrior"]
  },
  {
    id: "warrior-chainmail",
    name: "Chainmail",
    type: "armor",
    rarity: "common",
    price: 60,
    stats: { defense: 15 },
    description: "Basic chainmail armor for physical protection.",
    equipped: false,
    allowedClasses: ["warrior"]
  },
  {
    id: "iron-plate",
    name: "Iron Plate",
    type: "armor",
    rarity: "rare",
    price: 300,
    stats: { defense: 35, hp: 40 },
    description: "Solid iron plates to withstand heavy blows.",
    equipped: false,
    allowedClasses: ["warrior"]
  },
  {
    id: "splint-mail",
    name: "Splint Mail",
    type: "armor",
    rarity: "rare",
    price: 320,
    stats: { defense: 40, hp: 20 },
    description: "Reinforced mail with metal splints for superior protection.",
    equipped: false,
    allowedClasses: ["warrior"]
  },
  {
    id: "mithril-armor",
    name: "Mithril Armor",
    type: "armor",
    rarity: "epic",
    price: 1000,
    stats: { defense: 65, hp: 100 },
    description: "Lightweight yet incredibly tough mithril protection.",
    equipped: false,
    allowedClasses: ["warrior"]
  },
  {
    id: "dreadnought-plate",
    name: "Dreadnought Plate",
    type: "armor",
    rarity: "legendary",
    price: 3500,
    stats: { defense: 110, hp: 250, attack: 15 },
    description: "The ultimate armor for those who fear no enemy.",
    equipped: false,
    allowedClasses: ["warrior"]
  },

  // ── MAGE GEAR ──────────────────────────────────────────
  {
    id: "wooden-staff",
    name: "Wooden Staff",
    type: "weapon",
    rarity: "common",
    price: 55,
    stats: { magicPower: 15 },
    description: "A simple staff to focus basic magical energy.",
    equipped: false,
    allowedClasses: ["mage"]
  },
  {
    id: "apprentice-wand",
    name: "Apprentice Wand",
    type: "weapon",
    rarity: "rare",
    price: 280,
    stats: { magicPower: 30, mp: 25 },
    description: "A refined wand for aspiring sorcerers.",
    equipped: false,
    allowedClasses: ["mage"]
  },
  {
    id: "spellblade",
    name: "Spellblade",
    type: "weapon",
    rarity: "rare",
    price: 300,
    stats: { attack: 20, magicPower: 25 },
    description: "A magical blade that channels the user's mana into strikes.",
    equipped: false,
    allowedClasses: ["mage"]
  },
  {
    id: "crystal-staff",
    name: "Crystal Staff",
    type: "weapon",
    rarity: "epic",
    price: 900,
    stats: { magicPower: 55, mp: 60 },
    description: "A staff topped with a focusing crystal of pure arcane power.",
    equipped: false,
    allowedClasses: ["mage"]
  },
  {
    id: "phoenix-core-staff",
    name: "Phoenix's Core",
    type: "weapon",
    rarity: "legendary",
    price: 2800,
    stats: { magicPower: 95, mp: 150, attack: 20 },
    description: "Channels the eternal flame of a phoenix.",
    equipped: false,
    allowedClasses: ["mage"]
  },
  {
    id: "scholar-robe",
    name: "Scholar's Robe",
    type: "armor",
    rarity: "common",
    price: 45,
    stats: { defense: 8, magicPower: 12 },
    description: "Simple robes worn by students of the arcane.",
    equipped: false,
    allowedClasses: ["mage"]
  },
  {
    id: "silk-tunic",
    name: "Silk Tunic",
    type: "armor",
    rarity: "rare",
    price: 250,
    stats: { defense: 20, magicPower: 25, mp: 30 },
    description: "Magic-infused silk that offers decent protection.",
    equipped: false,
    allowedClasses: ["mage"]
  },
  {
    id: "sorcerer-tunic",
    name: "Sorcerer's Tunic",
    type: "armor",
    rarity: "rare",
    price: 260,
    stats: { defense: 25, mp: 30 },
    description: "Reinforcd robes with protective charms.",
    equipped: false,
    allowedClasses: ["mage"]
  },
  {
    id: "arcane-mantle",
    name: "Arcane Mantle",
    type: "armor",
    rarity: "epic",
    price: 850,
    stats: { defense: 45, magicPower: 50, mp: 80 },
    description: "A mantle that pulses with visible magical energy.",
    equipped: false,
    allowedClasses: ["mage"]
  },
  {
    id: "ether-woven-regalia-mage",
    name: "Ether-Woven Regalia",
    type: "armor",
    rarity: "legendary",
    price: 3200,
    stats: { defense: 85, magicPower: 80, mp: 150, hp: 200 },
    description: "Armor woven from the fabric of reality itself.",
    equipped: false,
    allowedClasses: ["mage"]
  },

  // ── PRIEST GEAR ────────────────────────────────────────
  {
    id: "iron-mace",
    name: "Iron Mace",
    type: "weapon",
    rarity: "common",
    price: 50,
    stats: { attack: 8, magicPower: 8 },
    description: "A sturdy iron mace for divine strikes.",
    equipped: false,
    allowedClasses: ["priest"]
  },
  {
    id: "silver-scepter",
    name: "Silver Scepter",
    type: "weapon",
    rarity: "rare",
    price: 260,
    stats: { attack: 15, magicPower: 20, mp: 20 },
    description: "A silver scepter that amplifies holy light.",
    equipped: false,
    allowedClasses: ["priest"]
  },
  {
    id: "blessed-flail",
    name: "Blessed Flail",
    type: "weapon",
    rarity: "rare",
    price: 270,
    stats: { attack: 18, magicPower: 18 },
    description: "A consecrated flail used by warrior priests.",
    equipped: false,
    allowedClasses: ["priest"]
  },
  {
    id: "golden-crozier",
    name: "Golden Crozier",
    type: "weapon",
    rarity: "epic",
    price: 850,
    stats: { attack: 30, magicPower: 45, mp: 50 },
    description: "A golden staff carried by high-ranking prelates.",
    equipped: false,
    allowedClasses: ["priest"]
  },
  {
    id: "seraphim-staff",
    name: "Staff of the Seraphim",
    type: "weapon",
    rarity: "legendary",
    price: 3000,
    stats: { attack: 55, magicPower: 85, mp: 120, hp: 100 },
    description: "A legendary staff blessed by the highest angels.",
    equipped: false,
    allowedClasses: ["priest"]
  },
  {
    id: "novice-habit",
    name: "Novice Habit",
    type: "armor",
    rarity: "common",
    price: 50,
    stats: { defense: 10, magicPower: 10 },
    description: "Basic attire for those just beginning their holy journey.",
    equipped: false,
    allowedClasses: ["priest"]
  },
  {
    id: "cleric-vestment",
    name: "Cleric's Vestment",
    type: "armor",
    rarity: "rare",
    price: 280,
    stats: { defense: 25, magicPower: 25, hp: 40 },
    description: "Durable vestments for traveling clerics.",
    equipped: false,
    allowedClasses: ["priest"]
  },
  {
    id: "padded-vestment",
    name: "Padded Vestment",
    type: "armor",
    rarity: "rare",
    price: 290,
    stats: { defense: 30, hp: 30 },
    description: "Reinforce robes with quilted layers for extra resilience.",
    equipped: false,
    allowedClasses: ["priest"]
  },
  {
    id: "saint-robe",
    name: "Saint's Robe",
    type: "armor",
    rarity: "epic",
    price: 900,
    stats: { defense: 50, magicPower: 45, hp: 100 },
    description: "Robes said to have been worn by a legendary saint.",
    equipped: false,
    allowedClasses: ["priest"]
  },
  {
    id: "high-sanctum-vestment",
    name: "High Sanctum Vestment",
    type: "armor",
    rarity: "legendary",
    price: 3400,
    stats: { defense: 90, magicPower: 75, hp: 250, mp: 150 },
    description: "The peak of holy protection, crafted in the High Sanctum.",
    equipped: false,
    allowedClasses: ["priest"]
  },

  // ── ROGUE GEAR ─────────────────────────────────────────
  {
    id: "item-rogue-dagger-bronze",
    name: "Bronze Dagger",
    type: "weapon",
    rarity: "common",
    price: 45,
    stats: { attack: 14 },
    description: "A simple, sharp dagger for quick strikes.",
    equipped: false,
    allowedClasses: ["rogue"]
  },
  {
    id: "item-rogue-twinblades",
    name: "Steel Twinblades",
    type: "weapon",
    rarity: "rare",
    price: 240,
    stats: { attack: 28 },
    description: "A pair of perfectly balanced steel blades.",
    equipped: false,
    allowedClasses: ["rogue"]
  },
  {
    id: "item-rogue-dirk-serrated",
    name: "Serrated Dirk",
    type: "weapon",
    rarity: "rare",
    price: 250,
    stats: { attack: 32 },
    description: "A maliciously jagged blade that leaves deep wounds.",
    equipped: false,
    allowedClasses: ["rogue"]
  },
  {
    id: "item-rogue-shadowfang",
    name: "Shadow Fang",
    type: "weapon",
    rarity: "epic",
    price: 750,
    stats: { attack: 50, magicPower: 10 },
    description: "A dark blade that seems to devour light.",
    equipped: false,
    allowedClasses: ["rogue"]
  },
  {
    id: "item-rogue-blade-whispers",
    name: "Blade of Whispers",
    type: "weapon",
    rarity: "legendary",
    price: 2600,
    stats: { attack: 90, magicPower: 20 },
    description: "Legendary daggers that cut as deep as silence.",
    equipped: false,
    allowedClasses: ["rogue"]
  },
  {
    id: "item-rogue-leather-tunic",
    name: "Leather Tunic",
    type: "armor",
    rarity: "common",
    price: 55,
    stats: { defense: 12 },
    description: "Lightweight leather protection for agile fighters.",
    equipped: false,
    allowedClasses: ["rogue"]
  },
  {
    id: "item-rogue-hard-leather",
    name: "Hard Leather Armor",
    type: "armor",
    rarity: "rare",
    price: 280,
    stats: { defense: 30, hp: 30 },
    description: "Reinforced leather for better combat durability.",
    equipped: false,
    allowedClasses: ["rogue"]
  },
  {
    id: "item-rogue-studded-leather",
    name: "Studded Leather",
    type: "armor",
    rarity: "rare",
    price: 290,
    stats: { defense: 35, hp: 20 },
    description: "Leather armor reinforced with steel studs for added deflection.",
    equipped: false,
    allowedClasses: ["rogue"]
  },
  {
    id: "item-rogue-assassin-garb",
    name: "Assassin's Garb",
    type: "armor",
    rarity: "epic",
    price: 850,
    stats: { defense: 55, hp: 70 },
    description: "Blackened armor designed for stealth and lethal efficiency.",
    equipped: false,
    allowedClasses: ["rogue"]
  },
  {
    id: "item-rogue-shadowalker-cloak",
    name: "Shadowalker's Cloak",
    type: "armor",
    rarity: "legendary",
    price: 3100,
    stats: { defense: 95, hp: 180, attack: 10 },
    description: "A cloak made of living shadows that protects its wearer.",
    equipped: false,
    allowedClasses: ["rogue"]
  },

  // ── ARCHER GEAR ────────────────────────────────────────
  {
    id: "item-archer-shortbow",
    name: "Shortbow",
    type: "weapon",
    rarity: "common",
    price: 50,
    stats: { attack: 13 },
    description: "A basic shortbow for new hunters.",
    equipped: false,
    allowedClasses: ["archer"]
  },
  {
    id: "item-archer-longbow",
    name: "Longbow",
    type: "weapon",
    rarity: "rare",
    price: 260,
    stats: { attack: 26 },
    description: "A large bow with great power and range.",
    equipped: false,
    allowedClasses: ["archer"]
  },
  {
    id: "item-archer-composite-bow",
    name: "Composite Bow",
    type: "weapon",
    rarity: "rare",
    price: 270,
    stats: { attack: 30 },
    description: "A bow made from multiple materials for maximum tension.",
    equipped: false,
    allowedClasses: ["archer"]
  },
  {
    id: "item-archer-recurve",
    name: "Recurve Bow",
    type: "weapon",
    rarity: "epic",
    price: 800,
    stats: { attack: 48 },
    description: "An advanced recurve bow with incredible tension.",
    equipped: false,
    allowedClasses: ["archer"]
  },
  {
    id: "item-archer-galepiercer",
    name: "Gale-Piercer Bow",
    type: "weapon",
    rarity: "legendary",
    price: 2700,
    stats: { attack: 88, magicPower: 10 },
    description: "A legendary bow that fires arrows faster than the wind.",
    equipped: false,
    allowedClasses: ["archer"]
  },
  {
    id: "item-archer-hunters-vest",
    name: "Hunter's Vest",
    type: "armor",
    rarity: "common",
    price: 50,
    stats: { defense: 11 },
    description: "Functional vest for hunters and trackers.",
    equipped: false,
    allowedClasses: ["archer"]
  },
  {
    id: "item-archer-rangers-jacket",
    name: "Ranger's Jacket",
    type: "armor",
    rarity: "rare",
    price: 270,
    stats: { defense: 28, hp: 35 },
    description: "Durable gear for long periods in the wild.",
    equipped: false,
    allowedClasses: ["archer"]
  },
  {
    id: "item-archer-reinforced-tunic",
    name: "Reinforced Tunic",
    type: "armor",
    rarity: "rare",
    price: 280,
    stats: { defense: 32, hp: 25 },
    description: "A tracker's tunic reinforced with hide and chain links.",
    equipped: false,
    allowedClasses: ["archer"]
  },
  {
    id: "item-archer-forest-warden",
    name: "Forest Warden Leather",
    type: "armor",
    rarity: "epic",
    price: 880,
    stats: { defense: 52, hp: 85 },
    description: "Sturdy leather armor favored by forest defenders.",
    equipped: false,
    allowedClasses: ["archer"]
  },
  {
    id: "item-archer-windwalker",
    name: "Wind-Walker Suit",
    type: "armor",
    rarity: "legendary",
    price: 3300,
    stats: { defense: 105, hp: 220, attack: 15 },
    description: "Enchanted armor that lets the wearer move with the wind.",
    equipped: false,
    allowedClasses: ["archer"]
  }
];

export const ALL_ITEMS = SHOP_ITEMS;

// ============================================================
// ENEMIES - 30+ unique enemies organized by category
// ============================================================
export const ENEMIES: Record<string, Enemy> = {
  // ── BEASTS ──────────────────────────────────────────────
  "green-slime": {
    id: "green-slime", name: "Green Slime", hp: 20, maxHp: 20,
    attack: 4, defense: 1, magicPower: 0, xpReward: 15, goldReward: 8,
    description: "A jiggling mass of green goo. Weak but plentiful.",
    sprite: "slime", battleTheme: "grassland"
  },
  "giant-rat": {
    id: "giant-rat", name: "Giant Rat", hp: 25, maxHp: 25,
    attack: 7, defense: 2, magicPower: 0, xpReward: 20, goldReward: 10,
    description: "A disease-ridden rodent the size of a dog.",
    sprite: "rat", battleTheme: "grassland"
  },
  "wild-boar": {
    id: "wild-boar", name: "Wild Boar", hp: 45, maxHp: 45,
    attack: 14, defense: 8, magicPower: 0, xpReward: 35, goldReward: 18,
    description: "A tusked beast that charges with savage fury.",
    sprite: "boar", battleTheme: "forest"
  },
  "terror-hawk": {
    id: "terror-hawk", name: "Terror Hawk", hp: 35, maxHp: 35,
    attack: 18, defense: 4, magicPower: 0, xpReward: 40, goldReward: 22,
    description: "A massive bird of prey with razor-sharp talons.",
    sprite: "hawk", battleTheme: "forest"
  },
  "dire-bear": {
    id: "dire-bear", name: "Dire Bear", hp: 90, maxHp: 90,
    attack: 22, defense: 14, magicPower: 0, xpReward: 80, goldReward: 45,
    description: "An enormous bear corrupted by dark energy. Massive and relentless.",
    sprite: "bear", battleTheme: "forest"
  },
  "wolf-pack": {
    id: "wolf-pack", name: "Wolf Pack", hp: 50, maxHp: 50,
    attack: 16, defense: 6, magicPower: 0, xpReward: 45, goldReward: 25,
    description: "A fierce pack of man-eating wolves guarding their nest.",
    sprite: "wolf", battleTheme: "forest"
  },

  // ── UNDEAD ──────────────────────────────────────────────
  "skeleton-soldier": {
    id: "skeleton-soldier", name: "Skeleton Soldier", hp: 35, maxHp: 35,
    attack: 12, defense: 6, magicPower: 3, xpReward: 30, goldReward: 15,
    description: "An animated pile of bones wielding a rusty sword.",
    sprite: "skeleton", battleTheme: "undead"
  },
  "zombie": {
    id: "zombie", name: "Shambling Zombie", hp: 50, maxHp: 50,
    attack: 10, defense: 3, magicPower: 5, xpReward: 35, goldReward: 18,
    description: "A decaying corpse that hungers for the living.",
    sprite: "zombie", battleTheme: "undead"
  },
  "wraith": {
    id: "wraith", name: "Wraith", hp: 40, maxHp: 40,
    attack: 8, defense: 2, magicPower: 20, xpReward: 55, goldReward: 30,
    description: "A spectral being of pure malice that drains life force.",
    sprite: "wraith", battleTheme: "undead"
  },
  "lich": {
    id: "lich", name: "Lich", hp: 75, maxHp: 75,
    attack: 10, defense: 8, magicPower: 30, xpReward: 120, goldReward: 65,
    description: "An undead sorcerer of terrible power, sustained by dark magic.",
    sprite: "lich", battleTheme: "undead"
  },
  "death-knight": {
    id: "death-knight", name: "Death Knight", hp: 100, maxHp: 100,
    attack: 25, defense: 18, magicPower: 12, xpReward: 150, goldReward: 80,
    description: "A fallen paladin who serves darkness, clad in cursed black armor.",
    sprite: "death-knight", battleTheme: "undead"
  },
  "restless-ghost": {
    id: "restless-ghost", name: "Restless Ghost", hp: 35, maxHp: 35,
    attack: 14, defense: 2, magicPower: 18, xpReward: 50, goldReward: 25,
    description: "A sorrowful spirit unable to find peace.",
    sprite: "ghost", battleTheme: "undead"
  },

  // ── ELEMENTAL ──────────────────────────────────────────
  "fire-sprite": {
    id: "fire-sprite", name: "Fire Sprite", hp: 30, maxHp: 30,
    attack: 6, defense: 3, magicPower: 16, xpReward: 35, goldReward: 20,
    description: "A tiny flame spirit that dances through the air.",
    sprite: "fire-sprite", battleTheme: "fire"
  },
  "ice-golem": {
    id: "ice-golem", name: "Ice Golem", hp: 70, maxHp: 70,
    attack: 15, defense: 20, magicPower: 10, xpReward: 65, goldReward: 35,
    description: "A construct of frozen ice, slow but incredibly tough.",
    sprite: "ice-golem", battleTheme: "ice"
  },
  "thunder-hawk": {
    id: "thunder-hawk", name: "Thunder Hawk", hp: 45, maxHp: 45,
    attack: 20, defense: 5, magicPower: 15, xpReward: 55, goldReward: 30,
    description: "A storm bird that crackles with electrical energy.",
    sprite: "thunder-hawk", battleTheme: "mountain"
  },
  "water-serpent": {
    id: "water-serpent", name: "Water Serpent", hp: 55, maxHp: 55,
    attack: 16, defense: 8, magicPower: 14, xpReward: 50, goldReward: 28,
    description: "A sinuous aquatic creature that strikes from the depths.",
    sprite: "water-serpent", battleTheme: "water"
  },
  "earth-elemental": {
    id: "earth-elemental", name: "Earth Elemental", hp: 80, maxHp: 80,
    attack: 18, defense: 15, magicPower: 8, xpReward: 100, goldReward: 50,
    description: "A massive construct of rock and earth.",
    sprite: "earth-elemental", battleTheme: "mountain"
  },
  "storm-djinn": {
    id: "storm-djinn", name: "Storm Djinn", hp: 65, maxHp: 65,
    attack: 12, defense: 6, magicPower: 28, xpReward: 110, goldReward: 60,
    description: "An ancient wind spirit of devastating magical power.",
    sprite: "storm-djinn", battleTheme: "mountain"
  },

  // ── PLANT / INSECT ─────────────────────────────────────
  "treant": {
    id: "treant", name: "Ancient Treant", hp: 85, maxHp: 85,
    attack: 20, defense: 16, magicPower: 8, xpReward: 70, goldReward: 38,
    description: "A massive walking tree corrupted by fungal spores.",
    sprite: "treant", battleTheme: "forest"
  },
  "mushroom-horror": {
    id: "mushroom-horror", name: "Mushroom Horror", hp: 30, maxHp: 30,
    attack: 5, defense: 4, magicPower: 14, xpReward: 25, goldReward: 15,
    description: "A sentient fungus that releases toxic spores.",
    sprite: "mushroom", battleTheme: "forest"
  },
  "giant-spider": {
    id: "giant-spider", name: "Giant Spider", hp: 40, maxHp: 40,
    attack: 15, defense: 5, magicPower: 6, xpReward: 40, goldReward: 22,
    description: "A venomous arachnid lurking in dark caves.",
    sprite: "spider", battleTheme: "cave"
  },
  "mantis-warrior": {
    id: "mantis-warrior", name: "Mantis Warrior", hp: 55, maxHp: 55,
    attack: 22, defense: 7, magicPower: 0, xpReward: 50, goldReward: 28,
    description: "A blade-armed insectoid fighter with deadly precision.",
    sprite: "mantis", battleTheme: "forest"
  },

  // ── DEMONIC ────────────────────────────────────────────
  "imp": {
    id: "imp", name: "Imp", hp: 25, maxHp: 25,
    attack: 8, defense: 3, magicPower: 10, xpReward: 25, goldReward: 15,
    description: "A small, mischievous demon that throws fireballs.",
    sprite: "imp", battleTheme: "fire"
  },
  "shadow-fiend": {
    id: "shadow-fiend", name: "Shadow Fiend", hp: 55, maxHp: 55,
    attack: 18, defense: 5, magicPower: 16, xpReward: 60, goldReward: 35,
    description: "A creature born from nightmares, phasing between shadows.",
    sprite: "shadow-fiend", battleTheme: "undead"
  },
  "hellhound": {
    id: "hellhound", name: "Hellhound", hp: 60, maxHp: 60,
    attack: 22, defense: 8, magicPower: 8, xpReward: 65, goldReward: 38,
    description: "A fiery canine from the abyss, breathing brimstone.",
    sprite: "hellhound", battleTheme: "fire"
  },
  "succubus": {
    id: "succubus", name: "Succubus", hp: 50, maxHp: 50,
    attack: 14, defense: 6, magicPower: 22, xpReward: 75, goldReward: 42,
    description: "A seductive demon that drains life through dark magic.",
    sprite: "succubus", battleTheme: "fire"
  },
  "arch-demon": {
    id: "arch-demon", name: "Arch-Demon", hp: 120, maxHp: 120,
    attack: 28, defense: 15, magicPower: 25, xpReward: 200, goldReward: 100,
    description: "A lord of the underworld, wreathed in hellfire and shadow.",
    sprite: "arch-demon", battleTheme: "boss"
  },
  "dark-corrupter": {
    id: "dark-corrupter", name: "Dark Corrupter", hp: 65, maxHp: 65,
    attack: 10, defense: 6, magicPower: 22, xpReward: 75, goldReward: 40,
    description: "A shadowy entity seeking to corrupt the village.",
    sprite: "dark-corrupter", battleTheme: "undead"
  },

  // ── DRAGONS ────────────────────────────────────────────
  "wyvern": {
    id: "wyvern", name: "Wyvern", hp: 70, maxHp: 70,
    attack: 24, defense: 10, magicPower: 8, xpReward: 85, goldReward: 48,
    description: "A two-legged drake with venomous tail and leathery wings.",
    sprite: "wyvern", battleTheme: "mountain"
  },
  "drake": {
    id: "drake", name: "Fire Drake", hp: 90, maxHp: 90,
    attack: 26, defense: 14, magicPower: 18, xpReward: 120, goldReward: 65,
    description: "A young dragon that breathes scorching flames.",
    sprite: "drake", battleTheme: "fire"
  },
  "crystal-dragon": {
    id: "crystal-dragon", name: "Crystal Dragon", hp: 110, maxHp: 110,
    attack: 20, defense: 22, magicPower: 30, xpReward: 180, goldReward: 90,
    description: "A dragon whose scales shimmer with prismatic energy.",
    sprite: "crystal-dragon", battleTheme: "boss"
  },
  "elder-dragon": {
    id: "elder-dragon", name: "Elder Dragon", hp: 150, maxHp: 150,
    attack: 35, defense: 20, magicPower: 35, xpReward: 300, goldReward: 150,
    description: "An ancient wyrm of immeasurable power. Few survive its wrath.",
    sprite: "elder-dragon", battleTheme: "boss"
  },

  // ── HUMANOID ───────────────────────────────────────────
  "goblin": {
    id: "goblin", name: "Goblin Scout", hp: 22, maxHp: 22,
    attack: 8, defense: 3, magicPower: 0, xpReward: 18, goldReward: 12,
    description: "A sneaky little creature armed with a crude dagger.",
    sprite: "goblin", battleTheme: "cave"
  },
  "orc-warrior": {
    id: "orc-warrior", name: "Orc Warrior", hp: 65, maxHp: 65,
    attack: 20, defense: 10, magicPower: 0, xpReward: 55, goldReward: 30,
    description: "A brutal green-skinned fighter with a massive axe.",
    sprite: "orc", battleTheme: "forest"
  },
  "dark-mage": {
    id: "dark-mage", name: "Dark Mage", hp: 40, maxHp: 40,
    attack: 6, defense: 4, magicPower: 24, xpReward: 65, goldReward: 35,
    description: "A rogue sorcerer wielding forbidden magic.",
    sprite: "dark-mage", battleTheme: "undead"
  },
  "bandit-leader": {
    id: "bandit-leader", name: "Bandit Leader", hp: 60, maxHp: 60,
    attack: 20, defense: 8, magicPower: 2, xpReward: 50, goldReward: 30,
    description: "A ruthless outlaw leading the attack on the village.",
    sprite: "bandit", battleTheme: "grassland"
  },
  "honor-knight": {
    id: "honor-knight", name: "Honor Knight", hp: 70, maxHp: 70,
    attack: 22, defense: 12, magicPower: 5, xpReward: 70, goldReward: 40,
    description: "A skilled knight testing worthy warriors in combat.",
    sprite: "knight", battleTheme: "grassland"
  },

  // ── MAGICAL ────────────────────────────────────────────
  "wild-spirit": {
    id: "wild-spirit", name: "Wild Spirit", hp: 40, maxHp: 40,
    attack: 8, defense: 3, magicPower: 12, xpReward: 30, goldReward: 15,
    description: "An unstable magical entity born from wild arcane energy.",
    sprite: "spirit", battleTheme: "magical"
  },
  "arcane-book": {
    id: "arcane-book", name: "Arcane Book", hp: 30, maxHp: 30,
    attack: 15, defense: 5, magicPower: 20, xpReward: 40, goldReward: 20,
    description: "A sentient spellbook overflowing with chaotic magic.",
    sprite: "arcane-book", battleTheme: "magical"
  },
  "plague-beast": {
    id: "plague-beast", name: "Plague Beast", hp: 45, maxHp: 45,
    attack: 12, defense: 4, magicPower: 8, xpReward: 40, goldReward: 20,
    description: "A twisted creature spreading the mysterious illness.",
    sprite: "plague-beast", battleTheme: "undead"
  },
  "mimic": {
    id: "mimic", name: "Mimic", hp: 50, maxHp: 50,
    attack: 18, defense: 12, magicPower: 10, xpReward: 55, goldReward: 45,
    description: "A treasure chest that was never a treasure chest.",
    sprite: "mimic", battleTheme: "cave"
  },
};

// Quests data
export const QUESTS: Quest[] = [
  // 🔮 MAGE QUESTS
  {
    id: "mage-library",
    title: "The Cursed Library",
    description: "The village library has been overtaken by wild magic books. Exterminate the possessed Grimoires to restore order.",
    class: "mage",
    minLevel: 1,
    region: "Northern Field",
    bounty: {
      targetMonsterId: "arcane-book",
      targetCount: 5
    },
    xpReward: 100,
    goldReward: 50
  },
  {
    id: "mage-apprentice",
    title: "The Missing Apprentice",
    description: "A young apprentice is trapped in the Whispering Woods. Clear the wild spirits to ensure their safe return.",
    class: "mage",
    minLevel: 1,
    region: "Whispering Woods",
    bounty: {
      targetMonsterId: "wild-spirit",
      targetCount: 8
    },
    xpReward: 120,
    goldReward: 60
  },
  {
    id: "mage-elemental",
    title: "The Elemental Disturbance",
    description: "An earth elemental has awakened in the Mountain Pass. Banish the rogue elementals to restore the balance of nature.",
    class: "mage",
    minLevel: 2,
    region: "Mountain Pass",
    bounty: {
      targetMonsterId: "earth-elemental",
      targetCount: 3
    },
    xpReward: 200,
    goldReward: 100
  },
  {
    id: "mage-crystalcave",
    title: "The Crystal Caverns",
    description: "Strange magical crystals have been growing in the old mines, attracting dangerous creatures. The miners need your help.",
    class: "mage",
    minLevel: 2,
    region: "Crystal Caverns",
    bounty: {
      targetMonsterId: "crystal-dragon",
      targetCount: 3
    },
    xpReward: 70,
    goldReward: 40
  },
  {
    id: "mage-tower",
    title: "The Dark Mage's Tower",
    description: "A rogue mage has taken up residence in the old watchtower, conducting dangerous experiments that threaten the region.",
    class: "mage",
    minLevel: 3,
    region: "Shadow Tower",
    bounty: {
      targetMonsterId: "dark-mage",
      targetCount: 5
    },
    xpReward: 80,
    goldReward: 40
  },
  {
    id: "mage-astral-plane",
    title: "The Astral Tear",
    description: "A tear in the astral plane has opened in the Observatory. Close it before the Void Terror consumes our world.",
    class: "mage",
    minLevel: 4,
    region: "Astral Observatory",
    bounty: {
      targetMonsterId: "void-terror",
      targetCount: 5
    },
    xpReward: 120,
    goldReward: 60
  },
  // ⚔️ WARRIOR QUESTS
  {
    id: "warrior-village",
    title: "The Bandit Scourge",
    description: "Bandits are raiding the Northern Village. Defeat their leaders to protect the villagers.",
    class: "warrior",
    minLevel: 1,
    region: "Northern Field",
    bounty: {
      targetMonsterId: "bandit-leader",
      targetCount: 5
    },
    xpReward: 150,
    goldReward: 80
  },
  {
    id: "warrior-duel",
    title: "The Duel of Honor",
    description: "A proud knight has challenged any warrior to a duel. Win and earn respect and rewards!",
    class: "warrior",
    minLevel: 2,
    region: "Training Grounds",
    bounty: {
      targetMonsterId: "honor-knight",
      targetCount: 5
    },
    xpReward: 70,
    goldReward: 40
  },
  {
    id: "warrior-monster",
    title: "The Monster Nest",
    description: "A nest of man-eating wolves has appeared near the trade route. Merchants are afraid to pass.",
    class: "warrior",
    minLevel: 1,
    region: "Trade Route",
    bounty: {
      targetMonsterId: "wolf-pack",
      targetCount: 5
    },
    xpReward: 55,
    goldReward: 30
  },
  {
    id: "warrior-orc-camp",
    title: "The Orc Encampment",
    description: "Orcs have set up a war camp near the village. Their raiding parties grow bolder each night.",
    class: "warrior",
    minLevel: 2,
    region: "Dark Forest",
    bounty: {
      targetMonsterId: "orc-warrior",
      targetCount: 5
    },
    xpReward: 85,
    goldReward: 50
  },
  {
    id: "warrior-dragon-lair",
    title: "The Dragon's Lair",
    description: "A wyvern has taken residence in the mountain pass, terrorizing travelers and demanding tribute.",
    class: "warrior",
    minLevel: 3,
    region: "Dragon Peak",
    bounty: {
      targetMonsterId: "wyvern",
      targetCount: 5
    },
    xpReward: 50,
    goldReward: 25
  },
  {
    id: "warrior-kings-guard",
    title: "Defend the King",
    description: "An elite royal assassin has infiltrated the Capital City. Find and eliminate the threat to the crown.",
    class: "warrior",
    minLevel: 4,
    region: "Capital City",
    bounty: {
      targetMonsterId: "royal-assassin",
      targetCount: 5
    },
    xpReward: 220,
    goldReward: 150
  },
  // ⛑️ PRIEST QUESTS
  {
    id: "priest-plague",
    title: "The Plague Beasts",
    description: "A mysterious plague is being spread by foul beasts in the Southern Field. Eradicate them to stop the infection.",
    class: "priest",
    minLevel: 1,
    region: "Southern Field",
    bounty: {
      targetMonsterId: "plague-beast",
      targetCount: 6
    },
    xpReward: 200,
    goldReward: 100
  },
  {
    id: "priest-ghost",
    title: "The Ghost's Regret",
    description: "A restless spirit haunts the old church. It seems to be searching for something.",
    class: "priest",
    minLevel: 1,
    region: "Abandoned Church",
    bounty: {
      targetMonsterId: "restless-ghost",
      targetCount: 5
    },
    xpReward: 55,
    goldReward: 30
  },
  {
    id: "priest-blessing",
    title: "The Field Blessing",
    description: "The village elder asks you to perform a blessing ritual to protect the village from evil forces.",
    class: "priest",
    minLevel: 2,
    region: "Northern Field",
    bounty: {
      targetMonsterId: "dark-corrupter",
      targetCount: 5
    },
    xpReward: 75,
    goldReward: 45
  },
  {
    id: "priest-undead-crypt",
    title: "The Undead Crypt",
    description: "The ancient crypt beneath the church has been unsealed. Undead creatures pour forth each night.",
    class: "priest",
    minLevel: 2,
    region: "Sacred Catacombs",
    bounty: {
      targetMonsterId: "death-knight",
      targetCount: 5
    },
    xpReward: 80,
    goldReward: 45
  },
  {
    id: "priest-demon-portal",
    title: "The Demon Portal",
    description: "A portal to the underworld has opened in the cursed ruins. Demons are spilling into the world.",
    class: "priest",
    minLevel: 3,
    region: "Cursed Ruins",
    bounty: {
      targetMonsterId: "arch-demon",
      targetCount: 5
    },
    xpReward: 50,
    goldReward: 25
  },
  {
    id: "priest-celestial-shrine",
    title: "The Fallen Angel",
    description: "A corrupted celestial guardian has taken over the ancient shrine. Purify the guardian to restore peace.",
    class: "priest",
    minLevel: 4,
    region: "Celestial Shrine",
    bounty: {
      targetMonsterId: "fallen-angel",
      targetCount: 5
    },
    xpReward: 80,
    goldReward: 40
  },
  // ═══════════════════════════════════════════════════════════════
  // GUILD SYSTEM - REPEATABLE GOLD FARMING QUESTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "guild-bounty-slimes",
    title: "Guild Bounty: Slime Infestation",
    description: "The Adventurer's Guild has posted a bounty for clearing slimes from the eastern farmlands. A quick job for quick gold.",
    class: "mage",
    minLevel: 1,
    region: "Eastern Farmlands",
    bounty: {
      targetMonsterId: "green-slime",
      targetCount: 5
    },
    xpReward: 15,
    goldReward: 35
  },
  {
    id: "guild-bounty-rats",
    title: "Guild Bounty: Giant Rats",
    description: "The tavern cellar is overrun with giant rats. The innkeeper will pay well for a clean sweep.",
    class: "warrior",
    minLevel: 1,
    region: "Tavern Cellar",
    bounty: {
      targetMonsterId: "giant-rat",
      targetCount: 5
    },
    xpReward: 20,
    goldReward: 40
  },
  {
    id: "guild-bounty-undead",
    title: "Guild Bounty: Graveyard Shift",
    description: "Skeletons have been spotted wandering the old graveyard at night. The church offers a bounty for their destruction.",
    class: "priest",
    minLevel: 2,
    region: "Old Graveyard",
    bounty: {
      targetMonsterId: "skeleton-soldier",
      targetCount: 5
    },
    xpReward: 35,
    goldReward: 60
  },
  {
    id: "guild-escort-merchant",
    title: "Guild Contract: Merchant Escort",
    description: "A nervous merchant needs an escort through the forest. The guild guarantees payment upon safe arrival.",
    class: "warrior",
    minLevel: 2,
    region: "Forest Path",
    bounty: {
      targetMonsterId: "bandit-leader",
      targetCount: 5
    },
    xpReward: 45,
    goldReward: 80
  },
  {
    id: "guild-herb-gathering",
    title: "Guild Contract: Rare Herbs",
    description: "The guild alchemist needs rare herbs from the dangerous swamps. Double pay for hazardous work.",
    class: "priest",
    minLevel: 2,
    region: "Poison Swamp",
    bounty: {
      targetMonsterId: "water-serpent",
      targetCount: 5
    },
    xpReward: 40,
    goldReward: 70
  },
  {
    id: "guild-treasure-hunt",
    title: "Guild Contract: Lost Treasure",
    description: "An old map shows buried treasure in the caves. The guild wants a cut for providing the map.",
    class: "rogue",
    minLevel: 3,
    region: "Crystal Caverns",
    bounty: {
      targetMonsterId: "mimic",
      targetCount: 5
    },
    xpReward: 55,
    goldReward: 120
  },
  {
    id: "guild-monster-hunt",
    title: "Guild Contract: Monster Hunt",
    description: "A powerful beast has been terrorizing the mountain pass. The guild offers a massive bounty for its head.",
    class: "warrior",
    minLevel: 3,
    region: "Mountain Pass",
    bounty: {
      targetMonsterId: "dire-bear",
      targetCount: 5
    },
    xpReward: 100,
    goldReward: 200
  },
  {
    id: "guild-arcane-research",
    title: "Guild Contract: Arcane Research",
    description: "The mage guild needs someone to collect magical essence from wild spirits. Dangerous but lucrative.",
    class: "mage",
    minLevel: 3,
    region: "Mystic Grove",
    bounty: {
      targetMonsterId: "storm-djinn",
      targetCount: 5
    },
    xpReward: 90,
    goldReward: 180
  },
];

// Map regions to the mobs that can spawn there
export const REGION_MOBS: Record<string, string[]> = {
  "Hub Town": [],
  // Northern Field: bandits & dark magic — target for warrior-village, mage-library, priest-blessing quests.
  "Northern Field": ["bandit-leader", "orc-warrior", "arcane-book", "dark-corrupter", "giant-rat"],
  "Whispering Woods": ["wild-boar", "terror-hawk", "mushroom-horror", "treant", "wild-spirit"],
  "Mountain Pass": ["thunder-hawk", "earth-elemental", "ice-golem"],
  // Starter combat route also supports early guild bounties from Hub Town.
  "Trade Route": ["green-slime", "giant-rat", "skeleton-soldier", "wolf-pack", "bandit-leader", "orc-warrior"],
  "Training Grounds": ["honor-knight", "skeleton-soldier"],
  "Dark Forest": ["orc-warrior", "dire-bear", "dark-mage", "mantis-warrior"],
  "Dragon Peak": ["fire-sprite", "wyvern", "drake"],
  // Southern Field: plague beasts and undead terrorize the grasslands — target for priest-plague quest.
  "Southern Field": ["plague-beast", "zombie", "skeleton-soldier", "dark-corrupter"],
  "Abandoned Church": ["restless-ghost", "skeleton-soldier", "zombie"],
  "Sacred Catacombs": ["skeleton-soldier", "zombie", "wraith", "death-knight"],
  "Cursed Ruins": ["imp", "hellhound", "succubus", "arch-demon"],
  "Crystal Caverns": ["giant-spider", "mimic", "wild-spirit", "crystal-dragon"],
  "Shadow Tower": ["dark-mage", "wraith", "lich", "shadow-fiend"],
  "Capital City": [],
  "Astral Observatory": ["wild-spirit", "arcane-book", "storm-djinn", "void-terror"],
  "Celestial Shrine": ["wild-spirit", "priest-robes", "fallen-angel"], // Use priest as base for angel
};

// Map quests to their enemies
export const QUEST_ENEMIES: Record<string, string> = {
  "mage-library": "arcane-book",
  "mage-apprentice": "wild-spirit",
  "mage-elemental": "earth-elemental",
  "mage-crystalcave": "crystal-dragon",
  "mage-tower": "dark-mage",
  "warrior-village": "bandit-leader",
  "warrior-duel": "honor-knight",
  "warrior-monster": "wolf-pack",
  "warrior-orc-camp": "orc-warrior",
  "warrior-dragon-lair": "wyvern",
  "priest-plague": "plague-beast",
  "priest-ghost": "restless-ghost",
  "priest-blessing": "dark-corrupter",
  "priest-undead-crypt": "death-knight",
  "priest-demon-portal": "arch-demon",
  "mage-astral-plane": "void-terror",
  "warrior-kings-guard": "royal-assassin",
  "priest-celestial-shrine": "fallen-angel",
  // Guild quests
  "guild-bounty-slimes": "green-slime",
  "guild-bounty-rats": "giant-rat",
  "guild-bounty-undead": "skeleton-soldier",
  "guild-escort-merchant": "bandit-leader",
  "guild-herb-gathering": "water-serpent",
  "guild-treasure-hunt": "mimic",
  "guild-monster-hunt": "dire-bear",
  "guild-arcane-research": "storm-djinn",
};

export function getQuestEnemy(questId: string): Enemy | null {
  const enemyId = QUEST_ENEMIES[questId];
  return enemyId ? ENEMIES[enemyId] : null;
}

export function getEnemy(enemyId: string): Enemy | null {
  return ENEMIES[enemyId] || null;
}

// Function to get translated quests
export function getTranslatedQuests(t: (key: string) => string): Quest[] {
  return [
    // 🔮 MAGE QUESTS
    {
      id: "mage-library",
      title: t("quests.mage-library.title"),
      description: t("quests.mage-library.description"),
      class: "mage",
      minLevel: 1,
      region: "Northern Field",
      bounty: {
        targetMonsterId: "arcane-book",
        targetCount: 5
      },
      xpReward: 50,
      goldReward: 25
    },
    {
      id: "mage-apprentice",
      title: t("quests.mage-apprentice.title"),
      description: t("quests.mage-apprentice.description"),
      class: "mage",
      minLevel: 1,
      region: "Whispering Woods",
      bounty: {
        targetMonsterId: "wild-spirit",
        targetCount: 8
      },
      xpReward: 40,
      goldReward: 20,
      rewardSkill: "fireball"
    },
    {
      id: "mage-elemental",
      title: t("quests.mage-elemental.title"),
      description: t("quests.mage-elemental.description"),
      class: "mage",
      minLevel: 2,
      region: "Mountain Pass",
      bounty: {
        targetMonsterId: "earth-elemental",
        targetCount: 3
      },
      xpReward: 80,
      goldReward: 50
    },
    {
      id: "mage-crystalcave",
      title: t("quests.mage-crystalcave.title"),
      description: t("quests.mage-crystalcave.description"),
      class: "mage",
      minLevel: 2,
      region: "Crystal Caverns",
      bounty: {
        targetMonsterId: "crystal-dragon",
        targetCount: 3
      },
      xpReward: 70,
      goldReward: 40
    },
    {
      id: "mage-tower",
      title: t("quests.mage-tower.title"),
      description: t("quests.mage-tower.description"),
      class: "mage",
      minLevel: 3,
      region: "Shadow Tower",
      bounty: {
        targetMonsterId: "dark-mage",
        targetCount: 5
      },
      xpReward: 80,
      goldReward: 40
    },
    // ⚔️ WARRIOR QUESTS
    {
      id: "warrior-village",
      title: t("quests.warrior-village.title"),
      description: t("quests.warrior-village.description"),
      class: "warrior",
      minLevel: 1,
      region: "Hub Town",
      bounty: {
        targetMonsterId: "bandit-leader",
        targetCount: 5
      },
      xpReward: 150,
      goldReward: 80
    },
    {
      id: "warrior-duel",
      title: t("quests.warrior-duel.title"),
      description: t("quests.warrior-duel.description"),
      class: "warrior",
      minLevel: 2,
      region: "Training Grounds",
      bounty: {
        targetMonsterId: "honor-knight",
        targetCount: 5
      },
      xpReward: 70,
      goldReward: 40,
      rewardSkill: "strike"
    },
    {
      id: "warrior-monster",
      title: t("quests.warrior-monster.title"),
      description: t("quests.warrior-monster.description"),
      class: "warrior",
      minLevel: 1,
      region: "Trade Route",
      bounty: {
        targetMonsterId: "wolf-pack",
        targetCount: 5
      },
      xpReward: 55,
      goldReward: 30
    },
    {
      id: "warrior-orc-camp",
      title: t("quests.warrior-orc-camp.title"),
      description: t("quests.warrior-orc-camp.description"),
      class: "warrior",
      minLevel: 2,
      region: "Dark Forest",
      bounty: {
        targetMonsterId: "orc-warrior",
        targetCount: 5
      },
      xpReward: 85,
      goldReward: 50
    },
    {
      id: "warrior-dragon-lair",
      title: t("quests.warrior-dragon-lair.title"),
      description: t("quests.warrior-dragon-lair.description"),
      class: "warrior",
      minLevel: 3,
      region: "Dragon Peak",
      bounty: {
        targetMonsterId: "wyvern",
        targetCount: 5
      },
      xpReward: 50,
      goldReward: 25
    },
    // ⛑️ PRIEST QUESTS
    {
      id: "priest-plague",
      title: t("quests.priest-plague.title"),
      description: t("quests.priest-plague.description"),
      class: "priest",
      minLevel: 1,
      region: "Southern Field",
      bounty: {
        targetMonsterId: "plague-beast",
        targetCount: 6
      },
      xpReward: 120,
      goldReward: 60
    },
    {
      id: "priest-ghost",
      title: t("quests.priest-ghost.title"),
      description: t("quests.priest-ghost.description"),
      class: "priest",
      minLevel: 1,
      region: "Abandoned Church",
      bounty: {
        targetMonsterId: "restless-ghost",
        targetCount: 5
      },
      xpReward: 55,
      goldReward: 30
    },
    {
      id: "priest-blessing",
      title: t("quests.priest-blessing.title"),
      description: t("quests.priest-blessing.description"),
      class: "priest",
      minLevel: 2,
      region: "Northern Field",
      bounty: {
        targetMonsterId: "dark-corrupter",
        targetCount: 5
      },
      xpReward: 75,
      goldReward: 45
    },
    {
      id: "priest-undead-crypt",
      title: t("quests.priest-undead-crypt.title"),
      description: t("quests.priest-undead-crypt.description"),
      class: "priest",
      minLevel: 2,
      region: "Sacred Catacombs",
      bounty: {
        targetMonsterId: "death-knight",
        targetCount: 5
      },
      xpReward: 80,
      goldReward: 45
    },
    {
      id: "priest-demon-portal",
      title: t("quests.priest-demon-portal.title"),
      description: t("quests.priest-demon-portal.description"),
      class: "priest",
      minLevel: 3,
      region: "Cursed Ruins",
      bounty: {
        targetMonsterId: "arch-demon",
        targetCount: 5
      },
      xpReward: 50,
      goldReward: 25
    },
    // ═══════════════════════════════════════════════════════════════
    // GUILD SYSTEM - REPEATABLE GOLD FARMING QUESTS
    // ═══════════════════════════════════════════════════════════════
    {
      id: "guild-bounty-slimes",
      title: t("quests.guild-bounty-slimes.title"),
      description: t("quests.guild-bounty-slimes.description"),
      class: "mage",
      minLevel: 1,
      region: "Eastern Farmlands",
      bounty: {
        targetMonsterId: "green-slime",
        targetCount: 5
      },
      xpReward: 15,
      goldReward: 35
    },
    {
      id: "guild-bounty-rats",
      title: t("quests.guild-bounty-rats.title"),
      description: t("quests.guild-bounty-rats.description"),
      class: "warrior",
      minLevel: 1,
      region: "Tavern Cellar",
      bounty: {
        targetMonsterId: "giant-rat",
        targetCount: 5
      },
      xpReward: 20,
      goldReward: 40
    }
  ];
}

// Helper function to get translated enemy by ID
export function getTranslatedEnemy(enemyId: string, t: (key: string) => string): Enemy | null {
  const translatedEnemies = getTranslatedEnemies(t);
  return translatedEnemies[enemyId] || null;
}

// Function to get translated enemies
export function getTranslatedEnemies(t: (key: string) => string): Record<string, Enemy> {
  return {
    // ── BEASTS ──────────────────────────────────────────────
    "green-slime": {
      id: "green-slime", name: t("enemies.green-slime.name"), hp: 20, maxHp: 20,
      attack: 4, defense: 1, magicPower: 0, xpReward: 15, goldReward: 8,
      description: t("enemies.green-slime.description"),
      sprite: "slime", battleTheme: "grassland"
    },
    "giant-rat": {
      id: "giant-rat", name: t("enemies.giant-rat.name"), hp: 25, maxHp: 25,
      attack: 7, defense: 2, magicPower: 0, xpReward: 20, goldReward: 10,
      description: t("enemies.giant-rat.description"),
      sprite: "rat", battleTheme: "grassland"
    },
    "wild-boar": {
      id: "wild-boar", name: t("enemies.wild-boar.name"), hp: 45, maxHp: 45,
      attack: 14, defense: 8, magicPower: 0, xpReward: 35, goldReward: 18,
      description: t("enemies.wild-boar.description"),
      sprite: "boar", battleTheme: "forest"
    },
    "terror-hawk": {
      id: "terror-hawk", name: t("enemies.terror-hawk.name"), hp: 35, maxHp: 35,
      attack: 18, defense: 4, magicPower: 0, xpReward: 40, goldReward: 22,
      description: t("enemies.terror-hawk.description"),
      sprite: "hawk", battleTheme: "forest"
    },
    "dire-bear": {
      id: "dire-bear", name: t("enemies.dire-bear.name"), hp: 90, maxHp: 90,
      attack: 22, defense: 14, magicPower: 0, xpReward: 80, goldReward: 45,
      description: t("enemies.dire-bear.description"),
      sprite: "bear", battleTheme: "forest"
    },
    "wolf-pack": {
      id: "wolf-pack", name: t("enemies.wolf-pack.name"), hp: 50, maxHp: 50,
      attack: 16, defense: 6, magicPower: 0, xpReward: 45, goldReward: 25,
      description: t("enemies.wolf-pack.description"),
      sprite: "wolf", battleTheme: "forest"
    },

    // ── UNDEAD ──────────────────────────────────────────────
    "skeleton-soldier": {
      id: "skeleton-soldier", name: t("enemies.skeleton-soldier.name"), hp: 35, maxHp: 35,
      attack: 12, defense: 6, magicPower: 3, xpReward: 30, goldReward: 15,
      description: t("enemies.skeleton-soldier.description"),
      sprite: "skeleton", battleTheme: "undead"
    },
    "zombie": {
      id: "zombie", name: t("enemies.zombie.name"), hp: 50, maxHp: 50,
      attack: 10, defense: 3, magicPower: 5, xpReward: 35, goldReward: 18,
      description: t("enemies.zombie.description"),
      sprite: "zombie", battleTheme: "undead"
    },
    "wraith": {
      id: "wraith", name: t("enemies.wraith.name"), hp: 40, maxHp: 40,
      attack: 8, defense: 2, magicPower: 20, xpReward: 55, goldReward: 30,
      description: t("enemies.wraith.description"),
      sprite: "wraith", battleTheme: "undead"
    },
    "lich": {
      id: "lich", name: t("enemies.lich.name"), hp: 75, maxHp: 75,
      attack: 10, defense: 8, magicPower: 30, xpReward: 120, goldReward: 65,
      description: t("enemies.lich.description"),
      sprite: "lich", battleTheme: "undead"
    },
    "death-knight": {
      id: "death-knight", name: t("enemies.death-knight.name"), hp: 100, maxHp: 100,
      attack: 25, defense: 18, magicPower: 12, xpReward: 150, goldReward: 80,
      description: t("enemies.death-knight.description"),
      sprite: "death-knight", battleTheme: "undead"
    },
    "restless-ghost": {
      id: "restless-ghost", name: t("enemies.restless-ghost.name"), hp: 35, maxHp: 35,
      attack: 14, defense: 2, magicPower: 18, xpReward: 50, goldReward: 25,
      description: t("enemies.restless-ghost.description"),
      sprite: "ghost", battleTheme: "undead"
    },

    // ── ELEMENTAL ──────────────────────────────────────────
    "fire-sprite": {
      id: "fire-sprite", name: t("enemies.fire-sprite.name"), hp: 30, maxHp: 30,
      attack: 6, defense: 3, magicPower: 16, xpReward: 35, goldReward: 20,
      description: t("enemies.fire-sprite.description"),
      sprite: "fire-sprite", battleTheme: "fire"
    },
    "ice-golem": {
      id: "ice-golem", name: t("enemies.ice-golem.name"), hp: 70, maxHp: 70,
      attack: 15, defense: 20, magicPower: 10, xpReward: 65, goldReward: 35,
      description: t("enemies.ice-golem.description"),
      sprite: "ice-golem", battleTheme: "ice"
    },
    "thunder-hawk": {
      id: "thunder-hawk", name: t("enemies.thunder-hawk.name"), hp: 45, maxHp: 45,
      attack: 20, defense: 5, magicPower: 15, xpReward: 55, goldReward: 30,
      description: t("enemies.thunder-hawk.description"),
      sprite: "thunder-hawk", battleTheme: "mountain"
    },
    "water-serpent": {
      id: "water-serpent", name: t("enemies.water-serpent.name"), hp: 55, maxHp: 55,
      attack: 16, defense: 8, magicPower: 14, xpReward: 50, goldReward: 28,
      description: t("enemies.water-serpent.description"),
      sprite: "water-serpent", battleTheme: "water"
    },
    "earth-elemental": {
      id: "earth-elemental", name: t("enemies.earth-elemental.name"), hp: 80, maxHp: 80,
      attack: 18, defense: 15, magicPower: 8, xpReward: 100, goldReward: 50,
      description: t("enemies.earth-elemental.description"),
      sprite: "earth-elemental", battleTheme: "mountain"
    },
    "storm-djinn": {
      id: "storm-djinn", name: t("enemies.storm-djinn.name"), hp: 65, maxHp: 65,
      attack: 12, defense: 6, magicPower: 28, xpReward: 110, goldReward: 60,
      description: t("enemies.storm-djinn.description"),
      sprite: "storm-djinn", battleTheme: "mountain"
    },

    // ── PLANT / INSECT ─────────────────────────────────────
    "treant": {
      id: "treant", name: t("enemies.treant.name"), hp: 85, maxHp: 85,
      attack: 20, defense: 16, magicPower: 8, xpReward: 70, goldReward: 38,
      description: t("enemies.treant.description"),
      sprite: "treant", battleTheme: "forest"
    },
    "mushroom-horror": {
      id: "mushroom-horror", name: t("enemies.mushroom-horror.name"), hp: 30, maxHp: 30,
      attack: 5, defense: 4, magicPower: 14, xpReward: 25, goldReward: 15,
      description: t("enemies.mushroom-horror.description"),
      sprite: "mushroom", battleTheme: "forest"
    },
    "giant-spider": {
      id: "giant-spider", name: t("enemies.giant-spider.name"), hp: 40, maxHp: 40,
      attack: 15, defense: 5, magicPower: 6, xpReward: 40, goldReward: 22,
      description: t("enemies.giant-spider.description"),
      sprite: "spider", battleTheme: "cave"
    },
    "mantis-warrior": {
      id: "mantis-warrior", name: t("enemies.mantis-warrior.name"), hp: 55, maxHp: 55,
      attack: 22, defense: 7, magicPower: 0, xpReward: 50, goldReward: 28,
      description: t("enemies.mantis-warrior.description"),
      sprite: "mantis", battleTheme: "forest"
    },

    // ── DEMONIC ────────────────────────────────────────────
    "imp": {
      id: "imp", name: t("enemies.imp.name"), hp: 25, maxHp: 25,
      attack: 8, defense: 3, magicPower: 10, xpReward: 25, goldReward: 15,
      description: t("enemies.imp.description"),
      sprite: "imp", battleTheme: "fire"
    },
    "shadow-fiend": {
      id: "shadow-fiend", name: t("enemies.shadow-fiend.name"), hp: 55, maxHp: 55,
      attack: 18, defense: 5, magicPower: 16, xpReward: 60, goldReward: 35,
      description: t("enemies.shadow-fiend.description"),
      sprite: "shadow-fiend", battleTheme: "undead"
    },
    "hellhound": {
      id: "hellhound", name: t("enemies.hellhound.name"), hp: 60, maxHp: 60,
      attack: 22, defense: 8, magicPower: 8, xpReward: 65, goldReward: 38,
      description: t("enemies.hellhound.description"),
      sprite: "hellhound", battleTheme: "fire"
    },
    "succubus": {
      id: "succubus", name: t("enemies.succubus.name"), hp: 50, maxHp: 50,
      attack: 14, defense: 6, magicPower: 22, xpReward: 75, goldReward: 42,
      description: t("enemies.succubus.description"),
      sprite: "succubus", battleTheme: "fire"
    },
    "arch-demon": {
      id: "arch-demon", name: t("enemies.arch-demon.name"), hp: 120, maxHp: 120,
      attack: 28, defense: 15, magicPower: 25, xpReward: 200, goldReward: 100,
      description: t("enemies.arch-demon.description"),
      sprite: "arch-demon", battleTheme: "boss"
    },
    "dark-corrupter": {
      id: "dark-corrupter", name: t("enemies.dark-corrupter.name"), hp: 65, maxHp: 65,
      attack: 10, defense: 6, magicPower: 22, xpReward: 75, goldReward: 40,
      description: t("enemies.dark-corrupter.description"),
      sprite: "dark-corrupter", battleTheme: "undead"
    },

    // ── DRAGONS ────────────────────────────────────────────
    "wyvern": {
      id: "wyvern", name: t("enemies.wyvern.name"), hp: 70, maxHp: 70,
      attack: 24, defense: 10, magicPower: 8, xpReward: 85, goldReward: 48,
      description: t("enemies.wyvern.description"),
      sprite: "wyvern", battleTheme: "mountain"
    },
    "drake": {
      id: "drake", name: t("enemies.drake.name"), hp: 90, maxHp: 90,
      attack: 26, defense: 14, magicPower: 18, xpReward: 120, goldReward: 65,
      description: t("enemies.drake.description"),
      sprite: "drake", battleTheme: "fire"
    },
    "crystal-dragon": {
      id: "crystal-dragon", name: t("enemies.crystal-dragon.name"), hp: 110, maxHp: 110,
      attack: 20, defense: 22, magicPower: 30, xpReward: 180, goldReward: 90,
      description: t("enemies.crystal-dragon.description"),
      sprite: "crystal-dragon", battleTheme: "boss"
    },
    "elder-dragon": {
      id: "elder-dragon", name: t("enemies.elder-dragon.name"), hp: 150, maxHp: 150,
      attack: 35, defense: 20, magicPower: 35, xpReward: 300, goldReward: 150,
      description: t("enemies.elder-dragon.description"),
      sprite: "elder-dragon", battleTheme: "boss"
    },

    // ── HUMANOID ───────────────────────────────────────────
    "goblin": {
      id: "goblin", name: t("enemies.goblin.name"), hp: 22, maxHp: 22,
      attack: 8, defense: 3, magicPower: 0, xpReward: 18, goldReward: 12,
      description: t("enemies.goblin.description"),
      sprite: "goblin", battleTheme: "cave"
    },
    "orc-warrior": {
      id: "orc-warrior", name: t("enemies.orc-warrior.name"), hp: 65, maxHp: 65,
      attack: 20, defense: 10, magicPower: 0, xpReward: 55, goldReward: 30,
      description: t("enemies.orc-warrior.description"),
      sprite: "orc", battleTheme: "forest"
    },
    "dark-mage": {
      id: "dark-mage", name: t("enemies.dark-mage.name"), hp: 40, maxHp: 40,
      attack: 6, defense: 4, magicPower: 24, xpReward: 65, goldReward: 35,
      description: t("enemies.dark-mage.description"),
      sprite: "dark-mage", battleTheme: "undead"
    },
    "bandit-leader": {
      id: "bandit-leader", name: t("enemies.bandit-leader.name"), hp: 60, maxHp: 60,
      attack: 20, defense: 8, magicPower: 2, xpReward: 50, goldReward: 30,
      description: t("enemies.bandit-leader.description"),
      sprite: "bandit", battleTheme: "grassland"
    },
    "honor-knight": {
      id: "honor-knight", name: t("enemies.honor-knight.name"), hp: 70, maxHp: 70,
      attack: 22, defense: 12, magicPower: 5, xpReward: 70, goldReward: 40,
      description: t("enemies.honor-knight.description"),
      sprite: "knight", battleTheme: "grassland"
    },

    // ── MAGICAL ────────────────────────────────────────────
    "wild-spirit": {
      id: "wild-spirit", name: t("enemies.wild-spirit.name"), hp: 40, maxHp: 40,
      attack: 8, defense: 3, magicPower: 12, xpReward: 30, goldReward: 15,
      description: t("enemies.wild-spirit.description"),
      sprite: "spirit", battleTheme: "magical"
    },
    "arcane-book": {
      id: "arcane-book", name: t("enemies.arcane-book.name"), hp: 30, maxHp: 30,
      attack: 15, defense: 5, magicPower: 20, xpReward: 40, goldReward: 20,
      description: t("enemies.arcane-book.description"),
      sprite: "arcane-book", battleTheme: "magical"
    },
    "plague-beast": {
      id: "plague-beast", name: t("enemies.plague-beast.name"), hp: 45, maxHp: 45,
      attack: 12, defense: 4, magicPower: 8, xpReward: 40, goldReward: 20,
      description: t("enemies.plague-beast.description"),
      sprite: "plague-beast", battleTheme: "undead"
    },
    "mimic": {
      id: "mimic", name: t("enemies.mimic.name"), hp: 50, maxHp: 50,
      attack: 18, defense: 12, magicPower: 10, xpReward: 55, goldReward: 45,
      description: t("enemies.mimic.description"),
      sprite: "mimic", battleTheme: "cave"
    },
  };
}

// Function to get translated skills
export function getTranslatedSkills(t: (key: string) => string): Record<string, { name: string; description: string }> {
  return {
    bolt: {
      name: t("skills.bolt.name"),
      description: t("skills.bolt.description")
    },
    defend: {
      name: t("skills.defend.name"),
      description: t("skills.defend.description")
    },
    flee: {
      name: t("skills.flee.name"),
      description: t("skills.flee.description")
    },
    slash: {
      name: t("skills.slash.name"),
      description: t("skills.slash.description")
    },
    smite: {
      name: t("skills.smite.name"),
      description: t("skills.smite.description")
    },
    fireball: {
      name: t("skills.fireball.name"),
      description: t("skills.fireball.description")
    },
    holy: {
      name: t("skills.holy.name"),
      description: t("skills.holy.description")
    },
    strike: {
      name: t("skills.strike.name"),
      description: t("skills.strike.description")
    }
  };
}
