import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser, User } from '../../src/hooks/useUser';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('useUser Hook', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve carregar dados do usuário do AsyncStorage na inicialização', async () => {
    const mockUser: User = {
      name: 'João Silva',
      id: 'user_123',
      createdAt: new Date(),
      profilePhoto: 'https://example.com/photo.jpg',
    };

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUser));

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@plantmanager:user');
  });

  test('deve lidar com formato antigo de dados (apenas nome)', async () => {
    const mockUserName = 'Maria Santos';
    mockAsyncStorage.getItem.mockResolvedValue(mockUserName);

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    await waitForNextUpdate();

    expect(result.current.user).toEqual({
      name: mockUserName,
      id: expect.any(String),
      createdAt: expect.any(Date),
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('deve lidar com usuário não encontrado', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('deve salvar novo usuário com sucesso', async () => {
    const { result } = renderHook(() => useUser());

    const newUser: User = {
      name: 'Carlos Alberto',
      id: 'user_456',
      createdAt: new Date(),
      email: 'carlos@email.com',
    };

    mockAsyncStorage.setItem.mockResolvedValue();

    await act(async () => {
      const success = await result.current.saveUser(newUser);
      expect(success).toBe(true);
    });

    expect(result.current.user).toEqual(newUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@plantmanager:user',
      JSON.stringify(newUser)
    );
  });

  test('deve falhar ao salvar usuário em caso de erro', async () => {
    const { result } = renderHook(() => useUser());

    const newUser: User = {
      name: 'Test User',
    };

    mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

    await act(async () => {
      const success = await result.current.saveUser(newUser);
      expect(success).toBe(false);
    });

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('deve limpar dados do usuário com sucesso', async () => {
    const mockUser: User = { name: 'Test User' };
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUser));
    mockAsyncStorage.removeItem.mockResolvedValue();

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    await waitForNextUpdate();

    await act(async () => {
      const success = await result.current.clearUser();
      expect(success).toBe(true);
    });

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('@plantmanager:user');
  });

  test('deve atualizar nome do usuário', async () => {
    const mockUser: User = {
      name: 'Nome Antigo',
      id: 'user_123',
      createdAt: new Date(),
    };

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUser));
    mockAsyncStorage.setItem.mockResolvedValue();

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    await waitForNextUpdate();

    await act(async () => {
      const success = await result.current.updateUserName('Novo Nome');
      expect(success).toBe(true);
    });

    expect(result.current.user?.name).toBe('Novo Nome');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@plantmanager:user',
      JSON.stringify({ ...mockUser, name: 'Novo Nome' })
    );
  });

  test('deve atualizar foto de perfil do usuário', async () => {
    const mockUser: User = {
      name: 'Test User',
      id: 'user_123',
      createdAt: new Date(),
    };

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUser));
    mockAsyncStorage.setItem.mockResolvedValue();

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    await waitForNextUpdate();

    const newPhotoUri = 'https://example.com/new-photo.jpg';

    await act(async () => {
      const success = await result.current.updateProfilePhoto(newPhotoUri);
      expect(success).toBe(true);
    });

    expect(result.current.user?.profilePhoto).toBe(newPhotoUri);
  });

  test('deve atualizar perfil completo do usuário', async () => {
    const mockUser: User = {
      name: 'Original Name',
      id: 'user_123',
      createdAt: new Date(),
    };

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUser));
    mockAsyncStorage.setItem.mockResolvedValue();

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    await waitForNextUpdate();

    const updates: Partial<User> = {
      email: 'novo@email.com',
      phone: '(11) 99999-9999',
    };

    await act(async () => {
      const success = await result.current.updateProfile(updates);
      expect(success).toBe(true);
    });

    expect(result.current.user?.email).toBe('novo@email.com');
    expect(result.current.user?.phone).toBe('(11) 99999-9999');
    expect(result.current.user?.name).toBe('Original Name'); // Mantém o nome original
  });

  test('não deve atualizar perfil se usuário não estiver logado', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);

    const { result, waitForNextUpdate } = renderHook(() => useUser());

    await waitForNextUpdate();

    await act(async () => {
      const success = await result.current.updateUserName('Novo Nome');
      expect(success).toBe(false);
    });

    expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
