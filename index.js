import fs from "node:fs/promises";
import _chunk from "lodash.chunk";
import _groupBy from "lodash.groupby";

const res = await fs.readFile("./stats.txt", "utf-8");
const lines = res.split("\n").filter((line) => line.trim().length);

const emojis = [];

// Split into chunks of 4 lines...
for (let [, emoji, date, name] of _chunk(lines, 4)) {
  // Remove the fancy date suffixes.
  date = date.replace(/(\d+)(st|nd|rd|th)/, "$1");
  // Add in the missing current year.
  if (!date.match(/\s\d{4}$/)) {
    date += `, ${new Date().getFullYear()}`;
  }
  date = new Date(date);
  emojis.push({ emoji, date, name });
}

// Group emojis by uploader, reduce into {name, count} pairs,
// sort by highest count first, grab the top 10 results.
let grouped = _groupBy(emojis, "name");
grouped = Object.entries(grouped)
  .reduce((acc, [k, v]) => {
    acc.push({ name: k, count: v.length });
    return acc;
  }, [])
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);

for (const row of grouped) {
  console.log(`${row.name}: ${row.count}`);
}
