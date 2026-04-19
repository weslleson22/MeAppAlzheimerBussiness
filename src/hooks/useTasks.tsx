import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface para dados da tarefa
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  reminderTime?: Date;
}

/**
 * Hook personalizado para gerenciamento de tarefas
 * Centraliza a lógica de armazenamento e recuperação de tarefas
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STORAGE_KEY = '@plantmanager:tasks';

  useEffect(() => {
    loadTasks();
  }, []);

  /**
   * Carrega todas as tarefas do AsyncStorage
   */
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const tasksString = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (tasksString) {
        const parsedTasks: Task[] = JSON.parse(tasksString);
        // Converte strings de data para objetos Date
        const tasksWithDates = parsedTasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          reminderTime: task.reminderTime ? new Date(task.reminderTime) : undefined,
        }));
        setTasks(tasksWithDates);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      setError('Não foi possível carregar as tarefas');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Salva uma nova tarefa
   */
  const saveTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      };

      const updatedTasks = [...tasks, newTask];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      
      return newTask;
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      setError('Não foi possível salvar a tarefa');
      return null;
    }
  };

  /**
   * Atualiza uma tarefa existente
   */
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        setError('Tarefa não encontrada');
        return false;
      }

      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...updates };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      setError('Não foi possível atualizar a tarefa');
      return false;
    }
  };

  /**
   * Remove uma tarefa
   */
  const deleteTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      
      return true;
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      setError('Não foi possível remover a tarefa');
      return false;
    }
  };

  /**
   * Marca uma tarefa como concluída/não concluída
   */
  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      return await updateTask(taskId, { completed: !task.completed });
    }
    return false;
  };

  /**
   * Limpa todas as tarefas
   */
  const clearAllTasks = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setTasks([]);
      return true;
    } catch (error) {
      console.error('Erro ao limpar tarefas:', error);
      setError('Não foi possível limpar as tarefas');
      return false;
    }
  };

  /**
   * Filtra tarefas por categoria
   */
  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category);
  };

  /**
   * Filtra tarefas por status (concluídas/não concluídas)
   */
  const getTasksByStatus = (completed: boolean) => {
    return tasks.filter(task => task.completed === completed);
  };

  /**
   * Obtém estatísticas das tarefas
   */
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      pending,
      completionRate: Math.round(completionRate * 10) / 10,
    };
  };

  return {
    tasks,
    isLoading,
    error,
    saveTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    clearAllTasks,
    loadTasks,
    getTasksByCategory,
    getTasksByStatus,
    getTaskStats,
    refreshTasks: loadTasks,
  };
}
