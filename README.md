# PokeValue Premium AdSense Rebuild

This is the complete replacement project for **pokevalue.co.uk**. It keeps the animated glass-card design while applying one shared layout system across public archive pages, collector tools, guides, policy pages and error states.

## Local setup

1. Copy your existing `.env.local` into this folder, or create it from `.env.example`.
2. Run `pnpm install`.
3. Run `pnpm build`.
4. Run `pnpm dev` and test the site at `http://localhost:3000`.

Never commit `.env.local`, `.next` or `node_modules`.

## AdSense setup outside the code

The code loads AdSense only on substantial public content routes: the homepage, card archive and details, set archive and details, and collector guides. Private browser tools are `noindex` and do not load the AdSense script.

In AdSense, publish a Google-certified European regulations message for UK/EEA traffic before serving personalised ads. Confirm the live `ads.txt`, `robots.txt` and `sitemap.xml` after deployment.

No codebase can guarantee approval; Google makes the final review decision.
