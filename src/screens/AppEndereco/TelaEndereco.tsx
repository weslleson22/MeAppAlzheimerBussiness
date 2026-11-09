import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import colors from "../../styles/colors";
import { RectButton } from "react-native-gesture-handler";
import fonts from "../../styles/fonts";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

interface IBGEUF {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

export function TelaEndereco() {
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState<IBGEUF[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  const { navigate } = useNavigation();

  useEffect(() => {
    fetchStates();
  }, []);

  async function fetchStates() {
    try {
      const response = await axios.get<IBGEUF[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      );
      setStates(response.data.sort((a: IBGEUF, b: IBGEUF) => a.nome.localeCompare(b.nome)));
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingStates(false);
    }
  }

  async function fetchCities(state: string) {
    if (!state) {
      setCities([]);
      return;
    }

    try {
      setLoadingCities(true);
      const response = await axios.get<IBGECity[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
      );
      setCities(response.data.sort((a: IBGECity, b: IBGECity) => a.nome.localeCompare(b.nome)));
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  }

  function handleSelectState(itemValue: string) {
    setUf(itemValue);
    setCity("");
    fetchCities(itemValue);
  }

  function handleNavigateMap() {
    navigate("Points", {
      uf,
      city,
    });
  }

  function handleNavigateTelaPrincipal() {
    navigate("TelaPrincipal");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container1}>
        <TouchableOpacity onPress={handleNavigateTelaPrincipal}>
          <Icon name="arrow-left" size={30} color="#2D9CDB" />
        </TouchableOpacity>

        <View style={styles.main}>
        <Image source={require("../../../assets/destination-point.png")} style={styles.heroImage} />
        <View style={styles.textBlock}>
          <Text style={styles.title}>Onde está sua família?</Text>
          <Text style={styles.description}>
            Informe o estado e a cidade para buscar a localização de pessoas próximas.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.label}>Estado</Text>
        <View style={styles.selectBox}>
          <Picker
            style={styles.picker}
            selectedValue={uf}
            onValueChange={(itemValue) => handleSelectState(itemValue)}
          >
            <Picker.Item label="Selecione o estado" value="" />
            {states.map((state) => (
              <Picker.Item
                key={state.id}
                label={`${state.sigla} — ${state.nome}`}
                value={state.sigla}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Cidade</Text>
        <View style={styles.selectBox}>
          <Picker
            style={styles.picker}
            selectedValue={city}
            enabled={!!uf && cities.length > 0}
            onValueChange={(itemValue) => setCity(itemValue)}
          >
            <Picker.Item
              label={uf ? "Selecione a cidade" : "Escolha primeiro o estado"}
              value=""
            />
            {cities.map((city) => (
              <Picker.Item key={city.id} label={city.nome} value={city.nome} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.button, !(uf && city) && styles.buttonDisabled]}
          onPress={handleNavigateMap}
          disabled={!uf || !city}
          activeOpacity={0.8}
        >
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color={"#fff"} size={32} />
          </View>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#322153",
    fontSize: 34,
    fontFamily: fonts.heading,
    maxWidth: 280,
    marginTop: 24,
  },

  description: {
    color: "#322153",
    fontSize: 16,
    marginTop: 12,
    fontFamily: fonts.heading,
    maxWidth: 300,
    lineHeight: 24,
    textAlign: "center",
  },

  textBlock: {
    marginTop: 16,
    alignItems: "center",
  },

  heroImage: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },

  footer: {
    paddingTop: 16,
  },

  label: {
    fontSize: 14,
    color: colors.blue,
    fontFamily: fonts.heading,
    marginBottom: 6,
    marginLeft: 8,
  },

  selectBox: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },

  picker: {
    height: 60,
    color: "#333",
    paddingHorizontal: 12,
  },

  input: {
    height: 60,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    textAlign: "center",
  },

  button: {
    backgroundColor: colors.blue,
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 16,
  },

  buttonDisabled: {
    backgroundColor: colors.gray,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: fonts.heading,
    fontSize: 16,
  },
});

export default TelaEndereco;
