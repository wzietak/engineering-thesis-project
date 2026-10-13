# LittleFlip

A mobile language-learning app powered by the Free Spaced Repetition Scheduler (FSRS) algorithm, featuring an offline-first architecture and generative content creation via the Google Gemini API.

Developed as an engineering thesis project in Computer Science.

---

## Overview

LittleFlip is an Android app built to take the friction out of learning vocabulary:

- **Smarter reviews with FSRS:** Instead of rigid schedules, the app uses the FSRS algorithm to adapt review intervals based on how well you actually remember each word
- **Active practice:** Includes classic flashcards as well as type-in and cloze cards
- **AI sentence generation:** An integrated Google Gemini feature creates natural example sentences on the fly, saving you from searching for usage examples on Google
- **Offline-first architecture:** Data is stored locally in SQLite for zero delay and full offline access, then synced seamlessly with Supabase in the background when connected

## Tech Stack

- **Framework:** React Native with Expo (Android)
- **Language:** TypeScript
- **Local Storage:** SQLite (`expo-sqlite`)
- **Backend & Auth:** Supabase (PostgreSQL)
- **AI Integration:** Google Gemini API
- **Spaced Repetition:** FSRS algorithm

## Getting Started

### Prerequisites
- Node.js >= 20.x (or LTS)
- Android Studio with an Android SDK and emulator (or a physical Android device with USB debugging enabled)
- A free [Supabase](https://supabase.com/) account
- A [Google Gemini API](https://ai.google.dev/) key

To run the app on your computer or Android device:

1. **Clone the repository:**

```bash
git clone https://github.com/wzietak/engineering-thesis-project.git
cd engineering-thesis-project
```

2. **Install project dependencies:**

```bash
npm install
```

3. **Set up Supabase (Database & RLS):**
- Create a new project in the Supabase dashboard
- Go to the **SQL Editor**
- Run the schema script (`schema.sql` located in this repository) to create the required tables (`decks`, `cards`, `fsrs_states`, `reviews`) and enable Row Level Security (RLS) policies

4. **Set up environment variables:**
   Create `.env` file in the root directory and add your credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_KEY=your-supabase-key
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

5. **Build and run the application:**
Development Build instead of standard Expo Go is recommended.
* **First time (build and install on your device/emulator):**
Connect your Android device via USB (with USB debugging enabled) or launch an emulator, then run:
```bash
npx expo run:android
```

6. **Start the development server:**

```bash
npx expo start
```

- Press `a` in the terminal to launch the app on a running Android emulator
- Or scan the displayed QR code with your camera to open the development build on your phone

## Project structure
``` text
src/ 
┝━━ algorithm/          # FSRS implementation (algorithm, types, tests)
┝━━ app/                # Views and navigation layer
│   ┝━━ (drawer)/       # Drawer navigation screens
│   ┝━━ study-screen/   # Study session screen
│   ┕━━ _layout.tsx     # Navigation skeleton
┝━━ assets/             # Icons and graphics
┝━━ components/         # UI components
┝━━ contexts/           # Global state management
┝━━ db/                 # SQLite initialization and table schema
┝━━ hooks/              # Reusable React hooks
┝━━ models/             # Entity interfaces and types
┝━━ repositories/       # Interfaces for card, deck and FSRS states operations, SQLite functions
┝━━ services/           # External communication, import and export
┝━━ styles/             # App styles definition
┕━━ utils/              # Helper utilities and Supabase configuration
```

## Author
Developed by **Wiktoria Ziętak** as an engineering thesis project in Computer Science.
