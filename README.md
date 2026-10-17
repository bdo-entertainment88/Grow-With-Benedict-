# Grow with Benedict – Mobile App

A cross-platform mobile app for the **Grow with Benedict** digital guides catalogue.

## Features

- **Product Catalogue** – Browse all practical guides with images
- **Wishlist** – Save products for later (persisted locally)
- **User Accounts** – Sign up / Sign in (local demo auth)
- **Progress Tracking** – Mark guides as In Progress or Completed
- **Support Contact** – Email & phone built-in
- **Dark theme** matching the original website brand

## Tech Stack

- Expo (React Native) + TypeScript
- Zustand + AsyncStorage (state & persistence)
- Ready for Supabase upgrade (auth + cloud sync)

## Getting Started

```bash
cd GrowWithBenedict
npm install
npx expo start
```

Then press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go on your phone.

## Support

- Email: anichidominic206@gmail.com
- Phone: 08125169910

## Next Steps (Production)

1. Create a free Supabase project and replace the mock auth in `AuthScreen` + store
2. Generate custom product cover images and replace the Unsplash placeholders
3. Add Expo Router for better deep linking
4. Configure app icons & splash screen in `app.json`
5. Build with EAS: `npx eas build`

---

**Learn · Build · Grow**
