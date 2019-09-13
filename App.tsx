import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginSignup from './src/Auth/LoginSignup';

export default function App() {
  return (
    <LoginSignup />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
