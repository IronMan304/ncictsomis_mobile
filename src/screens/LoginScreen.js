import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, login, error } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} textContent={'Loading...'} textStyle={styles.spinnerText} />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Image
            source={require('../norsu.png')} // Update the path accordingly
            style={styles.logo1}
          />
          <Image
            source={require('../ncictso.png')} // Update the path accordingly
            style={styles.logo2}
          />
        </View>
        <Text style={styles.loginWork}>NORSU CICTSO</Text> 
        <View>
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Enter your email"
            onChangeText={(text) => setEmail(text)}
          />
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </View>

       

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            login(email, password);
          }}
        >
          <Text style={styles.buttonText}>Login</Text> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5', // Light background color
  },
  wrapper: {
    width: '90%',
    padding: 20,
    backgroundColor: '#E1F5FE', // Light blue background for the form in light mode
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: 'black'
  },
  loginButton: {
    backgroundColor: '#2196F3', // Green color for the login button
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginTop: -10,
    marginBottom: 8
  },
  logo1: {
    width: 270, // Set the width of your square logo
    height: 150, // Set the height of your square logo
    resizeMode: 'contain', // Adjust the resizeMode as needed
    marginRight: -22, 
    marginLeft: 15, 
  },
  logo2: {
    width: 100, // Set the width of your circle logo
    height: 82, // Set the height of your circle logo
    resizeMode: 'contain', // Adjust the resizeMode as needed
    marginTop: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center', // Center logos horizontally
    alignItems: 'center', // Center logos vertically
    marginBottom: 20,
  },
  loginWork: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: -40,
    color: 'black',
    textAlign: 'center', // Centering the text
  },
});

export default LoginScreen;
