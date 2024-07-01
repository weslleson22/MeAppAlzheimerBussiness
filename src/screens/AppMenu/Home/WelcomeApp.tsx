import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,     
  View
} from "react-native"; 

const logoIgm = require ('../../../../assets/logo.png');
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";

export function WelcomeApp(){
  const navigation = useNavigation();
  type Nav = {
    navigate: (value: string) => void;
  }
  
  const { navigate } = useNavigation<Nav>()

  function handleStart() {
    navigate("UserIdentification");
  }
  return(
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          Gerencie {'\n'}seu dia a dia de {'\n'}forma fácil.
        </Text>
        <Image source={logoIgm} style={styles.image} resizeMode="contain" />
        <Text style={styles.subtitle}>
          Nós cuidamos de lembrar você sempre que precisar.
        </Text>
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleStart}>
          <Text>
            <Feather name="chevron-right" style={styles.buttonIcon} />
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center', 
    color: colors.blue,
    marginTop: 38,
    lineHeight: 34
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 20,
    color: colors.blue,
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
  buttonIcon: {
    color: colors.white,
    fontSize: 30
  },
  image: {
    height: Dimensions.get('window').width * 0.7
  },
});
