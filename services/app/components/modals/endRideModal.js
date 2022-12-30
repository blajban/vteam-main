import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Modal, Button, TextInput, Pressable   } from 'react-native';
import React, { useState,  useEffect } from 'react';

const EndRideModal = ({isModalVisible, setisEndRideModalVisible, setRideActive, children}) => {
    return (
        <Modal transparent={true} isModalVisible={isModalVisible} animationType="fade">
            <View style={{ flex: 1 , padding: 20, justifyContent: "center", alignItems: "center"}}>
                <View style={{flex: 0.4, backgroundColor: '#fff',
                 width: "90%", height: 100,  marginBottom: 30,
                  borderColor: "black", borderWidth: 1, borderRadius: 20,
                   justifyContent: "center", alignItems: "center", padding: 30}}>
                    <Text style={{fontSize: 25, marginRight: "auto", fontWeight: "bold"}}>Vill du avsluta resan?</Text>
                    <Pressable style={{backgroundColor:"#2A9D8F",borderRadius: 10, marginTop: 20,height: 50, width: "90%", justifyContent: "center", alignItems: "center"}} onPress={() => {setisEndRideModalVisible(false); setRideActive(false)}}>
                        <Text style={{fontSize: 25, fontWeight: "bold", color: "white"}}>Bekräfta</Text>
                    </Pressable>
                    <Pressable style={{backgroundColor:"#BF3721",borderRadius: 10, marginTop: 20,height: 50, width: "90%", justifyContent: "center", alignItems: "center"}} onPress={() => setisEndRideModalVisible(false)}>
                        <Text style={{fontSize: 25, fontWeight: "bold", color: "white"}}>Avbryt</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}



module.exports = EndRideModal;