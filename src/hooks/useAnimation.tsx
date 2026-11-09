import { useRef, useEffect, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Hook personalizado para animações reutilizáveis
 * Fornece animações comuns e configuráveis para melhor UX
 */
export function useAnimation() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Animação de fade in
   */
  const fadeIn = useCallback((duration: number = 300, delay: number = 0) => {
    return Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
      easing: Easing.ease,
    });
  }, [fadeAnim]);

  /**
   * Animação de fade out
   */
  const fadeOut = useCallback((duration: number = 300) => {
    return Animated.timing(fadeAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
      easing: Easing.ease,
    });
  }, [fadeAnim]);

  /**
   * Animação de scale (zoom)
   */
  const scale = useCallback((toValue: number, duration: number = 200) => {
    return Animated.timing(scaleAnim, {
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.elastic(1.2),
    });
  }, [scaleAnim]);

  /**
   * Animação de slide
   */
  const slide = useCallback((direction: 'left' | 'right' | 'up' | 'down', distance: number = 100, duration: number = 300) => {
    const toValue = direction === 'left' || direction === 'up' ? -distance : distance;
    return Animated.timing(slideAnim, {
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
  }, [slideAnim]);

  /**
   * Animação de rotação
   */
  const rotate = useCallback((degrees: number, duration: number = 300) => {
    return Animated.timing(rotateAnim, {
      toValue: degrees,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
  }, [rotateAnim]);

  /**
   * Animação de shake (tremida)
   */
  const shake = useCallback((intensity: number = 10, duration: number = 500) => {
    return Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: intensity,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -intensity,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: intensity,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: duration / 4,
        useNativeDriver: true,
      }),
    ]);
  }, [shakeAnim]);

  /**
   * Animação de pulso
   */
  const pulse = useCallback((scale: number = 1.2, duration: number = 1000) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: scale,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
      ])
    );
  }, [scaleAnim]);

  /**
   * Animação de bounce (quicar)
   */
  const bounce = useCallback((duration: number = 800) => {
    return Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: duration / 4,
        useNativeDriver: true,
        easing: Easing.elastic(1.5),
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: duration / 4,
        useNativeDriver: true,
        easing: Easing.elastic(1.5),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
        easing: Easing.elastic(1.5),
      }),
    ]);
  }, [scaleAnim]);

  /**
   * Reset todas as animações
   */
  const reset = useCallback(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(1);
    slideAnim.setValue(0);
    rotateAnim.setValue(0);
    shakeAnim.setValue(0);
  }, [fadeAnim, scaleAnim, slideAnim, rotateAnim, shakeAnim]);

  return {
    // Valores animados
    fadeAnim,
    scaleAnim,
    slideAnim,
    rotateAnim,
    shakeAnim,
    
    // Métodos de animação
    fadeIn,
    fadeOut,
    scale,
    slide,
    rotate,
    shake,
    pulse,
    bounce,
    reset,
  };
}

/**
 * Hook para animações de entrada escalonadas
 */
export function useStaggeredAnimation(count: number, baseDelay: number = 100) {
  const animations = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  /**
   * Inicia animações escalonadas
   */
  const startStaggered = useCallback((
    animationFn: (anim: Animated.Value, index: number) => Animated.CompositeAnimation,
    duration: number = 300
  ) => {
    const staggeredAnimations = animations.map((anim, index) => {
      const animation = animationFn(anim, index);
      // Usar setTimeout para criar delay manualmente
      return Animated.sequence([
        Animated.timing(new Animated.Value(0), {
          toValue: 1,
          duration: index * baseDelay,
          useNativeDriver: true,
        }),
        animation,
      ]);
    });
    
    return Animated.parallel(staggeredAnimations);
  }, [animations, baseDelay]);

  /**
   * Animação de entrada escalonada
   */
  const staggeredFadeIn = useCallback((duration: number = 300) => {
    return startStaggered((anim, index) => 
      Animated.timing(anim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.elastic(1.2),
      })
    , duration);
  }, [startStaggered]);

  return {
    animations,
    startStaggered,
    staggeredFadeIn,
  };
}
