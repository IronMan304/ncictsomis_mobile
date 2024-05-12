// RequestServiceConfirmationScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RequestServiceConfirmationScreen = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.confirmationText}>Service Request submitted successfully!</Text>
      <TouchableOpacity style={styles.okButton} onPress={onClose}>
        <Text style={styles.okButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 20,
    marginBottom: 20,
    color: 'black',
  },
  okButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  okButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RequestServiceConfirmationScreen;
