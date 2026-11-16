// All data in this file is MOCK data for the prototype.

export const timeControls = [
  { id: "1+0", label: "Bullet", base: 60, inc: 0 },
  { id: "3+2", label: "Blitz", base: 180, inc: 2 },
  { id: "5+0", label: "Blitz", base: 300, inc: 0 },
  { id: "10+0", label: "Rapid", base: 600, inc: 0 },
  { id: "15+10", label: "Rapid", base: 900, inc: 10 },
  { id: "30+0", label: "Classical", base: 1800, inc: 0 },
] as const;

export const lobbyGames = [
  { id: "g1", host: "NimzoKnight", rating: 1842, tc: "5+0", mode: "Rated", color: "Random", country: "Norway" },
  { id: "g2", host: "QueenGambit_88", rating: 1510, tc: "3+2", mode: "Casual", color: "White", country: "India" },
  { id: "g3", host: "endgame_elena", rating: 2104, tc: "10+0", mode: "Rated", color: "Random", country: "Spain" },
  { id: "g4", host: "BishopPair", rating: 1325, tc: "15+10", mode: "Casual", color: "Black", country: "Brazil" },
  { id: "g5", host: "zugzwang_z", rating: 1977, tc: "1+0", mode: "Rated", color: "Random", country: "Germany" },
  { id: "g6", host: "PawnStorm", rating: 1688, tc: "30+0", mode: "Casual", color: "Random", country: "Canada" },
];

export const leaderboard = [
  { name: "Magnus_K", rating: 2871, country: "Norway", trend: "+12" },
  { name: "HikaruFan", rating: 2794, country: "USA", trend: "+4" },
  { name: "Praggu", rating: 2762, country: "India", trend: "+21" },
  { name: "AnnaMuzy", rating: 2701, country: "Ukraine", trend: "-3" },
  { name: "Fabi_C", rating: 2688, country: "Italy", trend: "+1" },
];

export const events = [
  { id: "e1", title: "AICC Grand Prix", format: "Swiss · 9 rounds", date: "2026-12-06", time: "16:00 UTC", players: 412, cap: 512, prize: "$5,000", status: "Open", tc: "10+0", featured: true, desc: "Our flagship monthly tournament. Nine rounds of rapid chess with the strongest community players." },
  { id: "e2", title: "Friday Night Blitz Arena", format: "Arena · 2 hours", date: "2026-11-20", time: "19:00 UTC", players: 188, cap: 300, prize: "Trophy", status: "Open", tc: "3+2", featured: false, desc: "Score as many points as you can in two hours. Streaks double your points." },
  { id: "e3", title: "Beginner Bootcamp Cup", format: "Swiss · 5 rounds", date: "2026-11-28", time: "11:00 UTC", players: 96, cap: 128, prize: "Coaching pass", status: "Open", tc: "15+10", featured: false, desc: "For players under 1200. Friendly pairings, post-game coach notes." },
  { id: "e4", title: "Winter Bullet Brawl", format: "Knockout · 64 players", date: "2026-12-14", time: "18:30 UTC", players: 64, cap: 64, prize: "$1,000", status: "Full", tc: "1+0", featured: false, desc: "Single elimination bullet. Blink and you're out." },
  { id: "e5", title: "AICC Open Championship", format: "Swiss · 11 rounds", date: "2027-01-10", time: "14:00 UTC", players: 73, cap: 1024, prize: "$20,000", status: "Soon", tc: "30+0", featured: false, desc: "The season finale. Classical time control, titled and untitled welcome." },
  { id: "e6", title: "Women's Rapid Invitational", format: "Round robin · 8 players", date: "2026-10-30", time: "15:00 UTC", players: 8, cap: 8, prize: "$2,500", status: "Finished", tc: "10+5", featured: false, desc: "Won by Elena Marchetti on tiebreak after a dramatic final round." },
];

export const recentGames = [
  { opp: "NimzoKnight", result: "Win", rating: 1842, tc: "5+0", moves: 41, opening: "Sicilian Defense", delta: "+9" },
  { opp: "endgame_elena", result: "Loss", rating: 2104, tc: "10+0", moves: 58, opening: "Queen's Gambit", delta: "-6" },
  { opp: "BishopPair", result: "Win", rating: 1325, tc: "3+2", moves: 33, opening: "Italian Game", delta: "+4" },
  { opp: "zugzwang_z", result: "Draw", rating: 1977, tc: "10+0", moves: 72, opening: "Catalan Opening", delta: "+1" },
  { opp: "PawnStorm", result: "Win", rating: 1688, tc: "15+10", moves: 47, opening: "King's Indian", delta: "+7" },
];

export const ratingHistory = [1412, 1430, 1421, 1455, 1470, 1462, 1488, 1501, 1495, 1523, 1540, 1536, 1561, 1577, 1590];

export const team = ["Siddhi Kale", "Shekhar Puranik"];

export const countries = ["India", "Norway", "USA", "Germany", "Spain", "Brazil", "Canada", "Ukraine", "Italy", "Japan", "Other"];
export const openings = ["Sicilian Defense", "Queen's Gambit", "Italian Game", "Ruy Lopez", "King's Indian", "London System", "French Defense", "Caro-Kann", "Catalan Opening"];
