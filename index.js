import { loadEmojis, parseLeaderboard } from "./lib.js";

const lines = await loadEmojis("./stats.txt");
const leaderboard = parseLeaderboard(lines, 10);

for (const row of leaderboard) {
  console.log(`${row.name}: ${row.count}`);
}
