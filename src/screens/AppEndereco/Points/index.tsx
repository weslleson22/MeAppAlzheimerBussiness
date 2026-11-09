import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, StatusBar } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { SvgUri } from "react-native-svg";
import api2 from "../../../services/api2";
import * as Location from "expo-location";
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

function getLeafletHTML(initialLat: number, initialLng: number) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * {
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
    }
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-weight: 700;
      color: #FFFFFF;
      font-size: 12px;
      line-height: 22px;
      padding: 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .leaflet-control-attribution {
      font-size: 9px !important;
      background: rgba(255,255,255,0.7) !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: false }).setView([${initialLat}, ${initialLng}], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var markersLayer = L.layerGroup().addTo(map);

    function onMarkerClick(id) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: id }));
      }
    }

    window.setView = function(lat, lng) {
      if (map && lat && lng) {
        map.setView([lat, lng], 14);
      }
    };

    window.setPoints = function(points) {
      if (!markersLayer) return;
      markersLayer.clearLayers();
      if (!Array.isArray(points) || points.length === 0) return;

      points.forEach(function(point) {
        var lat = Number(point.latitude);
        var lng = Number(point.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        var icon = L.divIcon({
          className: '',
          html: '<div class="custom-marker" onclick="onMarkerClick(' + point.id + ')">' +
                  '<img src="' + (point.image_url || '') + '" onerror="this.style.display=\\'none\\'" />' +
                  '<span>' + (point.name || '') + '</span>' +
                '</div>',
          iconSize: [90, 68],
          iconAnchor: [45, 68]
        });

        var marker = L.marker([lat, lng], { icon: icon });
        marker.on('click', function() {
          onMarkerClick(point.id);
        });
        marker.addTo(markersLayer);
      });
    };
  </script>
</body>
</html>
  `;
}

export function TelaPoints() {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([-23.55052, -46.633308]);

  const webViewRef = useRef<any>(null);
  const navigation = useNavigation<any>();
  const route = useRoute();
  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadPosition() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização');
          return;
        }

        const location =
          (await Location.getLastKnownPositionAsync({})) ||
          (await Location.getCurrentPositionAsync({}));
        const { latitude, longitude } = location.coords;
        const newPos: [number, number] = [Number(latitude), Number(longitude)];
        setInitialPosition(newPos);
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`window.setView && window.setView(${newPos[0]}, ${newPos[1]}); true;`);
        }
      } catch (_error) {
        // Ignora erro silenciosamente caso GPS demore a responder
      }
    }
    loadPosition();
  }, []);

  useEffect(() => {
    if (selectedItems.length === 0) {
      setPoints([]);
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`window.setPoints && window.setPoints([]); true;`);
      }
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
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`window.setPoints && window.setPoints(${JSON.stringify(response.data)}); true;`);
        }
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
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`window.setPoints && window.setPoints(${JSON.stringify(res.data)}); true;`);
          }
        }
      }).catch(() => {});
    });
  }, [selectedItems]);

  useEffect(() => {
    api2.get('items').then(response => {
      if (Array.isArray(response.data)) {
        setItems(response.data);
      }
    }).catch(() => {
      setTimeout(() => {
        api2.get('items').then(response => {
          if (Array.isArray(response.data)) {
            setItems(response.data);
          }
        }).catch(() => {});
      }, 1500);
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

  function handleWebViewMessage(event: any) {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data && data.type === 'markerPress' && data.id) {
        handlerNavigateToDetail(data.id);
      }
    } catch (_e) {}
  }

  function handleWebViewLoaded() {
    if (webViewRef.current && points.length > 0) {
      webViewRef.current.injectJavaScript(`window.setPoints && window.setPoints(${JSON.stringify(points)}); true;`);
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
        {React.createElement(WebView as any, {
          ref: webViewRef,
          originWhitelist: ["*"],
          source: { html: getLeafletHTML(initialPosition[0], initialPosition[1]) },
          style: styles.map,
          onMessage: handleWebViewMessage,
          onLoadEnd: handleWebViewLoaded,
          javaScriptEnabled: true,
          domStorageEnabled: true,
          scalesPageToFit: false,
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
              <SvgUri width={42} height={42} uri={item.image_url} onError={() => {}} />
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
    paddingTop: 20 + (Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 20),
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
    backgroundColor: '#f2efe9',
  },
  map: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
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
