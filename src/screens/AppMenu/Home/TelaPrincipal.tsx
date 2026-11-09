import { useNavigation } from "@react-navigation/core";
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgUri } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView } from "react-native-gesture-handler";
import { useAppNavigation } from '../../../hooks/useNavigation';
import { useUser } from '../../../hooks/useUser';
import { useFocusEffect } from '@react-navigation/native';

const DefaultUserImg = require('../../../../assets/idoso.png');

export function TelaPrincipal() {
  const { navigate } = useAppNavigation();
  const { user, refreshUser } = useUser();
  const [userName, setUserName] = useState<string>();
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  // 10 sugestões do dia com imagens reais
  const dailySuggestions = [
    {
      id: 1,
      title: "Omelete de Legumes",
      description: "Refeição leve e nutritiva",
      image: "https://images.unsplash.com/photo-1512058404314-fcf0e1a8a9a8?w=400&h=300&fit=crop",
      time: "15 min",
      difficulty: "Fácil"
    },
    {
      id: 2,
      title: "Salada de Frutas",
      description: "Vitaminas e energia para o dia",
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop",
      time: "10 min",
      difficulty: "Fácil"
    },
    {
      id: 3,
      title: "Sopa de Legumes",
      description: "Confortante e nutritiva",
      image: "https://images.unsplash.com/photo-1547592166-3ac9de2ae1c3?w=400&h=300&fit=crop",
      time: "30 min",
      difficulty: "Médio"
    },
    {
      id: 4,
      title: "Sanduíche Natural",
      description: "Lanche rápido e saudável",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
      time: "5 min",
      difficulty: "Fácil"
    },
    {
      id: 5,
      title: "Vitamina de Banana",
      description: "Energia e nutrientes",
      image: "https://images.unsplash.com/photo-1502741126161-b048600d5733?w=400&h=300&fit=crop",
      time: "5 min",
      difficulty: "Fácil"
    },
    {
      id: 6,
      title: "Arroz com Feijão",
      description: "Prato tradicional brasileiro",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c7?w=400&h=300&fit=crop",
      time: "40 min",
      difficulty: "Médio"
    },
    {
      id: 7,
      title: "Torta de Frango",
      description: "Refeição completa e saborosa",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
      time: "45 min",
      difficulty: "Médio"
    },
    {
      id: 8,
      title: "Salada Caesar",
      description: "Clássica e refrescante",
      image: "https://images.unsplash.com/photo-1550304943-4f24f20dd23f?w=400&h=300&fit=crop",
      time: "15 min",
      difficulty: "Fácil"
    },
    {
      id: 9,
      title: "Macarrão ao Molho",
      description: "Tradicional e reconfortante",
      image: "https://images.unsplash.com/photo-1563379091339-03246996d9f0?w=400&h=300&fit=crop",
      time: "25 min",
      difficulty: "Fácil"
    },
    {
      id: 10,
      title: "Frango Assado",
      description: "Proteína de qualidade",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      time: "60 min",
      difficulty: "Médio"
    }
  ];

  // Auto-rotate suggestions every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % dailySuggestions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSuggestion = () => {
    setCurrentSuggestion((prev) => (prev + 1) % dailySuggestions.length);
  };

  const prevSuggestion = () => {
    setCurrentSuggestion((prev) => (prev - 1 + dailySuggestions.length) % dailySuggestions.length);
  };

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      // Refresh user data when screen comes into focus
      refreshUser();
    }, [refreshUser])
  );

  function handlerReceitasFaceis() {
    navigate("TelaAlimentos");
  }

  function handlerPlanoAlimentar() {
    navigate("TarefasSelect");
  }

  function handlerVerReceita() {
    Alert.alert("Receita", "Omelete de Legumes - Ver detalhes da receita");
  }

  function handlerVamosCozinhar() {
    Alert.alert("Cozinhar", "Iniciar modo de preparo passo a passo");
  }

  function handlerListaCompras() {
    Alert.alert("Lista de Compras", "Abrir lista de compras");
  }

  function handlerDicasMemoria() {
    navigate("MemoryGame");
  }

  function handlerAssistente() {
    (navigate as any)("AIAssistant");
  }

  function handlerProfile() {
    navigate("Settings");
  }

  // Original functions for missing features
  function handlerTarefas() {
    navigate("TarefasSelect");
  }

  function handlerEndereco() {
    navigate("TelaEndereco");
  }

  function handlerMemoryGame() {
    navigate("MemoryGame");
  }

  function handlerQuizGame() {
    navigate("home");
  }

  function handlerDashboard() {
    (navigate as any)("dashboard");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mealzheimer</Text>
          <TouchableOpacity onPress={handlerProfile}>
            <Image 
              source={user?.profilePhoto ? { uri: user.profilePhoto } : DefaultUserImg} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Olá, {user?.name || userName || 'Visitante'}!</Text>
          <Text style={styles.subGreeting}>O que vamos preparar hoje?</Text>
        </View>

        {/* Main Feature Cards */}
        <View style={styles.mainCardsContainer}>
          <TouchableOpacity 
            style={[styles.mainCard, styles.receitasCard]} 
            onPress={handlerReceitasFaceis}
          >
            <Ionicons name="restaurant-outline" size={40} color={colors.white} />
            <Text style={styles.mainCardTitle}>Receitas Fáceis</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.mainCard, styles.planoCard]} 
            onPress={handlerPlanoAlimentar}
          >
            <Ionicons name="document-text-outline" size={40} color={colors.white} />
            <Text style={styles.mainCardTitle}>Plano Alimentar</Text>
          </TouchableOpacity>
        </View>

        {/* Sugestão do Dia */}
        <View style={styles.sugestaoSection}>
          <View style={styles.sugestaoHeader}>
            <Text style={styles.sectionTitle}>Sugestão do Dia</Text>
            <View style={styles.suggestionIndicator}>
              <Text style={styles.indicatorText}>
                {currentSuggestion + 1} / {dailySuggestions.length}
              </Text>
            </View>
          </View>
          
          <View style={styles.recipeCard}>
            <Image 
              source={{ uri: dailySuggestions[currentSuggestion].image }} 
              style={styles.recipeImage} 
            />
            <View style={styles.recipeContent}>
              <Text style={styles.recipeTitle}>{dailySuggestions[currentSuggestion].title}</Text>
              <Text style={styles.recipeDescriptionText}>{dailySuggestions[currentSuggestion].description}</Text>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTime}>⏱ {dailySuggestions[currentSuggestion].time}</Text>
                <Text style={styles.recipeDifficulty}>{dailySuggestions[currentSuggestion].difficulty}</Text>
              </View>
              <View style={styles.recipeActions}>
                <TouchableOpacity style={styles.recipeButton} onPress={handlerVerReceita}>
                  <Text style={styles.recipeButtonText}>Ver Receita</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.recipeButton, styles.recipeButtonSecondary]} onPress={handlerVamosCozinhar}>
                  <Text style={[styles.recipeButtonText, styles.recipeButtonTextSecondary]}>Vamos Cozinhar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.navigationControls}>
            <TouchableOpacity style={styles.navButton} onPress={prevSuggestion}>
              <Ionicons name="chevron-back" size={24} color={colors.green} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={nextSuggestion}>
              <Ionicons name="chevron-forward" size={24} color={colors.green} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Feature Cards */}
        <View style={styles.bottomCardsContainer}>
          <TouchableOpacity 
            style={[styles.bottomCard, styles.listaCard]} 
            onPress={handlerListaCompras}
          >
            <View style={styles.cardIconContainer}>
              <Ionicons name="checkbox-outline" size={24} color={colors.white} />
              <Ionicons name="nutrition-outline" size={20} color={colors.white} />
            </View>
            <Text style={styles.bottomCardTitle}>Lista de Compras</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.bottomCard, styles.dicasCard]} 
            onPress={handlerDicasMemoria}
          >
            <View style={styles.cardIconContainer}>
              <Ionicons name="school-outline" size={24} color={colors.white} />
              <Ionicons name="information-circle-outline" size={20} color={colors.white} />
            </View>
            <Text style={styles.bottomCardTitle}>Dicas de Memória</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.bottomCard, styles.assistenteCard]} 
            onPress={handlerAssistente}
          >
            <View style={styles.cardIconContainer}>
              <Ionicons name="play-circle-outline" size={30} color={colors.white} />
            </View>
            <Text style={styles.bottomCardTitle}>Assistente</Text>
          </TouchableOpacity>
        </View>

        {/* Original Features Section */}
        <View style={styles.originalFeaturesSection}>
          <Text style={styles.sectionTitle}>Mais Funcionalidades</Text>
          <View style={styles.originalCardsContainer}>
            <TouchableOpacity style={styles.originalCard} onPress={handlerEndereco}>
              <SvgUri width={60} height={60} uri="https://raw.githubusercontent.com/weslleson22/ImagensAppAlzheimer/193ecada8163d83be33876cca876bcf8a5e27426/familialogo.svg" />
              <Text style={styles.originalCardTitle}>Minha Família</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.originalCard} onPress={handlerTarefas}>
              <SvgUri width={60} height={60} uri="https://raw.githubusercontent.com/weslleson22/ImagensAppAlzheimer/e59ae627a17ed3d4a01178f78690396d31fe8f16/Minhas_Tarefas.svg" />
              <Text style={styles.originalCardTitle}>Minhas Tarefas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.originalCard} onPress={handlerMemoryGame}>
              <SvgUri width={60} height={60} uri="https://raw.githubusercontent.com/weslleson22/ImagensAppAlzheimer/3ee707d8a74261e31239b5ad8391bf0a1cc34371/jogo-para-celular.svg" />
              <Text style={styles.originalCardTitle}>Jogos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.originalCard} onPress={handlerQuizGame}>
              <SvgUri width={60} height={60} uri="https://raw.githubusercontent.com/weslleson22/ImagensAppAlzheimer/081fbe0988b8218e9fd49d127bf9dd971a52f96d/QuizApp.svg" />
              <Text style={styles.originalCardTitle}>Quiz</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.originalCard} onPress={handlerDashboard}>
              <Ionicons name="bar-chart-outline" size={50} color={colors.blue} />
              <Text style={styles.originalCardTitle}>Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color={colors.green} />
          <Text style={[styles.navText, styles.navTextActive]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color={colors.body_light} />
          <Text style={styles.navText}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handlerAssistente}>
          <Ionicons name="help-circle-outline" size={24} color={colors.body_light} />
          <Text style={styles.navText}>Ajuda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handlerProfile}>
          <Ionicons name="person-outline" size={24} color={colors.body_light} />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.green,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.heading,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.heading,
    fontFamily: fonts.heading,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.body_dark,
    fontFamily: fonts.text,
    marginTop: 4,
  },
  mainCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  mainCard: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  receitasCard: {
    backgroundColor: '#FF6B35',
  },
  planoCard: {
    backgroundColor: colors.blue,
  },
  mainCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.heading,
    marginTop: 8,
    textAlign: 'center',
  },
  sugestaoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginBottom: 16,
  },
  recipeCard: {
    backgroundColor: colors.shape,
    borderRadius: 16,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 180,
  },
  recipeContent: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: colors.body_dark,
    fontFamily: fonts.text,
    marginBottom: 16,
  },
  recipeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  verReceitaButton: {
    flex: 1,
    backgroundColor: colors.green,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  verReceitaText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: fonts.heading,
  },
  cozinharButton: {
    flex: 1,
    backgroundColor: colors.blue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cozinharText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: fonts.heading,
  },
  bottomCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 80,
  },
  bottomCard: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  listaCard: {
    backgroundColor: '#FFA726',
  },
  dicasCard: {
    backgroundColor: '#9C27B0',
  },
  assistenteCard: {
    backgroundColor: '#00ACC1',
  },
  cardIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  bottomCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.heading,
    textAlign: 'center',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.shape,
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
    color: colors.body_light,
    fontFamily: fonts.text,
  },
  navTextActive: {
    color: colors.green,
  },
  originalFeaturesSection: {
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  originalCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  originalCard: {
    backgroundColor: colors.shape,
    borderColor: colors.shape,
    height: 140,
    width: 140,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  originalCardTitle: {
    fontFamily: fonts.heading,
    textAlign: 'center',
    color: colors.blue,
    fontSize: 14,
    marginTop: 12,
  },
  sugestaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestionIndicator: {
    backgroundColor: colors.green_light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.green,
  },
  indicatorText: {
    fontSize: 12,
    color: colors.green,
    fontFamily: fonts.heading,
    fontWeight: 'bold',
  },
  recipeDescriptionText: {
    fontSize: 14,
    color: colors.body_dark,
    fontFamily: fonts.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recipeTime: {
    fontSize: 14,
    color: colors.blue,
    fontFamily: fonts.text,
    fontWeight: '500',
  },
  recipeDifficulty: {
    fontSize: 14,
    color: colors.green,
    fontFamily: fonts.text,
    fontWeight: '500',
    backgroundColor: colors.green_light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recipeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  recipeButton: {
    flex: 1,
    backgroundColor: colors.green,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  recipeButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.heading,
    fontWeight: 'bold',
  },
  recipeButtonSecondary: {
    backgroundColor: colors.shape,
    borderWidth: 1,
    borderColor: colors.green,
  },
  recipeButtonTextSecondary: {
    color: colors.green,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.shape,
    borderWidth: 1,
    borderColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
