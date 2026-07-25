import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "app/robots.ts", "app/sitemap.ts", "public/ads.txt", "app/privacy/page.tsx",
  "app/terms/page.tsx", "app/contact/page.tsx", "app/about/page.tsx",
  "app/editorial-policy/page.tsx", "app/methodology/page.tsx",
  "app/market-insights/page.tsx", "app/collector-toolkit/page.tsx",
];
const missing = required.filter((item) => !fs.existsSync(path.join(root, item)));
if (missing.length) {
  console.error("Missing required files:\n" + missing.join("\n"));
  process.exit(1);
}
const ads = fs.readFileSync(path.join(root, "public/ads.txt"), "utf8");
if (!/google\.com,\s*pub-\d+,\s*DIRECT,\s*f08c47fec0942fa0/.test(ads)) {
  console.error("ads.txt does not contain a valid Google DIRECT record.");
  process.exit(1);
}
const guideText = fs.readFileSync(path.join(root, "lib/guides.ts"), "utf8");
const guideCount = (guideText.match(/slug:\s*"/g) || []).length;
if (guideCount < 10) {
  console.error(`Only ${guideCount} guides found; expected at least 10.`);
  process.exit(1);
}
console.log(`AdSense readiness source checks passed (${guideCount} substantial guides detected).`);
