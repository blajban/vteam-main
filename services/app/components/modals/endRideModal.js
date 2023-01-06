import { StyleSheet, Text, View,  Modal, Pressable } from 'react-native';
import React from 'react';
import scooterHandler from '../../models/scooterHandler'


async function parkScooter(text) {
    console.log(await scooterHandler.parkScooter(text))
  }

const EndRideModal = ({ isModalVisible, setisEndRideModalVisible, setRideActive, text }) => {
    return (
        <Modal transparent={true} isModalVisible={isModalVisible} animationType="fade">
            <View style={styles.container}>
                <View style={styles.modal_container}>
                    <Text style={styles.font}>Vill du avsluta resan?</Text>
                    <Pressable style={styles.button_positive} onPress={() => {setisEndRideModalVisible(false); setRideActive(false); parkScooter(text)}}>
                        <Text style={styles.button_font}>Bekräfta</Text>
                    </Pressable>
                    <Pressable style={styles.button_negative} onPress={() => setisEndRideModalVisible(false)}>
                        <Text style={styles.button_font}>Avbryt</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    modal_container: {
        flex: 0.4,
        backgroundColor: '#fff',
        width: "90%",
        height: 100,
        marginBottom: 30,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },
    font:{
        fontSize: 25,
        marginRight: "auto",
        fontWeight: "bold"
    },
    button_positive : {
        backgroundColor:"#2A9D8F",
        borderRadius: 10,
        marginTop: 20,
        height: 50,
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
    },
    button_negative : {
        backgroundColor: "#BF3721",
        borderRadius: 10,
        marginTop: 20,
        height: 50,
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
    },
    button_font: {
        fontSize: 25,
        fontWeight: "bold",
        color: "white"
    }
})

export default EndRideModal;