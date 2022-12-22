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
  const [rideActive, setRideActive] = useState(true);
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
      <StatusBar style="auto" />
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
