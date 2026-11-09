import React, { useState } from 'react';
import { 
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../../hooks/useUser';
import { useAnimation } from '../../../hooks/useAnimation';
import { useAppNavigation } from '../../../hooks/useNavigation';

import { Button } from '../../components/Button';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

/**
 * Componente de identificação do usuário
 * Responsável por capturar o nome do usuário na primeira utilização
 * Aplica hooks reutilizáveis e animações suaves para melhor UX
 */
export function UserIdentification() {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState<string>('');
  
  const { saveUser } = useUser();
  const { fadeAnim, scaleAnim, fadeIn, bounce } = useAnimation();
  const { navigate } = useAppNavigation();

  React.useEffect(() => {
    fadeIn(600).start();
  }, [fadeIn]);

  /**
   * Manipula o blur do input
   */
  const handleInputBlur = () => {
    setIsFocused(false);
    setIsFilled(!!name);
  };

  /**
   * Manipula o focus do input
   */
  const handleInputFocus = () => {
    setIsFocused(true);
    bounce().start();
  };

  /**
   * Manipula a mudança de valor no input
   */
  const handleInputChange = (value: string) => {
    setIsFilled(!!value);
    setName(value);
  };

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async () => {
    if (!name || !name.trim()) {
      return Alert.alert('Me diz como chamar você🥺');
    }

    try {
      const success = await saveUser({ name: name.trim() });
      
      if (success) {
        // Animação de sucesso e navegação
        bounce().start();
        setTimeout(() => {
          navigate('TelaPrincipal');
        }, 500);
      } else {
        Alert.alert('Não foi possível salvar o seu nome 😥');
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      Alert.alert('Não foi possível salvar o seu nome 😥');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Animated.View 
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={styles.form}>
                <Animated.View 
                  style={[
                    styles.header,
                    {
                      transform: [{ scale: scaleAnim }]
                    }
                  ]}
                >
                  <Animated.Text 
                    style={[
                      styles.emoji,
                      {
                        transform: [{ scale: scaleAnim }]
                      }
                    ]}
                  >
                    {isFilled ? '😆' : '😊'}
                  </Animated.Text>
                  <Animated.Text 
                    style={[
                      styles.title,
                      {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                      }
                    ]}
                  >
                    Como podemos{'\n'} 
                    chamar você?
                  </Animated.Text>
                </Animated.View>
                <TextInput
                  style={[
                    styles.input,
                    (isFocused || isFilled) && { borderColor: colors.blue }
                  ]}
                  placeholder="Digite um nome"
                  onBlur={handleInputBlur}
                  onFocus={handleInputFocus}
                  onChangeText={(text) => {
                    if (text.length <= 15) {
                      handleInputChange(text);
                    } else {
                      handleInputChange(text.substring(0, 15));
                    }
                  }}
                  maxLength={15}
                  value={name}
                />
                <Animated.View 
                  style={[
                    styles.footer,
                    {
                      transform: [{ scale: scaleAnim }]
                    }
                  ]}
                >
                  <Button 
                    title="Confirmar"
                    onPress={handleSubmit}
                  />
                </Animated.View>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 54,
    alignItems: 'center'
  },
  emoji: {
    fontSize: 44
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.blue,
    color: colors.blue,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center'
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    color: colors.blue,
    fontFamily: fonts.heading,
    marginTop: 20,
  }, 
  footer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 20
  },
  header: {
    alignItems: 'center'
  }
});