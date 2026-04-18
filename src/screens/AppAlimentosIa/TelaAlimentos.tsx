import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { styles } from '../AppAlimentosIa/stylesAlimentos'
import { Tip } from '../AppAlimentosIa/components/Tip'
import { Item, ItemProps } from '../AppAlimentosIa/components/Item'
import { Button } from '../AppAlimentosIa/components/Button'
import * as ImgePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { api_IA } from "../../services/api_IA";
import { Loading } from './components/Loading';
import { foodContains } from './utils/foodContains';
import {
  EXPO_PUBLIC_API_APP_ID,
  EXPO_PUBLIC_API_MODEL_ID,
  EXPO_PUBLIC_API_MODEL_VERSION_ID,
  EXPO_PUBLIC_API_USER_ID,
} from '@env';

export function TelaAlimentos() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<ItemProps[]>([]);
  const [message, setMessage] = useState('');




  async function handleSelectImage() {

    try {

      const { status } = await ImgePicker.requestMediaLibraryPermissionsAsync();

      if (status !== ImgePicker.PermissionStatus.GRANTED) {
        return Alert.alert("É necessario conceder permissão para acessar sua galeria!")
      }
      setIsLoading(true)
      setMessage('')
      setItems([])

      const response = await ImgePicker.launchImageLibraryAsync({
        mediaTypes: ImgePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1
      })
      if (response.canceled) {
        return setIsLoading(false)
      }


      if (!response.canceled) {

        const imgManipuled = await ImageManipulator.manipulateAsync(
          response.assets[0].uri,
          [{ resize: { width: 900 } }],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true
          }
        )
        setSelectedImageUri(imgManipuled.uri)
        await foodDetect(imgManipuled.base64)
        console.log("Image ok")

      }

    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }

  }

  async function foodDetect(imageBase64: string | undefined) {
    try {
      if (!imageBase64) {
        throw new Error('Imagem invalida para analise.')
      }

      const response = await api_IA.post(
        `/v2/users/clarifai/apps/main/models/${EXPO_PUBLIC_API_MODEL_ID}/versions/${EXPO_PUBLIC_API_MODEL_VERSION_ID}/outputs`,
        {
          "user_app_id": {
            "user_id": EXPO_PUBLIC_API_USER_ID,
            "app_id": EXPO_PUBLIC_API_APP_ID,
          },
          "inputs": [
            {
              "data": {
                "image": {
                  "base64": imageBase64
                }
              }
            }
          ]
        }
      )

      console.log('Clarifai success response:', JSON.stringify(response.data, null, 2))

      const concepts = response.data?.outputs?.[0]?.data?.concepts

      if (!Array.isArray(concepts) || concepts.length === 0) {
        throw new Error('A API nao retornou alimentos para esta imagem.')
      }

      const foods = concepts.map((concept: any) => {
        return {
          name: concept.name,
          percentage: `${Math.round(concept.value * 100)}%`
        }
      })
      const isVegetable = foodContains(foods, 'vegetable')
      setMessage(isVegetable ? '' : 'Adicione vegetais em seu prato!')
      setItems(foods)
      console.log("Tudo ok")
    } catch (error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: unknown;
        };
        message?: string;
      }

      console.log("Erro:", error)
      console.log('Clarifai error status:', axiosError.response?.status)
      console.log(
        'Clarifai error response:',
        JSON.stringify(axiosError.response?.data ?? { message: axiosError.message }, null, 2)
      )
      setMessage('Nao foi possivel analisar a imagem.')
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleSelectImage} disabled={isLoading} />

      {
        selectedImageUri ?
          <Image
            source={{ uri: selectedImageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          :
          <Text style={styles.description}>
            Selecione a foto do seu prato para analizar.
          </Text>
      }

      <View style={styles.bottom} >
        {message && <Tip message={message} />}
        {
         isLoading ?<Loading/>:
         <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24 }}>
          <View style={styles.items}>
            {
              items.map((item)=>(
                <Item key={item.name} data={item}/>
              ))
            }
          </View>
        </ScrollView>
          </>}
      </View>
    </View>
  );
}
