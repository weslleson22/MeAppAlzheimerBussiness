import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Confirmation } from '../screens/AppTarefas/Confirmations';
//import { HomeSelect } from '../screens/AppTarefas/HomeSelect';
import { PlantSave } from '../screens/AppTarefas/PlantSave';
import { UserIdentification } from '../screens/AppTarefas/UserIdentification';
//import { Welcome } from '../screens/AppTarefas/Welcome';
import colors from '../styles/colors';
//import { MyPlants } from '../screens/AppTarefas/MyPlants';
import AuthRoutes from './tab.routes';
import { WelcomeApp } from '../screens/AppMenu/Home/WelcomeApp';
import { TarefasSelect } from '../screens/AppTarefas/TarefasSelect';
import { TelaPrincipal } from '../screens/AppMenu/Home/TelaPrincipal';
import { TelaEndereco } from '../screens/AppEndereco/TelaEndereco';
import { TelaPoints } from '../screens/AppEndereco/Points';
import TelaDetail from '../screens/AppEndereco/Detail';
import { TelaAlimentos } from '../screens/AppAlimentosIa/TelaAlimentos';
import { MemoryGame } from '../screens/Gamers/Memory/MemoryGame';
import { MeusEndereco } from '../screens/Fleet/Signin/MeusEndereco';
import { HomeQuiz } from '../screens/Gamers/Quiz/src/screens/Home';
import { Quiz } from '../screens/Gamers/Quiz/src/screens/Quiz';
import { History } from '../screens/Gamers/Quiz/src/screens/History';
import { Finish } from '../screens/Gamers/Quiz/src/screens/Finish';

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
    <NavigationContainer>
        <stackRoutes.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: colors.white
                },
            }}
        >
            <stackRoutes.Screen 
                name='Welcome'
                component={WelcomeApp}
            />
            <stackRoutes.Screen 
                name='UserIdentification'
                component={UserIdentification}
            />
            <stackRoutes.Screen 
                name='Confirmation'
                component={Confirmation}
            />
            <stackRoutes.Screen 
                name='HomeSelect'
                component={AuthRoutes}
            />
            <stackRoutes.Screen
                name='PlantSave'
                component={PlantSave}
            />
            <stackRoutes.Screen 
                name='MyPlants'
                component={AuthRoutes}
            />
            <stackRoutes.Screen 
                name='Welcome01'
                component={WelcomeApp}
            />
            <stackRoutes.Screen 
                name='TelaEndereco'
                component={TelaEndereco}
            />
            <stackRoutes.Screen 
                name='TarefasSelect'
                component={TarefasSelect}
            />
            <stackRoutes.Screen 
                name='TelaPrincipal'
                component={TelaPrincipal}
            />
            <stackRoutes.Screen 
                name='Points'
                component={TelaPoints}
            />
            <stackRoutes.Screen 
                name='Detail'
                component={TelaDetail}
            />
            <stackRoutes.Screen 
                name='TelaAlimentos'
                component={TelaAlimentos}
            />
            <stackRoutes.Screen 
                name='MemoryGame'
                component={MemoryGame}
            />

            <stackRoutes.Screen 
                name='Fleet'
                component={MeusEndereco}
            />
            
            <stackRoutes.Screen 
            name="home" 
            component={HomeQuiz} 
            />
            <stackRoutes.Screen 
            name="quiz" 
            component={Quiz} 
            />
            <stackRoutes.Screen 
            name="history" 
            component={History} 
            />
            <stackRoutes.Screen 
            name="finish" 
            component={Finish} 
            />

         
        </stackRoutes.Navigator>
    </NavigationContainer>
);

export default AppRoutes;
