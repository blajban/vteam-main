import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import React, { useState,  useEffect } from 'react';
import scooterHandler from '../../models/scooterHandler'
import { BarCodeScanner } from 'expo-barcode-scanner';


const QrModalPopup = ({isModalVisible,setisModalVisible,setRideActive, text, setText}) => {
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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

  export default QrModalPopup;