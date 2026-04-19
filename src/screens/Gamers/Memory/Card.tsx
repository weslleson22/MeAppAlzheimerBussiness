import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SoundUtils, HapticFeedback } from '../../../utils/SoundUtils';

interface CardProps {
  onPress: () => void;
  text: string;
  flipped: boolean;
  matched?: boolean;
  index?: number;
}

const Card: React.FC<CardProps> = ({ onPress, text, flipped, matched, index = 0 }) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation with stagger
    scaleAnimation.setValue(0);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
      easing: Easing.elastic(1.2),
    }).start();
  }, [index, scaleAnimation]);

  useEffect(() => {
    SoundUtils.initializeSounds();
  }, []);

  useEffect(() => {
    // Flip animation
    Animated.timing(flipAnimation, {
      toValue: flipped || matched ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    }).start();
  }, [flipped, matched, flipAnimation]);

  useEffect(() => {
    // Match celebration animation
    if (matched) {
      // Play match sound and haptic feedback
      SoundUtils.playSound('match');
      HapticFeedback.success();
      
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.elastic(1.5),
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.elastic(1),
        }),
      ]).start();
    }
  }, [matched, scaleAnimation]);

  const handlePress = () => {
    if (!flipped && !matched) {
      // Play click sound and haptic feedback
      SoundUtils.playSound('click');
      HapticFeedback.light();
      
      // Shake animation on press
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
      onPress();
    }
  };

  const rotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const cardStyle = {
    transform: [
      { scale: scaleAnimation },
      { rotateY },
      { translateX: shakeAnimation },
    ],
  };

  return (
    <Animated.View style={[styles.cardContainer, cardStyle]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={flipped || matched}
        style={[
          styles.card,
          flipped || matched ? styles.flipped : {},
          matched ? styles.matched : {},
        ]}
      >
        <Animated.View
          style={[
            styles.cardContent,
            {
              transform: [
                {
                  rotateY: flipAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}
        >
          {(flipped || matched) && (
            <Animated.Text
              style={[
                styles.text,
                {
                  opacity: flipAnimation,
                  transform: [
                    {
                      scale: flipAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {text}
            </Animated.Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 90,
    height: 90,
    margin: 6,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#1976D2',
  },
  flipped: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  matched: {
    backgroundColor: '#FFC107',
    borderColor: '#F57C00',
    opacity: 0.9,
  },
  cardContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Card;
