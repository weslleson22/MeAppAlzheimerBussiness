import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';
import {ThemeProvider} from "styled-components/native";

import Routes from './src/routes/stack.routes';  // Certifique-se de importar o arquivo correto
import theme from './src/screens/Fleet/theme';
import { MeusEndereco } from './src/screens/Fleet/Signin/MeusEndereco';
import { HomeQuiz } from './src/screens/Gamers/Quiz/src/screens/Home';
import { RoutesQuiz } from './src/screens/Gamers/Quiz/src/routes';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
    <GestureHandlerRootView style={{ flex: 1 }}>
  {/*
      <Routes />
  */}
  <RoutesQuiz></RoutesQuiz>
      

      </GestureHandlerRootView>
      </ThemeProvider>
  );
}
