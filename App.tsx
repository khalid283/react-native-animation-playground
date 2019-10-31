import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginSignup from './src/Auth/LoginSignup';
import Shopping from './src/Shopping/Shopping';

export default function App() {
  return (
    <Shopping />
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
