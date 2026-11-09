import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from './src/components/ErrorBoundary';
import { UserProvider } from './src/context/UserContext';
import Routes from './src/routes';
import { useLoadFonts } from './src/styles/fonts';

export default function App() {
  useLoadFonts();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <UserProvider>
          <Routes />
        </UserProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
