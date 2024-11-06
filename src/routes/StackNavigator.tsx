import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import { ChartAlzheimerIA } from '../screens/ChartAlzheimer/ChartAlzheimerIA';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeApp">
        <Stack.Screen name="WelcomeApp" component={WelcomeApp} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
        <Stack.Screen name="UserIdentification" component={UserIdentification} />
        <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />    
        <Stack.Screen name="TelaEndereco" component={TelaEndereco} />
        <Stack.Screen name="TelaPoints" component={TelaPoints} />
        <Stack.Screen name="TelaDetail" component={TelaDetail} />
        <Stack.Screen name="TelaAlimentos" component={TelaAlimentos} />
        <Stack.Screen name="MemoryGame" component={MemoryGame} />
        
        <Stack.Screen name="TarefasSelect" component={TarefasSelect} />
        <Stack.Screen name="HomeSelect" component={HomeSelect} />
        <Stack.Screen name="PlantSave" component={PlantSave} />
        
        <Stack.Screen name="ChartAlzheimerIA" component={ChartAlzheimerIA} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
