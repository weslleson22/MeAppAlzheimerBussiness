import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../hooks/useUser';
import { useTasks } from '../../../hooks/useTasks';
import { useAnimation } from '../../../hooks/useAnimation';
import { useAppNavigation } from '../../../hooks/useNavigation';
import { pdfService } from '../../../services/pdfService';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

interface ReportStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  mealsAnalyzed: number;
  vegetablesDetected: number;
  gamesPlayed: number;
  averageScore: number;
}

export function ReportsScreen() {
  const { user } = useUser();
  const { tasks, getTaskStats } = useTasks();
  const { fadeAnim, scaleAnim, fadeIn, bounce } = useAnimation();
  const { goBack } = useAppNavigation();
  
  const [stats, setStats] = useState<ReportStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    mealsAnalyzed: 0,
    vegetablesDetected: 0,
    gamesPlayed: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fadeIn(1000, 200).start();
    loadStats();
  }, [fadeIn]);

  const loadStats = () => {
    const taskStats = getTaskStats();
    setStats({
      totalTasks: taskStats.total,
      completedTasks: taskStats.completed,
      pendingTasks: taskStats.pending,
      completionRate: taskStats.completionRate,
      mealsAnalyzed: 45, // Simulado - viria do storage
      vegetablesDetected: 32, // Simulado - viria do storage
      gamesPlayed: 12, // Simulado - viria do storage
      averageScore: 78, // Simulado - viria do storage
    });
  };

  const generateTaskReport = async () => {
    setLoading(true);
    try {
      await pdfService.generateTaskReport();
      bounce();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório de tarefas.');
    } finally {
      setLoading(false);
    }
  };

  const generateHealthReport = async () => {
    setLoading(true);
    try {
      await pdfService.generateHealthReport();
      bounce();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório de saúde.');
    } finally {
      setLoading(false);
    }
  };

  const generateCompleteReport = async () => {
    setLoading(true);
    try {
      // Gerar relatório completo combinado
      Alert.alert('Relatório Completo', 'Relatório completo gerado com sucesso! (Em produção, seria salvo como PDF)');
      bounce();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório completo.');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }: any) => (
    <View style={[styles.statCard, { backgroundColor: color + '10' }]}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={colors.white} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const ReportButton = ({ title, icon, onPress, color }: any) => (
    <TouchableOpacity
      style={[styles.reportButton, { backgroundColor: color }]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Ionicons name={icon} size={24} color={colors.white} />
      )}
      <Text style={styles.reportButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.blue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Perfil do Usuário */}
        <Animated.View 
          style={[
            styles.profileSection,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Perfil do Usuário</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Usuário'}</Text>
              <Text style={styles.profileSubtitle}>Relatórios e Estatísticas</Text>
            </View>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={32} color={colors.blue} />
            </View>
          </View>
        </Animated.View>

        {/* Estatísticas Gerais */}
        <Animated.View 
          style={[
            styles.statsSection,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Tarefas Totais"
              value={stats.totalTasks}
              icon="list-outline"
              color={colors.blue}
            />
            <StatCard
              title="Concluídas"
              value={stats.completedTasks}
              icon="checkmark-circle-outline"
              color={colors.green}
            />
            <StatCard
              title="Taxa de Conclusão"
              value={`${stats.completionRate.toFixed(1)}%`}
              icon="trending-up-outline"
              color={colors.green_dark}
            />
            <StatCard
              title="Refeições Analisadas"
              value={stats.mealsAnalyzed}
              icon="restaurant-outline"
              color={colors.red}
            />
            <StatCard
              title="Vegetais Detectados"
              value={stats.vegetablesDetected}
              icon="leaf-outline"
              color={colors.green}
              subtitle={`${((stats.vegetablesDetected / stats.mealsAnalyzed) * 100).toFixed(1)}%`}
            />
            <StatCard
              title="Jogos Jogados"
              value={stats.gamesPlayed}
              icon="game-controller-outline"
              color={colors.blue1}
            />
          </View>
        </Animated.View>

        {/* Relatórios Disponíveis */}
        <Animated.View 
          style={[
            styles.reportsSection,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Gerar Relatórios</Text>
          <View style={styles.reportsGrid}>
            <ReportButton
              title="Relatório de Tarefas"
              icon="document-text-outline"
              onPress={generateTaskReport}
              color={colors.blue}
            />
            <ReportButton
              title="Relatório de Saúde"
              icon="heart-outline"
              onPress={generateHealthReport}
              color={colors.green}
            />
            <ReportButton
              title="Relatório Completo"
              icon="documents-outline"
              onPress={generateCompleteReport}
              color={colors.red}
            />
          </View>
        </Animated.View>

        {/* Informações Adicionais */}
        <Animated.View 
          style={[
            styles.infoSection,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Informações Adicionais</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="information-circle-outline" size={20} color={colors.blue} />
              <Text style={styles.infoText}>
                Os relatórios são gerados com base em suas atividades no aplicativo.
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="download-outline" size={20} color={colors.green} />
              <Text style={styles.infoText}>
                Relatórios podem ser compartilhados com familiares e médicos.
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.red} />
              <Text style={styles.infoText}>
                Seus dados são mantidos em segurança e privacidade.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.shape,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.shape,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.blue,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.blue,
    marginBottom: 15,
  },
  profileSection: {
    marginBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.blue,
    marginBottom: 5,
  },
  profileSubtitle: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.body_dark,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.shape,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 50) / 2,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.blue,
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.body_dark,
  },
  statSubtitle: {
    fontSize: 10,
    fontFamily: fonts.text,
    color: colors.green,
    marginTop: 2,
  },
  reportsSection: {
    marginBottom: 30,
  },
  reportsGrid: {
    gap: 15,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.heading,
    marginLeft: 10,
  },
  infoSection: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoItemLast: {
    marginBottom: 0,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.body_dark,
    marginLeft: 10,
    lineHeight: 20,
  },
});
