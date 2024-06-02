import { parseLeaderboard } from "./lib.js";

const leaderboard = await parseLeaderboard("./stats.txt", 10);

for (const row of leaderboard) {
  console.log(`${row.name}: ${row.count}`);
}
