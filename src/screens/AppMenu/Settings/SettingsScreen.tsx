import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../hooks/useUser';
import { useAppNavigation } from '../../../hooks/useNavigation';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import { UserProfile } from '../../../components/UserProfile';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: 'toggle' | 'action' | 'navigation';
  value?: boolean;
  action?: () => void;
  screen?: string;
}

export function SettingsScreen() {
  const { user, clearUser } = useUser();
  const { navigate, goBack } = useAppNavigation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sair do Aplicativo',
      'Tem certeza que deseja sair? Seus dados serão mantidos no dispositivo.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            const success = await clearUser();
            if (success) {
              navigate('UserIdentification' as any);
            }
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Limpar Dados',
      'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            // Implementar limpeza de dados
            Alert.alert('Dados Limpos', 'Todos os dados foram removidos com sucesso.');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Deseja exportar seus dados para compartilhamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Exportar',
          onPress: () => {
            // Implementar exportação de dados
            Alert.alert('Exportação', 'Dados exportados com sucesso!');
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Suporte',
      'Como deseja entrar em contato com o suporte?',
      [
        {
          text: 'WhatsApp',
          onPress: () => {
            Linking.openURL('https://wa.me/5511999999999');
          },
        },
        {
          text: 'Email',
          onPress: () => {
            Linking.openURL('mailto:suporte@meapp.com');
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Sobre o MeApp Alzheimer',
      'Versão 1.0.0\n\nAplicativo desenvolvido para auxiliar pacientes com Alzheimer em estágio inicial.\n\nDesenvolvido com cuidado e dedicação.',
      [{ text: 'OK' }]
    );
  };

  const settings: SettingItem[] = [
    {
      id: 'profile',
      title: 'Perfil do Usuário',
      description: 'Gerenciar suas informações pessoais',
      icon: 'person-outline',
      type: 'navigation',
      screen: 'Settings',
    },
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Receber lembretes e alertas',
      icon: 'notifications-outline',
      type: 'toggle',
      value: notifications,
    },
    {
      id: 'sound',
      title: 'Efeitos Sonoros',
      description: 'Ativar sons no aplicativo',
      icon: 'volume-high-outline',
      type: 'toggle',
      value: soundEffects,
    },
    {
      id: 'autosave',
      title: 'Salvamento Automático',
      description: 'Salvar progresso automaticamente',
      icon: 'save-outline',
      type: 'toggle',
      value: autoSave,
    },
    {
      id: 'privacy',
      title: 'Privacidade',
      description: 'Gerenciar seus dados e privacidade',
      icon: 'lock-closed-outline',
      type: 'navigation',
      screen: 'PrivacySettings',
    },
    {
      id: 'backup',
      title: 'Backup e Restauração',
      description: 'Gerenciar backup dos seus dados',
      icon: 'cloud-upload-outline',
      type: 'navigation',
      screen: 'BackupSettings',
    },
  ];

  const dataSettings: SettingItem[] = [
    {
      id: 'export',
      title: 'Exportar Dados',
      description: 'Exportar seus dados para compartilhamento',
      icon: 'share-outline',
      type: 'action',
      action: handleExportData,
    },
    {
      id: 'clear',
      title: 'Limpar Dados',
      description: 'Remover todos os dados do aplicativo',
      icon: 'trash-outline',
      type: 'action',
      action: handleClearData,
    },
  ];

  const supportSettings: SettingItem[] = [
    {
      id: 'help',
      title: 'Ajuda e Suporte',
      description: 'Obter ajuda com o aplicativo',
      icon: 'help-circle-outline',
      type: 'action',
      action: handleContactSupport,
    },
    {
      id: 'about',
      title: 'Sobre',
      description: 'Informações sobre o aplicativo',
      icon: 'information-circle-outline',
      type: 'action',
      action: handleAbout,
    },
    {
      id: 'logout',
      title: 'Sair',
      description: 'Sair da sua conta',
      icon: 'log-out-outline',
      type: 'action',
      action: handleLogout,
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => {
        if (item.type === 'toggle') {
          // Toggle será tratado separadamente
        } else if (item.type === 'action' && item.action) {
          item.action();
        } else if (item.type === 'navigation' && item.screen) {
          navigate(item.screen as any);
        }
      }}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={item.icon as any} size={24} color={colors.blue} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.settingDescription}>{item.description}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={(value) => {
              if (item.id === 'notifications') setNotifications(value);
              else if (item.id === 'sound') setSoundEffects(value);
              else if (item.id === 'autosave') setAutoSave(value);
            }}
            trackColor={{ false: colors.gray, true: colors.blue_light }}
            thumbColor={colors.blue}
          />
        )}
        {item.type === 'navigation' && (
          <Ionicons name="chevron-forward" size={20} color={colors.gray} />
        )}
        {item.type === 'action' && (
          <Ionicons name="chevron-forward" size={20} color={colors.gray} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={colors.blue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <UserProfile size="medium" showEditButton={true} />
          <Text style={styles.userName}>{user?.name || 'Visitante'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'Sem email'}</Text>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações Gerais</Text>
          <View style={styles.sectionContent}>
            {settings.map(renderSettingItem)}
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerenciamento de Dados</Text>
          <View style={styles.sectionContent}>
            {dataSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <View style={styles.sectionContent}>
            {supportSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
          <Text style={styles.footerText}>
            Desenvolvido com cuidado para pacientes com Alzheimer
          </Text>
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 20,
    paddingBottom: 16,
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
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.blue,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.shape,
    borderRadius: 12,
    marginBottom: 24,
  },
  userName: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.blue,
    fontWeight: 'bold',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.body_light,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.blue,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.shape,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.shape,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.shape,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue_light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.blue,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.body_light,
    marginTop: 2,
  },
  settingRight: {
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.body_dark,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.body_light,
    textAlign: 'center',
  },
});
