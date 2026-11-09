import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { styles } from '../AppAlimentosIa/stylesAlimentos';
import { Tip } from '../AppAlimentosIa/components/Tip';
import { Item, ItemProps } from '../AppAlimentosIa/components/Item';
import { Button } from '../AppAlimentosIa/components/Button';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { api_IA } from '../../services/api_IA';
import { api_IA as api_IA_Alt } from './services/api';
import { Loading } from './components/Loading';
import { foodContains } from './utils/foodContains';

const CLARIFAI_MODEL_ID = 'general-image-recognition';
const CLARIFAI_MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';
const CLARIFAI_USER_ID = 'weslesonsouza';
const CLARIFAI_APP_ID = 'goodplate';

export function TelaAlimentos() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [message, setMessage] = useState('');

  async function handleSelectImage() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        return Alert.alert('É necessário conceder permissão para acessar sua galeria!');
      }
      setIsLoading(true);
      setMessage('');
      setItems([]);

      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (response.canceled) {
        return setIsLoading(false);
      }

      if (!response.canceled) {
        const imgManipuled = await ImageManipulator.manipulateAsync(
          response.assets[0].uri,
          [{ resize: { width: 900 } }],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );
        setSelectedImageUri(imgManipuled.uri);
        await foodDetect(imgManipuled.base64);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function requestClarifaiConcepts(cleanBase64: string) {
    const attempts = [
      () =>
        api_IA.post(
          `/v2/models/${CLARIFAI_MODEL_ID}/versions/${CLARIFAI_MODEL_VERSION_ID}/outputs`,
          {
            user_app_id: {
              user_id: CLARIFAI_USER_ID,
              app_id: CLARIFAI_APP_ID,
            },
            inputs: [{ data: { image: { base64: cleanBase64 } } }],
          }
        ),
      () =>
        api_IA.post(
          `/v2/users/clarifai/apps/main/models/${CLARIFAI_MODEL_ID}/versions/${CLARIFAI_MODEL_VERSION_ID}/outputs`,
          {
            inputs: [{ data: { image: { base64: cleanBase64 } } }],
          }
        ),
      () =>
        api_IA_Alt.post(
          `/v2/users/clarifai/apps/main/models/${CLARIFAI_MODEL_ID}/versions/${CLARIFAI_MODEL_VERSION_ID}/outputs`,
          {
            inputs: [{ data: { image: { base64: cleanBase64 } } }],
          }
        ),
      () =>
        api_IA_Alt.post(
          `/v2/models/${CLARIFAI_MODEL_ID}/versions/${CLARIFAI_MODEL_VERSION_ID}/outputs`,
          {
            user_app_id: {
              user_id: CLARIFAI_USER_ID,
              app_id: CLARIFAI_APP_ID,
            },
            inputs: [{ data: { image: { base64: cleanBase64 } } }],
          }
        ),
    ];

    let lastError: unknown = null;
    for (const attempt of attempts) {
      try {
        const response = await attempt();
        const concepts = response.data?.outputs?.[0]?.data?.concepts;
        if (Array.isArray(concepts) && concepts.length > 0) {
          return concepts;
        }
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('A API não retornou alimentos para esta imagem.');
  }

  async function foodDetect(imageBase64: string | undefined) {
    try {
      if (!imageBase64) {
        throw new Error('Imagem inválida para análise.');
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      const concepts = await requestClarifaiConcepts(cleanBase64);

      const foods = concepts.map((concept: any) => {
        return {
          name: concept.name,
          percentage: `${Math.round(concept.value * 100)}%`,
        };
      });

      const isVegetable = foodContains(foods, 'vegetable');
      setMessage(isVegetable ? '' : 'Adicione vegetais em seu prato!');
      setItems(foods);
    } catch (error) {
      console.log('Clarifai error:', error);
      setMessage('Não foi possível analisar a imagem.');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleSelectImage} disabled={isLoading} />

      {selectedImageUri ? (
        <Image
          source={{ uri: selectedImageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.description}>
          Selecione a foto do seu prato para analizar.
        </Text>
      )}

      <View style={styles.bottom}>
        {Boolean(message) && <Tip message={message} />}
        {isLoading ? (
          <Loading />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 24 }}
          >
            <View style={styles.items}>
              {items.map((item) => (
                <Item key={item.name} data={item} />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
