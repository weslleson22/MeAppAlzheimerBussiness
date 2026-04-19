import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTasks, Task } from '../../src/hooks/useTasks';
import { notificationService } from '../../src/services/notificationService';

// Mock dos serviços
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../src/services/notificationService');

describe('useTasks Hook', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
  const mockNotificationService = notificationService as jest.Mocked<typeof notificationService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue('[]');
    mockAsyncStorage.setItem.mockResolvedValue();
    mockNotificationService.scheduleNotification.mockResolvedValue('notification-id');
    mockNotificationService.cancelNotification.mockResolvedValue();
  });

  test('deve carregar tarefas do AsyncStorage na inicialização', async () => {
    const mockTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Tarefa Teste',
        description: 'Descrição',
        completed: false,
        priority: 'medium',
        category: 'Test',
        createdAt: new Date(),
        dueDate: new Date(),
      },
    ];

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockTasks));

    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.tasks).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tasks).toEqual(mockTasks);
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@plantmanager:tasks');
  });

  test('deve salvar nova tarefa com sucesso', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    await waitForNextUpdate();

    const newTask = {
      title: 'Nova Tarefa',
      description: 'Descrição da nova tarefa',
      priority: 'high' as const,
      category: 'Trabalho',
      dueDate: new Date(Date.now() + 3600000),
    };

    await act(async () => {
      const savedTask = await result.current.saveTask(newTask);
      expect(savedTask).toBeTruthy();
      expect(savedTask?.id).toBeTruthy();
      expect(savedTask?.title).toBe(newTask.title);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe(newTask.title);
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@plantmanager:tasks',
      expect.stringContaining('Nova Tarefa')
    );
  });

  test('deve agendar notificação ao salvar tarefa com data futura', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    await waitForNextUpdate();

    const futureDate = new Date(Date.now() + 3600000); // 1 hora no futuro
    const newTask = {
      title: 'Tarefa Agendada',
      description: 'Descrição',
      priority: 'medium' as const,
      category: 'Test',
      dueDate: futureDate,
    };

    await act(async () => {
      await result.current.saveTask(newTask);
    });

    expect(mockNotificationService.scheduleNotification).toHaveBeenCalledWith({
      id: expect.any(String),
      title: expect.stringContaining('Lembrete'),
      body: expect.stringContaining('Tarefa Agendada'),
      data: expect.objectContaining({ taskId: expect.any(String) }),
      trigger: {
        type: 'date',
        date: futureDate,
      },
    });
  });

  test('deve marcar tarefa como concluída', async () => {
    const mockTask: Task = {
      id: 'task-1',
      title: 'Tarefa Teste',
      description: 'Descrição',
      completed: false,
      priority: 'medium',
      category: 'Test',
      createdAt: new Date(),
      dueDate: new Date(),
    };

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockTask]));

    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    await waitForNextUpdate();

    await act(async () => {
      const success = await result.current.toggleTaskComplete('task-1');
      expect(success).toBe(true);
    });

    expect(result.current.tasks[0].completed).toBe(true);
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@plantmanager:tasks',
      expect.stringMatching(/"completed":true/)
    );
  });

  test('deve remover tarefa com sucesso', async () => {
    const mockTask: Task = {
      id: 'task-1',
      title: 'Tarefa Teste',
      description: 'Descrição',
      completed: false,
      priority: 'medium',
      category: 'Test',
      createdAt: new Date(),
      dueDate: new Date(),
    };

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockTask]));

    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    await waitForNextUpdate();

    await act(async () => {
      const success = await result.current.deleteTask('task-1');
      expect(success).toBe(true);
    });

    expect(result.current.tasks).toHaveLength(0);
    expect(mockNotificationService.cancelNotification).toHaveBeenCalledWith('task-1');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@plantmanager:tasks',
      '[]'
    );
  });

  test('deve filtrar tarefas por categoria', async () => {
    const mockTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Tarefa Trabalho',
        description: 'Descrição',
        completed: false,
        priority: 'medium',
        category: 'Trabalho',
        createdAt: new Date(),
        dueDate: new Date(),
      },
      {
        id: 'task-2',
        title: 'Tarefa Pessoal',
        description: 'Descrição',
        completed: false,
        priority: 'medium',
        category: 'Pessoal',
        createdAt: new Date(),
        dueDate: new Date(),
      },
    ];

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockTasks));

    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    await waitForNextUpdate();

    const workTasks = result.current.getTasksByCategory('Trabalho');
    expect(workTasks).toHaveLength(1);
    expect(workTasks[0].category).toBe('Trabalho');

    const personalTasks = result.current.getTasksByCategory('Pessoal');
    expect(personalTasks).toHaveLength(1);
    expect(personalTasks[0].category).toBe('Pessoal');
  });

  test('deve obter estatísticas corretas', async () => {
    const mockTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Tarefa Concluída',
        description: 'Descrição',
        completed: true,
        priority: 'high',
        category: 'Trabalho',
        createdAt: new Date(),
        dueDate: new Date(),
      },
      {
        id: 'task-2',
        title: 'Tarefa Pendente',
        description: 'Descrição',
        completed: false,
        priority: 'medium',
        category: 'Pessoal',
        createdAt: new Date(),
        dueDate: new Date(),
      },
      {
        id: 'task-3',
        title: 'Outra Pendente',
        description: 'Descrição',
        completed: false,
        priority: 'low',
        category: 'Trabalho',
        createdAt: new Date(),
        dueDate: new Date(),
      },
    ];

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockTasks));

    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    await waitForNextUpdate();

    const stats = result.current.getTaskStats();
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(2);
    expect(stats.completionRate).toBe(33.33);
  });

  test('deve lidar com erro ao salvar tarefa', async () => {
    mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    await waitForNextUpdate();

    await act(async () => {
      const savedTask = await result.current.saveTask({
        title: 'Tarefa Teste',
        description: 'Descrição',
        priority: 'medium',
        category: 'Test',
        dueDate: new Date(),
      });
      expect(savedTask).toBeNull();
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  test('deve lidar com erro ao carregar tarefas', async () => {
    mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tasks).toEqual([]);
  });

  test('deve buscar tarefas por ID', async () => {
    const mockTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Tarefa Teste',
        description: 'Descrição',
        completed: false,
        priority: 'medium',
        category: 'Test',
        createdAt: new Date(),
        dueDate: new Date(),
      },
    ];

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockTasks));

    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    await waitForNextUpdate();

    const task = result.current.getTaskById('task-1');
    expect(task).toBeTruthy();
    expect(task?.id).toBe('task-1');

    const nonExistentTask = result.current.getTaskById('non-existent');
    expect(nonExistentTask).toBeUndefined();
  });
});
