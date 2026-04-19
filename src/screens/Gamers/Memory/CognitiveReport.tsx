import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { Button } from '../../components/Button';
import {
  MemoryGameStats,
  MemoryGameResult,
  loadMemoryGameResults,
  getMemoryGameStats,
} from '../../../libs/storage';

interface CognitiveReportProps {
  onClose: () => void;
}

export function CognitiveReport({ onClose }: CognitiveReportProps) {
  const [stats, setStats] = useState<MemoryGameStats | null>(null);
  const [recentGames, setRecentGames] = useState<MemoryGameResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gameStats, games] = await Promise.all([
        getMemoryGameStats(),
        loadMemoryGameResults(),
      ]);
      setStats(gameStats);
      setRecentGames(games.slice(0, 10));
    } catch (error) {
      console.error('Error loading report data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do relatório.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const generateWhatsAppReport = () => {
    if (!stats) return;

    const report = `
🧠 RELATÓRIO COGNITIVO - JOGO DA MEMÓRIA
📅 Data: ${formatDate(new Date())}

📊 ESTATÍSTICAS GERAIS:
• Total de Jogos: ${stats.totalGames}
• Melhor Pontuação: ${stats.bestScore}
• Tempo Médio: ${formatTime(Math.round(stats.averageTime))}

🎯 MÉTRICAS COGNITIVAS:
• Precisão Média: ${stats.cognitiveMetrics.averageAccuracy.toFixed(1)}%
• Erros Médios: ${stats.cognitiveMetrics.averageMistakes.toFixed(1)}
• Tempo Médio por Movimento: ${stats.cognitiveMetrics.averageTimePerMove.toFixed(1)}s
• Pontuação de Consistência: ${stats.cognitiveMetrics.consistencyScore.toFixed(1)}%
• Nível de Engajamento: ${stats.cognitiveMetrics.engagementLevel === 'high' ? 'Alto' : stats.cognitiveMetrics.engagementLevel === 'medium' ? 'Médio' : 'Baixo'}

📈 DISTRIBUIÇÃO DE CARGA COGNITIVA:
• Baixa: ${stats.cognitiveMetrics.cognitiveLoadDistribution.low} jogos
• Média: ${stats.cognitiveMetrics.cognitiveLoadDistribution.medium} jogos
• Alta: ${stats.cognitiveMetrics.cognitiveLoadDistribution.high} jogos

📋 PROGRESSO SEMANAL (Últimas 8 semanas):
${stats.weeklyProgress.map(week => 
  `• Semana ${new Date(week.week).toLocaleDateString('pt-BR')}: ${week.gamesPlayed} jogos, ${week.averageScore.toFixed(1)} pts, ${week.improvementRate > 0 ? '+' : ''}${week.improvementRate.toFixed(1)}% melhoria`
).join('\n')}

🎮 ÚLTIMOS JOGOS:
${recentGames.slice(0, 5).map(game => 
  `• ${formatDate(game.date)} - Nível ${game.level === 'easy' ? 'Fácil' : game.level === 'medium' ? 'Médio' : 'Difícil'}: ${game.score} pts, ${game.moves} movimentos, ${formatTime(game.time)}`
).join('\n')}

🔍 ANÁLISE CLÍNICA:
${generateClinicalAnalysis()}

---
Relatório gerado pelo aplicativo MeApp Alzheimer Business
Para mais informações, contate o especialista responsável.
    `.trim();

    return report;
  };

  const generateClinicalAnalysis = () => {
    if (!stats || stats.totalGames === 0) return 'Dados insuficientes para análise clínica.';

    const { cognitiveMetrics } = stats;
    let analysis = [];

    // Análise de precisão
    if (cognitiveMetrics.averageAccuracy >= 80) {
      analysis.push('• Alta precisão cognitiva mantida');
    } else if (cognitiveMetrics.averageAccuracy >= 60) {
      analysis.push('• Precisão cognitiva moderada com potencial de melhoria');
    } else {
      analysis.push('• Precisão cognitiva abaixo do esperado - recomendada avaliação');
    }

    // Análise de consistência
    if (cognitiveMetrics.consistencyScore >= 80) {
      analysis.push('• Desempenho consistente e estável');
    } else if (cognitiveMetrics.consistencyScore >= 60) {
      analysis.push('• Desempenho moderadamente consistente');
    } else {
      analysis.push('• Desempenho inconsistente - possível flutuação cognitiva');
    }

    // Análise de carga cognitiva
    const totalLoad = cognitiveMetrics.cognitiveLoadDistribution.low + 
                    cognitiveMetrics.cognitiveLoadDistribution.medium + 
                    cognitiveMetrics.cognitiveLoadDistribution.high;
    
    if (totalLoad > 0) {
      const highLoadRatio = cognitiveMetrics.cognitiveLoadDistribution.high / totalLoad;
      if (highLoadRatio > 0.3) {
        analysis.push('• Alta frequência de carga cognitiva elevada - monitoramento recomendado');
      } else if (highLoadRatio > 0.15) {
        analysis.push('• Carga cognitiva moderada durante as atividades');
      } else {
        analysis.push('• Carga cognitiva geralmente baixa - bom desempenho');
      }
    }

    // Análise de engajamento
    if (cognitiveMetrics.engagementLevel === 'high') {
      analysis.push('• Alto nível de engajamento nas atividades');
    } else if (cognitiveMetrics.engagementLevel === 'medium') {
      analysis.push('• Engajamento moderado nas atividades');
    } else {
      analysis.push('• Baixo engajamento - possível desmotivação ou dificuldade');
    }

    return analysis.join('\n');
  };

  const shareViaWhatsApp = async () => {
    const report = generateWhatsAppReport();
    if (!report) return;
    
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(report)}`;
    
    try {
      await Linking.openURL(whatsappUrl);
    } catch (error) {
      Alert.alert(
        'WhatsApp não encontrado',
        'Por favor, instale o WhatsApp para compartilhar o relatório.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
    }
  };

  const shareReport = async () => {
    const report = generateWhatsAppReport();
    if (!report) return;
    
    try {
      await Share.share({
        message: report,
        title: 'Relatório Cognitivo - Jogo da Memória',
      });
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando relatório...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar dados</Text>
        <Button title="Voltar" onPress={onClose} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Relatório Cognitivo</Text>
        <Text style={styles.subtitle}>Análise detalhada para especialistas</Text>
      </View>

      {/* Clinical Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Resumo Clínico</Text>
        <View style={styles.clinicalCard}>
          <Text style={styles.clinicalText}>{generateClinicalAnalysis()}</Text>
        </View>
      </View>

      {/* Cognitive Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Métricas Cognitivas</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {stats.cognitiveMetrics.averageAccuracy.toFixed(1)}%
            </Text>
            <Text style={styles.metricLabel}>Precisão Média</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {stats.cognitiveMetrics.consistencyScore.toFixed(1)}%
            </Text>
            <Text style={styles.metricLabel}>Consistência</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {stats.cognitiveMetrics.averageTimePerMove.toFixed(1)}s
            </Text>
            <Text style={styles.metricLabel}>Tempo/Movimento</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {stats.cognitiveMetrics.engagementLevel === 'high' ? 'Alto' : 
               stats.cognitiveMetrics.engagementLevel === 'medium' ? 'Médio' : 'Baixo'}
            </Text>
            <Text style={styles.metricLabel}>Engajamento</Text>
          </View>
        </View>
      </View>

      {/* Cognitive Load Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Distribuição de Carga Cognitiva</Text>
        <View style={styles.loadContainer}>
          <View style={styles.loadItem}>
            <View style={[styles.loadBar, { backgroundColor: '#4CAF50', flex: stats.cognitiveMetrics.cognitiveLoadDistribution.low || 1 }]} />
            <Text style={styles.loadLabel}>Baixa: {stats.cognitiveMetrics.cognitiveLoadDistribution.low}</Text>
          </View>
          <View style={styles.loadItem}>
            <View style={[styles.loadBar, { backgroundColor: '#FF9800', flex: stats.cognitiveMetrics.cognitiveLoadDistribution.medium || 1 }]} />
            <Text style={styles.loadLabel}>Média: {stats.cognitiveMetrics.cognitiveLoadDistribution.medium}</Text>
          </View>
          <View style={styles.loadItem}>
            <View style={[styles.loadBar, { backgroundColor: '#F44336', flex: stats.cognitiveMetrics.cognitiveLoadDistribution.high || 1 }]} />
            <Text style={styles.loadLabel}>Alta: {stats.cognitiveMetrics.cognitiveLoadDistribution.high}</Text>
          </View>
        </View>
      </View>

      {/* Weekly Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Progresso Semanal</Text>
        {stats.weeklyProgress.length === 0 ? (
          <Text style={styles.noDataText}>Dados insuficientes para análise semanal</Text>
        ) : (
          stats.weeklyProgress.slice(0, 4).map((week, index) => (
            <View key={week.week} style={styles.weekCard}>
              <Text style={styles.weekDate}>
                {new Date(week.week).toLocaleDateString('pt-BR')}
              </Text>
              <View style={styles.weekStats}>
                <Text style={styles.weekStat}>Jogos: {week.gamesPlayed}</Text>
                <Text style={styles.weekStat}>Pontuação: {week.averageScore.toFixed(1)}</Text>
                <Text style={[
                  styles.weekStat,
                  { color: week.improvementRate >= 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  {week.improvementRate > 0 ? '+' : ''}{week.improvementRate.toFixed(1)}%
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Share Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📤 Compartilhar Relatório</Text>
        <View style={styles.shareContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={shareViaWhatsApp}>
            <Text style={styles.shareButtonText}>📱 WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={shareReport}>
            <Text style={styles.shareButtonText}>📋 Outros</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Fechar Relatório" onPress={onClose} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  clinicalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clinicalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  loadContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadBar: {
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    minWidth: 40,
  },
  loadLabel: {
    fontSize: 14,
    color: '#2c3e50',
  },
  weekCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  weekDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weekStats: {
    flexDirection: 'row',
    gap: 16,
  },
  weekStat: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  shareContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 50,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#e74c3c',
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});
