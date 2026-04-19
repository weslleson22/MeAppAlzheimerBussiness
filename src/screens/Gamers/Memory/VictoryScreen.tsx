import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/Button';
import { SoundUtils, HapticFeedback } from '../../../utils/SoundUtils';

interface VictoryScreenProps {
  score: number;
  moves: number;
  time: number;
  stars: number;
  level: 'easy' | 'medium' | 'hard';
  onPlayAgain: () => void;
  onGoToDashboard: () => void;
}

export function VictoryScreen({
  score,
  moves,
  time,
  stars,
  level,
  onPlayAgain,
  onGoToDashboard
}: VictoryScreenProps) {
  useEffect(() => {
    // Play victory sound and haptic feedback when screen loads
    SoundUtils.playSound('victory');
    HapticFeedback.success();
  }, []);

  const getLevelText = () => {
    switch (level) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return 'Fácil';
    }
  };

  const renderStars = () => {
    const starSymbols = ['⭐', '⭐⭐', '⭐⭐⭐'];
    return starSymbols[stars - 1] || '⭐';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Parabéns! 🎉</Text>
      <Text style={styles.subtitle}>Você completou o nível {getLevelText()}!</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.stars}>{renderStars()}</Text>
        <Text style={styles.score}>Pontuação: {score}</Text>
        <Text style={styles.moves}>Tentativas: {moves}</Text>
        <Text style={styles.time}>Tempo: {formatTime(time)}</Text>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          {stars === 3 ? 'Perfeito! Você é um mestre da memória!' :
           stars === 2 ? 'Muito bom! Continue treinando!' :
           'Bom trabalho! Tente melhorar na próxima vez!'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Jogar Novamente" onPress={onPlayAgain} />
        <View style={styles.buttonSpacer} />
        <Button title="Ver Estatísticas" onPress={onGoToDashboard} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 24,
    color: '#1A237E',
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  stars: {
    fontSize: 48,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 8,
  },
  moves: {
    fontSize: 20,
    color: '#424242',
    marginBottom: 6,
  },
  time: {
    fontSize: 20,
    color: '#424242',
  },
  messageContainer: {
    marginBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: '#E8F5E8',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  message: {
    fontSize: 20,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 28,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  buttonSpacer: {
    height: 16,
  },
});