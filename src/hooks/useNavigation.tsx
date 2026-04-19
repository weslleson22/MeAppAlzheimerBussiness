import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

/**
 * Tipos para navegação do app
 */
export type RootStackParamList = {
  UserIdentification: undefined;
  WelcomeApp: undefined;
  Settings: undefined;
  Confirmation: { plantId?: string };
  TelaPrincipal: undefined;
  TelaEndereco: undefined;
  TelaPoints: undefined;
  TelaDetail: { plantId: string };
  TelaAlimentos: undefined;
  MemoryGame: undefined;
  TarefasSelect: undefined;
  HomeSelect: undefined;
  PlantSave: { plantId?: string };
  home: undefined;
  quiz: { quizId?: string };
  history: undefined;
  finish: { score?: number; totalQuestions?: number };
  Reports: undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

/**
 * Hook personalizado para navegação
 * Centraliza a lógica de navegação e fornece métodos utilitários
 */
export function useAppNavigation() {
  const navigation = useNavigation<RootStackNavigationProp>();

  /**
   * Navega para a tela de identificação
   */
  const goToIdentification = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserIdentification' }],
    });
  };

  /**
   * Navega para a tela principal
   */
  const goToWelcome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'WelcomeApp' }],
    });
  };

  /**
   * Navega para uma tela específica
   */
  const navigate = <T extends keyof RootStackParamList>(
    screenName: T,
    params?: RootStackParamList[T]
  ) => {
    navigation.navigate(screenName as any, params as any);
  };

  /**
   * Volta para a tela anterior
   */
  const goBack = () => {
    navigation.goBack();
  };

  /**
   * Reseta a navegação para uma tela específica
   */
  const resetTo = <T extends keyof RootStackParamList>(
    screenName: T,
    params?: RootStackParamList[T]
  ) => {
    navigation.reset({
      index: 0,
      routes: [{ name: screenName as any, params: params as any }],
    });
  };

  /**
   * Substitui a tela atual
   */
  const replace = <T extends keyof RootStackParamList>(
    screenName: T,
    params?: RootStackParamList[T]
  ) => {
    navigation.replace(screenName as any, params as any);
  };

  return {
    navigation,
    navigate,
    goBack,
    goToIdentification,
    goToWelcome,
    resetTo,
    replace,
  };
}

/**
 * Hook para verificar se estamos em uma tela específica
 */
export function useCurrentRoute() {
  const navigation = useNavigation<RootStackNavigationProp>();
  
  const getCurrentRoute = () => {
    const state = navigation.getState();
    return state.routes[state.index]?.name;
  };

  const isCurrentRoute = (routeName: keyof RootStackParamList) => {
    return getCurrentRoute() === routeName;
  };

  return {
    getCurrentRoute,
    isCurrentRoute,
  };
}
