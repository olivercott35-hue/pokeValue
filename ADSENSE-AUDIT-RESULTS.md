# PokeValue final rebuild audit

## Result

The replacement project has been reworked around one premium visual system and an AdSense-safe route strategy. It is designed to be ready for a fresh live review after the production build, deployment and Google CMP setup are completed. Google alone decides approval, so approval cannot be guaranteed.

## Code checks passed

- TypeScript and TSX syntax across the project.
- Local import targets and required route files.
- No `/settings` or `/news` links in the shared navigation.
- Correct `app/robots.ts`; old `app/robot.ts` removed.
- `ads.txt`, sitemap, canonical metadata and structured data present.
- Private browser tools marked `noindex` and excluded from AdSense loading.
- Four substantial UK-focused collector guides, each approximately 900–1,070 words.
- Shared pricing resolver and source-labelled estimates.
- Gemini scanner no longer constructs its API client during the build.
- `.env.local`, `.next` and `node_modules` protected by `.gitignore`.

## Live actions still required

1. Run `pnpm install` and `pnpm build` locally.
2. Deploy to Vercel and manually test desktop and mobile routes.
3. Publish Google’s certified European regulations message in AdSense.
4. Confirm live `ads.txt`, `robots.txt` and `sitemap.xml`.
5. Submit the sitemap in Search Console and allow the new version to be recrawled.
6. Request an AdSense review only after the live site is stable.
