# Powder & Steel — Project Summary for Claude Code

## Overview
**Powder & Steel** is a turn-based RPG game built with modern web technologies. Originally a monolithic `index.html` file (~2900 lines), it was migrated to a modular React application using Vite 5 and React 18 with ES modules.

- **Build**: `npm run build` → `dist/` (286 KB JS, 86 KB gzipped)
- **Dev**: `npm run dev` → Hot Module Replacement on localhost:5173
- **Tech Stack**: Vite 5, React 18, ES Modules, HTML5 Canvas (implied), Web Audio API

## Project Structure

### Core Files
- **`src/main.jsx`**: ReactDOM.createRoot + localStorage initialization
- **`src/App.jsx`**: Main app component — entire game state + screen routing
- **`src/data.js`**: All game data + constants + T() translation function
- **`src/utils.js`**: Utility functions (rollRound, computeStats, ItemBadges, etc.)
- **`src/styles.js`**: Inline styles (S object), CSS animations (ANIM_CSS), icons (ICONS), colors (LC, AN)
- **`src/audio.js`**: Audio manager (AM, SFX, MUSIC, TAVERN_AMB)
- **`src/storage.js`**: localStorage wrapper (window.storage)

### Components (`src/components/`)
- **`icons.jsx`**: PixelIcon, CharSprite, enemy/class icon keys
- **`HpBar.jsx`**: Health bar component
- **`FighterPanel.jsx`**: Fighter panel (portrait + HP + stats)
- **`TravelScreen.jsx`**: Travel screen (progress bar)
- **`CombatScreen.jsx`**: Combat screen (turn-based/auto, log)
- **`DungeonBetween.jsx`**: Between dungeon sections screen
- **`DungeonReward.jsx`**: Dungeon reward screen
- **`LevelUpOverlay.jsx`**: Level up overlay (perk + stats)
- **`CharacterSelectScreen.jsx`**: Character slot selection (3 slots)
- **`CreateScreen.jsx`**: Character creation screen
- **`tabs/`**: Tab components (HeroTab, QuestsTab, InventoryTab, ShopTab, JobsTab, TavernTab, DungeonTab)

## Game State (in App.jsx)
Key state variables:
- `hero`: Hero object (name, class, level, xp, hp, stats, perks)
- `equipped`: Equipment slots (weapon, helmet, armor, boots, accessory)
- `inventory`: Item array (each with uid)
- `gold`: Current gold
- `potions`: Potion counts (small, medium, large)
- `stamina` / `pierogi`: Quest resource / tavern currency
- `travelState`: Travel progress (target, timeLeft)
- `combatData`: Current combat (enemy, questName, type)
- `dungeonBetween`: Between dungeon sections
- `dungeonReward`: Post-dungeon rewards
- `levelUpState`: Level up pending
- `activeJob`: Passive job (id, startedAt)
- `cooldowns`: Dungeon cooldowns (dungeonId: timestamp)

**Screen State Machine**: `screen` ∈ {loading, title, create, game}
Overlays stack: dungeonReward > dungeonBetween > combat > travel > levelUp

## Key Game Mechanics
- **Classes**: Knight, Musketeer, Alchemist (defined in CLASSES)
- **Perks**: 16 perks (PERKS)
- **Quests**: 6 quests with enemies (QUESTS, QUEST_ENEMIES)
- **Items**: ~45 shop items (ITEMS)
- **Dungeons**: 4 dungeons with sections/bosses (DUNGEONS)
- **Jobs**: 4 passive jobs (JOBS)
- **Combat**: Turn-based with hit/crit/miss/dodge/block, auto mode
- **XP/Leveling**: xpFor(level) formula, level up with perk choices
- **Audio**: SFX for actions, background music, tavern ambient

## Translation System
- `T(pl, en)` function in data.js
- Language stored in window.__LANG ("pl" or "en")
- All UI text uses T() for consistency
- Recent fix: Moved all hardcoded Polish texts to COMBAT_LOG and COMBAT_UI objects

## Recent Changes
- Added game logo to title screen (CharacterSelectScreen.jsx)
- Fixed logo path for GitHub Pages (relative paths)
- Consolidated translations: Moved ~57 hardcoded Polish strings to data.js translation objects
- Ensured consistent PL/EN language switching

## Quick Edit Guide
| Want to change | Files to check |
|---|---|
| Combat balance (hit%, dmg, crit) | `src/utils.js` (rollRound, computeStats) |
| New item/quest/dungeon | `src/data.js` |
| Tab UI | `src/components/tabs/<TabName>.jsx` |
| Combat screen/class abilities | `src/components/CombatScreen.jsx` |
| Music/sound | `src/audio.js` |
| Animations/colors/styles | `src/styles.js` |
| Save/state logic | `src/App.jsx` |
| New screen (title, create) | `src/components/CharacterSelectScreen.jsx` or `CreateScreen.jsx` |
| Pixel icons | `src/styles.js` (ICONS), `src/components/icons.jsx` |
| XP/level formula | `src/data.js` (xpFor), `src/utils.js` (applyXpForLevelUp) |

## Dependencies
```
main.jsx    ← App, storage
App.jsx     ← data, utils, styles, audio, all components
audio.js    ← (none)
data.js     ← (none)
storage.js  ← (none)
styles.js   ← (none)
utils.js    ← data, react
components/ ← data, styles, audio, utils, other components
tabs/       ← data, styles, audio, utils, icons
```

## Build & Deploy
- **Local dev**: `npm run dev`
- **Production build**: `npm run build`
- **Deploy**: GitHub Pages (main branch), served from `/game/` subfolder
- **Assets**: Static files in `public/` (e.g., `public/assets/icons/game_logo.png`)

This summary provides Claude Code with the essential context to understand and modify the Powder & Steel codebase effectively.