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

## Screenshots

<img width="100" height="200" alt="IMG_5220" src="https://github.com/user-attachments/assets/9253db04-e828-468d-8c18-eff7fa57453f" />
<img width="100" height="200" alt="IMG_5228" src="https://github.com/user-attachments/assets/18f0185c-69f5-460b-b8f6-86bd2f959333" />
<img width="100" height="200" alt="IMG_5227" src="https://github.com/user-attachments/assets/cd10a604-e115-4bdc-91fc-211469d1e7e9" />
<img width="100" height="200" alt="IMG_5226" src="https://github.com/user-attachments/assets/202fac00-e2cd-4435-94f5-4cdb852f746f" />
<img width="100" height="200" alt="IMG_5225" src="https://github.com/user-attachments/assets/b22c2f57-f080-40a6-a34b-53d13add2851" />
<img width="100" height="200" alt="IMG_5222" src="https://github.com/user-attachments/assets/af03905c-9b87-466c-9658-9e115189f9a5" />
<img width="100" height="200" alt="IMG_5221" src="https://github.com/user-attachments/assets/83e9ef34-c1d2-48b6-b797-256cbbccedd2" />



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
