import { StyleSheet, Text, View, Modal, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import userHandler from '../../models/userHandler';

/**
   * updateBalance.
   *
   * @async
   * @param {string} balance - sum to add
   * @param {string} token - token from github
   * @param {string} loginId - users id
   * @param {string} currentBalance - Current user balance
   */
async function updateBalance(balance, token, loginId, currentBalance) {
  await userHandler.updateUser(token, { _id: loginId, balance: parseInt(balance) + parseInt(currentBalance) }, loginId);
}

const ModalPopup = ({ isModalVisible, setisModalVisible, loginId, token, userInfo, setUserInfoActive }) => {
  const [balance, setBalance] = useState('');
  return (
    <Modal transparent={true} isModalVisible={isModalVisible} animationType='fade'>
      <View style={styles.container}>
        <View style={styles.modal_container}>
          <Text style={styles.font}>Hur mycket vill du lägga in?</Text>
          <TextInput
            style={styles.input}
            onChangeText={ (newText) => setBalance(newText)}
            placeholder='Summa'
            keyboardType='numeric'
            defaultValue={balance}
          />
          <Pressable style={styles.button_positive} onPress={() => { setisModalVisible(false); updateBalance(balance, token, loginId, userInfo.balance); setUserInfoActive(0); }}>
            <Text style={styles.button_font}>Bekräfta</Text>
          </Pressable>
          <Pressable style={styles.button_negative} onPress={() => setisModalVisible(false)}>
            <Text style={styles.button_font}>Avbryt</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_container: {
    flex: 0.4,
    backgroundColor: '#fff',
    width: '90%',
    height: 100,
    marginBottom: 30,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  font: {
    fontSize: 25,
    marginRight: 'auto',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    width: '50%',
    marginTop: 20,
    borderRadius: 5,
    height: 30,
  },
  button_positive: {
    backgroundColor: '#2A9D8F',
    borderRadius: 10,
    marginTop: 20,
    height: 50,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_negative: {
    backgroundColor: '#BF3721',
    borderRadius: 10,
    marginTop: 20,
    height: 50,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_font: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ModalPopup;
