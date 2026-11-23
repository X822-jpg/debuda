DEBUDA ALPHA 2.0 — static site for Vercel
NOTE: do not add a "public" folder; Vercel would serve only that folder.
Deploy: upload this folder to GitHub -> Vercel "Add New Project" -> Framework: Other -> Deploy.
Security: vercel.json adds CSP, HSTS, anti-clickjacking and other headers; the code has no inline scripts and no innerHTML.
Accounts are a client-side DEMO: passwords are PBKDF2-hashed in the browser's localStorage, per device only.
For real accounts/payments use a backend (Supabase/Auth0 + Stripe Checkout). Never put secret keys in this folder.

ALPHA LOCK: buying is disabled. In script.js, SALES_OPEN=false. Only set it to true after a real server-side checkout (e.g. Stripe) exists.

DISCORD / GITHUB LOGIN (via Supabase):
1. Supabase > Authentication > Providers: turn on Discord and GitHub, copy the Callback URL it shows.
2. Discord: discord.com/developers/applications > New Application > OAuth2: add the Callback URL as Redirect, copy Client ID + Client Secret into Supabase.
3. GitHub: github.com/settings/developers > New OAuth App: Homepage = your Vercel link, Callback = the Supabase Callback URL, then copy Client ID + a new Client Secret into Supabase.
4. Supabase > Authentication > URL Configuration: put your Vercel link in Site URL and Redirect URLs.
5. Paste SUPABASE_URL and SUPABASE_ANON_KEY into config.js. Never put Client Secrets in the site files.

PROFILE/SHOP: profile.js holds all 15 titles, 12 frames, 10 fonts ($4.99-$30). Profiles are saved in each browser only. Buying stays locked by SALES_OPEN=false in script.js.
GITHUB LOGIN: enable GitHub in Supabase > Authentication > Providers (Client ID + Secret from github.com/settings/developers).

SHOP v2: 250 items (50 titles, 50 frames, 50 fonts, 50 backgrounds, 50 animated icons). Rarities: Common, Rare, Epic, Legendary, Mythic, Exotic, Eternal, Secret, OG. Prices $4.99 to $80.00. Fonts come from Google Fonts (5 stylesheet links in index.html).

CASES: 12 cases (10 made from shop items + 2 Xmas cases with exclusive items). Odds are shown in each case. Opening is a free demo while SALES_OPEN=false.

ADMIN PANEL + LIVE EVENTS (needs one SQL step):
1. Log in to the site once with each owner GitHub account (X822-jpg, tugalevltv-debug).
2. Supabase > SQL Editor > New query > paste supabase-setup.sql > Run.
3. Log in as an owner: an OPEN button appears next to your name. Say / unlock animation / Christmas event / ban live there.
Test mode is locked ON: animations only, nothing is unlocked. Bans only block Discord/GitHub logins (the site has no server).
