import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api2 from "../../../services/api2";
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import fonts from "../../../styles/fonts";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

export function TelaPoints() {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadPosition() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização');
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setInitialPosition([latitude, longitude]);
    }
    loadPosition();
  }, []);

  useEffect(() => {
    if (routeParams && routeParams.city && routeParams.uf) {
      api2.get('points', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems
        }
      }).then(response => {
        setPoints(response.data);
      });
    }
  }, [routeParams, selectedItems]);

  useEffect(() => {
    api2.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  function handlerNavigateToDetail(id: number) {
    navigation.navigate('Detail', { points_id: id });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.includes(id);
    if (alreadySelected) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={30} color="#2D9CDB" />
      </TouchableOpacity>
      <Text style={styles.title}>😃 Bem Vindo!</Text>
      <Text style={styles.description}>Encontre no mapa um ponto.!</Text>
      <View style={styles.mapContainer}>
        {initialPosition[0] !== 0 && (
          <MapView
            style={styles.map}
            loadingEnabled={initialPosition[0] === 0}
            initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            {points.map(point => (
              <Marker
                key={String(point.id)}
                style={styles.mapMarker}
                onPress={() => handlerNavigateToDetail(point.id)}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
              >
                <View style={styles.mapMarkerContainer}>
                  <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        )}
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {items.map(item => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.heading,
    marginTop: 24,
  },
  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: fonts.text,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    width: 90,
    height: 80,
  },
  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#2D9CDB',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },
  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },
  mapMarkerTitle: {
    flex: 1,
    fontFamily: fonts.heading,
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },
  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },
  item: {
    backgroundColor: '#2D9CDB',
    borderWidth: 2,
    borderColor: '#34CB79',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  selectedItem: {
    borderColor: '#061FFF',
    borderWidth: 2,
  },
  itemTitle: {
    fontFamily: fonts.heading,
    textAlign: 'center',
    fontSize: 13,
  },
});
