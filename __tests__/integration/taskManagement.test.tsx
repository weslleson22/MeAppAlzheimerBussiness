import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../../src/hooks/useTasks';
import { notificationService } from '../../src/services/notificationService';

// Mock dos serviços
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../src/services/notificationService');

describe('Integração: Gerenciamento de Tarefas', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
  const mockNotificationService = notificationService as jest.Mocked<typeof notificationService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue('{}');
    mockAsyncStorage.setItem.mockResolvedValue();
    mockNotificationService.scheduleNotification.mockResolvedValue('notification-id');
  });

  test('fluxo completo: criar tarefa, agendar notificação e salvar no storage', async () => {
    // Componente simulado de criação de tarefa
    const TaskCreationComponent = () => {
      const [title, setTitle] = React.useState('');
      const [description, setDescription] = React.useState('');
      
      const handleCreateTask = async () => {
        const taskData = {
          title,
          description,
          completed: false,
          priority: 'medium' as const,
          category: 'Test',
          dueDate: new Date(Date.now() + 3600000), // 1 hora no futuro
        };

        // Simular salvamento
        const task: Task = {
          ...taskData,
          id: 'task-123',
          createdAt: new Date(),
        };

        // Salvar no storage
        await mockAsyncStorage.setItem('@plantmanager:tasks', JSON.stringify([task]));

        // Agendar notificação
        await mockNotificationService.scheduleNotification({
          id: task.id,
          title: 'Lembrete de Tarefa',
          body: `Está na hora de: ${task.title}`,
          trigger: {
            type: 'date' as const,
            date: task.dueDate,
          },
        });
      };

      return (
        <View>
          <TextInput
            testID="task-title"
            value={title}
            onChangeText={setTitle}
            placeholder="Título da tarefa"
          />
          <TextInput
            testID="task-description"
            value={description}
            onChangeText={setDescription}
            placeholder="Descrição da tarefa"
          />
          <TouchableOpacity testID="create-task" onPress={handleCreateTask}>
            <Text>Criar Tarefa</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const { getByTestId } = render(<TaskCreationComponent />);

    // Preencher formulário
    fireEvent.changeText(getByTestId('task-title'), 'Tarefa de Teste');
    fireEvent.changeText(getByTestId('task-description'), 'Descrição da tarefa de teste');

    // Criar tarefa
    fireEvent.press(getByTestId('create-task'));

    // Verificar se a tarefa foi salva no storage
    await waitFor(() => {
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantmanager:tasks',
        expect.stringContaining('Tarefa de Teste')
      );
    });

    // Verificar se a notificação foi agendada
    expect(mockNotificationService.scheduleNotification).toHaveBeenCalledWith({
      id: 'task-123',
      title: 'Lembrete de Tarefa',
      body: 'Está na hora de: Tarefa de Teste',
      trigger: {
        type: 'date',
        date: expect.any(Date),
      },
    });
  });

  test('fluxo: carregar tarefas do storage e exibir na lista', async () => {
    const mockTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Tarefa 1',
        description: 'Descrição 1',
        completed: false,
        priority: 'high',
        category: 'Trabalho',
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 3600000),
      },
      {
        id: 'task-2',
        title: 'Tarefa 2',
        description: 'Descrição 2',
        completed: true,
        priority: 'low',
        category: 'Pessoal',
        createdAt: new Date(),
      },
    ];

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockTasks));

    // Componente simulado de lista de tarefas
    const TaskListComponent = () => {
      const [tasks, setTasks] = React.useState<Task[]>([]);

      React.useEffect(() => {
        const loadTasks = async () => {
          const data = await mockAsyncStorage.getItem('@plantmanager:tasks');
          if (data) {
            const parsedTasks = JSON.parse(data);
            setTasks(parsedTasks);
          }
        };
        loadTasks();
      }, []);

      return (
        <View testID="task-list">
          {tasks.map(task => (
            <View key={task.id} testID={`task-${task.id}`}>
              <Text testID={`task-title-${task.id}`}>{task.title}</Text>
              <Text testID={`task-completed-${task.id}`}>
                {task.completed ? 'Concluída' : 'Pendente'}
              </Text>
            </View>
          ))}
        </View>
      );
    };

    const { getByTestId } = render(<TaskListComponent />);

    // Esperar carregar as tarefas
    await waitFor(() => {
      expect(getByTestId('task-title-task-1')).toBeTruthy();
      expect(getByTestId('task-title-task-2')).toBeTruthy();
    });

    // Verificar conteúdo das tarefas
    expect(getByTestId('task-title-task-1').props.children).toBe('Tarefa 1');
    expect(getByTestId('task-completed-task-1').props.children).toBe('Pendente');
    expect(getByTestId('task-title-task-2').props.children).toBe('Tarefa 2');
    expect(getByTestId('task-completed-task-2').props.children).toBe('Concluída');
  });

  test('fluxo: marcar tarefa como concluída e atualizar storage', async () => {
    const mockTask: Task = {
      id: 'task-1',
      title: 'Tarefa Teste',
      description: 'Descrição',
      completed: false,
      priority: 'medium',
      category: 'Test',
      createdAt: new Date(),
    };

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockTask]));

    // Componente simulado
    const TaskItemComponent = ({ task }: { task: Task }) => {
      const [isCompleted, setIsCompleted] = React.useState(task.completed);

      const handleToggleComplete = async () => {
        const updatedTask = { ...task, completed: !isCompleted };
        setIsCompleted(!isCompleted);

        // Atualizar no storage
        const data = await mockAsyncStorage.getItem('@plantmanager:tasks');
        const tasks = JSON.parse(data || '[]');
        const updatedTasks = tasks.map((t: Task) => 
          t.id === task.id ? updatedTask : t
        );
        await mockAsyncStorage.setItem('@plantmanager:tasks', JSON.stringify(updatedTasks));
      };

      return (
        <View testID="task-item">
          <Text testID="task-title">{task.title}</Text>
          <TouchableOpacity testID="toggle-complete" onPress={handleToggleComplete}>
            <Text>{isCompleted ? 'Desmarcar' : 'Concluir'}</Text>
          </TouchableOpacity>
          <Text testID="task-status">
            {isCompleted ? 'Concluída' : 'Pendente'}
          </Text>
        </View>
      );
    };

    const { getByTestId } = render(<TaskItemComponent task={mockTask} />);

    // Estado inicial
    expect(getByTestId('task-status').props.children).toBe('Pendente');

    // Marcar como concluída
    fireEvent.press(getByTestId('toggle-complete'));

    // Verificar atualização
    await waitFor(() => {
      expect(getByTestId('task-status').props.children).toBe('Concluída');
    });

    // Verificar se foi atualizado no storage
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@plantmanager:tasks',
      expect.stringMatching(/"completed":true/)
    );
  });

  test('fluxo: remover tarefa e cancelar notificação', async () => {
    const mockTask: Task = {
      id: 'task-1',
      title: 'Tarefa para Remover',
      description: 'Descrição',
      completed: false,
      priority: 'medium',
      category: 'Test',
      createdAt: new Date(),
    };

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([mockTask]));
    mockNotificationService.cancelNotification.mockResolvedValue();

    // Componente simulado
    const TaskItemComponent = ({ task }: { task: Task }) => {
      const handleRemove = async () => {
        // Cancelar notificação
        await mockNotificationService.cancelNotification(task.id);

        // Remover do storage
        const data = await mockAsyncStorage.getItem('@plantmanager:tasks');
        const tasks = JSON.parse(data || '[]');
        const updatedTasks = tasks.filter((t: Task) => t.id !== task.id);
        await mockAsyncStorage.setItem('@plantmanager:tasks', JSON.stringify(updatedTasks));
      };

      return (
        <View testID="task-item">
          <Text testID="task-title">{task.title}</Text>
          <TouchableOpacity testID="remove-task" onPress={handleRemove}>
            <Text>Remover</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const { getByTestId, queryByTestId } = render(<TaskItemComponent task={mockTask} />);

    // Verificar que a tarefa existe
    expect(getByTestId('task-title').props.children).toBe('Tarefa para Remover');

    // Remover tarefa
    fireEvent.press(getByTestId('remove-task'));

    // Verificar se a notificação foi cancelada
    expect(mockNotificationService.cancelNotification).toHaveBeenCalledWith('task-1');

    // Verificar se foi removida do storage
    await waitFor(() => {
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@plantmanager:tasks',
        '[]'
      );
    });
  });

  test('fluxo: erro ao salvar tarefa deve tratar exceção', async () => {
    mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

    const TaskCreationComponent = () => {
      const [error, setError] = React.useState<string | null>(null);

      const handleCreateTask = async () => {
        try {
          await mockAsyncStorage.setItem('@plantmanager:tasks', JSON.stringify([{}]));
        } catch (err) {
          setError('Erro ao salvar tarefa');
        }
      };

      return (
        <View>
          <TouchableOpacity testID="create-task" onPress={handleCreateTask}>
            <Text>Criar Tarefa</Text>
          </TouchableOpacity>
          {error && <Text testID="error-message">{error}</Text>}
        </View>
      );
    };

    const { getByTestId, queryByTestId } = render(<TaskCreationComponent />);

    fireEvent.press(getByTestId('create-task'));

    await waitFor(() => {
      expect(queryByTestId('error-message')).toBeTruthy();
      expect(getByTestId('error-message').props.children).toBe('Erro ao salvar tarefa');
    });
  });
});
