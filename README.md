# VibeRPG: FOSS vibe coded world for people that want to vibecode something but don't know exactly what

A classic turn-based MMORPG mobile game set in the a vibe coded world. Built with Expo (React Native) and an Express backend.

---

## About the Game

Step into the Northern Lands as a mage, warrior, or priest. Accept quests from the guild board, battle demons and ancient constructs, level up your character, and collect legendary equipment — all steeped in the lore of Frieren's world.

### Features

- **3 playable classes** — Mage, Warrior, Priest, each with unique spells and stat growth
- **Turn-based combat** — Attack, cast spells, defend, use items, or flee
- **Quest board** — 9 story quests across different regions, with difficulty tiers from Easy to Legendary
- **Inventory & equipment** — Collect weapons, armor, accessories, and consumables
- **Shop** — Spend gold on gear between battles
- **Persistent character** — Your character is saved to a backend database

---

## How to Play

### 1. Create Your Character
On first launch you'll be taken to the character creation screen. Enter a name and choose your class:

| Class | Strengths | Spells |
|---|---|---|
| **Mage** | High magic power & MP | Zoltraak, Jetzt, Flamme's Legacy, Sense Magic |
| **Warrior** | High HP, attack & defense | Battle Cry, Zweihander Strike, Iron Fortress |
| **Priest** | Balanced, can heal in battle | Holy Light, Mending Grace, Barrier of Serenity |

### 2. World Tab — Quest Board
- Browse available quests and tap **Accept** to start one
- Each quest shows the region, enemy, difficulty, and XP/gold rewards
- Quests with a lock icon require a higher level
- Once a quest is active, tap **Complete** to claim your rewards

### 3. Battle Tab — Combat
- Choose an enemy and tap **Enter Battle**
- Each round, pick an action:
  - **Attack** — Physical strike based on your Attack stat
  - **Spell** — Cast your class spell (costs MP)
  - **Defend** — Reduce incoming damage by ~60%
  - **Item** — Use a consumable from your inventory
  - **Flee** — Escape the battle (counts as a defeat)
- Defeat the enemy to earn XP and gold; level up to grow stronger

### 4. Inventory Tab
- View all collected items grouped by type
- Tap an item to see its stats and equip/unequip it
- Equipped items are highlighted with a gold border

### 5. Character Tab
- View your full character sheet: stats, level, XP progress, and spell list
- Gold and quest completion count are shown here
- Use **Retire Character** to start a new game

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend web | Vite + React + Tailwind |
| Backend API | Express 5 + TypeScript |
| Database | SQLite/Drizzle ORM |
| API contract | OpenAPI 3.1 + Orval codegen |
| Monorepo | npm workspaces |

---

## Project Structure

```
├── artifacts/
│   ├── mockup-sandbox/  # Browser web app (Vite + React)
│   └── api-server/      # Express REST API
├── lib/
│   ├── api-spec/         # OpenAPI spec + Orval codegen config
│   ├── api-client-react/ # Generated React Query hooks
│   ├── api-zod/          # Generated Zod validation schemas
│   └── db/               # Drizzle ORM schema + DB connection
└── .github/
    └── workflows/
        └── build-apk.yml # (legacy Expo APK pipeline, no long used)
```

---

## Running Locally

### Prerequisites

- Node.js 20+
- npm 10+
- SQLite (no server install required)

This project is configured for SQLite in local mode.
`start-viberpg.sh` uses `DATABASE_URL=file:./dev.db` by default.

If you want to explicitly set it:

```bash
export DATABASE_URL="file:./dev.db"
```

If you get `better-sqlite3` binding errors, run (npm workspaces handles rebuild automatically):

```bash
npm install
npm --workspace @workspace/db run push
```

### Setup

```bash
# Install dependencies
npm install

# Push database schema
npm --workspace @workspace/db run push

# Start the API server
npm --workspace @workspace/api-server run dev

# In a separate terminal, seed game data (quests & items)
curl -X POST http://localhost:8080/api/seed

# Start browser web client (Vite)
npm --workspace @workspace/mockup-sandbox run dev
```

### Quick start script (new)

A helper script is available: `start-viberpg.sh` in the repo root.

```bash
chmod +x start-viberpg.sh
./start-viberpg.sh
```

This runs:
- `npm install`
- `npm --workspace @workspace/db run push`
- `npm --workspace @workspace/api-server run dev`
- `npm --workspace @workspace/mockup-sandbox run dev`

---

## Legacy mobile pipeline

The earlier Expo mobile app and APK workflow are now deprecated for this browser-first version.

The repo has been retooled around:
- `artifacts/api-server`  (Node.js Express API)
- `artifacts/mockup-sandbox` (Vite React browser UI)

Mobile-specific folders and examples are deleted.

---

## API Reference

The REST API runs at `/api`. Key endpoints:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/characters` | Create a new character |
| `GET` | `/api/characters/current` | Get the most recent character |
| `GET` | `/api/quests` | List all quests |
| `POST` | `/api/quests/:id/start` | Accept a quest |
| `POST` | `/api/quests/:id/complete` | Complete a quest |
| `POST` | `/api/battles` | Start a battle |
| `POST` | `/api/battles/:id/action` | Perform a battle action |
| `GET` | `/api/inventory/:characterId` | Get character inventory |
| `POST` | `/api/inventory/:characterId/equip` | Equip or unequip an item |
| `GET` | `/api/shop` | List shop items |
| `POST` | `/api/shop/buy` | Purchase an item |
| `POST` | `/api/seed` | Seed quests and items (run once on setup) |

Full OpenAPI spec: `lib/api-spec/openapi.yaml`
