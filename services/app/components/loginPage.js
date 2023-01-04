import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
WebBrowser.maybeCompleteAuthSession();


// Endpoint
const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/settings/connections/applications/56fd540d2f775fd52e86',
  };

function LoginPage(props) {

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '56fd540d2f775fd52e86',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        native: 'myapp:/auth',
        useProxy: true,
      })
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.button_positive} disabled={!request} title="Login" onPress={() => { promptAsync(); }}>
        <Text style={styles.button_font}>Logga in</Text>
      </Pressable>
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