import fs from "node:fs/promises";
import _groupBy from "lodash.groupby";

const res = await fs.readFile("./stats.txt", "utf-8");
const lines = res.split("\n").filter((line) => line.trim().length);

const emojis = [];

for (let num = 0; num < lines.length; num += 4) {
  const emoji = lines[num + 1];
  let date = lines[num + 2].replace(/(\d+)(st|nd|rd|th)/, "$1");
  const name = lines[num + 3];
  if (!date.match(/\s\d{4}$/)) {
    date += `, ${new Date().getFullYear()}`;
  }
  date = new Date(date);
  emojis.push({ emoji, date, name });
}

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