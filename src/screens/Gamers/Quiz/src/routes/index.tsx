import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { THEME } from '../styles/theme';

import { AppRoutes } from './app.routes';

export function RoutesQuiz() {
  return (
    <View style={{ flex: 1, backgroundColor: THEME.COLORS.GREY_800 }}>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </View>
  )
}