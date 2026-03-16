import type { CharacterClass } from "./indexeddb";
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
          stats: { attack: 3, magicPower: 5 },
          equipped: true,
          description: "A basic staff for aspiring mages."
        },
        {
          id: "cloth-robe",
          name: "Novice Robe",
          type: "armor",
          rarity: "common",
          stats: { defense: 2, hp: 10 },
          equipped: true,
          description: "Simple robes worn by magic apprentices."
        },
        {
          id: "leather-shoes",
          name: "Traveler's Boots",
          type: "accessory",
          rarity: "common",
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
          stats: { attack: 8, defense: 2 },
          equipped: true,
          description: "A sturdy iron sword for warriors."
        },
        {
          id: "leather-armor",
          name: "Leather Armor",
          type: "armor",
          rarity: "common",
          stats: { defense: 5, hp: 15 },
          equipped: true,
          description: "Basic leather armor for beginners."
        },
        {
          id: "leather-boots",
          name: "Combat Boots",
          type: "accessory",
          rarity: "common",
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
          stats: { attack: 5, magicPower: 3 },
          equipped: true,
          description: "A blessed mace for priests."
        },
        {
          id: "priest-robes",
          name: "Priest's Robes",
          type: "armor",
          rarity: "common",
          stats: { defense: 3, magicPower: 5, hp: 10 },
          equipped: true,
          description: "Holy robes blessed with divine magic."
        },
        {
          id: "holy-pendant",
          name: "Holy Pendant",
          type: "accessory",
          rarity: "common",
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
      return { hp: 60, maxHp: 60, mp: 100, maxMp: 100, attack: 15, defense: 5, magicPower: 20 };
    case "warrior":
      return { hp: 100, maxHp: 100, mp: 30, maxMp: 30, attack: 20, defense: 15, magicPower: 5 };
    case "priest":
      return { hp: 80, maxHp: 80, mp: 80, maxMp: 80, attack: 12, defense: 10, magicPower: 15 };
  }
}

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
        goldReward: 25
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
        goldReward: 20
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
        goldReward: 25
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
        goldReward: 40
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
        goldReward: 25
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
        goldReward: 20
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
  }
];

// Enemies for quest battles
export const ENEMIES: Record<string, Enemy> = {
  // Mage quest enemies
  "wild-spirit": {
    id: "wild-spirit",
    name: "Wild Spirit",
    hp: 40,
    maxHp: 40,
    attack: 8,
    defense: 3,
    magicPower: 12,
    xpReward: 30,
    goldReward: 15,
    description: "An unstable magical entity born from wild arcane energy",
    sprite: "👻"
  },
  "arcane-book": {
    id: "arcane-book",
    name: "Arcane Book",
    hp: 30,
    maxHp: 30,
    attack: 15,
    defense: 5,
    magicPower: 20,
    xpReward: 40,
    goldReward: 20,
    description: "A sentient spellbook overflowing with chaotic magic",
    sprite: "📕"
  },
  "earth-elemental": {
    id: "earth-elemental",
    name: "Earth Elemental",
    hp: 80,
    maxHp: 80,
    attack: 18,
    defense: 15,
    magicPower: 8,
    xpReward: 100,
    goldReward: 50,
    description: "A massive construct of rock and earth, blocking the mountain pass",
    sprite: "🗿"
  },
  // Warrior quest enemies
  "bandit-leader": {
    id: "bandit-leader",
    name: "Bandit Leader",
    hp: 60,
    maxHp: 60,
    attack: 20,
    defense: 8,
    magicPower: 2,
    xpReward: 50,
    goldReward: 30,
    description: "A ruthless outlaw leading the attack on the village",
    sprite: "💀"
  },
  "honor-knight": {
    id: "honor-knight",
    name: "Honor Knight",
    hp: 70,
    maxHp: 70,
    attack: 22,
    defense: 12,
    magicPower: 5,
    xpReward: 70,
    goldReward: 40,
    description: "A skilled knight testing worthy warriors in combat",
    sprite: "🛡️"
  },
  "wolf-pack": {
    id: "wolf-pack",
    name: "Wolf Pack",
    hp: 50,
    maxHp: 50,
    attack: 16,
    defense: 6,
    magicPower: 0,
    xpReward: 45,
    goldReward: 25,
    description: "A fierce pack of man-eating wolves guarding their nest",
    sprite: "🐺"
  },
  // Priest quest enemies
  "plague-beast": {
    id: "plague-beast",
    name: "Plague Beast",
    hp: 45,
    maxHp: 45,
    attack: 12,
    defense: 4,
    magicPower: 8,
    xpReward: 40,
    goldReward: 20,
    description: "A twisted creature spreading the mysterious illness",
    sprite: "🦠"
  },
  "restless-ghost": {
    id: "restless-ghost",
    name: "Restless Ghost",
    hp: 35,
    maxHp: 35,
    attack: 14,
    defense: 2,
    magicPower: 18,
    xpReward: 50,
    goldReward: 25,
    description: "A sorrowful spirit unable to find peace",
    sprite: "👻"
  },
  "dark-corrupter": {
    id: "dark-corrupter",
    name: "Dark Corrupter",
    hp: 65,
    maxHp: 65,
    attack: 10,
    defense: 6,
    magicPower: 22,
    xpReward: 75,
    goldReward: 40,
    description: "A shadowy entity seeking to corrupt the village",
    sprite: "😈"
  }
};

// Map quests to their enemies
export const QUEST_ENEMIES: Record<string, string> = {
  "mage-library": "wild-spirit",
  "mage-apprentice": "arcane-book",
  "mage-elemental": "earth-elemental",
  "warrior-village": "bandit-leader",
  "warrior-duel": "honor-knight",
  "warrior-monster": "wolf-pack",
  "priest-plague": "plague-beast",
  "priest-ghost": "restless-ghost",
  "priest-blessing": "dark-corrupter"
};

export function getQuestEnemy(questId: string): Enemy | null {
  const enemyId = QUEST_ENEMIES[questId];
  return enemyId ? ENEMIES[enemyId] : null;
}
