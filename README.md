# ⚔️💣 Powder & Steel — Architektura projektu

Projekt zmigrowany z jednego monolitycznego `index.html` (~2900 linii) na **Vite 5 + React 18 ES modules**.

**Build:** `npm run build` → `dist/` (286 KB JS, 86 KB gzipped)  
**Dev:** `npm run dev` → HMR na localhost:5173

---

## Struktura plików

```
src/
├── main.jsx                     # ReactDOM.createRoot + storage init
├── App.jsx                      # Główny komponent — cały stan gry + routing ekranów
├── audio.js                     # AM, SFX, MUSIC, TAVERN_AMB
├── data.js                      # Wszystkie dane gry + stałe + T()
├── storage.js                   # localStorage wrapper (też window.storage)
├── styles.js                    # S, ANIM_CSS, ICONS, LC, AN
├── utils.js                     # rollRound, computeStats, ItemBadges i helpery
└── components/
    ├── icons.jsx                # PixelIcon, CharSprite, enemyIconKey, classIconKey
    ├── HpBar.jsx                # Pasek HP
    ├── FighterPanel.jsx         # Panel walczącego (portret + HP + statsy)
    ├── TravelScreen.jsx         # Ekran podróży (pasek postępu)
    ├── CombatScreen.jsx         # Ekran walki (turowy, auto, dziennik)
    ├── DungeonBetween.jsx       # Ekran między sekcjami lochu
    ├── DungeonReward.jsx        # Ekran nagrody po lochu
    ├── LevelUpOverlay.jsx       # Nakładka level up (perk + statsy)
    ├── CharacterSelectScreen.jsx # Wybór slotu (3 sloty)
    ├── CreateScreen.jsx         # Tworzenie postaci
    └── tabs/
        ├── HeroTab.jsx          # Karta bohatera, statystyki, ekwipunek, perki
        ├── QuestsTab.jsx        # Lista questów + dziennik
        ├── InventoryTab.jsx     # Plecak (equip/sell)
        ├── ShopTab.jsx          # Sklep rotacyjny + rare oferty
        ├── JobsTab.jsx          # Prace pasywne + dzienny bonus
        ├── TavernTab.jsx        # Tawerna (piwo, hazard)
        └── DungeonTab.jsx       # Lista lochów + cooldowny
```

---

## Co jest gdzie — przewodnik szybkiego dostępu

### Dane i stałe → `src/data.js`

| Czego szukasz | Gdzie w pliku |
|---|---|
| Klasy (Knight, Musketeer, Alchemist) | `CLASSES` |
| Perki (16 sztuk) | `PERKS` |
| Questy (6) + przeciwnicy questów | `QUESTS`, `QUEST_ENEMIES`, `QUEST_ENEMY_POOLS` |
| Przedmioty sklepowe (~45) | `ITEMS` |
| Nagrody lochów (rare/epic/legendary) | `DUNGEON_ITEMS` |
| Mikstury | `POTIONS` |
| Lochy (4) z sekcjami i bossami | `DUNGEONS` |
| Prace (4) | `JOBS` |
| Stałe (stamina, cooldown, beer...) | `STAMINA_MAX`, `COOLDOWN_MS`, `BEER_MAX`, itp. |
| Kolory (rarity, tier, statsy) | `RARITY_COLOR`, `TIER_COLOR`, `STAT_COLOR` |
| Funkcja tłumaczeń PL/EN | `T(pl, en)` |
| Skalowanie przeciwników | `scaleEnemy(enemy, heroLevel)` |
| Kolejka questowych przeciwników | `getQuestEnemy(questId)`, `getQuestDiff(minLevel)` |
| Koszty staminy | `getStaminaCost(quest)` |
| Reakcje bojowe | `REACT_ATK`, `REACT_DEF`, `pickReact(side, role, type)` |

### Logika → `src/utils.js`

| Czego szukasz | Funkcja |
|---|---|
| Wynik rundy walki | `rollRound(atkStats, defStats, forceHit?)` |
| Statystyki bohatera + ekwipunek | `computeStats(hero, equipped)` |
| Loot z lochu | `getDungeonLoot(dungeon)` |
| Cena sprzedaży przedmiotu | `getSellPrice(item)` |
| Suma mikstur | `totalPotions(potions)` |
| Uzdrowienie mikstury (z perkami) | `getPotionHeal(baseHeal, perks)` |
| Formatowanie czasu cooldownu | `fmtCooldown(ms)` |
| Level up + perkChoices | `applyXpForLevelUp(hero, xpGain)` |
| Tagi przedmiotu (dmgType, classTag) | `ItemBadges(item)` — React element |
| Formuła XP do nast. poziomu | import z data.js: `xpFor(level)` |

### Style i zasoby → `src/styles.js`

| Czego szukasz | Eksport |
|---|---|
| Wszystkie style inline | `S` (S.card, S.btn, S.bigBtn, S.overlay, S.wrap, S.hdr, S.tabs, S.body, S.row, S.sec, S.inp, S.mbar, S.mBtn, S.tab, S.tabA) |
| Keyframes CSS (animacje walki) | `ANIM_CSS` — string do `<style>` |
| Ikony pixel-art (nazwa → URL PNG) | `ICONS` |
| Kolory logów walki | `LC` (hit, crit, miss, heal, win, lose, info) |
| Animacje stanów postaci | `AN` (hero/enemy × idle/attack/dead/dodge/block/crit) |

### Audio → `src/audio.js`

| Czego szukasz | Eksport |
|---|---|
| Kontekst audio + głośność | `AM` (AM.resume(), AM.setMusVol(v)) |
| Efekty dźwiękowe | `SFX` (SFX.hit, SFX.crit, SFX.miss, SFX.dodge, SFX.block, SFX.heal, SFX.attack, SFX.buy, SFX.sell, SFX.equip, SFX.win, SFX.lose, SFX.lvlUp, SFX.perk, SFX.enter, SFX.step, SFX.coin, SFX.dice, SFX.cardFlip, SFX.rareItem) |
| Muzyka tła (3 piosenki) | `MUSIC` (MUSIC.start(i), MUSIC.stop(), MUSIC.next(), MUSIC.prev(), MUSIC.si(), MUSIC.SONGS) |
| Ambient tawerny | `TAVERN_AMB` (TAVERN_AMB.start(), TAVERN_AMB.stop(), TAVERN_AMB.active()) |

### Zapis → `src/storage.js`

Wrapper na localStorage. Eksportuje `storage` + ustawia `window.storage`.
```js
storage.get(key)     // → Promise<{value}|null>
storage.set(key, v)  // → Promise
storage.delete(key)  // → Promise
storage.list()       // → Promise<[{key,value}]>
```
Klucze zapisu: `ps_v5_slot0`, `ps_v5_slot1`, `ps_v5_slot2`, `ps_global`.

---

## Stan gry — co jest w `App.jsx`

Cały `useState` gry żyje w `App`. Najważniejsze pola:

| Zmienna | Znaczenie |
|---|---|
| `hero` | Obiekt bohatera: name, class, level, xp, xpNeeded, hp, maxHp, stats, perks |
| `equipped` | `{weapon, helmet, armor, boots, accessory}` — null lub item |
| `inventory` | Tablica przedmiotów (każdy ma `uid`) |
| `gold` | Aktualne złoto |
| `potions` | `{small, medium, large}` — liczniki |
| `stamina` / `pierogi` | Zasób questów / waluta tawerny |
| `travelState` | `{target, data, timeLeft, totalTime}` lub null |
| `combatData` | `{enemy, questName, type, quest/dungeon, sectionIdx}` lub null |
| `dungeonBetween` | `{dungeon, sectionIdx, heroHp}` lub null |
| `dungeonReward` | `{dungeon, loot, xpG, goldG}` lub null |
| `levelUpState` | `{level, points, perkChoices}` lub null |
| `activeJob` | `{jobId, startedAt}` lub null |
| `cooldowns` | `{dungeonId: timestamp}` |

**Maszyna stanów ekranów:** `screen` ∈ `{loading, title, create, game}`  
Overlay-e walki nadpisują się warstwowo: dungeonReward > dungeonBetween > combat > travel > levelUp.

---

## Zależności importów

```
main.jsx       ← App, storage
App.jsx        ← data, utils, styles, audio, wszystkie komponenty
audio.js       ← brak
data.js        ← brak
storage.js     ← brak
styles.js      ← brak
utils.js       ← data, react
components/    ← data, styles, audio, utils, inne komponenty
tabs/          ← data, styles, audio, utils, icons
```

---

## Przewodnik szybkich edycji

| Chcę zmienić | Plik(i) do wczytania |
|---|---|
| Balans walki (hit%, dmg, crit) | `src/utils.js` (rollRound, computeStats) |
| Nowy przedmiot / quest / lochu | `src/data.js` |
| UI zakładki | `src/components/tabs/<NazwaTab>.jsx` |
| Ekran walki, zdolności klasowe | `src/components/CombatScreen.jsx` |
| Muzyka / dźwięki | `src/audio.js` |
| Animacje, kolory, styl | `src/styles.js` |
| Logika zapisu / stan gry | `src/App.jsx` |
| Nowy ekran (tytuł, create) | `src/components/CharacterSelectScreen.jsx` lub `CreateScreen.jsx` |
| Ikony pixel-art | `src/styles.js` (ICONS), `src/components/icons.jsx` |
| Formuła XP / level up | `src/data.js` (xpFor), `src/utils.js` (applyXpForLevelUp) |
