import { StyleSheet, Text, View, Pressable, Linking, ActivityIndicator } from 'react-native';
import React from 'react';
import authHandler from '../models/authHandler';

function LoginPage(props) {
  let pollInterval;

  /**
   * Polling github to see if user has entered the code.
   *
   * @async
   * @param {object} req Contains information from github;
   */
  async function checkForAuthentication(req) {
    if (!req) return null;
    const data = await authHandler.checkForAuth(req);
    if (data.access_token) {
      props.setRequest(data);
      clearInterval(pollInterval);
      props.setToken(data.access_token);
      props.setLoginId(await authHandler.getGitHubUser(data.access_token));
      props.setIsLogged(true);
    }
  }

  /**
   * Starts the interval for polling.
   *
   * @async
   * @param {object} req Contains information from github;
   */
  async function startPolling(req) {
    pollInterval = setInterval(() => {
      checkForAuthentication(req);
    }, req.interval * 2 * 1000);
  }

  /**
   * Makes the initial call to github auth service.
   */
  async function reqe() {
    const data = await authHandler.req();
    props.setRequest(data);
    startPolling(data);
  }

  return (
    <View style={styles.container}>
      { !props.request ? <Pressable style={styles.button_positive} title="Login" onPress={() => { reqe(); }}>
      <Text style={styles.button_font}>Logga in</Text>
      </Pressable>
        : <>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={styles.code_font}>
        Code: {props.request.user_code}
      </Text>
       <Text style={{ color: 'blue' }}
        onPress={() => Linking.openURL(props.request.verification_uri)}>
        Click to open browser
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
    backgroundColor: '#FF4527',
    borderRadius: 10,
    marginTop: 20,
    height: 50,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_font: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  code_font: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default LoginPage;
