import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';



const RegisterScreen = ({navigation}) => {
  const [first_name, set_first_name] = useState(null);
  const [middle_name, set_middle_name] = useState(null);
  const [last_name, set_last_name] = useState(null);
  const [username, set_username] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {isLoading, register} = useContext(AuthContext);

return (
  <View style={styles.container}>
    <Spinner visible={isLoading}/>
    <View style={styles.wrapper}>


    <TextInput 
      style={styles.input}
      value={first_name}
      placeholder="Enter First Name" 
      onChangeText={text => set_first_name(text)}
      />
       <TextInput 
      style={styles.input}
      value={middle_name}
      placeholder="Enter Middle Name" 
      onChangeText={text => set_middle_name(text)}
      />
       <TextInput 
      style={styles.input}
      value={last_name}
      placeholder="Enter Last Name" 
      onChangeText={text => set_last_name(text)}
      />
        <TextInput 
      style={styles.input}
      value={username}
      placeholder="Enter  username" 
      onChangeText={text => set_username(text)}
      />
      <TextInput 
      style={styles.input}
      value={email}
      placeholder="Enter email" 
      onChangeText={text => setEmail(text)}
      />

      <TextInput style={styles.input} placeholder="Enter password" 
      secureTextEntry
      value={password}
      onChangeText={text => setPassword(text)}
      />

      <Button title="Register" 
      onPress={() => {
        register(first_name, middle_name, last_name, username, email, password);
      }} />

      <View style={{flexDirection: 'row', marginTop: 20}}>
        <Text>Already have an accout?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '80%',
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  link: {
    color: 'blue'
  }
})

export default RegisterScreen