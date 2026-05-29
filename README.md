# Silo (zen-mail)

![Expo](https://img.shields.io/badge/Expo-1C2024?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

Welcome to the official repository for **Silo (zen-mail)**, a cutting-edge, ultra-secure, and clean workspace application designed from the ground up for modern professionals. 

Silo is engineered to flawlessly manage work emails, Google Drive files, and Google Photos without ever causing personal account crossover. It ensures absolute, impenetrable data boundary separation between your work profiles and personal life, allowing you to focus on productivity while maintaining total peace of mind regarding data security. This system was designed for BYOD (Bring Your Own Device) environments where an MDM (Mobile Device Management) profile might be too intrusive.

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Core Philosophy](#core-philosophy)
3. [Key Features](#key-features)
4. [Comprehensive Architecture](#comprehensive-architecture)
5. [Tech Stack Details](#tech-stack-details)
6. [Detailed Directory Structure](#detailed-directory-structure)
7. [Core Modules Deep Dive](#core-modules-deep-dive)
8. [Setup and Installation Guide](#setup-and-installation-guide)
9. [Environment Configuration](#environment-configuration)
10. [State Management Approach](#state-management-approach)
11. [API Layer & Hooks](#api-layer--hooks)
12. [Styling & Theming](#styling--theming)
13. [Routing and Navigation](#routing-and-navigation)
14. [Security & Data Isolation Protocols](#security--data-isolation-protocols)
15. [Deployment & CI/CD](#deployment--cicd)
16. [Component Reference](#component-reference)
17. [Contributing Guidelines](#contributing-guidelines)
18. [Troubleshooting & FAQ](#troubleshooting--faq)
19. [License](#license)
20. [Contact & Support](#contact--support)

---

## 🔍 Project Overview

In the era of remote work and Bring Your Own Device (BYOD) cultures, the lines between personal and professional digital environments have blurred. **Silo** acts as a digital fortress on your device. It provides an isolated, sandboxed environment specifically tailored for professional tasks. 

By integrating directly with Google Workspace APIs (Gmail, Drive, Photos), Silo creates a localized ecosystem that prevents any token leakage, accidental file sharing to personal accounts, or cross-contamination of notifications. You no longer need to worry about accidentally sending a business document to a family member or seeing work emails pop up on your weekend lock screen.

---

## 🧠 Core Philosophy

The fundamental design principle of Silo is **"Absolute Separation."**

- **Zero Crossover**: Work emails stay in Silo. Personal emails stay in your native OS mail app. There is no background sync that merges contacts or calendars to the OS level.
- **Token Isolation**: OAuth tokens are securely stored using Expo SecureStore and are never exposed to the broader OS. They are encrypted at rest.
- **Minimalist Zen Interface**: The UI is designed to reduce cognitive load. We utilize ample whitespace, clear typography, and a cohesive color palette that respects both Light and Dark OS modes.
- **Ephemeral State by Default**: When the app is locked or closed, sensitive data in memory is purged. Persistent cache is heavily encrypted.

---

## ✨ Key Features

- **Isolated Mail Integration**: 
  - A secure workspace email client built natively on top of the Gmail REST API. 
  - Parse complex MIME threads.
  - Reply with rich formatting.
  - Manage your inbox (Archive, Delete, Mark as Read/Unread) without syncing to the OS-level mail daemon.
- **Drive File Explorer**: 
  - Isolated access to Google Drive work repositories. 
  - View, download, and manage professional documents securely.
  - Built-in previewer for common file types (PDF, Docs, Sheets) without opening external OS apps.
- **Photos Gallery**: 
  - Clean, secure interface for managing business and product visual assets.
  - Exists entirely independently from your personal camera roll.
- **Native Performance**: 
  - Built with React Native and Expo, offering buttery smooth 60fps animations.
  - Complex lists use `FlashList` (or optimized FlatLists) for flawless scrolling.
- **Cross-Platform Delivery**: 
  - Write once, run everywhere. First-class support for iOS, Android, and Web platforms.
- **Offline Capabilities**: 
  - Aggressive caching strategies via React Query to ensure you can read downloaded emails and view file metadata even in low-connectivity areas like subways or airplanes.

---

## 🏗 Comprehensive Architecture

Silo follows a modular, feature-first architectural pattern, heavily leveraging modern React paradigms (Hooks, Context, Suspense).

### The Expo Ecosystem
We utilize **Expo v56** for a robust managed workflow. 
This provides out-of-the-box support for:
- Over-the-air (OTA) updates via Expo Updates.
- Push notifications via Expo Notifications.
- A highly streamlined, cloud-based build process via EAS (Expo Application Services).
- Native module bridging without needing to touch Swift/Kotlin directly in most cases.

### Routing Architecture
We have adopted **Expo Router**, bringing Next.js style file-based routing to React Native. 
- This allows us to structure our navigation hierarchy identically to our file system.
- Makes the codebase highly intuitive.
- Supports deep linking natively without complex configuration blocks.

### Component Architecture
Components are split into two categories to maintain separation of concerns:
1. **Dumb/Presentational Components**: 
   - Highly reusable, purely functional UI elements.
   - Styled exclusively with Nativewind.
   - Example: `DriveItemRow.tsx`, `InboxItem.tsx`, `Button.tsx`.
   - They receive data exclusively via props and emit events via callbacks.
2. **Smart/Container Components**: 
   - Tied directly to routes or major screens.
   - These components connect to React Query to fetch data.
   - Handle complex business logic and state transformations.
   - Orchestrate the presentational components.

### Data Flow Diagram
1. User action triggers a UI event (e.g., clicking "Archive").
2. The Smart Component calls a React Query `useMutation` hook.
3. React Query interfaces with our API utility classes (e.g., `gmailParser.ts` or `driveApi.ts`).
4. The utility authenticates the request using tokens retrieved from `SecureStore`.
5. The request hits the Google REST APIs.
6. A response is returned. React Query updates its internal cache (either optimistically or post-confirmation).
7. The UI re-renders reactively based on the new cached state.

---

## 🛠 Tech Stack Details

Our tech stack is carefully curated for developer experience, runtime performance, and absolute security.

### Core Frameworks
- **React (v19.2)**: The underlying rendering library utilizing Concurrent features.
- **React Native (v0.85)**: The mobile framework bridging React to iOS and Android views.
- **Expo (v56)**: The application toolkit, CLI, and native module ecosystem.
- **Expo Router (v56.x)**: File-based routing for React Native, handling deep links and stack management.

### Data Fetching & Global State
- **@tanstack/react-query (v5.x)**: Used for server state management, caching, background synchronization, and complex error handling/retries.

### Styling & UI
- **TailwindCSS (v4.x) & Nativewind (v4.x)**: Utility-first styling adapted for React Native. Allows for rapid UI development with consistent design tokens across all platforms.
- **React Native Reanimated (v4.x)**: For complex, highly performant, thread-safe animations that run on the native UI thread, avoiding JS thread bottlenecks.
- **React Native Gesture Handler**: Works in tandem with Reanimated for fluid, native-feeling gestures (swipes, long-presses).
- **@gorhom/bottom-sheet**: The industry standard for highly performant bottom sheet interactions, used in our email composer and settings menus.

### Security & Native APIs
- **expo-secure-store**: Crucial for encrypting and storing OAuth tokens and sensitive configuration data locally on the device's secure enclave.
- **expo-crypto**: For cryptographic operations required during secure API handshakes.
- **expo-auth-session**: Handles the complex OAuth2 PKCE flow natively and securely.
- **expo-file-system**: Manages the sandboxed local storage of downloaded Drive files and email attachments.

---

## 📂 Detailed Directory Structure

Understanding the repository layout is crucial for effective contribution. We strictly adhere to this structure.

```text
Silo/
├── app/                     # Expo Router file-based routing directory
│   ├── (inbox)/             # Grouped routes for the Inbox domain (Stacks)
│   │   ├── _layout.tsx      # Inbox stack navigator layout
│   │   ├── index.tsx        # Main Inbox list screen
│   │   └── [id].tsx         # Dynamic route for a single email thread
│   ├── (drive)/             # Grouped routes for Google Drive
│   │   ├── _layout.tsx      # Drive stack navigator
│   │   └── index.tsx        # Drive root folder screen
│   ├── _layout.tsx          # Root layout defining Context Providers (Auth, QueryClient)
│   └── index.tsx            # Splash / Auth entry screen
├── src/                     # Core application source code
│   ├── components/          # Reusable UI components
│   │   ├── ComposerSheet.tsx# Bottom sheet for drafting emails
│   │   ├── DriveFileList.tsx# List container for Drive files
│   │   ├── DriveItemRow.tsx # Individual Drive file list item
│   │   └── InboxItem.tsx    # Individual email thread preview
│   ├── context/             # React Context providers
│   │   ├── AuthProvider.tsx # Manages login state and token lifecycle
│   │   └── ThemeContext.tsx # Manages Light/Dark mode toggling
│   ├── hooks/               # Custom React Query and utility hooks
│   │   ├── useGmail.ts      # Hooks wrapping Gmail REST API calls
│   │   └── useDrive.ts      # Hooks wrapping Google Drive API calls
│   ├── store/               # Zustand or Context for local UI state (if needed)
│   ├── types/               # Global TypeScript interfaces and type definitions
│   │   ├── gmail.d.ts       # Types for complex Gmail JSON responses
│   │   └── drive.d.ts       # Types for Drive metadata
│   └── utils/               # Helper functions and API wrappers
│       ├── gmailParser.ts   # Complex logic for parsing Gmail API MIME responses
│       ├── formatters.ts    # Date and currency formatters
│       └── secureStore.ts   # Wrapper around expo-secure-store
├── assets/                  # Static assets
│   ├── icon.png             # Application icon
│   ├── splash.png           # Splash screen image
│   └── fonts/               # Custom font files (.ttf, .otf)
├── app.json                 # Core Expo configuration file (plugins, bundle IDs)
├── babel.config.js          # Babel transpiler configuration (Nativewind plugins)
├── package.json             # NPM dependencies, metadata, and run scripts
├── tailwind.config.js       # Tailwind CSS configuration and Silo design tokens
└── tsconfig.json            # Strict TypeScript compiler configuration
```

---

## 🧩 Core Modules Deep Dive

### 1. Authentication Engine (`expo-auth-session`)
Silo relies on a robust OAuth2 implementation to communicate with Google Workspace.
- **Scopes**: We request granular, restricted scopes specifically for reading mail (`https://www.googleapis.com/auth/gmail.readonly`, `gmail.modify`), and accessing Drive. We explicitly avoid full account access.
- **Token Lifecycle**: Upon successful authentication, access and refresh tokens are immediately encrypted via `expo-secure-store`.
- **Interceptors**: All outbound network requests pass through an Axios/Fetch interceptor. This interceptor automatically attaches the Bearer token. If a `401 Unauthorized` is returned, the interceptor pauses the queue, uses the refresh token to get a new access token, updates the SecureStore, and replays the queued requests completely seamlessly to the user.

### 2. Inbox & Mail Module (`gmailParser.ts`)
The Gmail REST API returns messages in a highly nested MIME multi-part format.
- **Parsing Strategy**: Our `gmailParser.ts` utility recursively walks the MIME tree. It intelligently extracts the `text/plain` and `text/html` bodies, prioritizing HTML for rendering in our custom WebView container.
- **Attachments**: The parser identifies attachment parts, extracts their metadata (filename, mimeType), and allows the user to lazily download the Base64 data only when tapped.
- **Composer**: The `ComposerSheet.tsx` provides a seamless, native interface for drafting replies. It supports attaching files from the Silo Drive module. Before sending, the composer constructs a raw RFC 2822 formatted message encoded in Base64 URL-safe format, as required by the Gmail API.

### 3. Drive File Explorer
This module acts as a sandboxed window into Google Drive.
- **Fetching**: It queries the Google Drive v3 API, utilizing the `fields` parameter to only download necessary metadata (name, mimeType, iconLink, modifiedTime) to save bandwidth.
- **Rendering**: Files are rendered via `DriveFileList.tsx` and `DriveItemRow.tsx`.
- **Pagination**: We implement cursor-based infinite scrolling (via React Query's `useInfiniteQuery`) to lazily load large directories without freezing the UI thread.
- **Sandboxing**: Downloaded files are saved strictly into the app's internal cache directory (`expo-file-system.cacheDirectory`). They are purposefully *not* saved to the device's public `Downloads` folder to prevent cross-contamination.

---

## 🚀 Setup and Installation Guide

### Prerequisites Checklist
Before you begin, ensure you have the following installed and configured on your machine:
- **Node.js**: v18.x or v20.x (LTS recommended).
- **Package Manager**: `npm` (v9+) or `Yarn` (v1.22+).
- **Version Control**: Git.
- **Expo CLI**: Installed globally (`npm install -g expo-cli` is legacy, now we use `npx expo`).
- **Mobile Emulators**: 
  - Android Studio installed and an AVD (Android Virtual Device) configured.
  - Xcode installed (Mac only) and an iOS simulator configured.

### Environment Configuration
Silo requires specific environment variables to communicate with Google APIs.
Create a `.env` file in the root directory. **Never commit this file to version control.**

```env
# Client ID generated from Google Cloud Console -> APIs & Services -> Credentials
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# The redirect URI must match exactly what is configured in Google Cloud
# For Expo Go, this is usually exp://localhost:8081 or similar.
# For standalone builds, it will be your app's custom scheme (e.g., silo://)
EXPO_PUBLIC_GOOGLE_REDIRECT_URI=exp://localhost:8081

# Optional: Set logging level (debug, info, warn, error)
EXPO_PUBLIC_LOG_LEVEL=debug
```

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/silo.git
   cd silo
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Pre-build (If using custom native modules):**
   ```bash
   npx expo prebuild --clean
   ```

4. **Start the Expo Development Server:**
   ```bash
   npm start
   # or
   npx expo start -c # To clear the Metro bundler cache
   ```

5. **Run the Application:**
   - Press `a` in the terminal to launch on the Android emulator.
   - Press `i` to launch on the iOS simulator.
   - Alternatively, scan the QR code displayed in the terminal using the Expo Go app on your physical iOS or Android device.

---

## 🔄 State Management Approach

We strictly separate **Server State** from **Client/UI State**.

### Server State (React Query)
We rely entirely on **@tanstack/react-query** for managing asynchronous data from Google APIs.
- **Why?** Mobile apps are inherently dealing with stale data due to flaky, intermittent cellular connections.
- **Caching**: Email threads and Drive folder structures are aggressively cached. If a user opens the app in a subway without a connection, they can still navigate and read previously fetched emails.
- **Optimistic Updates**: When a user swipes to archive an email, we use React Query's `onMutate` callback to instantly remove the email from the UI cache. The network request happens silently in the background. If the request fails, the `onError` callback automatically rolls back the UI to the previous state, ensuring UI consistency without blocking the user.

### UI State (React Context / Zustand)
For purely local, ephemeral state (e.g., "Is the theme dark mode?", "Is the bottom sheet currently open?"):
- We use lightweight React Context for global UI state.
- We use standard `useState` hooks for localized component state.
- No Redux boilerplate is allowed unless the state complexity grows exponentially.

---

## 🔌 API Layer & Hooks

All API interactions are abstracted behind custom React hooks to maintain clean components.

### Example: `useGmail.ts`
```typescript
export const useInbox = () => {
  return useQuery({
    queryKey: ['inbox', 'list'],
    queryFn: async () => {
      const response = await gmailApi.get('/messages?labelIds=INBOX');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```
This abstraction means `InboxScreen.tsx` only cares about `{ data, isLoading, error }` and has zero knowledge of Axios, REST endpoints, or tokens.

---

## 🎨 Styling & Theming

Silo uses **Nativewind** (v4), bringing the immense power, speed, and familiarity of Tailwind CSS directly to React Native.

### The Nativewind Advantage
- **Consistency**: All design tokens (colors, spacing, typography, border radii) are centrally managed in `tailwind.config.js`. You cannot use arbitrary hex codes in components.
- **Performance**: Nativewind compiles Tailwind classes into standard React Native `StyleSheet` objects at build time. There is virtually zero runtime string parsing overhead.
- **Dark Mode**: Seamless dark mode support based on user device preferences using the `dark:` variant class.

### Design Language & Accessibility
- **Colors**: Calming, desaturated blues, neutral cool grays, and crisp whites to reduce eye strain during long work sessions.
- **Typography**: System fonts are leveraged (`System` on iOS, `Roboto` on Android) to ensure a native feel, falling back to specific sans-serif fonts for branding where necessary.
- **Accessibility**: All interactive elements must include `accessibilityLabel` and `accessibilityRole`. Contrast ratios strictly adhere to WCAG AA standards.

---

## 🛣 Routing and Navigation

Using **Expo Router**, navigation is deeply intuitive and URL-driven.
- `/app/index.tsx` serves as the initial splash and authentication gate.
- `/app/(inbox)/` represents a tab or stack group dedicated to mail.
- Dynamic routes, such as `/app/(inbox)/mail/[id].tsx`, handle individual email thread views. The `[id]` is automatically passed as a route parameter.

### Navigation Example
To programmatically navigate within any component:
```typescript
import { router } from 'expo-router';

// Navigate to a specific email thread
const handleEmailPress = (emailId: string) => {
  router.push(`/(inbox)/mail/${emailId}`);
};
```

---

## 🔒 Security & Data Isolation Protocols

Security is not an afterthought or a compliance checkbox; it is the fundamental reason Silo exists. We employ multiple layers of defense.

1. **No External Sharing**: By default, the React Native Share module is heavily restricted. We intercept intent calls to prevent users from accidentally sharing a confidential work PDF to their personal WhatsApp or iMessage.
2. **Secure Token Storage**: `expo-secure-store` encrypts OAuth tokens using the Android Keystore (KeyStore API) and iOS KeyChain. If a device is compromised, rooted, or jailbroken, extracting these raw tokens remains extraordinarily difficult.
3. **App State Obfuscation**: When the app goes into the background (multi-tasking view), we render a blank view or blur the screen to prevent sensitive information from being visible in the OS app switcher.
4. **Data Wiping & Panic Button**: An in-app "Panic Button" (or standard logout) completely and securely wipes the local `AsyncStorage`, the entire React Query Cache, the SecureStore, and deletes all downloaded files from the file system, leaving zero trace of the work profile on the physical device.

---

## 📦 Deployment & CI/CD

Deploying Silo is handled exclusively via EAS (Expo Application Services) to ensure clean, reproducible builds in the cloud.

### Build Configuration (`eas.json`)
We maintain distinct profiles for development, staging, and production environments.

### Build for Android (Production AAB)
```bash
eas build --platform android --profile production
```

### Build for iOS (Production IPA)
```bash
eas build --platform ios --profile production
```

### Over-The-Air (OTA) Updates
A massive advantage of the Expo ecosystem is OTA updates. You can push minor UI fixes, copy changes, and JS logic updates directly to users without going through the lengthy Apple/Google App Store review processes.
```bash
eas update --branch production --message "Fix padding on InboxItem component"
```

---

## 🧩 Component Reference

Below is a brief reference of key UI components and their expected props.

### `InboxItem`
Renders a single row in the email list.
- **Props**:
  - `id: string` - The unique message ID.
  - `sender: string` - Formatted sender name.
  - `subject: string` - Email subject line.
  - `snippet: string` - Short preview text of the body.
  - `isRead: boolean` - Dictates font weight and indicator dot.
  - `date: string` - Formatted timestamp.

### `ComposerSheet`
A bottom sheet component for drafting replies.
- **Props**:
  - `threadId?: string` - If present, configures the composer for a reply rather than a new thread.
  - `recipient?: string` - Pre-fills the 'To' field.
  - `onClose: () => void` - Callback when the sheet is dismissed or email is sent.

---

## 🤝 Contributing Guidelines

We actively welcome contributions from the community and enterprise partners! To ensure a smooth, secure process:

1. **Fork the repository** and create your feature branch: `git checkout -b feature/my-new-feature`.
2. **Follow the style guide**: Ensure your code passes all ESLint and Prettier rules (`npm run lint`).
3. **Write tests**: We strictly use Jest for unit testing and React Native Testing Library for component tests. Ensure existing tests pass and write robust new ones for your features. Minimum coverage is 80%.
4. **Commit format**: We strictly enforce Conventional Commits (e.g., `feat: add new drive viewer`, `fix: resolve crash on logout`, `chore: update dependencies`).
5. **Submit a Pull Request**: Detail the changes, the motivation, the specific issue it fixes, and attach video recordings or screenshots if it involves a UI change.

---

## ❓ Troubleshooting & FAQ

**Q: Metro Bundler is stuck, returning 500 errors, or failing to start.**
**A:** This is common with React Native caching. Clear the cache and restart: `npm start -- -c` or `npx react-native start --reset-cache`.

**Q: Native module missing after installing a new package.**
**A:** If you add a library that contains native iOS/Android code (e.g., a new Expo module or React Native library), you can no longer use the standard Expo Go app. You must rebuild your custom development client:
`eas build --profile development --platform all`

**Q: Google OAuth returns a `redirect_uri_mismatch` error.**
**A:** Ensure your `EXPO_PUBLIC_GOOGLE_REDIRECT_URI` in your `.env` file exactly matches one of the URIs configured in your Google Cloud Console OAuth 2.0 Client IDs dashboard.

**Q: Tailwind/Nativewind classes aren't applying to my new component.**
**A:** Ensure the specific folder path of your new component is included in the `content` array of your `tailwind.config.js` file.

**Q: App crashes on iOS Simulator but runs fine on Web.**
**A:** Check for iOS specific native module requirements or Info.plist permission strings (e.g., camera, photo library) that might be missing in `app.json`.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for the full legal details. This grants you permission for commercial use, modification, distribution, and private use.

---

## 📞 Contact & Support

For enterprise support, bug reports, or security vulnerability disclosures, please reach out to the core team at `security@zen-mail.io`. Do not open public GitHub issues for security vulnerabilities.

---

*Silo - Built with precision, secured by design, for the modern professional.*

## Advanced Configuration Options

If you are deploying Silo in an enterprise environment, you may need to configure specific flags and overrides to match your MDM or VPN settings.

### Custom Deep Link Schemes
In your pp.json, you can define custom URL schemes to allow deep linking from internal enterprise applications:
``json
{
  "expo": {
    "scheme": "zenmail-corp",
    "intentFilters": [
      {
        "action": "VIEW",
        "data": {
          "scheme": "https",
          "host": "mail.zen-mail.io"
        },
        "category": [
          "BROWSABLE",
          "DEFAULT"
        ]
      }
    ]
  }
}
``

### Strict Mode Settings
To enforce stricter security checks during runtime, modify the .env file:
`env
EXPO_PUBLIC_STRICT_CERT_PINNING=true
EXPO_PUBLIC_REQUIRE_BIOMETRICS=true
`

## Internal API Response Types Reference

Understanding the expected data shapes from Google APIs is critical for debugging cache issues.

### DriveFileItem Interface
`	ypescript
interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  iconLink: string;
  hasThumbnail: boolean;
  thumbnailLink?: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
  parents: string[];
}
`

### GmailThreadSummary Interface
`	ypescript
interface GmailThreadSummary {
  id: string;
  historyId: string;
  messages: Array<{
    id: string;
    snippet: string;
    internalDate: string;
    labelIds: string[];
    payload: {
      headers: Array<{
        name: string;
        value: string;
      }>;
    };
  }>;
}
`

## Additional Component APIs

### DriveFileList
- **Props**:
  - olderId?: string - The root folder ID to fetch. Defaults to 'root'.
  - onFilePress: (file: DriveFileItem) => void - Callback for file interaction.
  - listMode: 'grid' | 'list' - View mode toggle.

### DriveItemRow
- **Props**:
  - item: DriveFileItem - The file data.
  - isSelectable?: boolean - Enables a checkbox UI.
  - onSelect?: (id: string, selected: boolean) => void - Selection callback.
