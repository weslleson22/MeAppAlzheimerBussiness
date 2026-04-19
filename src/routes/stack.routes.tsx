import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import colors from '../styles/colors';

const stackRoutes = createNativeStackNavigator();

const AppRoutes: React.FC = () => (
    <stackRoutes.Navigator
        screenOptions={{
            headerShown: false,
            contentStyle: {
                backgroundColor: colors.white
            },
        }}
    >
        <stackRoutes.Screen 
            name='Welcome'
            getComponent={() => require('../screens/AppMenu/Home/WelcomeApp').WelcomeApp}
        />
        <stackRoutes.Screen 
            name='UserIdentification'
            getComponent={() => require('../screens/AppTarefas/UserIdentification').UserIdentification}
        />
        <stackRoutes.Screen 
            name='Confirmation'
            getComponent={() => require('../screens/AppTarefas/Confirmations').Confirmation}
        />
        <stackRoutes.Screen 
            name='HomeSelect'
            getComponent={() => require('./tab.routes').default}
        />
        <stackRoutes.Screen
            name='PlantSave'
            getComponent={() => require('../screens/AppTarefas/PlantSave').PlantSave}
        />
        <stackRoutes.Screen 
            name='MyPlants'
            getComponent={() => require('./tab.routes').default}
        />
        <stackRoutes.Screen 
            name='Welcome01'
            getComponent={() => require('../screens/AppMenu/Home/WelcomeApp').WelcomeApp}
        />
        <stackRoutes.Screen 
            name='TelaEndereco'
            getComponent={() => require('../screens/AppEndereco/TelaEndereco').TelaEndereco}
        />
        <stackRoutes.Screen 
            name='TarefasSelect'
            getComponent={() => require('../screens/AppTarefas/TarefasSelect').TarefasSelect}
        />
        <stackRoutes.Screen 
            name='TelaPrincipal'
            getComponent={() => require('../screens/AppMenu/Home/TelaPrincipal').TelaPrincipal}
        />
        <stackRoutes.Screen 
            name='Points'
            getComponent={() => require('../screens/AppEndereco/Points').TelaPoints}
        />
        <stackRoutes.Screen 
            name='Detail'
            getComponent={() => require('../screens/AppEndereco/Detail').default}
        />
        <stackRoutes.Screen 
            name='TelaAlimentos'
            getComponent={() => require('../screens/AppAlimentosIa/TelaAlimentos').TelaAlimentos}
        />
        <stackRoutes.Screen 
            name='MemoryGame'
            getComponent={() => require('../screens/Gamers/Memory/MemoryGame').MemoryGame}
        />
        <stackRoutes.Screen 
            name='Fleet'
            getComponent={() => require('../screens/Fleet/Signin/MeusEndereco').MeusEndereco}
        />
        <stackRoutes.Screen 
            name="home" 
            getComponent={() => require('../screens/Gamers/Quiz/src/screens/Home').HomeQuiz} 
        />
        <stackRoutes.Screen 
            name="quiz" 
            getComponent={() => require('../screens/Gamers/Quiz/src/screens/Quiz').Quiz} 
        />
        <stackRoutes.Screen 
            name="history" 
            getComponent={() => require('../screens/Gamers/Quiz/src/screens/History').History} 
        />
        <stackRoutes.Screen 
            name="finish" 
            getComponent={() => require('../screens/Gamers/Quiz/src/screens/Finish').Finish} 
        />
        <stackRoutes.Screen 
            name="Settings" 
            getComponent={() => require('../screens/AppMenu/Settings/SettingsScreen').SettingsScreen} 
        />
    </stackRoutes.Navigator>
);

export default AppRoutes;
