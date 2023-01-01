import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight } from 'react-native';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Marker, MapView } from 'react-native-maps';
import locationHandler from './models/locationHandler';
import scooterHandler from './models/scooterHandler';
import UserInfo from './components/userInfo';
import QrModalPopup from './components/modals/qrCodeModal';
import EndRideModal from './components/modals/endRideModal';

const parkingIcon = require('./assets/parking.png');
const scooterIcon = require('./assets/scootericon.png');
const qrIcon = require('./assets/qrcode.png');
const parkScooterIcon = require('./assets/parkScooter.png');
const userIcon = require('./assets/user.png');

export default function App() {
  const [userInfoActive, setUserInfoActive] = useState(0);
  const [userCity, setUserCity] = useState('stockholm');
  const [markers, setMarkers] = useState(null);
  const [rideActive, setRideActive] = useState(false);
  const [text, setText] = useState('not yet scanned');
  const [isModalVisible, setisModalVisible] = useState(false);
  const [isEndRideModalVisible, setisEndRideModalVisible] = useState(false);

  // Fetches users locations city
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      const userLocation = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      switch (userLocation[0].city) {
        case 'Stockholm':
          setUserCity('stockholm');
          break;
        case 'Göteborg':
          setUserCity('goteborg');
          break;
        case 'Malmö':
          setUserCity('malmo');
          break;

        default:
          break;
      }
    })();
  }, []);

  // Fetches locations or scooters depending on if ride is active, also fetches for right location
  useEffect(() => {
    (async () => {
      if (rideActive) {
        const data = await locationHandler.fetchLocations(userCity);
        const marks = data.map((e, i) => {
          return (
          <Marker key={i} description={"Laddplats: " + String(e.charging) + "  Rate:" + (e.rate)} coordinate={{latitude:e.properties.lat, longitude:e.properties.lng} }>
            <Image source={parkingIcon} style={{height: 20, width: 20}} />
          </Marker>)
          });
        setMarkers(marks);
      } else {
        const data = await scooterHandler.fetchScooters(userCity);
        const marks = data.map((e, i) => {
          return (
          <Marker key={i} description={"Status: " + e.status + " Battery: " +  e.properties.battery+ "%"} coordinate={{latitude:e.properties.lat, longitude:e.properties.lng}}>
            <Image source={scooterIcon} style={{height: 20, width: 20}} />
          </Marker>)
          });
        setMarkers(marks);
      }
    })();
  }, [rideActive, userCity]);

  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar style="auto" />
      <MapView
        style={styles.map}
        followsUserLocation={true}
        showsUserLocation={true}
      >
        {markers}
      </MapView>
      <View style={styles.footer}>
        <View style={styles.footer_box}>
          {isModalVisible ?
            <QrModalPopup
              isModalVisible={isModalVisible}
              setisModalVisible={setisModalVisible}
              setRideActive={setRideActive}
              text={text}
              setText={setText}
            >
            </QrModalPopup>:
          <></> }

          {isEndRideModalVisible ?
            <EndRideModal
              isModalVisible={isModalVisible}
              setisEndRideModalVisible={setisEndRideModalVisible}
              setRideActive={setRideActive}
              text={text}
              setText={setText}
            >
            </EndRideModal>: <></> }
          {rideActive ?
            <TouchableHighlight style={{position: 'absolute', right: 0}}  onPress={() => {setisEndRideModalVisible(true)}}>
            <Image source={parkScooterIcon} style={styles.footer_box_image}></Image>
          </TouchableHighlight>:
          <TouchableHighlight style={{position: 'absolute', right: 0}}  onPress={() => setisModalVisible(true)}>
            <Image source={qrIcon} style={styles.footer_box_image}></Image>
          </TouchableHighlight>
          }
        </View>
        <Text style={styles.footer_text}> {rideActive ? "Avsluta resa" : "Skanna och åk!"}</Text>
        <TouchableHighlight style={{position: 'absolute', right: 0}}  onPress={() => {userInfoActive == 0 ? setUserInfoActive(1): setUserInfoActive(0)}}>
          <Image source={userIcon} style={{height: 35, width: 35, position: 'absolute', right: 0, bottom: 1}}></Image>
        </TouchableHighlight>

        {userInfoActive === 1 ? <UserInfo></UserInfo> : <></>}
      </View>
    </SafeAreaView>
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
    flexBasis: 'auto',
    width: '100%',
    backgroundColor: '#2A9D8F',
    borderTopColor: '#228377',
    borderTopWidth: 10,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer_box: {
    height: 110,
    width: 110,
    position: 'absolute',
    top: -70,
    backgroundColor: '#FF4527',
    borderRadius: 15,
    borderWidth: 10,
    borderColor: '#D0361D',
  },
  footer_box_image: {
    height: 90,
    width: 90,
  },
  footer_text: {
    color: 'white',
    marginTop: 40,
    marginBottom: 30,
    fontSize: 20,
    fontWeight: 'bold',
  },
  button_positiv: {
    backgroundColor: '#2A9D8F',
    borderRadius: 10,
    marginTop: 20,
    height: 50,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_negative: {
    backgroundColor: '#BF3721',
    borderRadius: 10,
    marginTop: 20,
    height: 50,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
