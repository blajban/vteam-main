import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView  } from 'react-native';
import { LatLng, LeafletView } from 'react-native-leaflet-view';
import * as Location from 'expo-location';
import React, { useState,  useEffect } from 'react';
import locationHandler from './models/locationHandler'

const DEFAULT_COORDINATE = {
  lat: 59.334591,
  lng: 18.063240,
};

export default function App() {
  const [parking, setParking] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [latLng, setlatLng] = useState({
    lat: 37.78825,
    lng: -122.4324,
  });


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

  useEffect(() => {
    (async () => {
        setParking(await locationHandler.fetchAllLocations());
    })();
  }, []);
  return (
    <SafeAreaView  style={styles.container}>
      <LeafletView
          // The rest of your props, see the list below
          mapMarkers={[
            {
              position: latLng,
              icon: '😎',
              size: [32, 32],
            },
          ]}
          mapCenterPosition={latLng}
      />
      <StatusBar style="auto" />
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
});
