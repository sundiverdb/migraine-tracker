# Migraine Tracker

A local-first mobile app for iOS and Android to log and analyze migraine episodes — built with React Native (Expo) and TypeScript.

Cross-links with a daily diet log, sleep diary, and focus tracker to surface personal trigger patterns over time.

## Stack

- **React Native + Expo SDK 51** — managed workflow, Expo Router
- **expo-sqlite** — on-device SQLite, local-first
- **Zustand** — global state
- **React Native Paper** — Material 3 UI
- **Zod** — schema validation
- **date-fns** — date utilities
- **Victory Native** — charts (Phase 3)

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Then scan the QR code with Expo Go on your phone, or press `i` / `a` for iOS/Android simulator.

## Project Structure

```
app/                  # Expo Router screens
  (tabs)/             # Bottom tab navigation
    index.tsx         # Today dashboard
    migraines.tsx     # Migraine history
    diet.tsx          # Diet log (Phase 2)
    sleep.tsx         # Sleep diary (Phase 2)
    focus.tsx         # Focus tracker (Phase 2)
  migraine/
    new.tsx           # Log a new migraine
    [id].tsx          # Detail / edit (coming soon)
src/
  db/
    database.ts       # SQLite init + migration runner
    schema.ts         # SQL migrations (numbered)
    types.ts          # TypeScript domain types & enums
  repositories/
    migraineRepository.ts   # All migraine DB operations
  stores/
    migraineStore.ts        # Zustand store
  components/         # Shared UI (coming soon)
  utils/              # Date helpers, validators
```

## Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Migraine core — log, list, detail | 🚧 In progress |
| 2 | Diet log, Sleep diary, Focus tracker | Planned |
| 3 | Cross-linking, Insights, Pattern detection | Planned |
| 4 | Cloud backup, Health integrations, Web dashboard | Planned |

## License

MIT
