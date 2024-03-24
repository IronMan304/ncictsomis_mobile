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
      {/* <Text style={styles.companyName}>DIAGCARE</Text> */}
      <Spinner visible={isLoading} textContent={'Loading...'} textStyle={styles.spinnerText} />
      <View style={styles.wrapper}>
        {/* <Text style={styles.title}>Laboratory Login</Text> */}
        {/* <Image
      source={require('../logo.png')} // Update the path accordingly
      style={styles.logo}
    /> */}
    <View style={styles.header}>
    <Image
      source={require('../ncictso.png')} // Update the path accordingly
      style={styles.logo1}
    />
    </View>
   
    {/* <Text style={styles.companyName}>DIAGCARE</Text> */}

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

        {/* <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Register here</Text>
          </TouchableOpacity>
        </View> */}
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
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2196F3'
  },
  wrapper: {
    width: '80%',
    padding: 20,
    backgroundColor: '#E1F5FE', // Light blue background for the form in light mode
    borderRadius: 10,
    elevation: 3,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  registerText: {
    marginRight: 5,
  },
  link: {
    color: '#2196F3', // Blue color for the register link
  },
  spinnerText: {
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginTop: -10,
    marginBottom: 8
  },
  logo: {
    width: 100, // Set the width of your logo
    height: 100, // Set the height of your logo
    resizeMode: 'contain', // Adjust the resizeMode as needed
    marginBottom: 20, // Add margin as needed
  },
  logo1: {
    width: 260, // Set the width of your logo
    height: 100, // Set the height of your logo
    // resizeMode: 'contain', // Adjust the resizeMode as needed
    // marginBottom: 20, // Add margin as needed
    resizeMode: 'contain', // Adjust the resizeMode as needed
    //marginRight: 10, // Add margin as needed
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the content horizontally
    marginBottom: 20,
  },
});

export default LoginScreen;
