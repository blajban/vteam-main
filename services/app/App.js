import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView  } from 'react-native';
import { LatLng, LeafletView } from 'react-native-leaflet-view';
import * as Location from 'expo-location';
import React, { useState,  useEffect } from 'react';
import locationHandler from './models/locationHandler'
import scooterHandler from './models/scooterHandler'

const DEFAULT_COORDINATE = {
  lat: 59.334591,
  lng: 18.063240,
};

export default function App() {
  const [parking, setParking] = useState(null);
  const [scooters, setScooters] = useState(null);
  const [userCity, setUserCity] = useState("stockholm")
  const [markers, setMarkers] = useState(null);
  const [rideActive, setRideActive] = useState(true);
  const [latLng, setlatLng] = useState({
    lat: 59.334591,
    lng: 18.063240,
  });

// Fetches user location and sets that as map center
useEffect(() => {
    (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMessage('Permission to access location was denied');
            return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setlatLng({
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude
        })
    })();
  }, []);

// Fetches users locations city
  useEffect(() => {
    (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMessage('Permission to access location was denied');
            return;
        }
        let userLocation = await Location.reverseGeocodeAsync({latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude})
        switch (userLocation[0].city) {
          case "Stockholm":
            setUserCity("stockholm")
            break;
          case "Göteborg":
            setUserCity("goteborg")
            break;
          case "Malmö":
            setUserCity("malmo")
            break;

          default:
            break;
        }
    })();
  }, []);

// Fetches locations or scooters depending on if ride is active, also fetches for right location
  useEffect(() => {
    (async () => {
      let data = [{
        position: latLng,
        icon: '😎',
        size: [32, 32],
      }];
      if(!rideActive){
        data = await locationHandler.fetchLocations(userCity)
        console.log(data)
        let marks = data.map ((e) => {
          return { position: {lat: e.properties. lat, lng: e.properties.lng }, icon: '🅿', size:[32, 32]}
        })
        marks.push({
          position: latLng,
          icon: '😎',
          size: [32, 32],
        })
        setMarkers(marks);
      } else {
        data = await scooterHandler.fetchScooters(userCity)
        let marks = data.map ((e) => {
          return { position: {lat: e.properties. lat, lng: e.properties.lng }, icon: '🛴', size:[32, 32]}
        })
        marks.push({
          position: latLng,
          icon: '😎',
          size: [32, 32],
        })
        setMarkers(marks);
      }
    })();
  }, [latLng]);

  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar style="auto" />
      <LeafletView
          // The rest of your props, see the list below
          mapMarkers={markers}
          mapCenterPosition={latLng}
      />
      <View style={styles.footer}><View style={styles.footer_box}></View><Text style={styles.footer_text}>Skanna och åk!</Text></View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    height: 120,
    width: '100%',
    backgroundColor: '#2A9D8F',
    borderTopColor: "#228377",
    borderTopWidth: 10,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer_box: {
    height: 110,
    width: 110,
    backgroundColor: "#FF4527",
    borderRadius: 15,
    borderWidth: 10,
    borderColor: "#D0361D"
  },
  footer_text: {
    color: "white",
    marginBottom: 80,
    fontSize: 20,
    fontWeight: "bold"
  }
});
