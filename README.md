# Who's That Pokémon? (React Native + Expo)

A **React Native** mobile game built with **Expo**. Inspired by the classic "Who's That Pokémon?" segment, this app challenges players to guess the Pokémon based on its silhouette before time runs out.

**⚠️ Disclaimer:**  
This project is built **for proof-of-concept and personal use only**.  
It uses **Pokémon names, artwork, and music**, which are **intellectual property of Nintendo, Game Freak, and The Pokémon Company**.  
**This app is not for distribution, sale, or public release.**

---

## Features
- **Guess the Pokémon:** Silhouette guessing game with multiple-choice answers.
- **Region Modes:** Kanto, Johto, Hoenn — each with separate Pokémons.
- **Countdown Timer:** 30-second countdown with urgency effects; resets after correct guesses.
- **Dynamic Music:** Different background tracks depending on the page.
- **Persistent Progress:** Successfully identified Pokémons are stored in the Collection page per region using AsyncStorage, similar to a Pokédex. 
- **Settings Menu:** In-game speed toggle and mute button.
- **Animated UI:** Level-up animations, HUD updates, and shiny animated Pokéballs on the start screen.

---

## Demo

### Images

![Gameplay](https://github.com/user-attachments/assets/62401907-483e-40ac-8b96-8795bf89ec4c)
![Collection](https://github.com/user-attachments/assets/131630d0-52d6-4a1e-98b0-77bce7a8be1c)

<img width="350" alt="Start" src="https://github.com/user-attachments/assets/8fa50473-d2ad-40e1-9530-fe6b878bc71b" />
<img width="350" alt="Region" src="https://github.com/user-attachments/assets/a027dcf3-9ba4-4d29-a5d0-93596010d382" />
<img width="350" alt="Guess" src="https://github.com/user-attachments/assets/fe59e41f-ce45-4a97-8c2b-07011c62342a" />
<img width="350" alt="New" src="https://github.com/user-attachments/assets/d39f840f-d239-4ecf-98a3-d4abde8d430e" />
<img width="350" alt="NotNew" src="https://github.com/user-attachments/assets/3ed6c421-ab81-405a-8b40-99534bb92c43" />
<img width="350" alt="Incorrect" src="https://github.com/user-attachments/assets/42af1366-51c2-47c9-ad7b-bbd7616405fe" />
<img width="350" alt="Gameover" src="https://github.com/user-attachments/assets/802880f9-7e67-4792-ae63-6efffe761a05" />
<img width="350" alt="Kanto" src="https://github.com/user-attachments/assets/be5f05ab-c5ad-4d7d-84f0-2c8aae7f78c6" />
<img width="350" alt="Johto" src="https://github.com/user-attachments/assets/04b2b9bc-8af2-4ca7-9f36-1c2509b0ae48" />
<img width="350" alt="Hoenn" src="https://github.com/user-attachments/assets/6f0dcf8d-4a6a-47da-80da-abbb5c4c18ad" />

### Video

https://github.com/user-attachments/assets/96f5e571-e1b7-42f1-ba7d-efd9b43efd09

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
