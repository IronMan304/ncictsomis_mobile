import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { BASE_URL } from '../config';

const ProfileInfoScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const { userInfo, isLoading, logout, switchAccount } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const token = userInfo.token;
      const response = await axios.get(`${BASE_URL}/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(response.data.borrower);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
    setRefreshing(false);
  };

  const onRefresh = () => {
    fetchData();
  };

  const navigateToRequestHistory = () => {
    navigation.navigate('EquipmentRequestHistoryScreen');
  };

  const navigateToServiceRequestHistory = () => {
    navigation.navigate('ServiceRequestHistoryScreen');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Animatable.View style={styles.profileContainer} animation="fadeInDown">
        {/* <Image source={require('../ncictso.png')} style={styles.profilePicture} /> */}
        {profileData && (
          <View>
            {/* <Text style={styles.name}>
              {profileData.first_name} {profileData.middle_name} {profileData.last_name}
            </Text> */}
            <View style={styles.infoContainer}>
              {/* <Icon name="person" size={24} color="#333" /> */}
              <Text style={styles.infoLabel}>ID NUmber:</Text>
              <Text style={styles.infoValue}>{profileData.id_number}</Text>
            </View>
            <View style={styles.infoContainer}>
              {/* <Icon name="person" size={24} color="#333" /> */}
              <Text style={styles.infoLabel}>Full Name:</Text>
              <Text style={styles.infoValue}>{profileData.first_name} {profileData.middle_name} {profileData.last_name}</Text>
            </View>
            
            <View style={styles.infoContainer}>
              {/* <Icon name="person" size={24} color="#333" /> */}
              <Text style={styles.infoLabel}>Gender:</Text>
              <Text style={styles.infoValue}>{profileData.gender}</Text>
            </View>
            <View style={styles.infoContainer}>
              {/* <Icon name="person" size={24} color="#333" /> */}
              <Text style={styles.infoLabel}>Contact Number:</Text>
              <Text style={styles.infoValue}>{profileData.contact_number}</Text>
            </View>
            <View style={styles.infoContainer}>
              {/* <Icon name="person" size={24} color="#333" /> */}
              <Text style={styles.infoLabel}>College:</Text>
              <Text style={styles.infoValue}>{profileData.college}</Text>
            </View>
            <View style={styles.infoContainer}>
              {/* <Icon name="person" size={24} color="#333" /> */}
              <Text style={styles.infoLabel}>Course:</Text>
              <Text style={styles.infoValue}>{profileData.course}</Text>
            </View>
            
            <View style={styles.infoContainer}>
              {/* <Icon name="settings" size={24} color="#333" /> */}
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{profileData.email}</Text>
            </View>
          </View>
        )}
      </Animatable.View>
      <TouchableOpacity style={styles.historyButton} onPress={navigateToRequestHistory}>
        <Text style={styles.historyButtonText}>Equipment Request History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.historyButton} onPress={navigateToServiceRequestHistory}>
        <Text style={styles.historyButtonText}>Service Request History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  profileContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 5,
    color: '#333',
  },
  infoValue: {
    flex: 1,
    color: '#333',
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  historyButton: {
   backgroundColor: '#0a84ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  historyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileInfoScreen;
