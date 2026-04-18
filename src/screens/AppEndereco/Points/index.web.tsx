import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import fonts from '../../../styles/fonts';
import colors from '../../../styles/colors';

interface Params {
  uf: string;
  city: string;
}

export function TelaPoints() {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={30} color="#2D9CDB" />
      </TouchableOpacity>
      <Text style={styles.title}>Mapa não disponível no navegador</Text>
      <Text style={styles.description}>
        Esta tela usa o componente nativo do react-native-maps, que não roda no web.
      </Text>
      <Text style={styles.info}>
        Cidade: {routeParams?.city ?? 'não disponível'}
      </Text>
      <Text style={styles.info}>UF: {routeParams?.uf ?? 'não disponível'}</Text>
      <Text style={styles.note}>
        Use Expo Go no celular para acessar o mapa nativo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    backgroundColor: colors.background,
  },
  backButton: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.blue,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6C6C80',
    fontFamily: fonts.text,
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.blue,
    marginBottom: 8,
  },
  note: {
    marginTop: 24,
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#999',
  },
});
