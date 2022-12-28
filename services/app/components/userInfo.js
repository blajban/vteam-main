import { StyleSheet, Text, View, SafeAreaView, Image, TouchableHighlight, Modal, Button, TextInput, Pressable   } from 'react-native';
import React, { useState,  useEffect } from 'react';
const plusIcon = require('../assets/plus.png')

const ModalPopup = ({isModalVisible,setisModalVisible, children}) => {
    return (
        <Modal transparent={true} isModalVisible={isModalVisible} animationType="fade">
            <View style={{ flex: 1 , padding: 20, justifyContent: "center", alignItems: "center"}}>
                <View style={{flex: 0.4, backgroundColor: '#fff',
                 width: "90%", height: 100,  marginBottom: 30,
                  borderColor: "black", borderWidth: 1, borderRadius: 20,
                   justifyContent: "center", alignItems: "center", padding: 30}}>
                    <Text style={{fontSize: 25, marginRight: "auto", fontWeight: "bold"}}>Hur mycket vill du lägga in?</Text>
                    <TextInput
                        style={{borderWidth:1, borderColor: "black", width: "50%", marginTop: 20, borderRadius: 5, height: 30}}
                        placeholder="Summa"
                        keyboardType="numeric"
                    />
                    <Pressable style={{backgroundColor:"#2A9D8F",borderRadius: 10, marginTop: 20,height: 50, width: "90%", justifyContent: "center", alignItems: "center"}} onPress={() => setisModalVisible(false)}>
                        <Text style={{fontSize: 25, fontWeight: "bold", color: "white"}}>Bekräfta</Text>
                    </Pressable>
                    <Pressable style={{backgroundColor:"#BF3721",borderRadius: 10, marginTop: 20,height: 50, width: "90%", justifyContent: "center", alignItems: "center"}} onPress={() => setisModalVisible(false)}>
                        <Text style={{fontSize: 25, fontWeight: "bold", color: "white"}}>Avbryt</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

function UserInfo(props) {
    // Fetcha namn o saldo, skicka med som props
    const [isModalVisible, setisModalVisible] = useState(false);
    return (
      <View {...props} style={{flex: 1, backgroundColor: '#fff', width: "80%", marginBottom: 30, borderColor: "#228377", borderWidth: 5, borderRadius: 10}}>
        <View style={{flex: 1, padding: 10}}>
            <Text style={{fontSize: 40, marginRight: "auto", textDecorationLine: "underline"}}>Förnamn</Text>
            <Text>Efternamn</Text>
        </View>
        <View style={{flex: 1, backgroundColor: '#84E1D6', width: "90%", height: 80, margin: 10, padding: 10, borderRadius: 10}}>
            <Text>Ditt saldo</Text>
            <Text style={{fontSize: 40, marginRight: "auto", fontWeight: "bold"}}>235 kr</Text>
            {isModalVisible ?<ModalPopup isModalVisible={isModalVisible} setisModalVisible={setisModalVisible}></ModalPopup>: <></> }
            <TouchableHighlight style={{position: 'absolute', right: 0}}  onPress={() => setisModalVisible(true)}>
                <Image source={plusIcon} style={{marginRight: 5, marginTop: 5, position: 'absolute', right: 0,}}></Image>
            </TouchableHighlight>
        </View>
      </View>
    );
  }

export default UserInfo;