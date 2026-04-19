import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  Button as RNButton,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useUser, User } from '../hooks/useUser';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface UserProfileProps {
  showEditButton?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function UserProfile({ showEditButton = true, size = 'medium' }: UserProfileProps) {
  const { user, updateProfilePhoto, updateUserName, updateProfile } = useUser();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  // Configuração de tamanho baseado na prop
  const sizeConfig = {
    small: { imageSize: 40, fontSize: 14, iconSize: 16 },
    medium: { imageSize: 60, fontSize: 16, iconSize: 20 },
    large: { imageSize: 80, fontSize: 18, iconSize: 24 },
  };

  const config = sizeConfig[size];

  /**
   * Abre o seletor de imagens para escolher foto de perfil
   */
  const handleChoosePhoto = async () => {
    try {
      // Solicitar permissões
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para alterar sua foto de perfil.');
        return;
      }

      // Abrir galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        const success = await updateProfilePhoto(photoUri);
        
        if (success) {
          Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
        } else {
          Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar a foto.');
    }
  };

  /**
   * Abre a câmera para tirar uma nova foto
   */
  const handleTakePhoto = async () => {
    try {
      // Solicitar permissões
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar uma nova foto.');
        return;
      }

      // Abrir câmera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        const success = await updateProfilePhoto(photoUri);
        
        if (success) {
          Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
        } else {
          Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
        }
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tirar a foto.');
    }
  };

  /**
   * Mostra opções para alterar foto
   */
  const handleEditPhoto = () => {
    Alert.alert(
      'Alterar foto de perfil',
      'Escolha uma opção:',
      [
        {
          text: 'Tirar foto',
          onPress: handleTakePhoto,
        },
        {
          text: 'Escolher da galeria',
          onPress: handleChoosePhoto,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  /**
   * Salva as edições do perfil
   */
  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio.');
      return;
    }

    const updates: Partial<User> = {
      name: editName.trim(),
    };

    if (editEmail.trim()) {
      updates.email = editEmail.trim();
    }

    if (editPhone.trim()) {
      updates.phone = editPhone.trim();
    }

    const success = await updateProfile(updates);
    
    if (success) {
      setIsEditModalVisible(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  };

  /**
   * Abre o modal de edição
   */
  const handleEditProfile = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditPhone(user?.phone || '');
    setIsEditModalVisible(true);
  };

  // Renderiza a imagem de perfil ou avatar padrão
  const renderProfileImage = () => {
    if (user?.profilePhoto) {
      return (
        <Image
          source={{ uri: user.profilePhoto }}
          style={[
            styles.profileImage,
            { width: config.imageSize, height: config.imageSize, borderRadius: config.imageSize / 2 }
          ]}
        />
      );
    }

    // Avatar padrão com iniciais
    const initials = user?.name
      ? user.name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';

    return (
      <View
        style={[
          styles.defaultAvatar,
          { width: config.imageSize, height: config.imageSize, borderRadius: config.imageSize / 2 }
        ]}
      >
        <Text style={[styles.avatarText, { fontSize: config.fontSize * 1.2 }]}>
          {initials}
        </Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={showEditButton ? handleEditPhoto : undefined}
          disabled={!showEditButton}
        >
          {renderProfileImage()}
          {showEditButton && (
            <View style={[styles.editButton, { bottom: config.imageSize / 4 }]}>
              <Ionicons name="camera" size={config.iconSize} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>

        {size !== 'small' && (
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { fontSize: config.fontSize }]}>
              {user?.name || 'Visitante'}
            </Text>
            {user?.email && size === 'large' && (
              <Text style={[styles.userEmail, { fontSize: config.fontSize * 0.8 }]}>
                {user.email}
              </Text>
            )}
          </View>
        )}

        {showEditButton && size === 'large' && (
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={config.iconSize} color={colors.blue} />
            <Text style={[styles.editProfileText, { fontSize: config.fontSize * 0.9 }]}>
              Editar Perfil
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de Edição de Perfil */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.blue} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Seu nome"
                maxLength={50}
              />

              <Text style={styles.label}>Email (opcional)</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="seu.email@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Telefone (opcional)</Text>
              <TextInput
                style={styles.input}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
              />

              <View style={styles.photoSection}>
                <TouchableOpacity style={styles.photoButton} onPress={handleEditPhoto}>
                  <Ionicons name="camera" size={24} color={colors.blue} />
                  <Text style={styles.photoButtonText}>Alterar Foto</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <RNButton
              title="Cancelar"
              onPress={() => setIsEditModalVisible(false)}
              color={colors.gray}
            />
            <RNButton
              title="Salvar"
              onPress={handleSaveProfile}
              color={colors.blue}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    backgroundColor: colors.shape,
  },
  defaultAvatar: {
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontWeight: 'bold',
  },
  editButton: {
    position: 'absolute',
    right: -5,
    backgroundColor: colors.blue,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  userName: {
    color: colors.blue,
    fontFamily: fonts.heading,
    fontWeight: 'bold',
  },
  userEmail: {
    color: colors.gray,
    fontFamily: fonts.text,
    marginTop: 4,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.shape,
  },
  editProfileText: {
    color: colors.blue,
    fontFamily: fonts.text,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.shape,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.blue,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.blue,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.shape,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.blue,
  },
  photoSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.shape,
  },
  photoButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.blue,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.shape,
  },
});
