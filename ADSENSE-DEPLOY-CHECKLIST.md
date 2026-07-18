# PokeValue AdSense deployment checklist

The code changes in this package remove the main technical blockers found in the uploaded project. AdSense approval is still decided by Google and cannot be guaranteed.

## 1. Install and validate locally

```powershell
pnpm install
pnpm build
pnpm dev
```

Open these routes and check that each page loads without a console error:

- `/`
- `/cards`
- `/cards/ex15-100`
- `/sets`
- `/guides`
- `/methodology`
- `/editorial-policy`
- `/privacy`
- `/terms`
- `/robots.txt`
- `/sitemap.xml`
- `/ads.txt`

The Charizard `ex15-100` card should now use the same Cardmarket-based estimate everywhere instead of showing a TCGplayer value in one place and a Cardmarket value in another.

## 2. Environment variables

Add the variables you actually use in `.env.local` and in Vercel. Never commit `.env.local`.

```env
POKEMON_TCG_API_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_BASE_URL=https://www.pokevalue.co.uk
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-3780442870354296
```

## 3. Enable a Google-certified consent message

In AdSense, open **Privacy & messaging**, create a European regulations message for the UK and EEA, and publish it for `pokevalue.co.uk`. The message needs consent, reject/do-not-consent, and manage-options choices.

The custom PokeValue cookie banner has been removed from the root layout so it does not conflict with the certified Google message. Consent Mode defaults advertising storage to denied until the consent system updates it.

## 4. Confirm ads.txt

The package includes:

```text
google.com, pub-3780442870354296, DIRECT, f08c47fec0942fa0
```

After deployment, confirm that `https://www.pokevalue.co.uk/ads.txt` displays only plain text and that AdSense recognises the same publisher ID.

## 5. Submit the correct sitemap

In Google Search Console, submit:

```text
https://www.pokevalue.co.uk/sitemap.xml
```

The sitemap now excludes private browser tools and card pages without enough useful data. The crawler file is now correctly named `app/robots.ts`.

## 6. Ad placement

The AdSense script is loaded only on the strongest public content routes:

- Home
- Card Explorer
- Set Explorer
- Guides and guide articles

It is not loaded on individual card pages, individual set pages, News, Collection, Favourites, Portfolio, Analytics, Market Movers, Scanner, Wishlist, Contact, About, Pricing Methodology, Editorial Policy, Privacy or Terms. This conservative setup reduces approval risk; detail-page ads can be added later after those templates have been reviewed live.

Do not manually add ad units to empty states, menus, buttons, loading screens or pages that only contain a personal tool.

## 7. Content review before resubmission

Before requesting another review:

- Review the four rewritten guides for factual accuracy and add original screenshots or first-hand examples where available.
- Keep article read times matched to the actual article length.
- Check that article dates are specific and accurate.
- Remove or update any article that is no longer current.
- Test every sidebar and footer link on desktop and mobile.

## 8. Resubmit only after the live deployment is checked

After deployment, use an incognito window and inspect the initial HTML and visible page content. Then request review from the AdSense Sites page.

## News section status

The existing short news posts are intentionally removed from navigation, excluded from the sitemap, marked `noindex`, and excluded from AdSense delivery. Rewrite them as sourced, substantial reporting before making them public again.
