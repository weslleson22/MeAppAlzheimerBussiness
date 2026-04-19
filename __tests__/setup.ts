import 'react-native-gesture-handler/jestSetup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage')
);

// Mock das notificações
jest.mock('expo-notifications', () => ({
  ...jest.requireActual('expo-notifications'),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('mock-notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  setNotificationHandler: jest.fn(),
  getBadgeCountAsync: jest.fn(() => Promise.resolve(0)),
  setBadgeCountAsync: jest.fn(() => Promise.resolve()),
}));

// Mock da navegação
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    replace: jest.fn(),
  })),
  useRoute: jest.fn(() => ({
    params: {},
  })),
  useFocusEffect: jest.fn(),
}));

// Mock do react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: jest.fn(() => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })),
}));

// Mock do react-native-vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock do react-native-svg
jest.mock('react-native-svg', () => ({
  SvgUri: 'SvgUri',
}));

// Mock do DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => ({
  DateTimePicker: 'DateTimePicker',
}));

// Configuração global do teste
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Limpar AsyncStorage antes de cada teste
beforeEach(async () => {
  await AsyncStorage.clear();
});

afterEach(async () => {
  jest.clearAllMocks();
});
