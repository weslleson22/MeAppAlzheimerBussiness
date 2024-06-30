import React, { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';

import { TelaAlimentos } from './src/screens/AppAlimentosIa/TelaAlimentos';

SplashScreen.preventAutoHideAsync(); // Evita que a splash screen desapareça automaticamente

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Esconde a splash screen quando as fontes são carregadas
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Pode retornar nulo enquanto as fontes são carregadas
  }

  return (
    <TelaAlimentos/>
  );
}
