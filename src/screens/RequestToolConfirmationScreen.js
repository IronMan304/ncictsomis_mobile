// RequestToolConfirmationScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RequestToolConfirmationScreen = ({ onClose }) => {
  const handleOnClose = () => {
    onClose(); // Close the confirmation screen
    //onRefetch(); // Refetch data
  };
  return (
    <View style={styles.container}>
      <Text style={styles.confirmationText}>Equipment Request submitted successfully!</Text>
      <TouchableOpacity style={styles.okButton} onPress={handleOnClose}>
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

export default RequestToolConfirmationScreen;
