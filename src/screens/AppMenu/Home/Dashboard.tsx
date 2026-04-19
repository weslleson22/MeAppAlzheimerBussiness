import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../hooks/useUser';
import { useTasks } from '../../../hooks/useTasks';
import { useAnimation } from '../../../hooks/useAnimation';
import { useAppNavigation } from '../../../hooks/useNavigation';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import { UserProfile } from '../../../components/UserProfile';
import { pdfService } from '../../../services/pdfService';

const { width } = Dimensions.get('window');

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  screen: string;
  color: string;
}

export function Dashboard() {
  const { user } = useUser();
  const { tasks, getTaskStats } = useTasks();
  const { fadeAnim, scaleAnim, fadeIn, bounce } = useAnimation();
  const { navigate } = useAppNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(getTaskStats());

  useEffect(() => {
    fadeIn(1000, 200).start();
  }, [fadeIn]);

  useEffect(() => {
    setStats(getTaskStats());
  }, [tasks, getTaskStats]);

  const onRefresh = async () => {
    setRefreshing(true);
    bounce();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const generateTaskReport = async () => {
    try {
      await pdfService.generateTaskReport();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório de tarefas.');
    }
  };

  const generateHealthReport = async () => {
    try {
      await pdfService.generateHealthReport();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório de saúde.');
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Jogos',
      description: 'Exercícios cognitivos',
      icon: 'game-controller-outline',
      screen: 'GamersSelect',
      color: colors.blue,
    },
    {
      id: '2',
      title: 'Tarefas',
      description: 'Gerenciar atividades',
      icon: 'list-outline',
      screen: 'TarefasSelect',
      color: colors.green,
    },
    {
      id: '3',
      title: 'Alimentação',
      description: 'Registro alimentar',
      icon: 'restaurant-outline',
      screen: 'AppAlimentosIa',
      color: colors.red,
    },
    {
      id: '4',
      title: 'Endereços',
      description: 'Locais importantes',
      icon: 'location-outline',
      screen: 'TelaEndereco',
      color: colors.blue1,
    },
    {
      id: '5',
      title: 'Relatórios',
      description: 'Gerar relatórios',
      icon: 'document-text-outline',
      screen: 'Reports',
      color: colors.red,
    },
  ];

  const handleQuickAction = (action: QuickAction) => {
    bounce();
    navigate(action.screen as any);
  };

  const renderQuickAction = (action: QuickAction, index: number) => (
    <TouchableOpacity
      key={action.id}
      style={[
        styles.actionCard,
        {
          backgroundColor: action.color + '10',
          borderColor: action.color,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      onPress={() => handleQuickAction(action)}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
        <Ionicons name={action.icon as any} size={28} color={colors.white} />
      </View>
      <Text style={[styles.actionTitle, { color: action.color }]}>{action.title}</Text>
      <Text style={styles.actionDescription}>{action.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.blue} />
      }
    >
      {/* Header com Perfil */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }) }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <UserProfile size="large" showEditButton={true} />
          <View style={styles.headerInfo}>
            <Text style={styles.greeting}>Bem-vindo(a)</Text>
            <Text style={styles.userName}>{user?.name || 'Visitante'}</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View
        style={[
          styles.statsSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Visão Geral</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.blue + '15', borderColor: colors.blue }]}>
            <Text style={[styles.statValue, { color: colors.blue }]}>{stats.pending}</Text>
            <Text style={styles.statTitle}>Tarefas Hoje</Text>
            <Text style={styles.statSubtitle}>Pendentes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.green + '15', borderColor: colors.green }]}>
            <Text style={[styles.statValue, { color: colors.green }]}>{stats.completed}</Text>
            <Text style={styles.statTitle}>Concluídas</Text>
            <Text style={styles.statSubtitle}>Esta semana</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.blue1 + '15', borderColor: colors.blue1 }]}>
            <Text style={[styles.statValue, { color: colors.blue1 }]}>{stats.completionRate}%</Text>
            <Text style={styles.statTitle}>Progresso</Text>
            <Text style={styles.statSubtitle}>Taxa de conclusão</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.gray + '15', borderColor: colors.gray }]}>
            <Text style={[styles.statValue, { color: colors.gray }]}>{stats.total}</Text>
            <Text style={styles.statTitle}>Total</Text>
            <Text style={styles.statSubtitle}>Todas as tarefas</Text>
          </View>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View
        style={[
          styles.actionsSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => renderQuickAction(action, index))}
        </View>
      </Animated.View>

      {/* Recent Activity */}
      <Animated.View
        style={[
          styles.recentSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Atividade Recente</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: colors.blue + '20' }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.blue} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Tarefa concluída</Text>
              <Text style={styles.activityTime}>Há 2 horas</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: colors.green + '20' }]}>
              <Ionicons name="game-controller" size={20} color={colors.green} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Jogo de memória</Text>
              <Text style={styles.activityTime}>Há 5 horas</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Motivational Quote */}
      <Animated.View
        style={[
          styles.quoteSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.quoteCard}>
          <Ionicons name="chatbubble-outline" size={24} color={colors.blue} />
          <Text style={styles.quoteText}>
            "Cada pequeno progresso é um passo em direção à conquista."
          </Text>
          <Text style={styles.quoteAuthor}>- Anônimo</Text>
        </View>
      </Animated.View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 20,
  },
  greeting: {
    fontSize: 14,
    color: colors.body_light,
    fontFamily: fonts.text,
  },
  userName: {
    fontSize: 24,
    color: colors.blue,
    fontFamily: fonts.heading,
    fontWeight: 'bold',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: colors.gray,
    fontFamily: fonts.text,
    marginTop: 4,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.blue,
    fontFamily: fonts.heading,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 50) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    position: 'relative',
  },
  statIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  statContent: {
    paddingRight: 30,
  },
  statValue: {
    fontSize: 28,
    fontFamily: fonts.heading,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 12,
    color: colors.body_dark,
    fontFamily: fonts.text,
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 10,
    color: colors.body_light,
    fontFamily: fonts.text,
  },
  trendIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: fonts.heading,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.body_light,
    fontFamily: fonts.text,
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  activityCard: {
    backgroundColor: colors.shape,
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: colors.blue,
    fontFamily: fonts.text,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: colors.body_light,
    fontFamily: fonts.text,
    marginTop: 2,
  },
  quoteSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  quoteCard: {
    backgroundColor: colors.blue_light,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    color: colors.blue,
    fontFamily: fonts.text,
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 12,
    color: colors.body_light,
    fontFamily: fonts.text,
    fontStyle: 'italic',
  },
  footer: {
    height: 20,
  },
});
