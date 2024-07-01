import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import {HomeSelect} from '../screens/AppTarefas/HomeSelect';
import {MyPlants} from '../screens/AppTarefas/MyPlants';
import colors from '../styles/colors';

const AppTab = createBottomTabNavigator();

const AuthRoutes = () => {
    return (
        <AppTab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.blue,
                tabBarInactiveTintColor: colors.blue,
                tabBarLabelPosition: 'beside-icon',
                tabBarStyle: {
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                    height: 88
                },
            }}
        >
            <AppTab.Screen
                name="Nova Planta"
                component={HomeSelect}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons
                            name="add-circle-outline"
                            size={size}
                            color={color}
                        />
                    ),
                    headerShown: false,
                }}
            />
            <AppTab.Screen
                name="Minhas Plantas"
                component={MyPlants}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    ),
                    headerShown: false,
                }}
            />
        </AppTab.Navigator>
    );
}

export default AuthRoutes;
