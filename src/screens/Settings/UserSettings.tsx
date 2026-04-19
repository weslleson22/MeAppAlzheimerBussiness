import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { useUser } from '../../hooks/useUser';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export function UserSettings() {
  const { user, isLoading, updateUserName, updateProfilePhoto } = useUser();
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setIsFilled(!!user.name);
    }
  }, [user]);

  const handleInputBlur = () => {
    setIsFocused(false);
    setIsFilled(!!name);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputChange = (value: string) => {
    setIsFilled(!!value);
    setName(value);
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Nome obrigatório', 'Por favor, digite seu nome');
      return;
    }

    setSaving(true);
    try {
      const success = await updateUserName(name);
      if (success) {
        Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar seu nome');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar seu nome');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        const success = await updateProfilePhoto(photoUri);
        if (success) {
          Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
        } else {
          Alert.alert('Erro', 'Não foi possível atualizar a foto');
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a foto');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Configurações</Text>
          <Text style={styles.subtitle}>Editar Perfil</Text>
        </View>

        {/* Foto de Perfil */}
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoContainer} onPress={handleSelectPhoto}>
            {user?.profilePhoto ? (
              <Image source={{ uri: user.profilePhoto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={40} color={colors.gray} />
              </View>
            )}
            <View style={styles.photoEditIcon}>
              <Ionicons name="camera" size={20} color={colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoText}>Toque para alterar a foto</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          
          <TextInput
            style={[
              styles.input,
              isFocused && styles.inputFocused,
              isFilled && styles.inputFilled,
            ]}
            placeholder="Como você quer ser chamado?"
            placeholderTextColor={colors.body_light}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            onChangeText={handleInputChange}
            value={name}
          />

          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              Este nome será usado em toda a aplicação.
            </Text>
          </View>

          <Button 
            title={saving ? "Salvando..." : "Salvar Alterações"} 
            onPress={handleSave}
            disabled={saving}
          />
        </View>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.heading,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.body_dark,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.green,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 14,
    color: colors.body_light,
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.heading,
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    paddingHorizontal: 0,
    paddingBottom: 12,
    fontSize: 18,
    fontFamily: fonts.text,
    marginBottom: 15,
  },
  inputFocused: {
    borderColor: colors.green_dark,
  },
  inputFilled: {
    borderColor: colors.green_dark,
  },
  description: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.body_light,
    lineHeight: 24,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.red,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.heading,
    marginTop: 20,
  },
});
