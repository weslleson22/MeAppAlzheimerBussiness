import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GameBoard from './GameBoard';
import { VictoryScreen } from './VictoryScreen';
import { MemoryDashboard } from './MemoryDashboard';
import { Button } from '../../components/Button';
import { saveMemoryGameResult } from '../../../libs/storage';

interface CardObject {
  id: number;
  text: string;
  matched: boolean;
}

type GameLevel = 'easy' | 'medium' | 'hard';
type GameState = 'playing' | 'victory' | 'dashboard';

export function MemoryGame() {
  const [cards, setCards] = useState<CardObject[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [lockBoard, setLockBoard] = useState(false);
  const [level, setLevel] = useState<GameLevel>('easy');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [stars, setStars] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [mistakes, setMistakes] = useState(0);
  const [moveTimestamps, setMoveTimestamps] = useState<number[]>([]);

  useEffect(() => {
    initializeGame();
  }, [level]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (flippedIds.length !== 2) return;

    const firstCard = cards.find(card => card.id === flippedIds[0]);
    const secondCard = cards.find(card => card.id === flippedIds[1]);

    if (!firstCard || !secondCard) return;

    setLockBoard(true);
    setMoves(prev => prev + 1);
    setMoveTimestamps(prev => [...prev, Date.now()]);

    const isMatch = firstCard.text === secondCard.text;

    if (isMatch) {
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, matched: true }
            : card
        )
      );
      setScore(prev => prev + 1);
    } else {
      setMistakes(prev => prev + 1);
    }

    const timeout = setTimeout(() => {
      setFlippedIds([]);
      setLockBoard(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [flippedIds, cards]);

  useEffect(() => {
    const totalPairs = getLevelConfig(level).pairs;
    if (score === totalPairs && score > 0) {
      const calculatedStars = calculateStars();
      setStars(calculatedStars);
      setGameState('victory');
      saveGameResult(calculatedStars);
    }
  }, [score]);

  const getLevelConfig = (level: GameLevel) => {
    switch (level) {
      case 'easy': return { pairs: 4, symbols: ['🍎', '🍌', '🍇', '🍉'] };
      case 'medium': return { pairs: 6, symbols: ['🍎', '🍌', '🍇', '🍉', '🍊', '🍋'] };
      case 'hard': return { pairs: 8, symbols: ['🍎', '🍌', '🍇', '🍉', '🍊', '🍋', '🍓', '🥭'] };
      default: return { pairs: 4, symbols: ['🍎', '🍌', '🍇', '🍉'] };
    }
  };

  const shuffle = <T,>(array: T[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateCards = () => {
    const config = getLevelConfig(level);
    const allCards = [...config.symbols, ...config.symbols];
    return shuffle(
      allCards.map((text, index) => ({ id: index, text, matched: false }))
    );
  };

  const calculateStars = () => {
    const config = getLevelConfig(level);
    const maxMoves = config.pairs * 3;
    const maxTime = config.pairs * 30;

    let stars = 1;
    if (moves <= maxMoves * 0.8) stars++;
    if (timer <= maxTime) stars++;

    return Math.min(stars, 3);
  };

  const calculateCognitiveMetrics = () => {
    const config = getLevelConfig(level);
    const totalPairs = config.pairs;
    const accuracy = score > 0 ? (score / moves) * 100 : 0;
    const completionRate = (score / totalPairs) * 100;
    const averageTimePerMove = moves > 0 ? timer / moves : 0;
    
    // Calculate cognitive load based on performance
    let cognitiveLoad: 'low' | 'medium' | 'high' = 'low';
    if (mistakes > totalPairs * 0.5 || averageTimePerMove > 10) {
      cognitiveLoad = 'high';
    } else if (mistakes > totalPairs * 0.25 || averageTimePerMove > 5) {
      cognitiveLoad = 'medium';
    }
    
    // Calculate frustration level
    let frustrationLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
    if (mistakes > totalPairs * 0.75) {
      frustrationLevel = 'high';
    } else if (mistakes > totalPairs * 0.5) {
      frustrationLevel = 'medium';
    } else if (mistakes > totalPairs * 0.25) {
      frustrationLevel = 'low';
    }
    
    // Calculate improvement score (simplified version)
    const improvementScore = Math.max(0, Math.min(100, (accuracy * 0.6) + (completionRate * 0.4)));
    
    return {
      accuracy,
      completionRate,
      averageTimePerMove,
      cognitiveLoad,
      frustrationLevel,
      improvementScore,
    };
  };

  const saveGameResult = async (calculatedStars: number) => {
    try {
      const metrics = calculateCognitiveMetrics();
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
      
      await saveMemoryGameResult({
        level,
        score,
        moves,
        time: timer,
        stars: calculatedStars,
        averageTimePerMove: metrics.averageTimePerMove,
        mistakes,
        accuracy: metrics.accuracy,
        completionRate: metrics.completionRate,
        cognitiveLoad: metrics.cognitiveLoad,
        sessionDuration,
        frustrationLevel: metrics.frustrationLevel,
        improvementScore: metrics.improvementScore,
      });
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  const initializeGame = () => {
    setCards(generateCards());
    setFlippedIds([]);
    setScore(0);
    setMoves(0);
    setTimer(0);
    setLockBoard(false);
    setGameState('playing');
    setStars(0);
    setSessionStartTime(Date.now());
    setMistakes(0);
    setMoveTimestamps([]);
  };

  const handleCardPress = (id: number) => {
    if (lockBoard || flippedIds.includes(id)) return;
    setFlippedIds(prev => [...prev, id]);
  };

  const handleLevelChange = (newLevel: GameLevel) => {
    setLevel(newLevel);
  };

  const handlePlayAgain = () => {
    initializeGame();
  };

  const handleGoToDashboard = () => {
    setGameState('dashboard');
  };

  const handleBackToGame = () => {
    setGameState('playing');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'victory') {
    return (
      <VictoryScreen
        score={score}
        moves={moves}
        time={timer}
        stars={stars}
        level={level}
        onPlayAgain={handlePlayAgain}
        onGoToDashboard={handleGoToDashboard}
      />
    );
  }

  if (gameState === 'dashboard') {
    return <MemoryDashboard onBackToGame={handleBackToGame} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Jogo da Memória</Text>

      <View style={styles.levelContainer}>
        <Text style={styles.levelLabel}>Nível:</Text>
        <View style={styles.levelButtons}>
          <TouchableOpacity
            style={[styles.levelButton, level === 'easy' && styles.levelButtonActive]}
            onPress={() => handleLevelChange('easy')}
          >
            <Text style={[styles.levelButtonText, level === 'easy' && styles.levelButtonTextActive]}>
              Fácil
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.levelButton, level === 'medium' && styles.levelButtonActive]}
            onPress={() => handleLevelChange('medium')}
          >
            <Text style={[styles.levelButtonText, level === 'medium' && styles.levelButtonTextActive]}>
              Médio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.levelButton, level === 'hard' && styles.levelButtonActive]}
            onPress={() => handleLevelChange('hard')}
          >
            <Text style={[styles.levelButtonText, level === 'hard' && styles.levelButtonTextActive]}>
              Difícil
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.stat}>Pontuação: {score}</Text>
        <Text style={styles.stat}>Tentativas: {moves}</Text>
        <Text style={styles.stat}>Tempo: {formatTime(timer)}</Text>
      </View>

      <GameBoard cards={cards} flippedIds={flippedIds} onCardPress={handleCardPress} />

      <View style={styles.buttonContainer}>
        <Button title="Reiniciar" onPress={initializeGame} />
        <View style={styles.buttonSpacer} />
        <Button title="Dashboard" onPress={handleGoToDashboard} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  levelLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    marginRight: 16,
  },
  levelButtons: {
    flexDirection: 'row',
  },
  levelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    marginHorizontal: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  levelButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  levelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#616161',
  },
  levelButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  stat: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    marginTop: 32,
    width: '100%',
    gap: 16,
  },
  buttonSpacer: {
    height: 16,
  },
});
