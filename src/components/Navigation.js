import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabIcon from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { AuthContext } from '../context/AuthContext';
import PatientInfoScreen from '../screens/PatientInfoScreen';
import RequestToolScreen from '../screens/RequestToolScreen';
import ToolSelectionScreen from '../screens/ToolSelectionScreen';
// import PatientInfoScreen from '../screens/PatientInfoScreen';
// import BookingsScreen from '../screens/BookingsScreen';
// import ServiceResultScreen from '../screens/ServiceResultScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'documents-outline' : 'documents';
        } else if (route.name === 'Account') {
          iconName = focused ? 'person-circle' : 'person-circle-outline';
        }

        // You can return any component that you like here!
        return <TabIcon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Request" component={RequestToolScreen} />
    <Tab.Screen name="Account" component={PatientInfoScreen} />
  </Tab.Navigator>
);

const Navigation = () => {
  const { userInfo, isLoading, logout, switchAccount } = useContext(AuthContext);
  const [patientInfo, setPatientInfo] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userInfo && userInfo.token ? (
          <>
          
            
            <Stack.Screen
            name="DiagCare"
            component={TabNavigator}
            options={{
              headerTitle: () => (
                <View style={styles.header}>
                  <Image
                    source={require('../ncictso.png')} // Update the path accordingly
                    style={styles.logo}
                  />
                  <Text style={styles.headerTitle}>NORSU CICTSO</Text>
                </View>
              ),
              headerStyle: {
                backgroundColor: '#E1F5FE', // Light blue background for the header
              },
            }}
          />
             <Stack.Screen name="ToolSelection" component={ToolSelectionScreen} />
            {/* <Stack.Screen name="ServiceResultScreen" 
            component={ServiceResultScreen} 
            options={{
              headerTitle: () => (
                <View style={styles.header}>
                  <Image
                    source={require('../logo.png')} // Update the path accordingly
                    style={styles.logo}
                  />
                  <Text style={styles.headerTitle}>DiagCare</Text>
                </View>
              ),
              headerStyle: {
                backgroundColor: '#E1F5FE', // Light blue background for the header
              },
            }}
            /> */}
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            {/* Uncomment the Register screen when needed */}
            {/* <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  accountTabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 10, // Add some spacing between the logout button and the tab icon
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Navigation;