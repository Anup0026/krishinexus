KRISHI NEXUS — INDIA-WIDE STARTUP DEMO

OPEN:
1. Extract this ZIP.
2. Open the Krishi_Nexus_India_Startup_Demo folder in VS Code.
3. Double-click index.html.

This version is a browser-only product prototype. No Node.js, database, Docker or API key is required.

INCLUDED:
- Farmer self-registration flow
- Labour self-registration flow
- Demo OTP flow (displayed in the browser toast; NOT a real SMS)
- Farmer/labour profiles
- State/district/village/pincode fields
- Crop + task matching
- Labour availability
- Search and filters
- Ratings/trust
- Booking requests
- Work completion
- Notification UI
- Multi-language selector
- Verification status UI
- Two-sided trust concept
- India-wide demo data across multiple states
- 20 farmers + 20 labourers

IMPORTANT FOR PRODUCTION:
This demo simulates OTP, maps, notifications, identity verification and persistence.
A real launch needs secure backend APIs, database, SMS OTP provider, maps/geocoding,
push notifications, authentication, consent/privacy controls, fraud prevention,
admin/dispute tooling, and cloud deployment. Never put production API keys or OTP secrets
inside HTML/JavaScript.

UPDATE IN THIS VERSION:
- Verified & Create Profile now saves the user's profile in browser localStorage.
- My Profile displays the saved farmer/labour details after registration.
- State cards are clickable and show the demo labour available in that state.
- Language preference is persisted in browser localStorage.

LATEST UPDATE:
- Dashboard 'View all' opens a dedicated All Available Labour page with state/crop/work filters.
- Every India-wide coverage state is clickable and opens only currently AVAILABLE labour for that state.
- State cards show registered and available counts.

LATEST v5 UPDATE:
- Fixed View All so it opens the All Available Labour directory with working filters.
- Added all 28 Indian states + 8 Union Territories to the registration/location list.
- Every state/UT is clickable from India-wide Coverage.
- A state with zero workers still has a Register Labour Here action.
- New labour registrations are added immediately to the selected state and persist after refresh using localStorage.
- Custom labour records appear in View All, Find Labour, Labour Network and the selected state page.

V6 UPDATE:
- Custom farmer/labour profiles are loaded from localStorage on page refresh.
- A labour registered in any state is immediately added to LABOURS and reflected in state counts, All India View All, Labour Network, and state-specific availability.
- Labour Network has + Labour registration just like Farmer Network + Farmer.
- State pages keep a Register Labour Here action with the selected state prefilled.
