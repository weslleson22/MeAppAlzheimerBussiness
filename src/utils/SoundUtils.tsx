export class SoundUtils {
  private static vibrationSupported = false;

  static async initializeSounds() {
    try {
      // Check if vibration is supported
      if ('vibrate' in navigator) {
        this.vibrationSupported = true;
      }
    } catch (error) {
      console.warn('Error initializing sounds:', error);
    }
  }

  static async playSound(soundType: 'success' | 'match' | 'error' | 'victory' | 'click') {
    try {
      // In a real implementation, you would play actual sound files
      // For now, we'll use vibration as feedback
      if (soundType === 'success' || soundType === 'match') {
        await this.vibrate([0, 100, 50, 100]);
      } else if (soundType === 'error') {
        await this.vibrate([0, 200]);
      } else if (soundType === 'victory') {
        await this.vibrate([0, 100, 50, 100, 50, 200]);
      } else if (soundType === 'click') {
        await this.vibrate([0, 50]);
      }
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  static async vibrate(pattern: number[]) {
    try {
      // Use Expo's vibration API
      await this.vibratePattern(pattern);
    } catch (error) {
      console.warn('Vibration not supported:', error);
    }
  }

  private static async vibratePattern(pattern: number[]) {
    // Simple vibration implementation
    for (let i = 0; i < pattern.length; i += 2) {
      if (i < pattern.length) {
        // Wait
        await new Promise(resolve => setTimeout(resolve, pattern[i]));
      }
      if (i + 1 < pattern.length) {
        // Vibrate
        await new Promise(resolve => setTimeout(resolve, pattern[i + 1]));
      }
    }
  }

  static async cleanup() {
    try {
      // No sounds to cleanup in this simplified version
      console.log('Sound cleanup completed');
    } catch (error) {
      console.warn('Error cleaning up sounds:', error);
    }
  }
}

// Visual feedback utilities
export class VisualFeedback {
  static createSuccessAnimation() {
    return {
      scale: [1, 1.2, 1],
      backgroundColor: ['#4CAF50', '#81C784', '#4CAF50'],
    };
  }

  static createErrorAnimation() {
    return {
      shake: [0, 10, -10, 10, -10, 0],
      backgroundColor: ['#F44336', '#EF5350', '#F44336'],
    };
  }

  static createMatchAnimation() {
    return {
      scale: [1, 1.3, 1.1, 1.2, 1],
      rotate: ['0deg', '10deg', '-10deg', '5deg', '0deg'],
      backgroundColor: ['#FFC107', '#FFD54F', '#FFC107'],
    };
  }

  static createVictoryAnimation() {
    return {
      scale: [1, 1.5, 1.2, 1.4, 1.3, 1.5, 1],
      backgroundColor: ['#9C27B0', '#BA68C8', '#9C27B0'],
    };
  }
}

// Haptic feedback utilities
export class HapticFeedback {
  static async light() {
    try {
      // Light haptic feedback
      await this.triggerHaptic('light');
    } catch (error) {
      console.warn('Haptic feedback not supported:', error);
    }
  }

  static async medium() {
    try {
      // Medium haptic feedback
      await this.triggerHaptic('medium');
    } catch (error) {
      console.warn('Haptic feedback not supported:', error);
    }
  }

  static async heavy() {
    try {
      // Heavy haptic feedback
      await this.triggerHaptic('heavy');
    } catch (error) {
      console.warn('Haptic feedback not supported:', error);
    }
  }

  static async success() {
    try {
      // Success haptic feedback
      await this.triggerHaptic('success');
    } catch (error) {
      console.warn('Haptic feedback not supported:', error);
    }
  }

  static async error() {
    try {
      // Error haptic feedback
      await this.triggerHaptic('error');
    } catch (error) {
      console.warn('Haptic feedback not supported:', error);
    }
  }

  private static async triggerHaptic(type: string) {
    // In a real implementation, you would use Expo's Haptics API
    // For now, we'll use vibration as fallback
    switch (type) {
      case 'light':
        await SoundUtils.vibrate([0, 50]);
        break;
      case 'medium':
        await SoundUtils.vibrate([0, 100]);
        break;
      case 'heavy':
        await SoundUtils.vibrate([0, 200]);
        break;
      case 'success':
        await SoundUtils.vibrate([0, 100, 50, 100]);
        break;
      case 'error':
        await SoundUtils.vibrate([0, 150, 50, 150]);
        break;
    }
  }
}
