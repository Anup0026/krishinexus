# Krishi Nexus email/password authentication setup

1. Create a Supabase project.
2. Replace placeholders in assets/js/kn-auth.js with the Supabase Project URL and PUBLIC anon/publishable key. Never use service_role in browser code.
3. Enable Email and email confirmations in Supabase Authentication.
4. Set Site URL to https://krishinexus.vercel.app and add it to allowed Redirect URLs. Add local dev URL for testing.
5. Ensure the confirmation email template uses {{ .ConfirmationURL }}. Configure custom SMTP for reliable production delivery.
6. Test signup, verification, login, password reset and logout after deployment.

Security note: existing profiles, bookings and ratings remain in localStorage. This auth layer does not migrate those records or provide database-level authorization. Move user-owned records to a database with Row Level Security before production use.
