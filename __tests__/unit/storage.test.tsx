import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('Storage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve salvar item no storage', async () => {
    mockAsyncStorage.setItem.mockResolvedValue();
    
    await mockAsyncStorage.setItem('@test:key', 'test-value');
    
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('@test:key', 'test-value');
  });

  test('deve recuperar item do storage', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('test-value');
    
    const result = await mockAsyncStorage.getItem('@test:key');
    
    expect(result).toBe('test-value');
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@test:key');
  });

  test('deve remover item do storage', async () => {
    mockAsyncStorage.removeItem.mockResolvedValue();
    
    await mockAsyncStorage.removeItem('@test:key');
    
    expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('@test:key');
  });

  test('deve lidar com item não encontrado', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);
    
    const result = await mockAsyncStorage.getItem('@nonexistent:key');
    
    expect(result).toBeNull();
  });

  test('deve limpar todo o storage', async () => {
    mockAsyncStorage.clear.mockResolvedValue();
    
    await mockAsyncStorage.clear();
    
    expect(mockAsyncStorage.clear).toHaveBeenCalled();
  });

  test('deve lidar com erro ao salvar', async () => {
    mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));
    
    await expect(mockAsyncStorage.setItem('@test:key', 'value')).rejects.toThrow('Storage error');
  });

  test('deve salvar objeto JSON', async () => {
    const testObject = { name: 'Test', value: 123 };
    mockAsyncStorage.setItem.mockResolvedValue();
    
    await mockAsyncStorage.setItem('@test:object', JSON.stringify(testObject));
    
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('@test:object', JSON.stringify(testObject));
  });

  test('deve recuperar e parsear objeto JSON', async () => {
    const testObject = { name: 'Test', value: 123 };
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(testObject));
    
    const result = await mockAsyncStorage.getItem('@test:object');
    const parsed = JSON.parse(result || '{}');
    
    expect(parsed).toEqual(testObject);
  });
});
