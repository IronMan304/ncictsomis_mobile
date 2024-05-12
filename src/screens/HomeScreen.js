import React, {useContext} from 'react';
import {Button, StyleSheet, Text, View, Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

const HomeScreen = () => {
  const {userInfo, isLoading, logout} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Text style={styles.welcome}>Welcome </Text>
      <Text style={styles.welcome}>{userInfo.user.first_name} {userInfo.user.middle_name} {userInfo.user.last_name}</Text>
      {/* <Button title="Logout" color="red" onPress={logout} /> */}
      <Image
  source={require('../ncictso.png')} // Update the path accordingly
  style={styles.logo}
  resizeMode="contain" // This will make the image fit while maintaining aspect ratio
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
    color: 'black'
  },
  logo: {
    width: '80%', // Set width to 80% of the container
    height: undefined, // Let height be automatically calculated based on aspect ratio
    aspectRatio: 1, // You can adjust aspect ratio as needed
  },
});


export default HomeScreen;