import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginSignup from './src/Auth/LoginSignup';
import Shopping from './src/Shopping/Shopping';
import ImagePopup from './src/ImagePopup/ImagePopup';

export default function App() {
  return (
    <ImagePopup />
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
