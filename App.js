import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import * as Keychain from 'react-native-keychain';
import Router from './router';

const config = {
  service: 'secureBiometric',
  securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
  accessControl: null,
  storage: Keychain.STORAGE_TYPE.AES,
};

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ backgroundColor: "white" }} />
      <Router />
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginHorizontal: 24,
    alignItems: 'center',
  },
  image: {
    width: 270,
    height: 390,
    alignSelf: 'center'
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: "#CBCCD5",
    marginBottom: 4,
    marginTop: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#212131',
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    backgroundColor: '#FF815E',
    borderRadius: 30,
  },
  textButton: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  }
});