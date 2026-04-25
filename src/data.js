// ── PERKS ─────────────────────────────────────────────────────────────────────
export var PERKS = [
    { id: "iron_skin", name: "Iron Skin", emoji: "🛡️", desc: "Block chance +10%", sB: { _blockBonus: 10 } },
    { id: "eagle_eye", name: "Eagle Eye", emoji: "🦅", desc: "Crit hit chance +10%", sB: { _critBonus: 10 } },
    { id: "fleet_foot", name: "Fleet Foot", emoji: "👟", desc: "Dodge +8%, AGI +3", sB: { agi: 3, _dodgeBonus: 8 } },
    { id: "sharpshooter", name: "Sharpshooter", emoji: "🎯", desc: "Hit chance +12%", sB: { _hitBonus: 12 } },
    { id: "brute_force", name: "Brute Force", emoji: "💪", desc: "STR +5", sB: { str: 5 } },
    { id: "quick_mind", name: "Quick Mind", emoji: "🧠", desc: "INT +5", sB: { int: 5 } },
    { id: "tough_skin", name: "Tough Skin", emoji: "🪨", desc: "CON +5, max HP +50", sB: { con: 5 }, hpFlat: 50 },
    { id: "fortified", name: "Fortified", emoji: "🏰", desc: "Flat defense (CON +4)", sB: { con: 4 } },
    { id: "berserker", name: "Berserker", emoji: "🔥", desc: "+25% damage when HP below 30%", cE: "berserker", cV: 0.25 },
    { id: "vampiric", name: "Vampiric", emoji: "🩸", desc: "Heal 15% of damage dealt", cE: "vampiric", cV: 0.15 },
    { id: "resilient", name: "Resilient", emoji: "💚", desc: "Regen 4 HP at end of each round", cE: "regen", cV: 4 },
    { id: "powder_keg", name: "Powder Keg", emoji: "💥", desc: "Critical hits deal +40% damage", cE: "crit_boost", cV: 0.4 },
    { id: "iron_will", name: "Iron Will", emoji: "🔒", desc: "Survive one killing blow at 1 HP", cE: "iron_will" },
    { id: "lucky_strike", name: "Lucky Strike", emoji: "🍀", desc: "10% chance for triple damage", cE: "lucky", cV: 0.1 },
    { id: "battle_hardened", name: "Battle Hardened", emoji: "⚔️", desc: "Max HP +25%", hpPct: 0.25 },
    { id: "potion_expert", name: "Potion Expert", emoji: "🧪", desc: "Potions heal 50% more", potionBonus: 0.5 },
];

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
export var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
export var rng = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
export var xpFor = function (l) { return Math.floor(100 * Math.pow(1.5, l - 1)); };
export var COOLDOWN_MS = 15 * 60 * 1000;
export var RARITY_COLOR = { common: "#c8a44a", rare: "#4499ff", epic: "#cc44ff", legendary: "#ffaa00" };
export var RARITY_GLOW = { common: "none", rare: "0 0 8px #4499ff66", epic: "0 0 10px #cc44ff66", legendary: "0 0 14px #ffaa0088" };
export var SLOT_EMOJI = { weapon: "⚔️", helmet: "🪖", armor: "🛡️", boots: "👢", accessory: "📿" };
export var TIER_COLOR = { 1: "#9a7a30", 2: "#3a9a6a", 3: "#9a3ac8" };
export var STAT_COLOR = { str: "#ff6655", agi: "#44ccdd", int: "#cc77ff", con: "#44dd88" };
export var STAT_LABEL = { str: "⚔️ STR", agi: "🏃 AGI", int: "🧠 INT", con: "❤️ CON" };
export var STAMINA_MAX = 100;
export var STAMINA_REGEN_MS = 3 * 60 * 1000;
export var STAMINA_COST = { 1: 10, 2: 10, 3: 15, 4: 22, 5: 22, 6: 30 };
export var BEER_MAX = 3;
export var BEER_RESTOCK_MS = 45 * 60 * 1000;
export var DMG_TYPE_LABEL = { physical: "⚔ Physical", ranged: "🎯 Ranged", magical: "✨ Magical" };
export var DMG_TYPE_COLOR = { physical: "#e08844", ranged: "#44bbdd", magical: "#cc77ff" };
export var CLASS_TAG_INFO = {
    knight:    { label: "⚔ Knight",  color: "#e08844", bg: "#2a1400" },
    musketeer: { label: "🎯 Musk.",  color: "#44bbdd", bg: "#001a2a" },
    alchemist: { label: "✨ Alch.",  color: "#cc77ff", bg: "#1a0028" },
};

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
export var T = function (pl, en) { return (typeof window !== "undefined" && window.__LANG === "en") ? en : pl; };

// ── QUEST DIFFICULTY ──────────────────────────────────────────────────────────
export function getQuestDiff(minLevel) {
    if (minLevel <= 1) return { label: "Easy",   color: "#44dd88", bg: "#0a2010", pulse: false };
    if (minLevel <= 3) return { label: "Medium",  color: "#f0c060", bg: "#2a1a04", pulse: false };
    if (minLevel <= 6) return { label: "Hard",    color: "#ff8844", bg: "#2a1004", pulse: false };
    return                     { label: "Brutal", color: "#ff4444", bg: "#2a0404", pulse: true  };
}

// ── COMBAT REACTIONS ──────────────────────────────────────────────────────────
export var REACT_ATK = {
    hit:  { hero: ["Masz, skurczybyku!", "Weź to!", "No i jak ci?", "Nie płacz.", "Zasłużone!", "I co teraz?"], enemy: ["Ha! Trafiłem!", "Masz!", "Cierp!", "Słabeusz!", "Ból jest życiem!"] },
    crit: { hero: ["ŚWIĘTA ARMATA!!!", "K***A, JAK TRAFIŁEM!", "To za wszystkie podatki!", "BOOM!!!", "MIAŻDŻĄCE!!!"], enemy: ["GRZMOT!", "KTO TERAZ PŁACZE?!", "PADNIJ!", "KONIEC DLA CIEBIE!", "Żegnaj, głuptasie!"] },
    miss: { hero: ["Kurwa... spudłowałem.", "No serio?!", "DLACZEGO?!", "Zaślepiony byłem.", "Ręce mi drżą..."], enemy: ["Jak to możliwe?!", "Pudło...", "Okulary bym potrzebował.", "Niee...", "Co to było?!"] },
};
export var REACT_DEF = {
    dodge: { hero: ["Ho ho, nie dzisiaj!", "Zbyt wolny!", "Hehe, pudło!", "Widziałem to z daleka!"], enemy: ["Niezłe nóżki!", "Hehe, zwinny jesteś?", "Szczęściarz.", "Daleko nie uciekniesz!"] },
    block: { hero: ["Solidna obrona!", "Nie przejdziesz.", "Próbuj dalej, debi*!", "Żelazo, nie człowiek!"], enemy: ["Imponujące...", "Żelazna obrona...", "Niezłe.", "Hmm... twardy jesteś."] },
};
export function pickReact(side, role, type) {
    var pool = (role === "atk" ? REACT_ATK : REACT_DEF)[type];
    pool = pool && pool[side];
    if (!pool || !pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
}

// ── CLASSES ───────────────────────────────────────────────────────────────────
export var CLASSES = {
    musketeer: { name: "Musketeer", emoji: "🔫", desc: "Swift and deadly from afar. Deals bonus damage with ranged weapons.", preferredType: "ranged", primaryStat: "agi", secondaryStat: "str", stats: { str: 4, agi: 8, int: 5, con: 3 } },
    knight:    { name: "Knight",    emoji: "⚔️", desc: "Unyielding steel on the battlefield. Deals bonus damage with physical weapons.", preferredType: "physical", primaryStat: "str", secondaryStat: "con", stats: { str: 8, agi: 3, int: 3, con: 8 } },
    alchemist: { name: "Alchemist", emoji: "⚗️", desc: "Explosive concoctions. Eyebrows optional. Deals bonus damage with magical weapons.", preferredType: "magical", primaryStat: "int", secondaryStat: "agi", stats: { str: 3, agi: 5, int: 10, con: 4 } },
};

// ── ENEMIES ───────────────────────────────────────────────────────────────────
export var QUEST_ENEMIES = {
    1: { name: "Drunk Brawler",    emoji: "🍺", hp: 53,  stats: { str: 4,  agi: 3,  int: 1,  con: 4  }, desc: "Smells of ale and regret." },
    2: { name: "Bandit Leader",    emoji: "🗡️", hp: 98,  stats: { str: 7,  agi: 6,  int: 3,  con: 6  }, desc: "Fancies himself a highwayman." },
    3: { name: "Goblin Warchief",  emoji: "👺", hp: 165, stats: { str: 7,  agi: 10, int: 4,  con: 6  }, desc: "Surprisingly tactical for his size." },
    4: { name: "Smuggler Captain", emoji: "🏴‍☠️", hp: 263, stats: { str: 10, agi: 7,  int: 6,  con: 8  }, desc: "Has a pistol. And a backup pistol." },
    5: { name: "Fort Commander",   emoji: "👮", hp: 450, stats: { str: 14, agi: 7,  int: 7,  con: 13 }, desc: "Actually trained. How inconvenient." },
    6: { name: "Powder Dragon",    emoji: "🐉", hp: 825, stats: { str: 21, agi: 11, int: 18, con: 15 }, desc: "Breathes fire AND gunpowder." },
};
export var QUEST_ENEMY_POOLS = {
    1: [QUEST_ENEMIES[1], { name: "Angry Cook",   emoji: "🍳", hp: 48,  stats: { str: 5, agi: 2, int: 1,  con: 5  }, desc: "Armed with a skillet. Surprisingly lethal." },
                           { name: "Tavern Thug",  emoji: "🪓", hp: 60,  stats: { str: 6, agi: 3, int: 1,  con: 4  }, desc: "Hired muscle with a very personal grudge." }],
    2: [QUEST_ENEMIES[2], { name: "Road Cutthroat", emoji: "🔪", hp: 105, stats: { str: 8, agi: 5, int: 2, con: 7 }, desc: "Business is business." },
                           { name: "Ambush Scout",  emoji: "🏹", hp: 88,  stats: { str: 5, agi: 9, int: 3, con: 4 }, desc: "Prefers to never be seen. Today is different." }],
    3: [QUEST_ENEMIES[3], { name: "Troll Grunt", emoji: "👹", hp: 190, stats: { str: 10, agi: 4,  int: 1,  con: 10 }, desc: "Not tactical. Just enormous." },
                           { name: "Hex Shaman",  emoji: "🧙", hp: 155, stats: { str: 4,  agi: 8,  int: 12, con: 5  }, desc: "Smells of mushrooms and bad intentions." }],
    4: [QUEST_ENEMIES[4], { name: "Powder Saboteur", emoji: "💣", hp: 245, stats: { str: 8,  agi: 9, int: 8, con: 6  }, desc: "Always smells slightly of sulfur." },
                           { name: "Harbor Master",   emoji: "⚓", hp: 280, stats: { str: 11, agi: 5, int: 5, con: 10 }, desc: "Controls the docks. And your fate." }],
    5: [QUEST_ENEMIES[5], { name: "Elite Hussar", emoji: "🐴", hp: 420, stats: { str: 12, agi: 11, int: 5,  con: 11 }, desc: "Man and horse. One deadly unit." },
                           { name: "War Mage",     emoji: "🔮", hp: 400, stats: { str: 6,  agi: 8,  int: 18, con: 10 }, desc: "The most dangerous kind of academic." }],
    6: [QUEST_ENEMIES[6], { name: "Ancient Drake",     emoji: "🐲", hp: 790, stats: { str: 24, agi: 14, int: 12, con: 14 }, desc: "Older than the kingdom. Much angrier." },
                           { name: "Corrupted Knight",  emoji: "☠️", hp: 840, stats: { str: 19, agi: 10, int: 15, con: 17 }, desc: "Once honorable. No longer." }],
};
export function getQuestEnemy(id) { var p = QUEST_ENEMY_POOLS[id]; return p ? Object.assign({}, p[rng(0, p.length - 1)]) : Object.assign({}, QUEST_ENEMIES[id]); }
export function scaleEnemy(enemy, heroLevel) {
    if (!enemy || !heroLevel || heroLevel <= 3) return enemy;
    var lvlOver = heroLevel - 3;
    var hpMult  = 1 + lvlOver * 0.14;
    var stMult  = 1 + lvlOver * 0.06;
    var scaled  = Object.assign({}, enemy);
    scaled.hp   = Math.round(enemy.hp * hpMult);
    scaled.stats = {};
    Object.keys(enemy.stats).forEach(function(k) { scaled.stats[k] = Math.max(1, Math.round((enemy.stats[k] || 0) * stMult)); });
    scaled._scaled = true;
    return scaled;
}

// ── QUESTS ────────────────────────────────────────────────────────────────────
export var QUESTS = [
    { id: 1, name: "Tavern Brawl",         desc: "Sort out a disagreement at the local tavern. With fists.",         travel: 5,  minLevel: 1, xp: 15,  gold: [5,   15],  lootChance: 0.3  },
    { id: 2, name: "Bandit Camp",           desc: "Clear out bandits taxing travelers (not for the crown).",          travel: 8,  minLevel: 1, xp: 30,  gold: [10,  25],  lootChance: 0.4  },
    { id: 3, name: "Goblin Warren",         desc: "A goblin infestation. They smell worse than they fight.",          travel: 12, minLevel: 2, xp: 60,  gold: [20,  40],  lootChance: 0.5  },
    { id: 4, name: "Smugglers' Den",        desc: "Contraband powder kegs. Someone has to confiscate them.",          travel: 15, minLevel: 3, xp: 100, gold: [35,  60],  lootChance: 0.55 },
    { id: 5, name: "Fort Greywall",         desc: "Storming a fort. What could possibly go wrong?",                   travel: 20, minLevel: 5, xp: 180, gold: [60,  100], lootChance: 0.65 },
    { id: 6, name: "Dragon's Powder Hoard", desc: "A dragon hoarding gunpowder. Genius or catastrophic.",             travel: 30, minLevel: 8, xp: 350, gold: [120, 200], lootChance: 0.75 },
];
export function getStaminaCost(q) { return STAMINA_COST[q.id] || 15; }

// ── ITEMS ─────────────────────────────────────────────────────────────────────
export var ITEMS = [
    { id:"w7",  name:"Siege Pistol",          slot:"weapon", tier:2, dmgType:"ranged",   stats:{str:3,int:3,agi:2},       price:175, desc:"Too heavy for a holster. Too effective to ignore." },
    { id:"w8",  name:"Thunder Arquebus",       slot:"weapon", tier:3, dmgType:"ranged",   stats:{str:5,agi:6,int:4},       price:530, desc:"Takes 3 minutes to reload. Worth every second." },
    { id:"w2",  name:"Cavalry Saber",          slot:"weapon", tier:1, dmgType:"physical", stats:{str:3},                   price:60,  classTag:"knight",    desc:"Slashing is more reliable than powder." },
    { id:"w5",  name:"Enchanted Zweihänder",   slot:"weapon", tier:3, dmgType:"physical", stats:{str:8,con:2},             price:500, classTag:"knight",    desc:"Glows when enemies are near. Also randomly." },
    { id:"kw1", name:"War Hammer",             slot:"weapon", tier:2, dmgType:"physical", stats:{str:5,con:3},             price:185, classTag:"knight",    desc:"Designed to dent armour. And spirits." },
    { id:"kw2", name:"Templar's Blade",        slot:"weapon", tier:3, dmgType:"physical", stats:{str:9,con:3},             price:525, classTag:"knight",    desc:"Blessed thrice. Still covered in blood." },
    { id:"w1",  name:"Rusty Flintlock",        slot:"weapon", tier:1, dmgType:"ranged",   stats:{agi:2,str:1},             price:50,  classTag:"musketeer", desc:"Fires occasionally. When it feels like it." },
    { id:"w4",  name:"Repeating Musket",       slot:"weapon", tier:2, dmgType:"ranged",   stats:{agi:5,str:2},             price:200, classTag:"musketeer", desc:"Fires 3 times before jamming spectacularly." },
    { id:"mw1", name:"Dueling Pistol",         slot:"weapon", tier:1, dmgType:"ranged",   stats:{agi:4,str:1},             price:65,  classTag:"musketeer", desc:"For arguments that demand a final word." },
    { id:"mw2", name:"Long Rifle",             slot:"weapon", tier:3, dmgType:"ranged",   stats:{agi:8,str:3},             price:515, classTag:"musketeer", desc:"One shot, no second chances. Usually." },
    { id:"w3",  name:"Grenadier's Pack",       slot:"weapon", tier:2, dmgType:"magical",  stats:{int:4,str:1},             price:150, classTag:"alchemist", desc:"Contains 4 grenades. Usually." },
    { id:"w6",  name:"Alchemical Cannon",      slot:"weapon", tier:3, dmgType:"magical",  stats:{int:7,str:3},             price:600, classTag:"alchemist", desc:"Shoulder-mounted. Medically inadvisable." },
    { id:"aw1", name:"Vial Launcher",          slot:"weapon", tier:1, dmgType:"magical",  stats:{int:3,agi:2},             price:70,  classTag:"alchemist", desc:"Flings volatile compounds with enthusiasm." },
    { id:"aw2", name:"Arcane Mortar",          slot:"weapon", tier:2, dmgType:"magical",  stats:{int:6,agi:2},             price:215, classTag:"alchemist", desc:"Short-range devastation. In a good way." },
    { id:"h1",  name:"Leather Cap",            slot:"helmet", tier:1, stats:{con:1},                                       price:30,  desc:"Better than nothing. Barely." },
    { id:"h2",  name:"Morion Helmet",          slot:"helmet", tier:2, stats:{con:3,agi:1},                                 price:120, desc:"Tall crest deflects arrows and compliments." },
    { id:"h3",  name:"Full Plate Helm",        slot:"helmet", tier:3, stats:{con:6,str:1},                                 price:400, desc:"Vision: 30 degrees. Feature, not bug." },
    { id:"h4",  name:"Scout's Cap",            slot:"helmet", tier:2, stats:{agi:4,int:1},                                 price:110, desc:"Favored by those who prefer running to fighting." },
    { id:"a1",  name:"Padded Gambeson",        slot:"armor",  tier:1, stats:{con:2},                                       price:40,  desc:"Effective. Also incredibly sweaty." },
    { id:"a2",  name:"Chainmail Hauberk",      slot:"armor",  tier:2, stats:{con:4,str:1},                                 price:180, classTag:"knight",    desc:"Each ring lovingly machine-linked." },
    { id:"a3",  name:"Cuirassier Plate",       slot:"armor",  tier:3, stats:{con:7,str:2},                                 price:550, classTag:"knight",    desc:"Pistol-proof. Most of the time." },
    { id:"ka1", name:"Iron Hauberk",           slot:"armor",  tier:1, stats:{con:3,str:1},                                 price:55,  classTag:"knight",    desc:"Heavy, hot, and surprisingly comfortable." },
    { id:"ka2", name:"Knight's Plate",         slot:"armor",  tier:2, stats:{con:6,str:2},                                 price:225, classTag:"knight",    desc:"Forged for charging. Not for dancing." },
    { id:"ka3", name:"Templar Armour",         slot:"armor",  tier:3, stats:{con:10,str:3},                                price:610, classTag:"knight",    desc:"The kind of armour that ends sieges." },
    { id:"a4",  name:"Scale Vest",             slot:"armor",  tier:2, stats:{con:5,agi:1},                                 price:165, classTag:"musketeer", desc:"Scales from something. Best not to ask." },
    { id:"ma1", name:"Leather Jerkin",         slot:"armor",  tier:1, stats:{agi:2,con:1},                                 price:45,  classTag:"musketeer", desc:"Light enough to run. Tough enough to matter." },
    { id:"ma2", name:"Ranger's Coat",          slot:"armor",  tier:2, stats:{agi:4,con:2},                                 price:190, classTag:"musketeer", desc:"Long coat, long range, long odds." },
    { id:"ma3", name:"Shadow Cloak",           slot:"armor",  tier:3, stats:{agi:7,con:2},                                 price:575, classTag:"musketeer", desc:"Difficult to see. Easy to fear." },
    { id:"aa1", name:"Apprentice's Robe",      slot:"armor",  tier:1, stats:{int:2,agi:1},                                 price:45,  classTag:"alchemist", desc:"Stained with six substances. Intentionally." },
    { id:"aa2", name:"Scholar's Vestment",     slot:"armor",  tier:2, stats:{int:4,con:1,agi:1},                           price:195, classTag:"alchemist", desc:"Pockets for everything. Including regret." },
    { id:"aa3", name:"Arcane Regalia",         slot:"armor",  tier:3, stats:{int:7,agi:2,con:1},                           price:585, classTag:"alchemist", desc:"Woven from distilled knowledge. Somehow." },
    { id:"b1",  name:"Leather Boots",          slot:"boots",  tier:1, stats:{agi:2},                                       price:35,  desc:"They go on your feet. Revolutionary." },
    { id:"b4",  name:"Iron Sabatons",          slot:"boots",  tier:3, stats:{con:4,str:3},                                 price:395, classTag:"knight",    desc:"Heavy but reassuring." },
    { id:"b2",  name:"Cavalry Boots",          slot:"boots",  tier:2, stats:{agi:4,con:1},                                 price:130, classTag:"musketeer", desc:"Great for riding. Awful for swimming." },
    { id:"b3",  name:"Alchemist's Greaves",    slot:"boots",  tier:3, stats:{agi:5,int:3},                                 price:420, classTag:"alchemist", desc:"Infused with Haste. 40% more stumbling." },
    { id:"ac1", name:"Powder Horn",            slot:"accessory", tier:1, stats:{agi:1,int:1},                              price:45,  desc:"For powder. Not for honking." },
    { id:"ac2", name:"Officer's Sash",         slot:"accessory", tier:2, stats:{str:2,int:2},                              price:160, desc:"Conveys authority. Catches spilled wine." },
    { id:"ac4", name:"Tactician's Tome",       slot:"accessory", tier:2, stats:{int:3,str:2},                              price:145, desc:"Chapter 1: Don't die." },
    { id:"ac5", name:"Hero's Crest",           slot:"accessory", tier:3, stats:{str:4,agi:4,con:3},                        price:455, desc:"You're borrowing it indefinitely." },
    { id:"kac1",name:"Battle Standard",        slot:"accessory", tier:1, stats:{str:2,con:1},                              price:50,  classTag:"knight",    desc:"Plant it. Rally. Win. Repeat." },
    { id:"kac2",name:"Knight's Sigil",         slot:"accessory", tier:2, stats:{str:3,con:2},                              price:175, classTag:"knight",    desc:"Proof of fealty. And excellent credit." },
    { id:"kac3",name:"Templar's Oath",         slot:"accessory", tier:3, stats:{str:5,con:4},                              price:495, classTag:"knight",    desc:"Sworn before god and three witnesses." },
    { id:"mac1",name:"Bullet Pouch",           slot:"accessory", tier:1, stats:{agi:2},                                    price:40,  classTag:"musketeer", desc:"Suspiciously heavy for its size." },
    { id:"mac2",name:"Spyglass",               slot:"accessory", tier:2, stats:{agi:3,int:1},                              price:155, classTag:"musketeer", desc:"See the enemy before they see you." },
    { id:"mac3",name:"Marksman's Coin",        slot:"accessory", tier:3, stats:{agi:6,str:2},                              price:475, classTag:"musketeer", desc:"Heads: you live. Tails: they don't." },
    { id:"ac3", name:"Philosopher's Compass",  slot:"accessory", tier:3, stats:{int:6,agi:2},                              price:480, classTag:"alchemist", desc:"Currently pointing toward the tavern." },
    { id:"aac1",name:"Crystal Vial",           slot:"accessory", tier:1, stats:{int:2},                                    price:40,  classTag:"alchemist", desc:"Empty. For now." },
    { id:"aac2",name:"Alchemist's Lens",       slot:"accessory", tier:2, stats:{int:3,agi:1},                              price:160, classTag:"alchemist", desc:"Magnifies both targets and mistakes." },
    { id:"aac3",name:"Philosopher's Shard",    slot:"accessory", tier:3, stats:{int:7,con:1},                              price:500, classTag:"alchemist", desc:"Fragment of the real thing. Allegedly." },
];

export var DUNGEON_ITEMS = [
    { id: "dr1", name: "Sharpshooter's Musket",    slot: "weapon",    rarity: "rare",      stats: { agi: 7, str: 3, int: 2 },      sellPrice: 120, desc: "Fires straight. Revolutionary concept." },
    { id: "dr2", name: "Duelist's Rapier",          slot: "weapon",    rarity: "rare",      stats: { str: 5, agi: 6 },              sellPrice: 120, desc: "En garde, et cetera." },
    { id: "dr3", name: "Rifleman's Coif",           slot: "helmet",    rarity: "rare",      stats: { con: 5, agi: 4 },              sellPrice: 100, desc: "A hat with ambitions." },
    { id: "dr4", name: "Bomb-Proof Vest",           slot: "armor",     rarity: "rare",      stats: { con: 9, str: 2 },              sellPrice: 110, desc: "Tested empirically. Once." },
    { id: "dr5", name: "Stalker's Boots",           slot: "boots",     rarity: "rare",      stats: { agi: 7, int: 2 },              sellPrice: 100, desc: "Silent as a less-loud person." },
    { id: "dr6", name: "Alchemist's Bandolier",     slot: "accessory", rarity: "rare",      stats: { int: 6, str: 2 },              sellPrice: 100, desc: "Holds 12 vials. Currently 3." },
    { id: "de1", name: "Void-Touched Pistol",       slot: "weapon",    rarity: "epic",      stats: { int: 10, agi: 6, str: 3 },     sellPrice: 280, desc: "The void looks back. Awkward." },
    { id: "de2", name: "Warblade of Free Companies",slot: "weapon",    rarity: "epic",      stats: { str: 12, con: 3, agi: 2 },     sellPrice: 280, desc: "Seven armies. Zero survivors." },
    { id: "de3", name: "Ironclad Cuirass",          slot: "armor",     rarity: "epic",      stats: { con: 13, str: 4 },             sellPrice: 260, desc: "Survived three wars. Dinged." },
    { id: "de4", name: "Shadowweave Helm",          slot: "helmet",    rarity: "epic",      stats: { con: 8, agi: 5, int: 3 },      sellPrice: 250, desc: "Shadows not included." },
    { id: "de5", name: "Mercenary's Greaves",       slot: "boots",     rarity: "epic",      stats: { agi: 9, con: 5 },              sellPrice: 250, desc: "Walked a thousand miles. Still going." },
    { id: "de6", name: "Dragon-Scale Sash",         slot: "accessory", rarity: "epic",      stats: { con: 6, int: 8, str: 3 },      sellPrice: 260, desc: "The dragon may want this back." },
    { id: "dl1", name: "Throne-Breaker",            slot: "weapon",    rarity: "legendary", stats: { str: 16, con: 5, agi: 4 },     sellPrice: 600, desc: "Once belonged to a king. Long story." },
    { id: "dl2", name: "The Sovereign Musket",      slot: "weapon",    rarity: "legendary", stats: { agi: 16, int: 8, str: 5 },     sellPrice: 600, desc: "Fires once. That's enough." },
    { id: "dl3", name: "The Last Bulwark",          slot: "armor",     rarity: "legendary", stats: { con: 20, str: 6 },             sellPrice: 580, desc: "The kingdom fell. The armor didn't." },
    { id: "dl4", name: "Crown of Smoke",            slot: "helmet",    rarity: "legendary", stats: { int: 14, agi: 8, con: 4 },     sellPrice: 570, desc: "Formed from alchemical vapor. Solid." },
    { id: "dl5", name: "Zephyr's Trail",            slot: "boots",     rarity: "legendary", stats: { agi: 15, int: 5 },             sellPrice: 560, desc: "Named after a wind. Faster than one." },
    { id: "dl6", name: "Philosopher's Heart",       slot: "accessory", rarity: "legendary", stats: { int: 16, str: 6, agi: 5, con: 5 }, sellPrice: 620, desc: "The stone was in your heart all along." },
];

export var POTIONS = [
    { id: "p1", name: "Small Potion",  emoji: "🧪", heal: 30,  price: 20, desc: "Tastes of strawberries and despair." },
    { id: "p2", name: "Medium Potion", emoji: "⚗️", heal: 60,  price: 40, desc: "The medium amount of questionable." },
    { id: "p3", name: "Large Potion",  emoji: "🫙", heal: 100, price: 75, desc: "Glows slightly. Probably fine." },
];

export var DUNGEONS = [
    { id: 1, name: "Rusted Keep",      emoji: "🏚️", minLevel: 1,  travel: 10, lootTable: "rare",      xp: 120,  gold: [50,  100], desc: "Abandoned fortress. Rats with delusions of grandeur.",
      sections: [{ name: "Gatehouse",        enemy: { name: "Gate Rat",        emoji: "🐀", hp: 68,  stats: { str: 6,  agi: 4,  int: 1,  con: 4  }, desc: "A rat with a grudge." } },
                 { name: "Great Hall",        enemy: { name: "Rusted Knight",   emoji: "🤺", hp: 105, stats: { str: 8,  agi: 6,  int: 3,  con: 7  }, desc: "Clanks ominously." } },
                 { name: "Keep Tower",        enemy: { name: "Iron Golem",      emoji: "🤖", hp: 165, stats: { str: 11, agi: 3,  int: 1,  con: 13 }, desc: "Slow but hits hard." }, boss: true }] },
    { id: 2, name: "Fort Ironwood",    emoji: "🏰", minLevel: 4,  travel: 15, lootTable: "epic",      xp: 300,  gold: [120, 220], desc: "A real fortification, defended by real soldiers.",
      sections: [{ name: "Outer Wall",        enemy: { name: "Ironwood Guard",  emoji: "💂", hp: 195, stats: { str: 13, agi: 7,  int: 4,  con: 11 }, desc: "Professional. Annoying." } },
                 { name: "Barracks",           enemy: { name: "Sergeant Major",  emoji: "⚔️", hp: 285, stats: { str: 15, agi: 8,  int: 6,  con: 13 }, desc: "Twenty years' experience." } },
                 { name: "Commander's Hall",   enemy: { name: "Iron Commander",  emoji: "👮", hp: 405, stats: { str: 18, agi: 10, int: 8,  con: 15 }, desc: "Veteran of twelve campaigns." }, boss: true }] },
    { id: 3, name: "Powder Magazine", emoji: "💥", minLevel: 7,  travel: 20, lootTable: "epic",      xp: 520,  gold: [200, 360], desc: "Do NOT shoot the walls. This cannot be overstated.",
      sections: [{ name: "Fuse Room",          enemy: { name: "Powder Warden",  emoji: "🧨", hp: 420, stats: { str: 18, agi: 11, int: 10, con: 13 }, desc: "Extremely flammable job." } },
                 { name: "Arsenal",             enemy: { name: "Blast Captain",  emoji: "💣", hp: 570, stats: { str: 21, agi: 13, int: 13, con: 15 }, desc: "Loves his grenades." } },
                 { name: "Core Chamber",        enemy: { name: "Grand Bomb",     emoji: "💥", hp: 750, stats: { str: 24, agi: 14, int: 17, con: 18 }, desc: "It breathes." }, boss: true }] },
    { id: 4, name: "Dragon's Keep",   emoji: "🐉", minLevel: 10, travel: 30, lootTable: "legendary", xp: 1050, gold: [400, 720], desc: "The dragon has a cannon collection. You covet it.",
      sections: [{ name: "Dragon Gate",         enemy: { name: "Drake Sentinel", emoji: "🦎", hp: 630, stats: { str: 24, agi: 14, int: 14, con: 21 }, desc: "A scaled wall with opinions." } },
                 { name: "Hoard Chamber",        enemy: { name: "Dragon Knight",  emoji: "🐲", hp: 870, stats: { str: 28, agi: 17, int: 17, con: 24 }, desc: "The dragon's champion." } },
                 { name: "Dragon's Throne",      enemy: { name: "Powder Dragon",  emoji: "🐉", hp: 1170, stats: { str: 34, agi: 20, int: 25, con: 27 }, desc: "Ancient. Explosive. Disappointed in you." }, boss: true }] },
];

// ── JOBS ──────────────────────────────────────────────────────────────────────
export var JOBS = [
    { id: 1, name: "Sprzątanie Tawerny", nameEn: "Tavern Cleaning",   emoji: "🧹", duration: 10 * 60 * 1000, minLevel: 1, baseGold: [8,  15],  bonusPerLevel: 1 },
    { id: 2, name: "Służba Wartownicza", nameEn: "Guard Duty",        emoji: "🛡️", duration: 20 * 60 * 1000, minLevel: 3, baseGold: [20, 35],  bonusPerLevel: 2 },
    { id: 3, name: "Pomoc Kowala",       nameEn: "Blacksmith's Aid",  emoji: "⚒️", duration: 30 * 60 * 1000, minLevel: 5, baseGold: [40, 65],  bonusPerLevel: 3 },
    { id: 4, name: "Eskorta Kupiecka",   nameEn: "Merchant Escort",   emoji: "🚢", duration: 45 * 60 * 1000, minLevel: 7, baseGold: [70, 110], bonusPerLevel: 5 },
];
