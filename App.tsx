import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from './src/components/ErrorBoundary';
import Routes from './src/routes';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Routes />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
