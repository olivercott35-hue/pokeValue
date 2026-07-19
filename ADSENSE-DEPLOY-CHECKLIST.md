# PokeValue deployment checklist

## Import

1. Back up the current project folder.
2. Extract this ZIP into a new folder.
3. Copy the old project’s hidden `.git` folder into the new folder.
4. Copy the old `.env.local` into the new folder. If none exists, copy `.env.example` to `.env.local` and add private keys only there.
5. Open the new folder in Visual Studio Code.

## Build

Run these commands from the folder containing `package.json`:

```powershell
pnpm install
pnpm build
```

Do not deploy if the build fails. Then test locally:

```powershell
pnpm dev
```

Test `/`, `/cards`, a card detail, `/sets`, a set detail, `/guides`, every guide, `/methodology`, `/editorial-policy`, `/about`, `/contact`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml` and `/ads.txt`.

## Git and Vercel

```powershell
git status
git add -A
git diff --cached --name-only
git commit -m "Deploy premium AdSense-ready rebuild"
git push origin main
```

Confirm `.env.local`, `.next` and `node_modules` are not staged. Wait for the Vercel deployment to show **Ready**.

## AdSense and Search Console

- In AdSense, publish a certified European regulations message for UK/EEA users.
- Confirm AdSense detects the site and `ads.txt`.
- Submit `https://www.pokevalue.co.uk/sitemap.xml` in Search Console.
- Request indexing for the homepage, cards, sets, guides, methodology and editorial-policy pages.
- Request review only after the new live pages have been crawled.
