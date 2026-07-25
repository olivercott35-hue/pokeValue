# PokeValue Authority Build — Final Deployment

1. Copy `.env.example` to `.env.local` and insert real private keys only in `.env.local`.
2. Copy the existing hidden `.git` directory into this project if replacing the repository folder.
3. Run `pnpm install`.
4. Run `pnpm verify:adsense`.
5. Run `pnpm build` and do not deploy if it fails.
6. Test `/`, `/cards`, `/sets`, `/guides`, `/market-insights`, `/collector-toolkit`, `/methodology`, `/editorial-policy`, `/about`, `/contact`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, and `/ads.txt`.
7. Commit and push to the production branch.
8. In AdSense, publish the certified European regulations consent message for UK/EEA visitors.
9. Submit `https://www.pokevalue.co.uk/sitemap.xml` in Search Console.
10. Let Google recrawl the rebuilt content before requesting another review.

No code package can guarantee approval. This build removes the controllable technical and structural blockers and substantially expands original editorial value.

## Price accuracy and freshness (read this)

Displayed prices are not live — they come from a periodic sync of
Cardmarket/TCGplayer listings via `pnpm sync:pokemon`, written to
`data/pokemon-cards.json` and `data/pokemon-sets.json`. No card-pricing
product can claim real-time, always-correct prices; what this build does
instead is keep the data reasonably fresh and label it honestly:

1. `.github/workflows/refresh-price-data.yml` re-runs the sync daily,
   commits the updated `data/` files, and (if you set a
   `VERCEL_DEPLOY_HOOK_URL` repo secret) triggers a redeploy. Add
   `POKEMON_TCG_API_KEY` as a repo secret too — the public API works
   without one but is rate-limited.
2. The footer and `/methodology` page now show the real "last synced"
   date pulled from `data/pokemon-sync-report.json`, with a visible
   warning if it's gone stale, instead of implying the number is live.
3. Before every deploy that isn't handled by the Action above, run
   `pnpm sync:pokemon` yourself (or use `pnpm build:sync` as the build
   command) so you're not shipping old data.

## Cleanup done in this pass

- Removed `components/PriceBadge.tsx`, `components/RecentSales.tsx` and
  `lib/pricing.ts` — dead code that called a `/api/get-price` endpoint
  which never existed.
- Removed `app/api/prices/[cardId]/route.ts` — a stub that always
  returned `marketPrice: null` and was only referenced by the now-removed
  `RecentSales.tsx`.
- Removed `app/api/search/route.ts` — an unused duplicate of `/api/cards`.
- Rebuilt `components/GlobalSearch.tsx` (previously unused/dead) to query
  the site's own `/api/cards` endpoint — the same resolved-price dataset
  every other page uses — instead of calling `api.pokemontcg.io` directly
  from the browser with no key, and wired it into the header so it's
  actually live.
