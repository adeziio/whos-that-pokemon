# Who's That Pokémon? (React Native + Expo)

A **React Native** mobile game built with **Expo**. Inspired by the classic "Who's That Pokémon?" segment, this app challenges players to guess the Pokémon based on its silhouette before time runs out.

**⚠️ Disclaimer:**  
This project is built **for proof-of-concept and personal use only**.  
It uses **Pokémon names, artwork, and music**, which are **intellectual property of Nintendo, Game Freak, and The Pokémon Company**.  
**This app is not for distribution, sale, or public release.**

---

## Features
- **Guess the Pokémon:** Silhouette guessing game with multiple-choice answers.
- **Difficulty Modes:** Easy, Medium, Hard, Master — each with separate high scores.
- **Countdown Timer:** 30-second countdown with urgency effects; resets after correct guesses.
- **Dynamic Music:** Different background tracks for each difficulty and for game over.
- **Persistent Progress:** High scores stored per difficulty using AsyncStorage.
- **Settings Menu:** In-game speed toggle and mute button.
- **Animated UI:** Level-up animations, HUD updates, and shiny animated Pokéballs on the start screen.

---

## Demo

### Images
<img width="180" alt="start" src="https://github.com/user-attachments/assets/16660f16-c29a-445f-8455-d0bd7509bb36" />
<img width="180" alt="gameplay1" src="https://github.com/user-attachments/assets/f8869b28-1778-4cb0-bc56-0849badb58df" />
<img width="180" alt="gameplay2" src="https://github.com/user-attachments/assets/9e1d42b0-12b2-4a08-bc5f-778485ab6197" />
<img width="180" alt="gameplay3" src="https://github.com/user-attachments/assets/7f8c409e-8398-4996-a2a7-7027ca67c660" />
<img width="180" alt="gameplay4" src="https://github.com/user-attachments/assets/f97fd609-6d02-4e73-ab64-7717843aba47" />
<img width="180" alt="gameplay5" src="https://github.com/user-attachments/assets/66e43037-7280-4d50-9818-c844b846a35e" />
<img width="180" alt="gameplay6" src="https://github.com/user-attachments/assets/01f29517-490d-4851-ba00-e2f6d514bd78" />
<img width="180" alt="gameplay7" src="https://github.com/user-attachments/assets/7b71374b-b986-4ee1-ae45-321290298ef3" />
<img width="180" alt="gameplay8" src="https://github.com/user-attachments/assets/e6402845-fa0d-4d2e-8608-816241913b45" />
<img width="180" alt="end" src="https://github.com/user-attachments/assets/d463f215-de23-4028-8735-6d7ffb4c84a3" />


### Video

https://github.com/user-attachments/assets/c4cb158e-ebc9-43d5-a082-2b8c18e6e1f1

https://github.com/user-attachments/assets/f6184476-1ba8-4957-9c50-c1bb971eab96

https://github.com/user-attachments/assets/9391e0e4-f99a-445c-8f9e-3ccb1b129c72

## Getting Started

### 1. Install Dependencies
Make sure you have **Node.js** and **npm** or **yarn** installed. Then install Expo CLI (if not already):

```bash
npm install -g expo-cli
```

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/whos-that-pokemon.git
cd whos-that-pokemon
npm install
```

### 2. Run the Project in Development
Start the project using Expo:

```bash
npx expo start
```

Scan the QR code in your terminal using the **Expo Go** app (iOS or Android).

---

## Building a Private Standalone App
For personal use (without publishing to the App Store/Google Play):

```bash
npx eas build -p ios --profile preview
npx eas build -p android --profile preview
```

> **Note:** You’ll need a free [Expo account](https://expo.dev/signup).  
> For iOS builds, an Apple Developer account is required for installation on physical devices.

---

## Project Structure
```
/assets         # Music, sounds, fonts
/App.tsx        # Main React Native application
/README.md      # Project info
```

---

## Legal Disclaimer
This project:
- Uses Pokémon names, artwork, and music for **educational and personal purposes only**.
- Is **not affiliated with, endorsed by, or connected to Nintendo, Game Freak, or The Pokémon Company**.
- Is **not for commercial use or distribution**.

If you intend to share or distribute this app publicly, you **must remove all Pokémon-related assets** and replace them with original content.

---

## License
This project is unlicensed and intended only for personal proof-of-concept use.
