import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Interface para dados da notificação
 */
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  scheduledTime?: Date;
  trigger?: any;
}

/**
 * Serviço centralizado para gerenciamento de notificações
 * Fornece métodos seguros e tipados para operações de notificação
 */
export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  /**
   * Obtém instância singleton do serviço
   */
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Solicita permissões de notificação
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      if (status === 'granted') {
        console.log('Permissões de notificação concedidas');
        return true;
      } else {
        console.warn('Permissões de notificação negadas');
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return false;
    }
  }

  /**
   * Agenda uma notificação local
   */
  async scheduleNotification(notification: NotificationData): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: notification.scheduledTime ? {
          type: 'timeInterval' as any,
          seconds: Math.floor((notification.scheduledTime.getTime() - Date.now()) / 1000)
        } : null,
      });

      // Salva notificação agendada no storage
      await this.saveScheduledNotification({
        ...notification,
        id: notificationId,
      });

      console.log('Notificação agendada:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return null;
    }
  }

  /**
   * Cancela uma notificação agendada
   */
  async cancelNotification(notificationId: string): Promise<boolean> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      
      // Remove do storage
      await this.removeScheduledNotification(notificationId);
      
      console.log('Notificação cancelada:', notificationId);
      return true;
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
      return false;
    }
  }

  /**
   * Envia uma notificação imediata
   */
  async sendNotification(notification: NotificationData): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: 'default',
        },
        trigger: null, // Imediata
      });

      console.log('Notificação enviada:', notification.title);
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    }
  }

  /**
   * Obtém todas as notificações agendadas
   */
  async getScheduledNotifications(): Promise<NotificationData[]> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      
      // Carrega notificações salvas localmente
      const savedNotifications = await this.loadScheduledNotifications();
      
      return savedNotifications;
    } catch (error) {
      console.error('Erro ao obter notificações agendadas:', error);
      return [];
    }
  }

  /**
   * Cancela todas as notificações agendadas
   */
  async cancelAllNotifications(): Promise<boolean> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Limpa storage local
      await this.clearScheduledNotifications();
      
      console.log('Todas as notificações canceladas');
      return true;
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
      return false;
    }
  }

  /**
   * Salva notificação agendada no storage
   */
  private async saveScheduledNotification(notification: NotificationData & { id: string }): Promise<void> {
    try {
      const existing = await this.loadScheduledNotifications();
      existing.push(notification);
      await AsyncStorage.setItem('@app:scheduled_notifications', JSON.stringify(existing));
    } catch (error) {
      console.error('Erro ao salvar notificação no storage:', error);
    }
  }

  /**
   * Carrega notificações agendadas do storage
   */
  private async loadScheduledNotifications(): Promise<NotificationData[]> {
    try {
      const data = await AsyncStorage.getItem('@app:scheduled_notifications');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar notificações do storage:', error);
      return [];
    }
  }

  /**
   * Remove notificação agendada do storage
   */
  private async removeScheduledNotification(notificationId: string): Promise<void> {
    try {
      const existing = await this.loadScheduledNotifications();
      const filtered = existing.filter(n => n.id !== notificationId);
      await AsyncStorage.setItem('@app:scheduled_notifications', JSON.stringify(filtered));
    } catch (error) {
      console.error('Erro ao remover notificação do storage:', error);
    }
  }

  /**
   * Limpa todas as notificações agendadas do storage
   */
  private async clearScheduledNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem('@app:scheduled_notifications');
    } catch (error) {
      console.error('Erro ao limpar notificações do storage:', error);
    }
  }

  /**
   * Obtém o número de notificações não lidas (badge)
   */
  async getBadgeCount(): Promise<number> {
    try {
      const badgeCount = await Notifications.getBadgeCountAsync();
      return badgeCount;
    } catch (error) {
      console.error('Erro ao obter badge count:', error);
      return 0;
    }
  }

  /**
   * Define o número de notificações não lidas
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
      console.log('Badge count definido:', count);
    } catch (error) {
      console.error('Erro ao definir badge count:', error);
    }
  }

  /**
   * Limpa todas as notificações não lidas
   */
  async clearBadgeCount(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
      console.log('Badge count limpo');
    } catch (error) {
      console.error('Erro ao limpar badge count:', error);
    }
  }
}

// Exporta instância singleton
export const notificationService = NotificationService.getInstance();
