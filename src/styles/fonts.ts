import { useFonts, Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';

// Carrega as fontes necessárias usando useFonts
export function useLoadFonts() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  });

  return fontsLoaded;
}

// Defina as fontes disponíveis para o resto do projeto
const fonts = {
  heading: 'Jost_600SemiBold',
  text: 'Jost_400Regular',
  complement: 'Jost_400Regular',
};

export default fonts;
