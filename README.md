# AIP Genius — React Native App

A ChatGPT-style mobile client for **AIP Genius**, an AI-powered intellectual property consulting assistant. Built with Expo SDK 54, React Native 0.81, and Keycloak for authentication.

## Features

- **Chat interface** — Conversational UI with message bubbles, typing indicators, and auto-scroll
- **Drawer navigation** — Dark sidebar with chat history grouped by date, search bar, and filters
- **Custom auth flow** — Email → OTP → Magic Link screens (UI-ready for backend integration)
- **Keycloak OIDC** — Full OpenID Connect authentication with PKCE, token persistence, and secure storage
- **AIP branding** — Custom SVG logo with gradient, branded theme system, typewriter greeting animation
- **Offline support** — Chat caching via AsyncStorage, API fallback when server is unreachable
- **Mock backend** — Express server with seeded data for standalone development

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Framework      | Expo SDK 54 / React Native 0.81                 |
| Language       | TypeScript 5.9                                  |
| Navigation     | React Navigation (Drawer + Native Stack)        |
| Auth           | Keycloak 26.5 via expo-auth-session (OIDC/PKCE) |
| Storage        | expo-secure-store (tokens), AsyncStorage (cache) |
| Animations     | react-native-reanimated 4.1                     |
| SVG            | react-native-svg 15                             |
| Testing        | Jest 29 + jest-expo (14 tests)                  |
| Mock Server    | Express 4 (in `server/`)                        |

## Prerequisites

- **Node.js** ≥ 20
- **Expo CLI** — installed globally or via `npx`
- **iOS Simulator** (Xcode) or **Android Emulator** (Android Studio)
- **Keycloak 26.5** — included in `../keycloak-26.5.3/`

## Getting Started

### 1. Install dependencies

```bash
cd react-native-app
npm install
```

### 2. Start Keycloak

```bash
cd ../keycloak-26.5.3
bin/kc.sh start-dev
```

Keycloak runs at `http://localhost:8080`. The app expects:
- **Realm**: `my-app-realm`
- **Client**: `aip-genius-app` (public, PKCE S256)

### 3. Start the mock backend (optional)

```bash
cd server
npm install
npm run dev
```

Runs at `http://localhost:3000` with 5 seeded chats. The app falls back to inline mocks if the server is down.

### 4. Start Expo

```bash
npx expo start --clear
```

Press `i` for iOS Simulator or `a` for Android Emulator.

## Project Structure

```
src/
├── api/            # API client (chatApi, authApi) with server + fallback
├── cache/          # AsyncStorage persistence layer
├── components/     # Reusable UI (AipLogo, ChatBubble, ChatInput, EmptyChat, TypingIndicator)
├── config/         # Keycloak OIDC configuration
├── context/        # React contexts (AuthContext, ChatContext)
├── navigation/     # Drawer navigator, header, sidebar content
├── screens/        # ChatScreen, EmailScreen, OtpScreen, MagicLinkScreen
├── theme/          # Design tokens (colors, typography, spacing)
├── types/          # Shared TypeScript interfaces
└── utils/          # Helpers (generateId, formatDate, truncate, getDateGroupLabel)
```

## Scripts

| Command              | Description                |
| -------------------- | -------------------------- |
| `npm start`          | Start Expo dev server      |
| `npm run ios`        | Start on iOS Simulator     |
| `npm run android`    | Start on Android Emulator  |
| `npm test`           | Run Jest test suite        |

## Auth Flow

The app supports two authentication paths:

1. **Custom flow** (default): Email → OTP → Magic Link — UI screens are built, backend endpoints documented in `src/api/authApi.ts`
2. **Keycloak OIDC**: Direct SSO via browser redirect — available in `src/context/AuthContext.tsx`

## Environment

Keycloak connection is configured in `src/config/keycloak.ts`:

```typescript
KEYCLOAK_URL = "http://192.168.100.101:8080"
REALM        = "my-app-realm"
CLIENT_ID    = "aip-genius-app"
```

Update the IP address to match your local network if testing on a physical device.

## License

Private — AIP Genius
