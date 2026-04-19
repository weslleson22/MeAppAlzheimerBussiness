import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook personalizado para gerenciamento de AsyncStorage
 * Fornece métodos seguros e tipados para operações de storage
 */
export function useStorage<T = any>(key: string, defaultValue?: T) {
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega dados do storage
   */
  useEffect(() => {
    loadData();
  }, [key]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const storedData = await AsyncStorage.getItem(key);
      
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
      } else {
        setData(defaultValue);
      }
    } catch (err) {
      const errorMessage = `Erro ao carregar dados do storage (${key}): ${err}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      setData(defaultValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  /**
   * Salva dados no storage
   */
  const saveData = useCallback(async (value: T): Promise<boolean> => {
    try {
      setError(null);
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, serializedValue);
      setData(value);
      return true;
    } catch (err) {
      const errorMessage = `Erro ao salvar dados no storage (${key}): ${err}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      return false;
    }
  }, [key]);

  /**
   * Remove dados do storage
   */
  const removeData = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      await AsyncStorage.removeItem(key);
      setData(defaultValue);
      return true;
    } catch (err) {
      const errorMessage = `Erro ao remover dados do storage (${key}): ${err}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      return false;
    }
  }, [key, defaultValue]);

  /**
   * Limpa todos os dados do storage
   */
  const clearAll = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      await AsyncStorage.clear();
      setData(defaultValue);
      return true;
    } catch (err) {
      const errorMessage = `Erro ao limpar storage: ${err}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      return false;
    }
  }, [defaultValue]);

  /**
   * Recarrega os dados do storage
   */
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    error,
    saveData,
    removeData,
    clearAll,
    refresh,
  };
}

/**
 * Interface para dados da planta
 */
export interface Plant {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: string[];
  frequency: {
    times: number;
    repeat_every: string;
  };
  hour: string;
  dateTimeNotification: Date;
}

/**
 * Hook específico para gerenciamento de plantas
 */
export function usePlants() {
  const STORAGE_KEY = '@plantmanager:plants';
  
  const { data: plants, isLoading, error, saveData, removeData, clearAll, refresh } = useStorage<Record<string, Plant>>(STORAGE_KEY, {});

  /**
   * Salva uma planta específica
   */
  const savePlant = useCallback(async (plant: Plant): Promise<boolean> => {
    try {
      const currentPlants = plants || {};
      const updatedPlants = {
        ...currentPlants,
        [plant.id]: plant,
      };
      return await saveData(updatedPlants);
    } catch (err) {
      console.error('Erro ao salvar planta:', err);
      return false;
    }
  }, [plants, saveData]);

  /**
   * Remove uma planta específica
   */
  const removePlant = useCallback(async (plantId: string): Promise<boolean> => {
    try {
      const currentPlants = plants || {};
      const remainingPlants = { ...currentPlants };
      delete remainingPlants[plantId];
      return await saveData(remainingPlants);
    } catch (err) {
      console.error('Erro ao remover planta:', err);
      return false;
    }
  }, [plants, saveData]);

  /**
   * Atualiza uma planta específica
   */
  const updatePlant = useCallback(async (plantId: string, updates: Partial<Plant>): Promise<boolean> => {
    try {
      const currentPlants = plants || {};
      const currentPlant = currentPlants[plantId];
      if (!currentPlant) return false;
      
      const updatedPlants = {
        ...currentPlants,
        [plantId]: {
          ...currentPlant,
          ...updates,
        },
      };
      return await saveData(updatedPlants);
    } catch (err) {
      console.error('Erro ao atualizar planta:', err);
      return false;
    }
  }, [plants, saveData]);

  return {
    plants: plants || {},
    isLoading,
    error,
    savePlant,
    removePlant,
    updatePlant,
    clearAll,
    refresh,
  };
}
