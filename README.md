# SpaceX Launches

A React Native application that displays SpaceX launch information with beautiful animations and interactive features.

## Features

- View a list of SpaceX launches with mission details
- Launch information including mission name, date, and rocket details
- Launch images with favorite functionality
- Direct links to launch articles
- Smooth animations and transitions
- Favorite and save launch images
- Network error handling
- Modern, clean UI with consistent theming

## Tech Stack

- React Native
- TypeScript
- Apollo Client for GraphQL
- React Native Paper for UI components
- React Native Animatable for animations
- React Navigation for routing
- AsyncStorage for local storage

## Project Structure

```
src/
├── apollo/          # Apollo Client configuration
├── components/      # Reusable components
├── context/         # React Context providers
├── graphql/         # GraphQL queries and mutations
├── hooks/           # Custom React hooks
├── screens/         # Screen components
├── theme/           # Theme configuration
└── types/           # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npx expo start
```

3. Run the app:
   - Scan the QR code with your mobile device using the Expo Go app
   - Press 'i' to open in iOS simulator (requires Xcode)
   - Press 'a' to open in Android emulator (requires Android Studio)
   - Press 'w' to open in web browser

## Key Components

### LaunchOverviewScreen
The main screen displaying a list of SpaceX launches. Features:
- Scroll-aware animations
- Pull-to-refresh
- Error handling
- Loading states

### LaunchDetailsScreen
Detailed view of a specific launch. Features:
- Sequential animations
- Image gallery
- Favorite functionality
- Article link

### Custom Hooks

#### useNetworkError
Handles network connectivity and error states:
- Monitors network status
- Displays appropriate error messages
- Provides error handling utilities

#### useSequentialAnimation
Manages sequential animations for launch details:
- Card fade-in
- Image gallery animations
- Article button animations

## Theme System

The app uses a centralized theme system for consistent styling:
- Colors
- Spacing
- Typography
- Elevation
- Border radius
- Common styles