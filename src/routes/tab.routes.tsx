import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
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
                getComponent={() => require('../screens/AppTarefas/HomeSelect').HomeSelect}
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
                getComponent={() => require('../screens/AppTarefas/MyPlants').MyPlants}
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
