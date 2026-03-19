import type { CharacterClass } from "./storage";
import type { InventoryItem, Quest, Enemy } from "../types/game";

export const CHARACTER_CLASSES: CharacterClass[] = ["mage", "warrior", "priest"];

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
  }
}

export function getInitialCharacterStats(charClass: CharacterClass) {
  switch (charClass) {
    case "mage":
      return { hp: 60, maxHp: 60, mp: 100, maxMp: 100, attack: 15, defense: 5, magicPower: 20, skills: ["bolt", "defend", "flee"] };
    case "warrior":
      return { hp: 100, maxHp: 100, mp: 30, maxMp: 30, attack: 20, defense: 15, magicPower: 5, skills: ["slash", "defend", "flee"] };
    case "priest":
      return { hp: 80, maxHp: 80, mp: 80, maxMp: 80, attack: 12, defense: 10, magicPower: 15, skills: ["smite", "defend", "flee"] };
  }
}

export const SHOP_ITEMS: InventoryItem[] = [
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
  }
];

export const REWARD_ITEMS: InventoryItem[] = [
  {
    id: "mystic-ring",
    name: "Amulet of Eternity",
    type: "hat",
    rarity: "epic",
    price: 350,
    stats: { magicPower: 22, mp: 60, defense: 5 },
    equipped: false,
    description: "An ancient jewelry piece that pulses with the heartbeat of the cosmos."
  },
  {
    id: "steel-buckler",
    name: "Aegis of the Vanguard",
    type: "armor",
    rarity: "epic",
    price: 480,
    stats: { defense: 35, hp: 120 },
    equipped: false,
    description: "A shield forged from the scales of a celestial dragon."
  },
  {
    id: "silver-dagger",
    name: "Blade of Whispers",
    type: "weapon",
    rarity: "epic",
    price: 450,
    stats: { attack: 42, magicPower: 10 },
    equipped: false,
    description: "A silent, ethereal blade that seems to phase through armor."
  },
  {
    id: "holy-relic",
    name: "Sunlord's Halo",
    type: "hat",
    rarity: "epic",
    price: 400,
    stats: { magicPower: 28, hp: 80, defense: 12 },
    equipped: false,
    description: "A crown of pure sunlight that blinds those who would strike you."
  },
  {
    id: "fire-staff",
    name: "Pheonix's Core",
    type: "weapon",
    rarity: "legendary",
    price: 1200,
    stats: { magicPower: 65, attack: 15, mp: 150 },
    equipped: false,
    description: "The heat radiating from this staff can ignite the very air."
  },
  {
    id: "knight-armor",
    name: "Dreadnought Plate",
    type: "armor",
    rarity: "legendary",
    price: 1500,
    stats: { defense: 75, hp: 250, attack: 10 },
    equipped: false,
    description: "A colossal set of armor that makes you feel like an immovable object."
  },
  {
    id: "divine-robes",
    name: "Ether-Woven Regalia",
    type: "armor",
    rarity: "legendary",
    price: 1400,
    stats: { defense: 35, magicPower: 70, hp: 180, mp: 100 },
    equipped: false,
    description: "Robes that bleed between realities, granting near-infinite magical flow."
  }
];


export const ALL_ITEMS = [...SHOP_ITEMS, ...REWARD_ITEMS];

// ============================================================
// ENEMIES - 30+ unique enemies organized by category
// ============================================================
export const ENEMIES: Record<string, Enemy> = {
  // ── BEASTS ──────────────────────────────────────────────
  "green-slime": {
    id: "green-slime", name: "Green Slime", hp: 20, maxHp: 20,
    attack: 4, defense: 1, magicPower: 0, xpReward: 15, goldReward: 8,
    description: "A jiggling mass of green goo. Weak but plentiful.",
    sprite: "slime"
  },
  "giant-rat": {
    id: "giant-rat", name: "Giant Rat", hp: 25, maxHp: 25,
    attack: 7, defense: 2, magicPower: 0, xpReward: 20, goldReward: 10,
    description: "A disease-ridden rodent the size of a dog.",
    sprite: "rat"
  },
  "wild-boar": {
    id: "wild-boar", name: "Wild Boar", hp: 45, maxHp: 45,
    attack: 14, defense: 8, magicPower: 0, xpReward: 35, goldReward: 18,
    description: "A tusked beast that charges with savage fury.",
    sprite: "boar"
  },
  "terror-hawk": {
    id: "terror-hawk", name: "Terror Hawk", hp: 35, maxHp: 35,
    attack: 18, defense: 4, magicPower: 0, xpReward: 40, goldReward: 22,
    description: "A massive bird of prey with razor-sharp talons.",
    sprite: "hawk"
  },
  "dire-bear": {
    id: "dire-bear", name: "Dire Bear", hp: 90, maxHp: 90,
    attack: 22, defense: 14, magicPower: 0, xpReward: 80, goldReward: 45,
    description: "An enormous bear corrupted by dark energy. Massive and relentless.",
    sprite: "bear"
  },
  "wolf-pack": {
    id: "wolf-pack", name: "Wolf Pack", hp: 50, maxHp: 50,
    attack: 16, defense: 6, magicPower: 0, xpReward: 45, goldReward: 25,
    description: "A fierce pack of man-eating wolves guarding their nest.",
    sprite: "wolf"
  },

  // ── UNDEAD ──────────────────────────────────────────────
  "skeleton-soldier": {
    id: "skeleton-soldier", name: "Skeleton Soldier", hp: 35, maxHp: 35,
    attack: 12, defense: 6, magicPower: 3, xpReward: 30, goldReward: 15,
    description: "An animated pile of bones wielding a rusty sword.",
    sprite: "skeleton"
  },
  "zombie": {
    id: "zombie", name: "Shambling Zombie", hp: 50, maxHp: 50,
    attack: 10, defense: 3, magicPower: 5, xpReward: 35, goldReward: 18,
    description: "A decaying corpse that hungers for the living.",
    sprite: "zombie"
  },
  "wraith": {
    id: "wraith", name: "Wraith", hp: 40, maxHp: 40,
    attack: 8, defense: 2, magicPower: 20, xpReward: 55, goldReward: 30,
    description: "A spectral being of pure malice that drains life force.",
    sprite: "wraith"
  },
  "lich": {
    id: "lich", name: "Lich", hp: 75, maxHp: 75,
    attack: 10, defense: 8, magicPower: 30, xpReward: 120, goldReward: 65,
    description: "An undead sorcerer of terrible power, sustained by dark magic.",
    sprite: "lich"
  },
  "death-knight": {
    id: "death-knight", name: "Death Knight", hp: 100, maxHp: 100,
    attack: 25, defense: 18, magicPower: 12, xpReward: 150, goldReward: 80,
    description: "A fallen paladin who serves darkness, clad in cursed black armor.",
    sprite: "death-knight"
  },
  "restless-ghost": {
    id: "restless-ghost", name: "Restless Ghost", hp: 35, maxHp: 35,
    attack: 14, defense: 2, magicPower: 18, xpReward: 50, goldReward: 25,
    description: "A sorrowful spirit unable to find peace.",
    sprite: "ghost"
  },

  // ── ELEMENTAL ──────────────────────────────────────────
  "fire-sprite": {
    id: "fire-sprite", name: "Fire Sprite", hp: 30, maxHp: 30,
    attack: 6, defense: 3, magicPower: 16, xpReward: 35, goldReward: 20,
    description: "A tiny flame spirit that dances through the air.",
    sprite: "fire-sprite"
  },
  "ice-golem": {
    id: "ice-golem", name: "Ice Golem", hp: 70, maxHp: 70,
    attack: 15, defense: 20, magicPower: 10, xpReward: 65, goldReward: 35,
    description: "A construct of frozen ice, slow but incredibly tough.",
    sprite: "ice-golem"
  },
  "thunder-hawk": {
    id: "thunder-hawk", name: "Thunder Hawk", hp: 45, maxHp: 45,
    attack: 20, defense: 5, magicPower: 15, xpReward: 55, goldReward: 30,
    description: "A storm bird that crackles with electrical energy.",
    sprite: "thunder-hawk"
  },
  "water-serpent": {
    id: "water-serpent", name: "Water Serpent", hp: 55, maxHp: 55,
    attack: 16, defense: 8, magicPower: 14, xpReward: 50, goldReward: 28,
    description: "A sinuous aquatic creature that strikes from the depths.",
    sprite: "water-serpent"
  },
  "earth-elemental": {
    id: "earth-elemental", name: "Earth Elemental", hp: 80, maxHp: 80,
    attack: 18, defense: 15, magicPower: 8, xpReward: 100, goldReward: 50,
    description: "A massive construct of rock and earth.",
    sprite: "earth-elemental"
  },
  "storm-djinn": {
    id: "storm-djinn", name: "Storm Djinn", hp: 65, maxHp: 65,
    attack: 12, defense: 6, magicPower: 28, xpReward: 110, goldReward: 60,
    description: "An ancient wind spirit of devastating magical power.",
    sprite: "storm-djinn"
  },

  // ── PLANT / INSECT ─────────────────────────────────────
  "treant": {
    id: "treant", name: "Ancient Treant", hp: 85, maxHp: 85,
    attack: 20, defense: 16, magicPower: 8, xpReward: 70, goldReward: 38,
    description: "A massive walking tree corrupted by fungal spores.",
    sprite: "treant"
  },
  "mushroom-horror": {
    id: "mushroom-horror", name: "Mushroom Horror", hp: 30, maxHp: 30,
    attack: 5, defense: 4, magicPower: 14, xpReward: 25, goldReward: 15,
    description: "A sentient fungus that releases toxic spores.",
    sprite: "mushroom"
  },
  "giant-spider": {
    id: "giant-spider", name: "Giant Spider", hp: 40, maxHp: 40,
    attack: 15, defense: 5, magicPower: 6, xpReward: 40, goldReward: 22,
    description: "A venomous arachnid lurking in dark caves.",
    sprite: "spider"
  },
  "mantis-warrior": {
    id: "mantis-warrior", name: "Mantis Warrior", hp: 55, maxHp: 55,
    attack: 22, defense: 7, magicPower: 0, xpReward: 50, goldReward: 28,
    description: "A blade-armed insectoid fighter with deadly precision.",
    sprite: "mantis"
  },

  // ── DEMONIC ────────────────────────────────────────────
  "imp": {
    id: "imp", name: "Imp", hp: 25, maxHp: 25,
    attack: 8, defense: 3, magicPower: 10, xpReward: 25, goldReward: 15,
    description: "A small, mischievous demon that throws fireballs.",
    sprite: "imp"
  },
  "shadow-fiend": {
    id: "shadow-fiend", name: "Shadow Fiend", hp: 55, maxHp: 55,
    attack: 18, defense: 5, magicPower: 16, xpReward: 60, goldReward: 35,
    description: "A creature born from nightmares, phasing between shadows.",
    sprite: "shadow-fiend"
  },
  "hellhound": {
    id: "hellhound", name: "Hellhound", hp: 60, maxHp: 60,
    attack: 22, defense: 8, magicPower: 8, xpReward: 65, goldReward: 38,
    description: "A fiery canine from the abyss, breathing brimstone.",
    sprite: "hellhound"
  },
  "succubus": {
    id: "succubus", name: "Succubus", hp: 50, maxHp: 50,
    attack: 14, defense: 6, magicPower: 22, xpReward: 75, goldReward: 42,
    description: "A seductive demon that drains life through dark magic.",
    sprite: "succubus"
  },
  "arch-demon": {
    id: "arch-demon", name: "Arch-Demon", hp: 120, maxHp: 120,
    attack: 28, defense: 15, magicPower: 25, xpReward: 200, goldReward: 100,
    description: "A lord of the underworld, wreathed in hellfire and shadow.",
    sprite: "arch-demon"
  },
  "dark-corrupter": {
    id: "dark-corrupter", name: "Dark Corrupter", hp: 65, maxHp: 65,
    attack: 10, defense: 6, magicPower: 22, xpReward: 75, goldReward: 40,
    description: "A shadowy entity seeking to corrupt the village.",
    sprite: "dark-corrupter"
  },

  // ── DRAGONS ────────────────────────────────────────────
  "wyvern": {
    id: "wyvern", name: "Wyvern", hp: 70, maxHp: 70,
    attack: 24, defense: 10, magicPower: 8, xpReward: 85, goldReward: 48,
    description: "A two-legged drake with venomous tail and leathery wings.",
    sprite: "wyvern"
  },
  "drake": {
    id: "drake", name: "Fire Drake", hp: 90, maxHp: 90,
    attack: 26, defense: 14, magicPower: 18, xpReward: 120, goldReward: 65,
    description: "A young dragon that breathes scorching flames.",
    sprite: "drake"
  },
  "crystal-dragon": {
    id: "crystal-dragon", name: "Crystal Dragon", hp: 110, maxHp: 110,
    attack: 20, defense: 22, magicPower: 30, xpReward: 180, goldReward: 90,
    description: "A dragon whose scales shimmer with prismatic energy.",
    sprite: "crystal-dragon"
  },
  "elder-dragon": {
    id: "elder-dragon", name: "Elder Dragon", hp: 150, maxHp: 150,
    attack: 35, defense: 20, magicPower: 35, xpReward: 300, goldReward: 150,
    description: "An ancient wyrm of immeasurable power. Few survive its wrath.",
    sprite: "elder-dragon"
  },

  // ── HUMANOID ───────────────────────────────────────────
  "goblin": {
    id: "goblin", name: "Goblin Scout", hp: 22, maxHp: 22,
    attack: 8, defense: 3, magicPower: 0, xpReward: 18, goldReward: 12,
    description: "A sneaky little creature armed with a crude dagger.",
    sprite: "goblin"
  },
  "orc-warrior": {
    id: "orc-warrior", name: "Orc Warrior", hp: 65, maxHp: 65,
    attack: 20, defense: 10, magicPower: 0, xpReward: 55, goldReward: 30,
    description: "A brutal green-skinned fighter with a massive axe.",
    sprite: "orc"
  },
  "dark-mage": {
    id: "dark-mage", name: "Dark Mage", hp: 40, maxHp: 40,
    attack: 6, defense: 4, magicPower: 24, xpReward: 65, goldReward: 35,
    description: "A rogue sorcerer wielding forbidden magic.",
    sprite: "dark-mage"
  },
  "bandit-leader": {
    id: "bandit-leader", name: "Bandit Leader", hp: 60, maxHp: 60,
    attack: 20, defense: 8, magicPower: 2, xpReward: 50, goldReward: 30,
    description: "A ruthless outlaw leading the attack on the village.",
    sprite: "bandit"
  },
  "honor-knight": {
    id: "honor-knight", name: "Honor Knight", hp: 70, maxHp: 70,
    attack: 22, defense: 12, magicPower: 5, xpReward: 70, goldReward: 40,
    description: "A skilled knight testing worthy warriors in combat.",
    sprite: "knight"
  },

  // ── MAGICAL ────────────────────────────────────────────
  "wild-spirit": {
    id: "wild-spirit", name: "Wild Spirit", hp: 40, maxHp: 40,
    attack: 8, defense: 3, magicPower: 12, xpReward: 30, goldReward: 15,
    description: "An unstable magical entity born from wild arcane energy.",
    sprite: "spirit"
  },
  "arcane-book": {
    id: "arcane-book", name: "Arcane Book", hp: 30, maxHp: 30,
    attack: 15, defense: 5, magicPower: 20, xpReward: 40, goldReward: 20,
    description: "A sentient spellbook overflowing with chaotic magic.",
    sprite: "arcane-book"
  },
  "plague-beast": {
    id: "plague-beast", name: "Plague Beast", hp: 45, maxHp: 45,
    attack: 12, defense: 4, magicPower: 8, xpReward: 40, goldReward: 20,
    description: "A twisted creature spreading the mysterious illness.",
    sprite: "plague-beast"
  },
  "mimic": {
    id: "mimic", name: "Mimic", hp: 50, maxHp: 50,
    attack: 18, defense: 12, magicPower: 10, xpReward: 55, goldReward: 45,
    description: "A treasure chest that was never a treasure chest.",
    sprite: "mimic"
  },
};

// Quests data
export const QUESTS: Quest[] = [
  // 🔮 MAGE QUESTS
  {
    id: "mage-library",
    title: "The Cursed Library",
    description: "The village library has been overtaken by wild magic. Books float everywhere and the librarian is trapped in a magical barrier.",
    class: "mage",
    minLevel: 1,
    region: "Northern Village",
    choices: [
      {
        text: "Cast Dispel Magic to break the barrier",
        requiredStat: "magicPower",
        difficulty: 15,
        successMessage: "Your dispel magic works! The barrier shatters and the librarian is freed.",
        failureMessage: "Your magic fizzles against the barrier. The wild magic is too strong!",
        xpReward: 50,
        goldReward: 25,
        rewardItemId: "mystic-ring"
      },
      {
        text: "Use Sense Magic to find the source",
        requiredStat: "magicPower",
        difficulty: 10,
        successMessage: "You sense a wild spellbook causing the chaos. With precision, you neutralize it!",
        failureMessage: "The magical feedback is too overwhelming. You retreat to regroup.",
        xpReward: 30,
        goldReward: 15
      },
      {
        text: "Try to reason with the magical disturbance",
        requiredStat: "magicPower",
        difficulty: 8,
        successMessage: "Through careful negotiation with the sentient magic, you calm the wild energies.",
        failureMessage: "The magical entity doesn't understand your words. It lashes out!",
        xpReward: 20,
        goldReward: 10
      }
    ]
  },
  {
    id: "mage-apprentice",
    title: "The Missing Apprentice",
    description: "A young apprentice has gone missing in the forest. The village elder says they were studying magical herbs.",
    class: "mage",
    minLevel: 1,
    region: "Whispering Woods",
    choices: [
      {
        text: "Use Sense Magic to locate them",
        requiredStat: "magicPower",
        difficulty: 12,
        successMessage: "You sense the apprentice's magical aura nearby! They're trapped in a magical bramble.",
        failureMessage: "The forest's natural magic interferes with your senses. You find nothing.",
        xpReward: 40,
        goldReward: 20,
        rewardSkill: "fireball"
      },
      {
        text: "Cast an illusion to lure them out",
        requiredStat: "magicPower",
        difficulty: 15,
        successMessage: "Your illusion distracts the magical creatures, allowing the apprentice to escape!",
        failureMessage: "The creatures see through your illusion. They become agitated!",
        xpReward: 35,
        goldReward: 15
      }
    ]
  },
  {
    id: "mage-elemental",
    title: "The Elemental Disturbance",
    description: "An earth elemental has awakened near the village and is blocking the main road. The villagers are frightened.",
    class: "mage",
    minLevel: 2,
    region: "Mountain Pass",
    choices: [
      {
        text: "Challenge the elemental in a magical duel",
        requiredStat: "magicPower",
        difficulty: 25,
        successMessage: "Your magical prowess overwhelms the elemental! It retreats deep underground.",
        failureMessage: "The elemental's power is immense. You're pushed back by the sheer force of earth!",
        xpReward: 80,
        goldReward: 50
      },
      {
        text: "Communicate with the elemental",
        requiredStat: "magicPower",
        difficulty: 20,
        successMessage: "Through ancient magical words, you convince the elemental to guard the village instead!",
        failureMessage: "The elemental doesn't understand your magical language. It roars in confusion!",
        xpReward: 60,
        goldReward: 30
      },
      {
        text: "Banish the elemental back to its plane",
        requiredStat: "magicPower",
        difficulty: 30,
        successMessage: "With a powerful banishment spell, you send the elemental back to the elemental plane!",
        failureMessage: "Your banishment fails! The elemental grows angrier!",
        xpReward: 100,
        goldReward: 75
      }
    ]
  },
  {
    id: "mage-crystalcave",
    title: "The Crystal Caverns",
    description: "Strange magical crystals have been growing in the old mines, attracting dangerous creatures. The miners need your help.",
    class: "mage",
    minLevel: 2,
    region: "Crystal Caverns",
    choices: [
      {
        text: "Harness the crystal energy to blast the creatures",
        requiredStat: "magicPower",
        difficulty: 22,
        successMessage: "You channel the crystal energy into a devastating arcane blast!",
        failureMessage: "The crystal energy is unstable and backfires on you!",
        xpReward: 70,
        goldReward: 40
      },
      {
        text: "Create a protective ward around the miners",
        requiredStat: "defense",
        difficulty: 18,
        successMessage: "Your magical barrier holds firm, allowing the miners to escape safely!",
        failureMessage: "The creatures overwhelm your ward with sheer numbers!",
        xpReward: 55,
        goldReward: 30
      }
    ]
  },
  {
    id: "mage-tower",
    title: "The Dark Mage's Tower",
    description: "A rogue mage has taken up residence in the old watchtower, conducting dangerous experiments that threaten the region.",
    class: "mage",
    minLevel: 3,
    region: "Shadow Tower",
    choices: [
      {
        text: "Engage in a full magical duel",
        requiredStat: "magicPower",
        difficulty: 30,
        successMessage: "Your superior magical knowledge wins the duel! The dark mage surrenders!",
        failureMessage: "The dark mage's forbidden spells prove too powerful!",
        xpReward: 120,
        goldReward: 70,
        rewardItemId: "fire-staff"
      },
      {
        text: "Dismantle the tower's magical defenses",
        requiredStat: "magicPower",
        difficulty: 25,
        successMessage: "You systematically unravel the wards, leaving the mage vulnerable!",
        failureMessage: "A trap spell triggers, blasting you backwards!",
        xpReward: 90,
        goldReward: 50
      }
    ]
  },
  // ⚔️ WARRIOR QUESTS
  {
    id: "warrior-village",
    title: "Village Protection",
    description: "Bandits are approaching the village! The village leader needs someone to defend the gates.",
    class: "warrior",
    minLevel: 1,
    region: "Northern Village",
    choices: [
      {
        text: "Stand at the gates and fight them head-on!",
        requiredStat: "attack",
        difficulty: 15,
        successMessage: "Your fierce fighting scares off the bandits! The village is safe.",
        failureMessage: "There are too many bandits! You hold them off but they pillage some houses.",
        xpReward: 50,
        goldReward: 25,
        rewardItemId: "silver-dagger"
      },
      {
        text: "Lead a charge to scatter them",
        requiredStat: "attack",
        difficulty: 20,
        successMessage: "Your leadership and combat skills turn the tide! The bandits flee in panic.",
        failureMessage: "The bandits anticipate your charge. You're surrounded!",
        xpReward: 60,
        goldReward: 35
      }
    ]
  },
  {
    id: "warrior-duel",
    title: "The Duel of Honor",
    description: "A proud knight has challenged any warrior to a duel. Win and earn respect and rewards!",
    class: "warrior",
    minLevel: 2,
    region: "Training Grounds",
    choices: [
      {
        text: "Use raw strength to overpower them",
        requiredStat: "attack",
        difficulty: 25,
        successMessage: "Your powerful strikes overwhelm the knight! You win the duel!",
        failureMessage: "The knight is more skilled than expected. You lose the duel.",
        xpReward: 70,
        goldReward: 40,
        rewardSkill: "strike"
      },
      {
        text: "Use tactical defense and counter-attacks",
        requiredStat: "defense",
        difficulty: 20,
        successMessage: "You deflect their attacks perfectly and find an opening for victory!",
        failureMessage: "Their technique is flawless. You cannot find a weakness!",
        xpReward: 55,
        goldReward: 30
      }
    ]
  },
  {
    id: "warrior-monster",
    title: "The Monster Nest",
    description: "A nest of man-eating wolves has appeared near the trade route. Merchants are afraid to pass.",
    class: "warrior",
    minLevel: 1,
    region: "Trade Route",
    choices: [
      {
        text: "Storm the nest alone!",
        requiredStat: "attack",
        difficulty: 20,
        successMessage: "Your ferocity is terrifying! The wolves flee from their own nest!",
        failureMessage: "There are too many wolves! You're forced to retreat temporarily.",
        xpReward: 55,
        goldReward: 30
      },
      {
        text: "Set a trap and lure them out",
        requiredStat: "defense",
        difficulty: 15,
        successMessage: "Your trap works perfectly! You defeat the wolves efficiently.",
        failureMessage: "The wolves are smarter than expected. They avoid your trap!",
        xpReward: 40,
        goldReward: 20
      }
    ]
  },
  {
    id: "warrior-orc-camp",
    title: "The Orc Encampment",
    description: "Orcs have set up a war camp near the village. Their raiding parties grow bolder each night.",
    class: "warrior",
    minLevel: 2,
    region: "Dark Forest",
    choices: [
      {
        text: "Challenge the orc chieftain to single combat",
        requiredStat: "attack",
        difficulty: 28,
        successMessage: "You defeat the chieftain! Without a leader, the orcs scatter!",
        failureMessage: "The orc chieftain is incredibly powerful! You barely escape!",
        xpReward: 85,
        goldReward: 50
      },
      {
        text: "Lead a night raid on their supplies",
        requiredStat: "defense",
        difficulty: 22,
        successMessage: "You destroy their food stores, forcing the orcs to retreat!",
        failureMessage: "The orc sentries spot you! You fight your way out!",
        xpReward: 65,
        goldReward: 35
      }
    ]
  },
  {
    id: "warrior-dragon-lair",
    title: "The Dragon's Lair",
    description: "A wyvern has taken residence in the mountain pass, terrorizing travelers and demanding tribute.",
    class: "warrior",
    minLevel: 3,
    region: "Dragon Peak",
    choices: [
      {
        text: "Face the wyvern head-on with sword and shield",
        requiredStat: "attack",
        difficulty: 32,
        successMessage: "Your blade finds the gap in the wyvern's scales! It falls defeated!",
        failureMessage: "The wyvern's flames nearly incinerate you! You retreat badly burned!",
        xpReward: 130,
        goldReward: 75,
        rewardItemId: "knight-armor"
      },
      {
        text: "Use the terrain to your advantage",
        requiredStat: "defense",
        difficulty: 26,
        successMessage: "You lure the wyvern into a narrow passage where it can't fly! Victory!",
        failureMessage: "The wyvern is smarter than you expected. It corners you instead!",
        xpReward: 100,
        goldReward: 55
      }
    ]
  },
  // ⛑️ PRIEST QUESTS
  {
    id: "priest-plague",
    title: "The Plagued Village",
    description: "A mysterious illness is spreading through the village. The healer needs help finding the cure.",
    class: "priest",
    minLevel: 1,
    region: "Southern Village",
    choices: [
      {
        text: "Use healing magic on the sick",
        requiredStat: "magicPower",
        difficulty: 15,
        successMessage: "Your holy magic cures the villagers! They recover quickly.",
        failureMessage: "The plague is stronger than your magic. More people fall ill!",
        xpReward: 50,
        goldReward: 25,
        rewardItemId: "holy-relic"
      },
      {
        text: "Search for medicinal herbs in the forest",
        requiredStat: "defense",
        difficulty: 10,
        successMessage: "You find the rare healing herbs. The cure is made!",
        failureMessage: "You cannot find the right herbs. Time is running out!",
        xpReward: 35,
        goldReward: 20
      },
      {
        text: "Purify the contaminated water source",
        requiredStat: "magicPower",
        difficulty: 20,
        successMessage: "Your purification ritual cleanses the water! The source of illness is gone.",
        failureMessage: "The contamination is too severe. The ritual fails!",
        xpReward: 60,
        goldReward: 35
      }
    ]
  },
  {
    id: "priest-ghost",
    title: "The Ghost's Regret",
    description: "A restless spirit haunts the old church. It seems to be searching for something.",
    class: "priest",
    minLevel: 1,
    region: "Abandoned Church",
    choices: [
      {
        text: "Use Holy Light to banish the spirit",
        requiredStat: "magicPower",
        difficulty: 18,
        successMessage: "The Holy Light reveals the spirit's burden. You help it find peace.",
        failureMessage: "The spirit resists your magic. It's too powerful!",
        xpReward: 55,
        goldReward: 30
      },
      {
        text: "Listen to the spirit's story and help it",
        requiredStat: "magicPower",
        difficulty: 12,
        successMessage: "Through compassionate listening, you learn of its unfinished business. You help complete it.",
        failureMessage: "The spirit cannot communicate. It remains restless!",
        xpReward: 40,
        goldReward: 20,
        rewardSkill: "holy"
      }
    ]
  },
  {
    id: "priest-blessing",
    title: "The Village Blessing",
    description: "The village elder asks you to perform a blessing ritual to protect the village from evil forces.",
    class: "priest",
    minLevel: 2,
    region: "Northern Village",
    choices: [
      {
        text: "Perform the Great Blessing ritual",
        requiredStat: "magicPower",
        difficulty: 25,
        successMessage: "The blessing is successful! A protective aura surrounds the village.",
        failureMessage: "The ritual drains your energy. You barely complete it!",
        xpReward: 75,
        goldReward: 45
      },
      {
        text: "Place protective wards around the village",
        requiredStat: "defense",
        difficulty: 20,
        successMessage: "Your wards are strong! The village is now protected.",
        failureMessage: "Some wards fail to activate. The village remains vulnerable.",
        xpReward: 55,
        goldReward: 30
      }
    ]
  },
  {
    id: "priest-undead-crypt",
    title: "The Undead Crypt",
    description: "The ancient crypt beneath the church has been unsealed. Undead creatures pour forth each night.",
    class: "priest",
    minLevel: 2,
    region: "Sacred Catacombs",
    choices: [
      {
        text: "Perform a mass exorcism ritual",
        requiredStat: "magicPower",
        difficulty: 24,
        successMessage: "Your holy power banishes the undead back to their graves!",
        failureMessage: "Too many undead! Your holy power is overwhelmed!",
        xpReward: 80,
        goldReward: 45
      },
      {
        text: "Seal the crypt with divine wards",
        requiredStat: "defense",
        difficulty: 20,
        successMessage: "The divine seals hold! No more undead can escape!",
        failureMessage: "The dark energy within cracks your seals!",
        xpReward: 60,
        goldReward: 35
      }
    ]
  },
  {
    id: "priest-demon-portal",
    title: "The Demon Portal",
    description: "A portal to the underworld has opened in the cursed ruins. Demons are spilling into the world.",
    class: "priest",
    minLevel: 3,
    region: "Cursed Ruins",
    choices: [
      {
        text: "Channel divine power to close the portal",
        requiredStat: "magicPower",
        difficulty: 30,
        successMessage: "With an explosion of holy light, you seal the portal forever!",
        failureMessage: "The demonic energy is overwhelming! The portal resists!",
        xpReward: 130,
        goldReward: 70,
        rewardItemId: "divine-robes"
      },
      {
        text: "Confront the demon gatekeeper",
        requiredStat: "attack",
        difficulty: 25,
        successMessage: "You smite the gatekeeper with divine fury! The portal collapses!",
        failureMessage: "The demon's dark power scorches your holy shields!",
        xpReward: 100,
        goldReward: 55
      }
    ]
  },
];

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
};

export function getQuestEnemy(questId: string): Enemy | null {
  const enemyId = QUEST_ENEMIES[questId];
  return enemyId ? ENEMIES[enemyId] : null;
}
