import { StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import React, { useState } from 'react';


function LoginPage(props) {
  let pollInterval

  async function req(){
    const response = await fetch("https://github.com/login/device/code", {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: '56fd540d2f775fd52e86'
      })
    })
    const data = await response.json()
    props.setRequest(data)
    startPolling(data);
  }

  async function startPolling(data) {
    console.log(data)
    pollInterval = setInterval(() => {
        checkForAuthentication(data);
    }, data.interval * 2 * 1000)
  }


  async function checkForAuthentication(req) {
    if(!req) return null
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: '56fd540d2f775fd52e86',
        device_code: req.device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
        })
      })
    const data = await response.json();
    if(data.access_token) {
    props.setRequest(data)
    clearInterval(pollInterval)
  }
  }

  return (
    <View style={styles.container}>
      { !props.request ? <Pressable style={styles.button_positive} title="Login" onPress={(e) => { req(); }}>
        <Text style={styles.button_font}>Logga in</Text>
      </Pressable> :
      <>
      <Text>
      Code to enter: {props.request.user_code}
      </Text>
       <Text style={{color: 'blue'}}
      onPress={() => Linking.openURL(props.request.verification_uri)}>
        Click to enter Github
      </Text>
      </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A9D8F',
    borderWidth: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_positiv: {
    backgroundColor:"#FF4527",
    borderRadius: 10,
    marginTop: 20,
    height: 50,
    width: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  button_font: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white"
    }
});

export default LoginPage;