import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Modal, Pressable, Button } from 'react-native';
import * as Location from 'expo-location';
import React, { useState,  useEffect } from 'react';
import locationHandler from './models/locationHandler'
import scooterHandler from './models/scooterHandler'
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";
import UserInfo from './components/userInfo'
import { BarCodeScanner } from 'expo-barcode-scanner';
const parkingIcon = require('./assets/parking.png')
const scooterIcon = require('./assets/scootericon.png')
const qrIcon = require('./assets/qrcode.png')
const parkScooterIcon = require('./assets/parkScooter.png')
const userIcon = require('./assets/user.png')

const QrModalPopup = ({isModalVisible,setisModalVisible,setRideActive, text, setText, children}) => {
  const [scanned, setScanned] = useState(false)
  const askForCameraPermission = () => {
    (async() => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted")
    })()
  }

  useEffect(() => {
    askForCameraPermission();
  }, []);

  // what happens when we scan the bar code
  const handleBarCodeScanned = ({type, data}) => {
    setScanned(true)
    setText(data)
  }

  // rent a scooter function
  async function rentScooter() {
    console.log("scooter" + text)
    console.log(await scooterHandler.rentScooter(text, 1))
  }

  // Pupup for qrCodescanner and  renting scooter
  return (
      <Modal transparent={true} isModalVisible={isModalVisible} animationType="fade">
          <View style={styles.modal_container}>
              {!scanned ?
              <View style={styles.barcode_container}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.barcode}
              />
              </View>
              :
              <View style={{ flex: 1 , padding: 20, justifyContent: "center", alignItems: "center"}}>
                <View style={{flex: 0.4, backgroundColor: '#fff',
                  width: "90%", height: 100,  marginBottom: 30,
                  borderColor: "black", borderWidth: 1, borderRadius: 20,
                  justifyContent: "center", alignItems: "center", padding: 30}}>
                  <Text style={styles.big_text_in_modal}>
                    Vill du låsa upp scooter: {text} ?
                  </Text>
                  <Text style={{fontSize: 15, marginRight: "auto", fontWeight: "bold"}}>
                    Battery life:
                  </Text>
                  <Pressable style={styles.button_positiv} onPress={() => {setisModalVisible(false), setRideActive(true), rentScooter()}}>
                        <Text style={styles.big_text_in_modal}>Lås upp</Text>
                    </Pressable>
                </View>
              </View>
              }
            <Pressable style={styles.button_negative} onPress={() => setisModalVisible(false)}>
                        <Text style={styles.big_text_in_modal}>Avbryt</Text>
            </Pressable>
          </View>
      </Modal>
    )
  }

  async function parkScooter(scooterId){
    console.log(await scooterHandler.parkScooter(scooterId))
  }

export default function App() {
  const [userInfoActive, setUserInfoActive] = useState(0);
  const [userCity, setUserCity] = useState("stockholm")
  const [markers, setMarkers] = useState(null);
  const [rideActive, setRideActive] = useState(false);
  const [text, setText] = useState("not yet scanned")
  const [latLng, setlatLng] = useState({
    lat: 59.334591,
    lng: 18.063240,
  });
  const [isModalVisible, setisModalVisible] = useState(false);


/**
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
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        })
    })();
  }, []);
  */
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
      if(rideActive){
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
        console.log(data)
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
        followsUserLocation={true}
        showsUserLocation={true}
        >
          {markers}
        </MapView>
      <View style={styles.footer}>
        <View style={styles.footer_box}>
        {isModalVisible ?<QrModalPopup isModalVisible={isModalVisible} setisModalVisible={setisModalVisible} setRideActive={setRideActive} text={text} setText={setText}></QrModalPopup>: <></> }
        {rideActive ?
          <TouchableHighlight style={{position: 'absolute', right: 0}}  onPress={() => {setRideActive(false), parkScooter(text)}}>
            <Image source={parkScooterIcon} style={styles.footer_box_image}></Image>
          </TouchableHighlight>
        :
          <TouchableHighlight style={{position: 'absolute', right: 0}}  onPress={() => setisModalVisible(true)}>
            <Image source={qrIcon} style={styles.footer_box_image}></Image>
          </TouchableHighlight>
          }
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
  footer_box_image:{
    height: 90,
    width: 90
  },
  footer_text: {
    color: "white",
    marginTop: 40,
    marginBottom: 30,
    fontSize: 20,
    fontWeight: "bold"
  },
  modal_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "rgba(189, 195, 199, .5);"
  },
  big_text_in_modal: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white"
  },
  barcode_container: {
    borderRadius: 30,
    height:300,
    width: 300,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "black"
  },
  barcode:{
    height:300,
    width: 300
  },
  button_positiv: {
    backgroundColor:"#2A9D8F",
    borderRadius: 10,
    marginTop: 20,
    height: 50,
    width: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  button_negative: {
    backgroundColor:"#BF3721",
    borderRadius: 10,
    marginTop: 20,
    height: 50,
    width: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
