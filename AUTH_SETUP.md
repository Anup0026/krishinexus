# Krishi Nexus email/password authentication setup

## Supabase project configuration

1. Open the Supabase project used by `assets/js/kn-auth.js`.
2. In **Authentication → URL Configuration**, set **Site URL** to:
   `https://krishinexus.vercel.app/`
3. Add these exact entries to **Redirect URLs**:
   - `https://krishinexus.vercel.app/**`
   - `http://localhost:5000/**`
   - If you use a different local port, add that exact local origin too.
4. In **Authentication → Providers → Email**, enable email/password sign-in and email confirmation if you want verified-email-only access.
5. In **Authentication → Email Templates → Confirm signup**, make sure the confirmation link uses Supabase's `{{ .ConfirmationURL }}` variable. Do not replace it with a localhost URL.
6. For reliable production delivery, configure custom SMTP under **Project Settings → Authentication → SMTP Settings** (menu wording may vary). Supabase's default email service has sending limits and is not intended for production volume.

## Application redirect behavior

The application sends signup, resend-verification, and password-reset links to the production URL `https://krishinexus.vercel.app/`. This avoids email links pointing to `localhost`, which is only reachable on the computer running the local server.

If you change your production domain, update `PRODUCTION_APP_URL` in `assets/js/kn-auth.js` and add the new URL to Supabase's allowed Redirect URLs.

## Test the full flow

1. Deploy the merged changes to Vercel and wait for the deployment to finish.
2. Open `https://krishinexus.vercel.app/` (not localhost) and create an account using an email address you control.
3. Open the newest confirmation email and click its link. It should return to the deployed Krishi Nexus site.
4. Log in with the same email and password.
5. For an existing unverified account, use **Resend verification email** on the login tab. Check Inbox, Spam/Junk, and Promotions. Wait before retrying because Supabase may rate-limit repeated requests.
6. If no email arrives, inspect Supabase **Authentication → Logs** and SMTP/email provider logs. A browser-side code change cannot override disabled email confirmation, an invalid SMTP setup, provider limits, or Supabase's email rate limits.

## Security and data note

Only the Supabase public publishable/anon key belongs in browser code. Never expose the `service_role` key.

Existing profiles, bookings and ratings remain in localStorage. This auth layer does not migrate those records or provide database-level authorization. Move user-owned records to a database with Row Level Security before production use.
