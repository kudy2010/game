# ⚔️💣 Powder & Steel — Architektura projektu

Projekt został podzielony z jednego monolitycznego `index.html` (~2900 linii) na 8 mniejszych plików. Każdy plik odpowiada za jedną warstwę aplikacji i może być wczytany do modelu AI osobno.

---

## Struktura plików

```
powder-steel/
├── index.html          ~  90 linii  — HTML shell + CSS + storage polyfill + <script> tagi
└── js/
    ├── audio.js        ~ 146 linii  — Dźwięk i muzyka
    ├── data.js         ~ 258 linii  — Wszystkie dane gry (stałe, przedmioty, questy...)
    ├── logic.js        ~  72 linie  — Logika walki i obliczeń
    ├── ui.js           ~ 267 linii  — Komponenty UI (ikony, styl, HP bar, panel walczącego)
    ├── combat.js       ~ 474 linie  — Ekrany walki, lochy, level up
    ├── screens.js      ~ 137 linii  — Ekran wyboru i tworzenia postaci
    ├── tabs.js         ~ 700 linii  — Zakładki głównego HUD (7 zakładek)
    └── app.js          ~ 750 linii  — Główny komponent App + zapis/ładowanie + ReactDOM
```

---

## Opis każdego pliku

### `index.html` (~90 linii)
Czysty HTML shell. Zawiera:
- CSS globalny (animacje tooltipów, mobile polish)
- CDN linki do React 18
- Polyfill `window.storage` (wrapper na localStorage)
- `<script src="js/...">` tagi w odpowiedniej kolejności

**Kiedy edytować:** zmiana tytułu, globalnego CSS, dodanie nowych plików JS.

---

### `js/audio.js` (~146 linii)
Cały system audio gry. Trzy moduły:
- **`AM`** — Audio Master (kontekst WebAudio, gain dla SFX i muzyki)
- **`SFX`** — Efekty dźwiękowe (attack, hit, crit, buy, heal, lvlUp, itp.)
- **`TAVERN_AMB`** — Ambient dźwięk tawerny (szum różowy)
- **`MUSIC`** — Proceduralny tracker muzyki (3 piosenki: Tavern Night, March to Battle, Dungeon Depths)

**Kiedy edytować:** dodanie nowych dźwięków lub piosenek.

---

### `js/data.js` (~258 linii)
Wszystkie statyczne dane gry. Zawiera:
- **`PERKS`** — 16 perkow z ich efektami
- **`CLASSES`** — 3 klasy (Knight, Musketeer, Alchemist)
- **`QUESTS`** / **`QUEST_ENEMIES`** / **`QUEST_ENEMY_POOLS`** — 6 questów + pule przeciwników
- **`ITEMS`** — ~45 przedmiotów sklepowych (broń, zbroja, buty, akcesoria) z tagami klas
- **`DUNGEON_ITEMS`** — 18 nagród z lochów (rare/epic/legendary)
- **`POTIONS`** — 3 rodzaje mikstur
- **`DUNGEONS`** — 4 lochy z sekcjami i bossami
- **`JOBS`** — 4 prace (pasywny dochód)
- Stałe: `STAMINA_MAX`, `COOLDOWN_MS`, `RARITY_COLOR`, `STAT_COLOR`, itp.

**Kiedy edytować:** balansowanie statystyk, dodawanie nowych przedmiotów/questów.

---

### `js/logic.js` (~72 linie)
Czysta logika gry (bez UI):
- **`rollRound(atkS, defS)`** — oblicza wynik rundy walki (miss/dodge/block/hit/crit + dmg)
- **`computeStats(hero, equipped)`** — sumuje statystyki bohatera + ekwipunek + perki
- **`applyXpForLevelUp(hero, xpGain)`** — obsługuje level up i perkChoices
- Helpery: `getDungeonLoot`, `getSellPrice`, `totalPotions`, `getPotionHeal`, `fmtCooldown`
- **`ItemBadges`** — komponent tagów (dmgType, classTag) na karcie przedmiotu

**Kiedy edytować:** zmiana formuł walki, obliczania XP, mechanik levelowania.

---

### `js/ui.js` (~267 linii)
Warstwa wizualna i style. Zawiera:
- **`ANIM_CSS`** — wszystkie `@keyframes` animacji walki
- **`ICONS`** — mapa nazwa→ścieżka PNG dla 80+ ikon pixel-art
- **`PixelIcon`** — komponent renderujący ikonę (fallback do emoji)
- **`CharSprite`** — duży sprite postaci (z animacją walki)
- **`S`** — obiekt ze wszystkimi stylami inline (wrap, card, button, overlay, itp.)
- **`HpBar`** — pasek HP z animacją i kolorami
- **`FighterPanel`** — panel walczącego (portret + HP + statsy)
- **`TravelScreen`** — ekran podróży (pasek postępu)

**Kiedy edytować:** zmiana kolorów/stylów, dodanie nowych animacji, nowe ikony.

---

### `js/combat.js` (~474 linie)
Ekrany związane z walką:
- **`CombatScreen`** — główny ekran walki (turowy, auto-fight, dziennik, efekty float)
- **`DungeonBetween`** — ekran między sekcjami lochu (status HP, opcja ucieczki)
- **`DungeonReward`** — ekran nagrody po lochu (animowany przedmiot legendary/epic/rare)
- **`LevelUpOverlay`** — nakładka level up (wybór perku + alokacja statystyk)

**Kiedy edytować:** mechanika walki, nowe zdolności klasowe, UI ekranu walki.

---

### `js/screens.js` (~137 linii)
Ekrany poza głównym HUD:
- **`CharacterSelectScreen`** — wybór slotu zapisu (3 sloty, load/delete)
- **`CreateScreen`** — tworzenie nowej postaci (imię + wybór klasy z kartami statystyk)

**Kiedy edytować:** dodanie nowych klas, zmiana ekranu tytułowego.

---

### `js/tabs.js` (~700 linii)
Siedem zakładek głównego HUD:
- **`HeroTab`** — karta bohatera (statystyki, ekwipunek, perki, mikstury)
- **`QuestsTab`** — lista questów + dziennik
- **`InventoryTab`** — plecak (lista przedmiotów, equip/sell)
- **`ShopTab`** — sklep z pulą rotacyjną przedmiotów
- **`DungeonTab`** — lista lochów z cooldownami
- **`JobsTab`** — praca na czas (pasywny dochód) + dzienny bonus
- **`TavernTab`** — tawerna (piwo, hazard: Three Cups, Dice Roll, High Card)

**Kiedy edytować:** nowe UI w zakładkach, nowe gry hazardowe, zmiany sklepu.

---

### `js/app.js` (~750 linii)
Główny komponent `App` — rdzeń gry. Zawiera:
- Cały stan gry (`useState` dla hero, inventory, gold, stamina, quests, dungeons, itp.)
- Logika zapisu/ładowania (3 sloty, autosave, localStorage)
- Maszyna stanów ekranów (`screen`: title → create/load → game → travel → combat → dungeon)
- Efekty: regeneracja staminy, cooldowny lochów, timer pracy, restock piwa
- Handlery: startTravel, startJob, buyItem, equipItem, drinkBeer, claimDaily, itp.
- Główny HUD z nawigacją zakładek
- `ReactDOM.createRoot(...)` — montowanie aplikacji

**Kiedy edytować:** nowe mechaniki gry, nowe ekrany, zmiany w przepływie gry.

---

## Kolejność ładowania (zależności)

```
audio.js   ← brak zależności od innych plików gry
data.js    ← używa: audio.js (SFX w kilku miejscach pośrednio)
logic.js   ← używa: data.js (PERKS, CLASSES, DUNGEON_ITEMS)
ui.js      ← używa: data.js (STAT_COLOR, RARITY_COLOR, SLOT_EMOJI, itp.)
combat.js  ← używa: ui.js, logic.js, data.js, audio.js (SFX)
screens.js ← używa: ui.js, data.js
tabs.js    ← używa: ui.js, data.js, logic.js, audio.js
app.js     ← używa: wszystkich powyżej
```

Wszystkie zmienne są globalne (brak modułów ES6) — pliki muszą być załadowane w tej kolejności.

---

## Wskazówka dla AI

Gdy chcesz zmodyfikować konkretną część gry, wczytaj tylko odpowiedni plik:
- **Balans walki** → `logic.js` + `data.js`
- **Nowy przedmiot** → `data.js`
- **Nowy quest** → `data.js`
- **UI zakładki** → `tabs.js`
- **Ekran walki** → `combat.js`
- **Muzyka/dźwięk** → `audio.js`
- **Styl wizualny** → `ui.js`
- **Logika zapisu/stanu** → `app.js`
