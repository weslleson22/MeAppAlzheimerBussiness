import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import api2 from "../../../services/api2";
import fonts from "../../../styles/fonts";

declare const window: any;

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

function getLeafletHTML(initialLat: number, initialLng: number, points: Point[]) {
  const pointsJSON = JSON.stringify(points);
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { box-sizing: border-box; }
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      background-color: #f2efe9;
    }
    .custom-marker {
      width: 90px;
      background-color: #2D9CDB;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 3px 8px rgba(0,0,0,0.35);
      text-align: center;
      cursor: pointer;
    }
    .custom-marker img {
      width: 90px;
      height: 45px;
      object-fit: cover;
      display: block;
      background-color: #2D9CDB;
    }
    .custom-marker span {
      display: block;
      font-family: sans-serif;
      font-weight: 700;
      color: #FFFFFF;
      font-size: 12px;
      line-height: 22px;
      padding: 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: true }).setView([${initialLat}, ${initialLng}], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var points = ${pointsJSON};
    if (Array.isArray(points)) {
      points.forEach(function(point) {
        var lat = Number(point.latitude);
        var lng = Number(point.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        var icon = L.divIcon({
          className: '',
          html: '<div class="custom-marker">' +
                  '<img src="' + (point.image_url || '') + '" onerror="this.style.display=\\'none\\'" />' +
                  '<span>' + (point.name || '') + '</span>' +
                '</div>',
          iconSize: [90, 68],
          iconAnchor: [45, 68]
        });

        var marker = L.marker([lat, lng], { icon: icon });
        marker.on('click', function() {
          window.parent.postMessage(JSON.stringify({ type: 'markerPress', id: point.id }), '*');
        });
        marker.addTo(map);
      });
    }
  </script>
</body>
</html>
  `;
}

export function TelaPoints() {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition] = useState<[number, number]>([-23.55052, -46.633308]);

  const navigation = useNavigation<any>();
  const route = useRoute();
  const routeParams = (route.params as Params) || { uf: '', city: '' };

  useEffect(() => {
    function handleWindowMessage(event: any) {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.type === 'markerPress' && data.id) {
          handlerNavigateToDetail(data.id);
        }
      } catch (_e) {}
    }
    const globalObj: any = typeof window !== 'undefined' ? window : null;
    if (globalObj && globalObj.addEventListener) {
      globalObj.addEventListener('message', handleWindowMessage);
      return () => globalObj.removeEventListener('message', handleWindowMessage);
    }
  }, []);

  useEffect(() => {
    if (selectedItems.length === 0) {
      setPoints([]);
      return;
    }

    api2.get('points', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems.join(',')
      }
    }).then(response => {
      if (Array.isArray(response.data)) {
        setPoints(response.data);
      }
    }).catch(() => {
      api2.get('points', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems
        }
      }).then(res => {
        if (Array.isArray(res.data)) {
          setPoints(res.data);
        }
      }).catch(() => {});
    });
  }, [selectedItems]);

  useEffect(() => {
    api2.get('items').then(response => {
      if (Array.isArray(response.data)) {
        setItems(response.data);
      }
    }).catch(() => {});
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

  const leafletHtml = getLeafletHTML(initialPosition[0], initialPosition[1], points);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={30} color="#2D9CDB" />
      </TouchableOpacity>
      <Text style={styles.title}>😃 Bem Vindo!</Text>
      <Text style={styles.description}>Encontre no mapa um ponto.!</Text>
      <View style={styles.mapContainer}>
        {React.createElement('iframe', {
          srcDoc: leafletHtml,
          style: {
            width: '100%',
            height: '100%',
            border: '0',
          },
          title: 'Mapa Leaflet',
        })}
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
              <Image style={{ width: 42, height: 42 }} source={{ uri: item.image_url }} resizeMode="contain" />
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
    paddingTop: 40,
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
