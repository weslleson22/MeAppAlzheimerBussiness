import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

type Props = {
  error: Error;
  errorInfo?: React.ErrorInfo;
  onRetry: () => void;
};

export function ErrorReport({ error, errorInfo, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ops! Algo deu errado.</Text>
      <Text style={styles.message}>{error?.message ?? 'Erro desconhecido'}</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Detalhes do erro</Text>
        <ScrollView style={styles.logBox} contentContainerStyle={styles.logContent}>
          <Text style={styles.logText}>{errorInfo?.componentStack ?? error?.stack ?? 'Nenhuma pilha de erro disponível.'}</Text>
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Reiniciar app</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.heading,
    color: colors.blue,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.body_dark,
    marginBottom: 24,
  },
  section: {
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.blue,
    marginBottom: 12,
  },
  logBox: {
    flex: 1,
    backgroundColor: colors.shape,
    borderRadius: 16,
    padding: 16,
  },
  logContent: {
    paddingBottom: 24,
  },
  logText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.body_dark,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.blue,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.white,
  },
});
