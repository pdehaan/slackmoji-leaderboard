import fs from "node:fs/promises";
import _chunk from "lodash.chunk";
import _groupBy from "lodash.groupby";

export async function loadEmojis(file = "./stats.txt") {
  const res = await fs.readFile(file, "utf-8");
  // Remove any blank lines
  return res
    .trim()
    .split("\n")
    .filter((line) => line.trim().length);
}

export function parseLeaderboard(lines = [], count = 10) {
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
    emojis.push({ emoji, date: new Date(date), name });
  }

  // Group emojis by uploader, reduce into {name, count} pairs,
  // sort by highest count first, grab the top `count` results.
  const grouped = _groupBy(emojis, "name");
  return Object.entries(grouped)
    .reduce((acc, [name, { length }]) => {
      acc.push({ name, count: length });
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count)
    .slice(0, count);
}
