import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function AIAssistantScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou sua assistente virtual para cuidados com Alzheimer. Como posso ajudar você hoje?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<any>(null);

  // Respostas pré-programadas para questões comuns sobre Alzheimer
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('esqueci') || lowerMessage.includes('lembrar')) {
      return 'Entendo que você está se sentindo esquecido. Isso é comum e não se preocupe. Vamos tentar juntos: o que você gostaria de lembrar? Pode ser algo importante que você fez hoje ou precisa fazer?';
    }
    
    if (lowerMessage.includes('medicamento') || lowerMessage.includes('remédio')) {
      return 'Sobre medicamentos: sempre tome na hora certa e conforme o médico prescreveu. Você pode usar um alarme no celular para não esquecer. Já tomou seus medicamentos hoje?';
    }
    
    if (lowerMessage.includes('comer') || lowerMessage.includes('fome') || lowerMessage.includes('comida')) {
      return 'Uma boa alimentação é muito importante! Que tal uma refeição nutritiva? Alimentos como peixes, frutas, vegetais e nozes ajudam na memória. Você já almoçou hoje?';
    }
    
    if (lowerMessage.includes('exercício') || lowerMessage.includes('caminhar') || lowerMessage.includes('mexer')) {
      return 'Exercícios físicos leves como caminhadas são excelentes! Fazem bem para o corpo e para a mente. Que tal uma caminhada curta de 10 minutos? Posso te acompanhar mentalmente!';
    }
    
    if (lowerMessage.includes('família') || lowerMessage.includes('filho') || lowerMessage.includes('esposa')) {
      return 'Sua família te ama muito e está sempre aqui para ajudar. Eles se preocupam com você porque te amam. Você gostaria de falar com algum familiar?';
    }
    
    if (lowerMessage.includes('confuso') || lowerMessage.includes('perdido')) {
      return 'Calma, você está seguro. Vamos respirar fundo juntos. Olhe ao redor e me diga o que você vê. Estou aqui para te ajudar a se orientar. Você está em um lugar familiar?';
    }
    
    if (lowerMessage.includes('ansioso') || lowerMessage.includes('nervoso')) {
      return 'É normal sentir-se ansioso às vezes. Vamos tentar uma técnica simples: respire fundo contando até 4, segure por 4 segundos e solte contando até 6. Vamos tentar juntos?';
    }
    
    if (lowerMessage.includes('dormir') || lowerMessage.includes('sono')) {
      return 'Uma boa noite de sono é fundamental para a memória. Tente manter uma rotina: deitar e levantar nos mesmos horários. Evite telas antes de dormir. Você está dormindo bem ultimamente?';
    }
    
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('socorro')) {
      return 'Estou aqui para te ajudar! Se precisar de algo urgente, não hesite em chamar um familiar ou vizinho. Para emergências, ligue para oSAMU: 192. O que você precisa agora?';
    }
    
    // Resposta padrão
    return 'Entendi sua preocupação. Como sua assistente, estou aqui para te apoiar. Pode me contar mais sobre o que está pensando? Juntos vamos encontrar uma solução. Lembre-se: você não está sozinho nesta jornada.';
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Simular resposta da IA após 1 segundo
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
    sendMessage();
  };

  useEffect(() => {
    // Rolar para a mensagem mais recente
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assistente Virtual</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userText : styles.aiText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Questions */}
        <View style={styles.quickQuestionsContainer}>
          <Text style={styles.quickQuestionsTitle}>Perguntas Rápidas:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.quickQuestionsList}>
              {[
                'O que devo comer hoje?',
                'Como me lembrar das coisas?',
                'Estou me sentindo confuso',
                'Preciso tomar remédios?',
              ].map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion(question)}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua pergunta..."
            placeholderTextColor={colors.body_light}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === '' ? styles.sendButtonDisabled : null,
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === ''}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() === '' ? colors.body_light : colors.white}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    backgroundColor: colors.green,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.heading,
  },
  headerPlaceholder: {
    width: 24,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: colors.green,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.shape,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: fonts.text,
    lineHeight: 22,
  },
  userText: {
    color: colors.white,
  },
  aiText: {
    color: colors.heading,
  },
  timestamp: {
    fontSize: 12,
    color: colors.body_light,
    marginTop: 4,
    fontFamily: fonts.text,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.body_light,
  },
  quickQuestionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.shape,
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginBottom: 12,
  },
  quickQuestionsList: {
    flexDirection: 'row',
    gap: 12,
  },
  quickQuestionButton: {
    backgroundColor: colors.green_light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.green,
  },
  quickQuestionText: {
    fontSize: 12,
    color: colors.green,
    fontFamily: fonts.text,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.shape,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.shape,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.heading,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.shape,
  },
});
