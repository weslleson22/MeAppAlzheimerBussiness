import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../../../hooks/useNavigation';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

export function ReportsScreen() {
  const { goBack } = useAppNavigation();

  const handleGenerateReport = () => {
    Alert.alert('Relatório', 'Relatório gerado com sucesso!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.blue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo aos Relatórios</Text>
        <Text style={styles.subtitle}>
          Aqui você pode visualizar e gerar relatórios das suas atividades.
        </Text>

        <TouchableOpacity style={styles.reportButton} onPress={handleGenerateReport}>
          <Ionicons name="document-text-outline" size={24} color={colors.white} />
          <Text style={styles.reportButtonText}>Gerar Relatório</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Estatísticas Rápidas</Text>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Tarefas Concluídas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Refeições Analisadas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Jogos Jogados</Text>
          </View>
        </View>
      </View>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.blue,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.body_dark,
    textAlign: 'center',
    marginBottom: 30,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  reportButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.heading,
    marginLeft: 10,
  },
  statsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.blue,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.green,
  },
  statLabel: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.body_dark,
  },
});
