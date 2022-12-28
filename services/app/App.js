import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight  } from 'react-native';
import * as Location from 'expo-location';
import React, { useState,  useEffect } from 'react';
import locationHandler from './models/locationHandler'
import scooterHandler from './models/scooterHandler'
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";
import UserInfo from './components/userInfo'
const parkingIcon = require('./assets/parking.png')
const scooterIcon = require('./assets/scootericon.png')
const qrIcon = require('./assets/qrcode.png')
const userIcon = require('./assets/user.png')

const DEFAULT_COORDINATE = {
  lat: 59.334591,
  lng: 18.063240,
};

export default function App() {
  const [parking, setParking] = useState(null);
  const [scooters, setScooters] = useState(null);
  const [userInfoActive, setUserInfoActive] = useState(0);
  const [userCity, setUserCity] = useState("stockholm")
  const [markers, setMarkers] = useState(null);
  const [rideActive, setRideActive] = useState(false);
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
        //const currentLocation = await Location.getCurrentPositionAsync({});
        setlatLng({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        })
        console.log(latLng)
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
        //let userLocation = await Location.reverseGeocodeAsync({latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude})
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
      if(!rideActive){
        let data = await locationHandler.fetchLocations(userCity)
        let marks = data.map ((e, i) => {return <Marker key={i} description={"Laddplats: " + String(e.charging) + "  Rate:" + (e.rate)} coordinate={{latitude:e.properties.lat, longitude:e.properties.lng} }>
        <Image
        source={parkingIcon}
        style={{height: 20, width: 20}}
        />
        </Marker>})
        setMarkers(marks);
      } else {
        let data = await scooterHandler.fetchScooters(userCity)
        let marks = data.map ((e, i) => { return <Marker key={i} description={"Status: " + e.status + " Battery: " +  e.properties.battery+ "%"} coordinate={{latitude:e.properties.lat, longitude:e.properties.lng}}>
        <Image
        source={scooterIcon}
        style={{height: 20, width: 20}}
        />
        </Marker>})
        setMarkers(marks);
      }
    })();
  }, [latLng]);

  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar style="auto" />
        <MapView
        style={styles.map}
        region={latLng}
        followsUserLocation={false}
        showsUserLocation={true}
        >
          {markers}
        </MapView>
      <View style={styles.footer}>
        <View style={styles.footer_box}>
          <Image source={qrIcon} style={{height: 90, width: 90}}></Image>
        </View>
          <Text style={styles.footer_text}>Skanna och åk!</Text>
          <TouchableHighlight style={{position: 'absolute', right: 0}}  onPress={() => {userInfoActive == 0 ? setUserInfoActive(1): setUserInfoActive(0)}}>
          <Image source={userIcon} style={{height: 35, width: 35, position: 'absolute', right: 0, bottom: 1}}></Image>
          </TouchableHighlight>
          {userInfoActive == 1?
          <UserInfo></UserInfo>:
          <></>
          }
      </View>
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
    flexBasis: "auto",
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
    position: "absolute",
    top: -70,
    backgroundColor: "#FF4527",
    borderRadius: 15,
    borderWidth: 10,
    borderColor: "#D0361D"
  },
  footer_text: {
    color: "white",
    marginTop: 40,
    marginBottom: 30,
    fontSize: 20,
    fontWeight: "bold"
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
