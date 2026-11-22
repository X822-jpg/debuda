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
