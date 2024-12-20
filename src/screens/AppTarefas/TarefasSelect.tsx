import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
//import React from "react";
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollViewBase } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgUri } from 'react-native-svg';
//const logoIgm = require ("../../../assets/Tarefas.png");
import { Button } from "../components/Button";
//const UserImg = require ('../../../assets/idoso.png');
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import AsyncStorange from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView } from "react-native-gesture-handler";

export function TarefasSelect(){
  const navigation = useNavigation();
  type Nav = {
    navigate: (value: string) => void;
  }

  const { navigate } = useNavigation<Nav>()

  function handlerPlants() {
    //navigation.
    navigate("HomeSelect");
  }
  function handlerTarefas() {
    //navigation.
    navigate("TarefasSelect");
  }
  function handlerEndereco() {
    //navigation.
    navigate("TelaEndereco");
  }

  function handlerAlimentoIA() {
    //navigation.
    navigate("TelaAlimentos");
  }

  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    async function loadStorangeUsername() {
      const user = await AsyncStorange.getItem('@plantmanager:user');

      setUserName(user || '')
    }

    loadStorangeUsername();
  }, [])

  return (
    <View style={styles.wapper}>
      <View style={styles.containerProdutor}>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{userName} aqui você pode selecionar algumas das terefas disponivel no App</Text>
        <ScrollView style={styles.scrollVie} showsVerticalScrollIndicator={false}>
          <View style={styles.containerProdutor3}>
            <TouchableOpacity style={styles.item} onPress={handlerPlants}>
              <SvgUri width={100} height={100} uri="https://raw.githubusercontent.com/weslleson22/ImagensAppAlzheimer/50a5484469b7eee26488960f24f3cd10b57a8329/Minhas%20Plantas.svg" />
              <Text style={styles.itemTitle}>Minhas Plantas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handlerPlants}>
              <SvgUri width={100} height={100} uri="https://raw.githubusercontent.com/weslleson22/ImagensAppAlzheimer/f951321dff154ef51c358d81a8ecc9e0d7aa0aab/rotina-diaria.svg" />
              <Text style={styles.itemTitle}>Rotinas Diarias</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerProdutor: {
    marginTop: 16,
    flex: 1,
  },
  containerProdutor1: {
    flexDirection: "row",
    alignItems: "center", // Centraliza verticalmente os Texts
  },
  containerProdutor3: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',     // Centraliza horizontalmente
    marginTop: 25,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  wapper: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  greeting: {
    fontSize: 32,
    marginTop: 92,
    color: colors.blue,
    fontFamily: fonts.text,
  },
  userName: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.blue,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  scrollView: {
    maxHeight: 300, // Ajuste conforme necessário
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.blue,
    marginTop: 30,
    fontFamily: fonts.heading,
    lineHeight: 40,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 30,
    paddingHorizontal: 20,
    color: colors.blue,
    fontFamily: fonts.heading,
  },
  button: {
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 10,
    height: 56,
    width: 56,
  },
  emoji: {
    fontSize: 50,
  },
  buttonIcon: {
    color: colors.white,
    fontSize: 30,
  },
  image: {
    height: Dimensions.get('window').width * 0.9,
  },
  footer: {
    width: '100%',
    paddingHorizontal: 50,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#F0F0F0',
    borderColor: '##F0F0F0',
    height: 160,
    width: 160,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    paddingBottom: 16,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  selectedItem: {
    borderColor: '#061FFF',
    borderWidth: 2,
  },
  itemTitle: {
    fontFamily: fonts.heading,
    textAlign: 'center',
    color: colors.blue,
    fontSize: 15,
  },
  image2: {
    marginTop: -160,
    width: 120,
    height: 120,
    marginLeft: 250,
    borderRadius: 60,
  },
  scrollVie: {
    marginTop: 32,
    maxHeight: "100%", // Ajuste conforme necessário
    flex: 1,
    alignSelf: 'center'
  },
});
