import fs from "node:fs/promises";
import _chunk from "lodash.chunk";
import _groupBy from "lodash.groupby";

const lines = await loadEmojis("./stats.txt");
const leaderboard = parseLeaderboard(lines, 10);

for (const row of leaderboard) {
  console.log(`${row.name}: ${row.count}`);
}

async function loadEmojis(file = "./stats.txt") {
  const res = await fs.readFile(file, "utf-8");
  // Remove any blank lines
  return res.trim().split("\n").filter((line) => line.trim().length);
}

function parseLeaderboard(lines = [], count = 10) {
  const CURR_YEAR = new Date().getFullYear();
  const emojis = [];

  // Split into chunks of 4 lines...
  for (let [, emoji, date, name] of _chunk(lines, 4)) {
    // Remove the fancy date suffixes since it breaks `new Date()`.
    date = date.replace(/(\d+)(st|nd|rd|th)/, "$1");
    // Add in the missing current year.
    if (!date.match(/\s\d{4}$/)) {
      date += `, ${CURR_YEAR}`;
    }
    date = new Date(date);
    emojis.push({ emoji, date, name });
  }

  // Group emojis by uploader, reduce into {name, count} pairs,
  // sort by highest count first, grab the top 10 results.
  const grouped = _groupBy(emojis, "name");
  return Object.entries(grouped)
    .reduce((acc, [k, v]) => {
      acc.push({ name: k, count: v.length });
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count)
    .slice(0, count);
}
