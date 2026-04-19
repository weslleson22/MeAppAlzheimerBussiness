import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '../../components/Button';
import { CognitiveReport } from './CognitiveReport';
import { getMemoryGameStats, loadMemoryGameResults, MemoryGameStats, MemoryGameResult } from '../../../libs/storage';

interface DashboardProps {
  onBackToGame: () => void;
}

export function MemoryDashboard({ onBackToGame }: DashboardProps) {
  const [stats, setStats] = useState<MemoryGameStats | null>(null);
  const [recentGames, setRecentGames] = useState<MemoryGameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gameStats, games] = await Promise.all([
        getMemoryGameStats(),
        loadMemoryGameResults()
      ]);
      setStats(gameStats);
      setRecentGames(games.slice(0, 10)); // Last 10 games
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return level;
    }
  };

  const renderStars = (stars: number) => {
    return '⭐'.repeat(stars);
  };

  if (showReport) {
    return <CognitiveReport onClose={() => setShowReport(false)} />;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar dados</Text>
        <Button title="Voltar" onPress={onBackToGame} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Dashboard de Memória</Text>

      {/* Level Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Por Nível</Text>
        {Object.entries(stats.levelStats).map(([level, levelStats]) => (
          <View key={level} style={styles.levelCard}>
            <Text style={styles.levelTitle}>{getLevelText(level)}</Text>
            <View style={styles.levelStats}>
              <Text style={styles.levelStat}>Jogos: {levelStats.games}</Text>
              <Text style={styles.levelStat}>Melhor: {levelStats.bestScore}</Text>
              <Text style={styles.levelStat}>
                Tempo: {levelStats.averageTime ? formatTime(Math.round(levelStats.averageTime)) : '--:--'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Games */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimos Jogos</Text>
        {recentGames.length === 0 ? (
          <Text style={styles.noGamesText}>Nenhum jogo registrado ainda</Text>
        ) : (
          recentGames.map((game, index) => (
            <View key={game.id} style={styles.gameCard}>
              <View style={styles.gameHeader}>
                <Text style={styles.gameLevel}>{getLevelText(game.level)}</Text>
                <Text style={styles.gameStars}>{renderStars(game.stars)}</Text>
              </View>
              <View style={styles.gameStats}>
                <Text style={styles.gameStat}>Pontos: {game.score}</Text>
                <Text style={styles.gameStat}>Tentativas: {game.moves}</Text>
                <Text style={styles.gameStat}>Tempo: {formatTime(game.time)}</Text>
              </View>
              <Text style={styles.gameDate}>
                {new Date(game.date).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Overall Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalGames}</Text>
            <Text style={styles.statLabel}>Jogos Totais</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.bestScore}</Text>
            <Text style={styles.statLabel}>Melhor Pontuação</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatTime(Math.round(stats.averageTime))}</Text>
            <Text style={styles.statLabel}>Tempo Médio</Text>
          </View>
        </View>
      </View>

      {/* Cognitive Metrics Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧠 Métricas Cognitivas</Text>
        <View style={styles.cognitiveSummary}>
          <View style={styles.cognitiveItem}>
            <Text style={styles.cognitiveValue}>
              {stats.cognitiveMetrics.averageAccuracy.toFixed(1)}%
            </Text>
            <Text style={styles.cognitiveLabel}>Precisão Média</Text>
          </View>
          <View style={styles.cognitiveItem}>
            <Text style={styles.cognitiveValue}>
              {stats.cognitiveMetrics.consistencyScore.toFixed(1)}%
            </Text>
            <Text style={styles.cognitiveLabel}>Consistência</Text>
          </View>
          <View style={styles.cognitiveItem}>
            <Text style={styles.cognitiveValue}>
              {stats.cognitiveMetrics.engagementLevel === 'high' ? 'Alto' : 
               stats.cognitiveMetrics.engagementLevel === 'medium' ? 'Médio' : 'Baixo'}
            </Text>
            <Text style={styles.cognitiveLabel}>Engajamento</Text>
          </View>
        </View>
      </View>

      {/* Report Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.reportButton} onPress={() => setShowReport(true)}>
          <Text style={styles.reportButtonText}>🧠 Gerar Relatório Completo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Voltar ao Jogo" onPress={onBackToGame} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  levelCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  levelStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelStat: {
    fontSize: 14,
    color: '#666',
  },
  gameCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  gameStars: {
    fontSize: 16,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gameStat: {
    fontSize: 12,
    color: '#666',
  },
  gameDate: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
  },
  noGamesText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#f44336',
    marginBottom: 20,
  },
  cognitiveSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cognitiveItem: {
    alignItems: 'center',
    flex: 1,
  },
  cognitiveValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 4,
  },
  cognitiveLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  reportButton: {
    backgroundColor: '#9C27B0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});