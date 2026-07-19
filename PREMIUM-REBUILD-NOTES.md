# Premium rebuild notes

## Completed

- One shared dark premium shell, sidebar, header, footer, spacing scale and glass treatment.
- Preserved motion, hover lift, shine and ambient glow effects with reduced-motion support.
- Removed broken Settings and News navigation.
- Redirected retired thin news and guide URLs rather than leaving dead links.
- Four substantial UK-focused collector guides with article and breadcrumb structured data.
- Shared Cardmarket-first pricing resolver used across card, set and collection experiences.
- Public content routes can load AdSense; private/empty browser tools cannot.
- Private tools are excluded from the sitemap and marked `noindex`.
- Correct `app/robots.ts`, public sitemap, `ads.txt`, canonical URLs and trust pages.
- Gemini client is created only inside scanner requests, preventing missing-key build warnings.
- Complete `.gitignore`, pnpm build-script approvals and environment example included.

## Required after deployment

- Publish Google’s certified European regulations message in AdSense.
- Confirm `https://www.pokevalue.co.uk/ads.txt`, `/robots.txt` and `/sitemap.xml`.
- Run the production build locally and inspect every major route on desktop and mobile.
- Request review only after the live deployment is stable and fully crawled.
