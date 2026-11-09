import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface para dados do usuário
 */
export interface User {
  name: string;
  id?: string;
  createdAt?: Date;
  profilePhoto?: string;
  email?: string;
  phone?: string;
}

type UserListener = (user: User | null) => void;
const listeners = new Set<UserListener>();

function notifyUserListeners(nextUser: User | null) {
  listeners.forEach(listener => listener(nextUser));
}

/**
 * Hook personalizado para gerenciamento de usuário
 * Centraliza a lógica de armazenamento e recuperação de dados do usuário
 */
export function useStandaloneUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Carrega os dados do usuário do AsyncStorage e sincroniza entre telas
   */
  useEffect(() => {
    loadUserData();

    const listener: UserListener = (nextUser) => {
      setUser(nextUser);
      setIsAuthenticated(Boolean(nextUser));
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  /**
   * Carrega dados do usuário do storage
   */
  const loadUserData = async () => {
    try {
      const userString = await AsyncStorage.getItem('@plantmanager:user');
      if (userString) {
        try {
          const userData: User = JSON.parse(userString);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (parseError) {
          // Fallback para formato antigo (apenas nome)
          const userData: User = { 
            name: userString, 
            id: 'user_' + Date.now(), 
            createdAt: new Date() 
          };
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Salva os dados do usuário no AsyncStorage
   */
  const saveUser = async (userData: User) => {
    try {
      const userToSave: User = {
        ...userData,
        id: userData.id || 'user_' + Date.now(),
        createdAt: userData.createdAt || new Date(),
      };
      await AsyncStorage.setItem('@plantmanager:user', JSON.stringify(userToSave));
      setUser(userToSave);
      setIsAuthenticated(true);
      notifyUserListeners(userToSave);
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      return false;
    }
  };

  /**
   * Remove os dados do usuário do AsyncStorage
   */
  const clearUser = async () => {
    try {
      await AsyncStorage.removeItem('@plantmanager:user');
      setUser(null);
      setIsAuthenticated(false);
      notifyUserListeners(null);
      return true;
    } catch (error) {
      console.error('Erro ao remover dados do usuário:', error);
      return false;
    }
  };

  /**
   * Atualiza o nome do usuário
   */
  const updateUserName = async (newName: string) => {
    if (!user) return false;
    
    const updatedUser = { ...user, name: newName };
    return await saveUser(updatedUser);
  };

  /**
   * Atualiza a foto de perfil do usuário
   */
  const updateProfilePhoto = async (photoUri: string) => {
    if (!user) return false;
    
    const updatedUser = { ...user, profilePhoto: photoUri };
    return await saveUser(updatedUser);
  };

  /**
   * Atualiza informações completas do perfil
   */
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return false;
    
    const updatedUser = { ...user, ...updates };
    return await saveUser(updatedUser);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    saveUser,
    clearUser,
    updateUserName,
    updateProfilePhoto,
    updateProfile,
    refreshUser: loadUserData,
  };
}

export const useUser = useStandaloneUser;
