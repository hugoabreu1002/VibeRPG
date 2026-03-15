export interface EnemyTemplate {
  name: string;
  description: string;
  type: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  xpReward: number;
  goldReward: number;
  scaleFactor: number;
}

export const ENEMIES: Record<string, EnemyTemplate> = {
  "Flamme's Construct": {
    name: "Flamme's Construct",
    description: "An ancient magical automaton created by the legendary mage Flamme. Its crystalline core pulses with arcane energy.",
    type: "Construct",
    baseHp: 40,
    baseAttack: 12,
    baseDefense: 8,
    xpReward: 30,
    goldReward: 20,
    scaleFactor: 1.2,
  },
  "Aura's Undead Knight": {
    name: "Aura's Undead Knight",
    description: "A fallen warrior resurrected by Aura the Guillotine. Controlled by the demon's Balance of Life, it fights without mercy.",
    type: "Undead",
    baseHp: 60,
    baseAttack: 18,
    baseDefense: 14,
    xpReward: 55,
    goldReward: 35,
    scaleFactor: 1.5,
  },
  "Spiegel's Mirror Shade": {
    name: "Spiegel's Mirror Shade",
    description: "A reflection demon that copies the appearance and techniques of those it has slain. Its imitation is nearly perfect.",
    type: "Demon",
    baseHp: 50,
    baseAttack: 20,
    baseDefense: 10,
    xpReward: 65,
    goldReward: 40,
    scaleFactor: 1.4,
  },
  "Serie's Rejected Pupil": {
    name: "Serie's Rejected Pupil",
    description: "A mage who sought to learn from the elf Serie but was deemed unworthy. They turned to dark magic in desperation.",
    type: "Mage",
    baseHp: 35,
    baseAttack: 22,
    baseDefense: 6,
    xpReward: 50,
    goldReward: 30,
    scaleFactor: 1.3,
  },
  "Ruins Guardian": {
    name: "Ruins Guardian",
    description: "An ancient golem left to protect the ruins of a forgotten mage civilization. Its stone body is hardened by centuries of enchantment.",
    type: "Construct",
    baseHp: 80,
    baseAttack: 15,
    baseDefense: 20,
    xpReward: 75,
    goldReward: 50,
    scaleFactor: 1.6,
  },
  "Wirbel's Shade Soldier": {
    name: "Wirbel's Shade Soldier",
    description: "A shade called upon by the powerful mage Wirbel. It dissipates and reforms, making it extremely difficult to destroy.",
    type: "Shade",
    baseHp: 45,
    baseAttack: 16,
    baseDefense: 8,
    xpReward: 45,
    goldReward: 25,
    scaleFactor: 1.2,
  },
  "Northern Demon Scout": {
    name: "Northern Demon Scout",
    description: "A low-ranking demon from the northern territories. Underestimate it at your peril — it fights with savage cunning.",
    type: "Demon",
    baseHp: 55,
    baseAttack: 14,
    baseDefense: 10,
    xpReward: 40,
    goldReward: 28,
    scaleFactor: 1.3,
  },
  "Berserk Mana Elemental": {
    name: "Berserk Mana Elemental",
    description: "A mana elemental driven to madness by the overflowing magical energy in the Northern Lands. It strikes with chaotic arcane blasts.",
    type: "Elemental",
    baseHp: 65,
    baseAttack: 25,
    baseDefense: 5,
    xpReward: 80,
    goldReward: 55,
    scaleFactor: 1.7,
  },
};

export interface SpellTemplate {
  name: string;
  description: string;
  mpCost: number;
  damageMultiplier: number;
  healAmount?: number;
  classes: string[];
}

export const SPELLS: Record<string, SpellTemplate> = {
  Zoltraak: {
    name: "Zoltraak",
    description: "The standard offensive spell of modern mages. Once a terrifying demon's exclusive technique, now widely taught.",
    mpCost: 10,
    damageMultiplier: 2.2,
    classes: ["mage"],
  },
  Jetzt: {
    name: "Jetzt",
    description: "An ancient elf spell that amplifies magical output for a single devastating strike.",
    mpCost: 20,
    damageMultiplier: 3.5,
    classes: ["mage"],
  },
  "Sense Magic": {
    name: "Sense Magic",
    description: "Detect and exploit weaknesses in the enemy's magical defenses, dealing bonus arcane damage.",
    mpCost: 8,
    damageMultiplier: 1.8,
    classes: ["mage"],
  },
  "Flamme's Legacy": {
    name: "Flamme's Legacy",
    description: "Channel the ancient power of Flamme herself. An overwhelming surge of pure magical energy.",
    mpCost: 30,
    damageMultiplier: 4.0,
    classes: ["mage"],
  },
  "Battle Cry": {
    name: "Battle Cry",
    description: "A fearsome war cry that briefly enhances attack power, dealing bonus damage on the next strike.",
    mpCost: 8,
    damageMultiplier: 2.0,
    classes: ["warrior"],
  },
  "Zweihander Strike": {
    name: "Zweihander Strike",
    description: "A powerful two-handed sword technique that cleaves through armor.",
    mpCost: 15,
    damageMultiplier: 2.8,
    classes: ["warrior"],
  },
  "Iron Fortress": {
    name: "Iron Fortress",
    description: "Adopt a defensive stance that absorbs incoming damage.",
    mpCost: 5,
    damageMultiplier: 0,
    classes: ["warrior"],
  },
  "Holy Light": {
    name: "Holy Light",
    description: "A beam of sacred light that deals extra damage to undead and demons.",
    mpCost: 12,
    damageMultiplier: 2.0,
    classes: ["priest"],
  },
  "Mending Grace": {
    name: "Mending Grace",
    description: "Channel healing energy to restore your own HP mid-battle.",
    mpCost: 15,
    damageMultiplier: 0,
    healAmount: 30,
    classes: ["priest"],
  },
  "Barrier of Serenity": {
    name: "Barrier of Serenity",
    description: "Erect a holy barrier that reduces enemy damage for several rounds.",
    mpCost: 20,
    damageMultiplier: 1.0,
    classes: ["priest"],
  },
};

export function getStartingStats(characterClass: string) {
  switch (characterClass) {
    case "mage":
      return { hp: 60, maxHp: 60, mp: 120, maxMp: 120, attack: 8, defense: 4, magicPower: 25 };
    case "warrior":
      return { hp: 120, maxHp: 120, mp: 40, maxMp: 40, attack: 20, defense: 16, magicPower: 4 };
    case "priest":
      return { hp: 90, maxHp: 90, mp: 80, maxMp: 80, attack: 10, defense: 10, magicPower: 16 };
    default:
      return { hp: 80, maxHp: 80, mp: 80, maxMp: 80, attack: 14, defense: 10, magicPower: 14 };
  }
}

export function getXpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function scaleEnemy(template: EnemyTemplate, level: number) {
  const scale = Math.pow(template.scaleFactor, Math.max(0, level - 1));
  return {
    name: template.name,
    description: template.description,
    type: template.type,
    hp: Math.floor(template.baseHp * scale),
    maxHp: Math.floor(template.baseHp * scale),
    attack: Math.floor(template.baseAttack * scale),
    defense: Math.floor(template.baseDefense * scale),
    xpReward: Math.floor(template.xpReward * Math.sqrt(scale)),
    goldReward: Math.floor(template.goldReward * Math.sqrt(scale)),
  };
}

export const SEED_QUESTS = [
  {
    name: "The Ruins of Aureolin",
    description: "Investigate ancient ruins where a Flamme-era construct has reawakened, threatening a nearby village.",
    lore: "Long ago, the great mage Flamme constructed magical automatons to guard her research. One has awoken after a thousand years of slumber.",
    difficulty: "easy" as const,
    xpReward: 80,
    goldReward: 50,
    enemyName: "Flamme's Construct",
    region: "Northern Lowlands",
    requiredLevel: 1,
  },
  {
    name: "Aura's Shadow Lingers",
    description: "Undead warriors bearing Aura's insignia have been spotted near the old battlefield. Purge them.",
    lore: "Though Aura the Guillotine was defeated, her Balance of Life left behind numerous undead thralls still carrying out her last commands.",
    difficulty: "medium" as const,
    xpReward: 150,
    goldReward: 90,
    enemyName: "Aura's Undead Knight",
    region: "The Fallen Battlefield",
    requiredLevel: 3,
  },
  {
    name: "The Mirror in the Dark",
    description: "Travelers report a demon that wears the faces of the dead. Track it through the Shaded Marshes.",
    lore: "Spiegel's lineage of mirror demons has spread across the continent. Each one carries a thousand stolen faces — their victims' last moments.",
    difficulty: "medium" as const,
    xpReward: 170,
    goldReward: 100,
    enemyName: "Spiegel's Mirror Shade",
    region: "The Shaded Marshes",
    requiredLevel: 4,
  },
  {
    name: "Desperation of the Unchosen",
    description: "A mage rejected by Serie has turned to forbidden magic. Stop them before they hurt anyone.",
    lore: "Serie, the ancient elf, grants magic knowledge to one person per generation. Those who fail her trial sometimes break — and break others.",
    difficulty: "medium" as const,
    xpReward: 130,
    goldReward: 80,
    enemyName: "Serie's Rejected Pupil",
    region: "The Great Forest",
    requiredLevel: 3,
  },
  {
    name: "Secrets of the Lost Civilization",
    description: "Deep in ancient ruins, a golem of tremendous power guards forbidden mage knowledge. Claim it.",
    lore: "The ruins predate even the elves' records. The golem within was built to outlast its creators — and it has, for ten thousand years.",
    difficulty: "hard" as const,
    xpReward: 250,
    goldReward: 150,
    enemyName: "Ruins Guardian",
    region: "Ancient Ruins of the Lost Age",
    requiredLevel: 6,
  },
  {
    name: "Wirbel's Unwanted Gift",
    description: "Wirbel's shade soldiers have been left unchecked near a trade route. Eliminate the threat.",
    lore: "Wirbel, a former Sage of the Empire, left behind shade constructs as a warning to those who might challenge him. The warning outlived him.",
    difficulty: "easy" as const,
    xpReward: 90,
    goldReward: 55,
    enemyName: "Wirbel's Shade Soldier",
    region: "Imperial Trade Road",
    requiredLevel: 2,
  },
  {
    name: "Incursion from the North",
    description: "Demon scouts have crossed the northern border. Drive them back and secure the pass.",
    lore: "The demon king's territory lies beyond the Northern Lands. His scouts probe the border, testing human defenses — and finding them lacking.",
    difficulty: "easy" as const,
    xpReward: 70,
    goldReward: 45,
    enemyName: "Northern Demon Scout",
    region: "Northern Border Pass",
    requiredLevel: 2,
  },
  {
    name: "The Mana Storm's Spawn",
    description: "Mana elementals driven mad by the Northern Lands' wild magic are attacking settlements. Stop them.",
    lore: "The Northern Lands overflow with magical energy left by the ancient Demon King's wars. Sometimes that energy coalesces into violent, mindless elementals.",
    difficulty: "hard" as const,
    xpReward: 280,
    goldReward: 170,
    enemyName: "Berserk Mana Elemental",
    region: "The Northern Lands",
    requiredLevel: 7,
  },
  {
    name: "Cleansing the Battlefield",
    description: "A legendary undead champion of Aura's still walks the ancient battlefield. Only the strongest may face it.",
    lore: "Among the undead Aura raised, one stands above all others — a champion from the age when demons ruled the world. Its name has been lost to time.",
    difficulty: "legendary" as const,
    xpReward: 500,
    goldReward: 300,
    enemyName: "Aura's Undead Knight",
    region: "The Fallen Battlefield",
    requiredLevel: 10,
  },
];

export const SEED_ITEMS = [
  // Weapons
  { name: "Iron Staff", description: "A simple mage's staff. Channels mana efficiently.", type: "weapon" as const, attackBonus: 2, defenseBonus: 0, hpBonus: 0, mpBonus: 10, magicPowerBonus: 5, cost: 80, classRestriction: "mage" },
  { name: "Steel Sword", description: "A dependable blade forged in the Empire's smithies.", type: "weapon" as const, attackBonus: 8, defenseBonus: 0, hpBonus: 0, mpBonus: 0, magicPowerBonus: 0, cost: 100, classRestriction: "warrior" },
  { name: "Holy Scepter", description: "A scepter blessed by a high priest. Amplifies healing and holy spells.", type: "weapon" as const, attackBonus: 3, defenseBonus: 0, hpBonus: 0, mpBonus: 15, magicPowerBonus: 8, cost: 120, classRestriction: "priest" },
  { name: "Flamme's Rod", description: "A rod said to have been crafted in the style of the great mage Flamme herself.", type: "weapon" as const, attackBonus: 5, defenseBonus: 0, hpBonus: 0, mpBonus: 20, magicPowerBonus: 15, cost: 300, classRestriction: "mage" },
  { name: "Zweihander", description: "A massive two-handed sword used by elite warriors. Devastating power.", type: "weapon" as const, attackBonus: 18, defenseBonus: -2, hpBonus: 0, mpBonus: 0, magicPowerBonus: 0, cost: 350, classRestriction: "warrior" },
  // Armor
  { name: "Mage Robe", description: "Light robes enchanted with protective mana weaves.", type: "armor" as const, attackBonus: 0, defenseBonus: 3, hpBonus: 5, mpBonus: 20, magicPowerBonus: 3, cost: 90, classRestriction: "mage" },
  { name: "Chain Mail", description: "Sturdy chain armor favored by warriors across the continent.", type: "armor" as const, attackBonus: 0, defenseBonus: 10, hpBonus: 20, mpBonus: 0, magicPowerBonus: 0, cost: 120, classRestriction: "warrior" },
  { name: "Priest Vestments", description: "Sacred garments that bolster the wearer's holy power.", type: "armor" as const, attackBonus: 0, defenseBonus: 6, hpBonus: 15, mpBonus: 10, magicPowerBonus: 5, cost: 110, classRestriction: "priest" },
  { name: "Archmage's Cloak", description: "The legendary cloak of an archmage. Shimmers with ancient enchantments.", type: "armor" as const, attackBonus: 0, defenseBonus: 8, hpBonus: 10, mpBonus: 40, magicPowerBonus: 12, cost: 400, classRestriction: "mage" },
  // Accessories
  { name: "Mana Crystal", description: "A crystallized mana stone that slowly restores MP over time.", type: "accessory" as const, attackBonus: 0, defenseBonus: 0, hpBonus: 0, mpBonus: 30, magicPowerBonus: 0, cost: 150, classRestriction: null },
  { name: "Warrior's Band", description: "A simple iron band worn by veterans. Increases physical toughness.", type: "accessory" as const, attackBonus: 3, defenseBonus: 3, hpBonus: 10, mpBonus: 0, magicPowerBonus: 0, cost: 100, classRestriction: null },
  { name: "Ancient Elf Talisman", description: "A talisman of elven craftsmanship. Radiates ancient protective magic.", type: "accessory" as const, attackBonus: 0, defenseBonus: 5, hpBonus: 20, mpBonus: 20, magicPowerBonus: 5, cost: 350, classRestriction: null },
  // Consumables
  { name: "Health Potion", description: "A basic healing brew. Restores a small amount of HP.", type: "consumable" as const, attackBonus: 0, defenseBonus: 0, hpBonus: 30, mpBonus: 0, magicPowerBonus: 0, cost: 40, classRestriction: null },
  { name: "Mana Potion", description: "A shimmering blue draught. Restores a modest amount of MP.", type: "consumable" as const, attackBonus: 0, defenseBonus: 0, hpBonus: 0, mpBonus: 30, magicPowerBonus: 0, cost: 40, classRestriction: null },
  { name: "Elixir of the North", description: "A rare potion from the Northern Lands. Restores a large amount of both HP and MP.", type: "consumable" as const, attackBonus: 0, defenseBonus: 0, hpBonus: 60, mpBonus: 60, magicPowerBonus: 0, cost: 150, classRestriction: null },
];
