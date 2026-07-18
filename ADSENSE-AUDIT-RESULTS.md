# PokeValue AdSense audit results

Audit date: 18 July 2026

## Major fixes completed

- Replaced the inconsistent page-by-page pricing logic with one shared resolver.
- Cardmarket is used first for the UK/EU audience; a clearly labelled available TCGplayer variant is the fallback.
- Card detail pages now use the same local card snapshot as explorer, set and collection pages.
- The example card `ex15-100` now resolves consistently to the Cardmarket trend price: EUR 838.41, approximately GBP 721.03 using the site's display conversion.
- Renamed `app/robot.ts` to the correct Next.js convention, `app/robots.ts`.
- Rebuilt the sitemap around public content and useful card records.
- Added canonical metadata, robots directives, breadcrumbs and article structured data where appropriate.
- Marked browser-only tools and empty personal states as `noindex` and excluded them from AdSense delivery.
- Removed the broken or thin News section from navigation, sitemap and advertising while retaining the URLs as noindex pages.
- Replaced the thin guide library with four fuller guides of roughly 870–1,040 words each.
- Added Pricing Methodology and Editorial/Corrections Policy pages.
- Added the AdSense account meta tag and retained the verified publisher ID in `public/ads.txt`.
- Removed the custom cookie banner so it does not conflict with a Google-certified consent message.
- Added redirects for retired guide URLs.

## Automated checks completed

- TypeScript syntax/transpile check passed for 77 source files.
- All local `@/` imports resolve to existing files.
- Literal internal-link scan passed for all static routes.
- Local Pokémon JSON parsed successfully: 20,359 cards.
- Shared price resolver test passed.
- 19,690 card records currently meet the sitemap's minimum image, identity and price requirements.
- No API-key or private-key patterns were found in the prepared package.

## Manual actions still required

1. Run `pnpm install` and `pnpm build` on your own computer.
2. Deploy the result to Vercel.
3. Publish a Google-certified European regulations message from AdSense Privacy & messaging.
4. Verify `/ads.txt`, `/robots.txt` and `/sitemap.xml` on the live domain.
5. Review the rewritten guides and add original screenshots or first-hand examples where available.
6. Request AdSense review only after the deployed pages have been checked in an incognito window.

## Build validation note

A complete Next.js production build could not be completed in the audit container because dependency installation repeatedly timed out while retrieving packages. This package passed source-level syntax, import, route and data checks, but your local `pnpm build` remains the final required validation before deployment.

Google makes the final AdSense decision; no code change can guarantee approval.
