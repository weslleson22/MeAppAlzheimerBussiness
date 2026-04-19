import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import TelaDetail from '../screens/AppEndereco/Detail';
import { TelaPoints } from '../screens/AppEndereco/Points';
import { TelaEndereco } from '../screens/AppEndereco/TelaEndereco';
import { WelcomeApp } from '../screens/AppMenu/Home/WelcomeApp';
import { UserIdentification } from '../screens/AppTarefas/UserIdentification';
import { Confirmation } from '../screens/AppTarefas/Confirmations';
import { TelaPrincipal } from '../screens/AppMenu/Home/TelaPrincipal';
import { TelaAlimentos } from '../screens/AppAlimentosIa/TelaAlimentos';
import { MemoryGame } from '../screens/Gamers/Memory/MemoryGame';
import { HomeSelect } from '../screens/AppTarefas/HomeSelect';
import { TarefasSelect } from '../screens/AppTarefas/TarefasSelect';
import { PlantSave } from '../screens/AppTarefas/PlantSave';
import { HomeQuiz } from '../screens/Gamers/Quiz/src/screens/Home';
import { Quiz } from '../screens/Gamers/Quiz/src/screens/Quiz';
import { History } from '../screens/Gamers/Quiz/src/screens/History';
import { Finish } from '../screens/Gamers/Quiz/src/screens/Finish';
import { UserSettings } from '../screens/Settings/UserSettings';
import colors from '../styles/colors';
import { ReportsScreen } from '../screens/AppMenu/Reports/ReportsScreen';
import { Dashboard } from '../screens/AppMenu/Home/Dashboard';
import { AIAssistantScreen } from '../screens/AppMenu/AI/AIAssistantScreen';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const [isLoading, setIsLoading] = useState(true);
  const [userIdentified, setUserIdentified] = useState(false);

  useEffect(() => {
    checkUserIdentification();
  }, []);

  const checkUserIdentification = async () => {
    try {
      const userData = await AsyncStorage.getItem('@plantmanager:user');
      // Verifica se existe dados do usuário (não apenas nome)
      setUserIdentified(!!userData && userData !== '');
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      setUserIdentified(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={userIdentified ? "WelcomeApp" : "UserIdentification"}
      >
        {!userIdentified ? (
          // Tela de identificação na primeira vez
          <Stack.Screen 
            name="UserIdentification" 
            component={UserIdentification}
          />
        ) : null}
        
        {/* Tela de identificação sempre disponível */}
        <Stack.Screen name="UserIdentification" component={UserIdentification} />
        
        {/* Rotas principais */}
        <Stack.Screen name="WelcomeApp" component={WelcomeApp} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Settings" component={UserSettings} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
        <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />    
        <Stack.Screen name="TelaEndereco" component={TelaEndereco} />
        <Stack.Screen name="TelaPoints" component={TelaPoints} />
        <Stack.Screen name="TelaDetail" component={TelaDetail} />
        <Stack.Screen name="TelaAlimentos" component={TelaAlimentos} />
        <Stack.Screen name="MemoryGame" component={MemoryGame} />
        
        <Stack.Screen name="TarefasSelect" component={TarefasSelect} />
        <Stack.Screen name="HomeSelect" component={HomeSelect} />
        <Stack.Screen name="PlantSave" component={PlantSave} />
        
        <Stack.Screen name="home" component={HomeQuiz} />
        <Stack.Screen name="quiz" component={Quiz} />
        <Stack.Screen name="history" component={History} />
        <Stack.Screen name="finish" component={Finish} />
        <Stack.Screen name="dashboard" component={Dashboard} />
        <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
