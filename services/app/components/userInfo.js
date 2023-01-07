import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import React, { useState, useEffect } from 'react';
import ModalPopup from './modals/userModal';
import userHandler from '../models/userHandler'
const plusIcon = require('../assets/plus.png');

function UserInfo(props) {
  const [isModalVisible, setisModalVisible] = useState(false);
  const [userInfo, setUserInfo]  = useState(null)
  useEffect(() => {
    (async () => {
        setUserInfo(await userHandler.getUser(props.token, props.loginId, props.loginId))
        console.log(await userHandler.getUser(props.token, props.loginId, props.loginId))
    })();
  }, []);

return (
  <View {...props} style={styles.container}>
    {!userInfo ? <></>:
    <>
    <View style={styles.name_container}>
      <Text style={styles.name_font}>{userInfo.name}</Text>
      <Text>{userInfo.mail}</Text>
    </View>
    <View style={styles.credit_container} testID={'saldoContainer'}>
      <Text>Ditt saldo</Text>
      <Text style={styles.font_credit}>{userInfo.balance}</Text>
      {isModalVisible ?<ModalPopup isModalVisible={isModalVisible} setisModalVisible={setisModalVisible} token={props.token} loginId={props.loginId}></ModalPopup>:
    <></>}
      <TouchableHighlight style={{position: 'absolute', right: 0}} onPress={() => setisModalVisible(true)}>
        <Image source={plusIcon} style={{marginRight: 5, marginTop: 5, position: 'absolute', right: 0 } } />
      </TouchableHighlight>
    </View>
    </>
    }
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '80%',
    marginBottom: 30,
    borderColor: '#228377',
    borderWidth: 5,
    borderRadius: 10,
  },
  name_container: {
    flex: 1,
    padding: 10,
  },
  name_font: {
    fontSize: 40,
    marginRight: 'auto',
    textDecorationLine: 'underline',
  },
  credit_container: {
    flex: 1,
    backgroundColor: '#84E1D6',
    width: '90%',
    height: 80,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  font_credit: {
    fontSize: 40,
    marginRight: 'auto',
    fontWeight: 'bold',
  },
});

export default UserInfo;
