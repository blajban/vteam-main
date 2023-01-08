import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import scooterHandler from '../../models/scooterHandler';

/**
 * rentScooter function, calls on scooterHandler.rentscooter.
 *
 * @async
 * @param {string} text - id of the scooter to rent
 * @param {string} loginId - The users id.
 * @param {string} token - github token.
 */
async function rentScooter(text, loginId, token) {
  await scooterHandler.rentScooter(text, loginId, token);
}

const QrModalPopup = ({ isModalVisible, setisModalVisible, setRideActive, text, setText, token, loginId }) => {
  const [scanned, setScanned] = useState(false);

  /**
   * Asks user for camera permission.
   */
  const askForCameraPermission = () => {
    (async () => {
      await BarCodeScanner.requestPermissionsAsync();
    })();
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  /**
   * When scanned sets scooter id as text.
   * @param {string} data - Scooter id
   */
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setText(data);
  };

  // Pupup for qrCodescanner and  renting scooter
  return (
      <Modal transparent={true} isModalVisible={isModalVisible} animationType='fade'>
          <View style={styles.modal_container}>
            {!scanned
              ? <View style={styles.barcode_container}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={styles.barcode}
            />
            </View>
              : <View style={styles.bigger_modal_view}>
              <View style={styles.little_modal_view}>
                <Text style={styles.big_text_in_modal}>
                  Vill du låsa upp scooter: {text} ?
                </Text>
                <Pressable style={styles.button_positiv} onPress={() => { setisModalVisible(false); setRideActive(true); rentScooter(text, loginId, token); }}>
                  <Text style={styles.big_text_in_modal}>Lås upp</Text>
                </Pressable>
                <Pressable style={styles.button_negative} onPress={() => setisModalVisible(false)}>
                  <Text style={styles.big_text_in_modal}>Avbryt</Text>
                </Pressable>
              </View>
            </View>
            }
          </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'rgba(189, 195, 199, .5);',
  },
  bigger_modal_view: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  little_modal_view: {
    flex: 0.4,
    backgroundColor: '#ffffff',
    width: '90%',
    height: 50,
    marginBottom: 30,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  big_text_in_modal: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  barcode_container: {
    borderRadius: 30,
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'black',
  },
  barcode: {
    height: 300,
    width: 300,
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

export default QrModalPopup;
