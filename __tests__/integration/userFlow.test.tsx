import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserIdentification } from '../../src/screens/AppTarefas/UserIdentification';
import { WelcomeApp } from '../../src/screens/AppMenu/Home/WelcomeApp';
import { UserSettings } from '../../src/screens/Settings/UserSettings';
import { useUser } from '../../src/hooks/useUser';

// Mock dos serviços
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../src/hooks/useUser');
jest.mock('../../src/services/notificationService');

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const Stack = createNativeStackNavigator();

// Componente de navegação para testes
const TestNavigation = ({ initialRoute = 'UserIdentification' }) => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="UserIdentification" component={UserIdentification} />
      <Stack.Screen name="WelcomeApp" component={WelcomeApp} />
      <Stack.Screen name="Settings" component={UserSettings} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('Integração: Fluxo do Usuário', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
    
    // Mock padrão do useUser
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      saveUser: jest.fn().mockResolvedValue(true),
      clearUser: jest.fn().mockResolvedValue(true),
      updateUserName: jest.fn().mockResolvedValue(true),
      updateProfilePhoto: jest.fn().mockResolvedValue(true),
      updateProfile: jest.fn().mockResolvedValue(true),
    });
  });

  test('fluxo completo: primeiro acesso -> identificação -> dashboard', async () => {
    // Simular usuário não identificado
    mockAsyncStorage.getItem.mockResolvedValue(null);

    const { getByTestId, getByText, queryByTestId } = render(<TestNavigation />);

    // Verificar que está na tela de identificação
    expect(getByTestId('identification-screen')).toBeTruthy();
    expect(getByText('Como podemos chamar você?')).toBeTruthy();

    // Preencher nome do usuário
    const nameInput = getByTestId('name-input');
    fireEvent.changeText(nameInput, 'João Silva');

    // Clicar no botão de confirmar
    const confirmButton = getByTestId('confirm-button');
    fireEvent.press(confirmButton);

    // Esperar navegação para o dashboard
    await waitFor(() => {
      expect(getByTestId('welcome-screen')).toBeTruthy();
      expect(queryByTestId('identification-screen')).toBeFalsy();
    });

    // Verificar que o nome foi salvo
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@plantmanager:user',
      expect.stringContaining('João Silva')
    );
  });

  test('fluxo: usuário existente -> dashboard direto', async () => {
    // Simular usuário já identificado
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify({
      name: 'Maria Santos',
      id: 'user-123',
      createdAt: new Date(),
    }));

    const { getByTestId, queryByTestId } = render(<TestNavigation initialRoute="WelcomeApp" />);

    // Verificar que foi direto para o dashboard
    await waitFor(() => {
      expect(getByTestId('welcome-screen')).toBeTruthy();
      expect(queryByTestId('identification-screen')).toBeFalsy();
    });
  });

  test('fluxo: dashboard -> configurações -> editar nome', async () => {
    // Simular usuário logado
    mockUseUser.mockReturnValue({
      user: {
        name: 'Carlos Alberto',
        id: 'user-456',
        createdAt: new Date(),
      },
      isLoading: false,
      isAuthenticated: true,
      saveUser: jest.fn().mockResolvedValue(true),
      clearUser: jest.fn().mockResolvedValue(true),
      updateUserName: jest.fn().mockResolvedValue(true),
      updateProfilePhoto: jest.fn().mockResolvedValue(true),
      updateProfile: jest.fn().mockResolvedValue(true),
    });

    const { getByTestId, getByText } = render(<TestNavigation initialRoute="Settings" />);

    // Verificar que está na tela de configurações
    expect(getByTestId('settings-screen')).toBeTruthy();
    expect(getByText('Editar Perfil')).toBeTruthy();

    // Verificar nome atual
    const nameInput = getByTestId('name-input');
    expect(nameInput.props.value).toBe('Carlos Alberto');

    // Editar nome
    fireEvent.changeText(nameInput, 'Carlos Silva');

    // Salvar alterações
    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    // Verificar que o nome foi atualizado
    const mockUpdateUserName = mockUseUser.mock.results[0].value.updateUserName;
    expect(mockUpdateUserName).toHaveBeenCalledWith('Carlos Silva');
  });

  test('fluxo: validação de nome obrigatório', async () => {
    const { getByTestId, getByText } = render(<TestNavigation />);

    // Tentar confirmar sem nome
    const confirmButton = getByTestId('confirm-button');
    fireEvent.press(confirmButton);

    // Verificar mensagem de erro
    await waitFor(() => {
      expect(getByText('Por favor, digite seu nome')).toBeTruthy();
    });

    // Verificar que não navegou
    expect(getByTestId('identification-screen')).toBeTruthy();
  });

  test('fluxo: persistência de dados do usuário', async () => {
    const { getByTestId, getByText, rerender } = render(<TestNavigation />);

    // Primeiro acesso
    const nameInput = getByTestId('name-input');
    fireEvent.changeText(nameInput, 'Ana Paula');

    const confirmButton = getByTestId('confirm-button');
    fireEvent.press(confirmButton);

    // Esperar salvar
    await waitFor(() => {
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantmanager:user',
        expect.stringContaining('Ana Paula')
      );
    });

    // Simular reload do app com usuário salvo
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify({
      name: 'Ana Paula',
      id: 'user-789',
      createdAt: new Date(),
    }));

    rerender(<TestNavigation initialRoute="WelcomeApp" />);

    // Verificar que usuário está logado
    await waitFor(() => {
      expect(getByTestId('welcome-screen')).toBeTruthy();
    });
  });

  test('fluxo: tratamento de erro ao salvar usuário', async () => {
    // Mock de erro no saveUser
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      saveUser: jest.fn().mockResolvedValue(false),
      clearUser: jest.fn().mockResolvedValue(true),
      updateUserName: jest.fn().mockResolvedValue(true),
      updateProfilePhoto: jest.fn().mockResolvedValue(true),
      updateProfile: jest.fn().mockResolvedValue(true),
    });

    const { getByTestId, getByText } = render(<TestNavigation />);

    // Tentar salvar usuário
    const nameInput = getByTestId('name-input');
    fireEvent.changeText(nameInput, 'Teste Erro');

    const confirmButton = getByTestId('confirm-button');
    fireEvent.press(confirmButton);

    // Verificar mensagem de erro
    await waitFor(() => {
      expect(getByText('Não foi possível salvar seu nome')).toBeTruthy();
    });

    // Verificar que não navegou
    expect(getByTestId('identification-screen')).toBeTruthy();
  });

  test('fluxo: integração com AsyncStorage', async () => {
    const { getByTestId, getByText } = render(<TestNavigation />);

    // Salvar usuário
    const nameInput = getByTestId('name-input');
    fireEvent.changeText(nameInput, 'Usuário Teste');

    const confirmButton = getByTestId('confirm-button');
    fireEvent.press(confirmButton);

    // Verificar chamadas ao AsyncStorage
    await waitFor(() => {
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@plantmanager:user');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantmanager:user',
        expect.stringContaining('Usuário Teste')
      );
    });
  });

  test('fluxo: navegação entre telas', async () => {
    // Mock usuário logado
    mockUseUser.mockReturnValue({
      user: {
        name: 'Navegação Test',
        id: 'user-nav',
        createdAt: new Date(),
      },
      isLoading: false,
      isAuthenticated: true,
      saveUser: jest.fn().mockResolvedValue(true),
      clearUser: jest.fn().mockResolvedValue(true),
      updateUserName: jest.fn().mockResolvedValue(true),
      updateProfilePhoto: jest.fn().mockResolvedValue(true),
      updateProfile: jest.fn().mockResolvedValue(true),
    });

    const { getByTestId } = render(<TestNavigation />);

    // Verificar tela inicial
    expect(getByTestId('welcome-screen')).toBeTruthy();

    // Navegar para configurações (seria feito via navegação real)
    // Este é um teste simulado da estrutura de navegação
  });
});
