import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';

const ServiceRequestHistory = ({navigation}) => {
  const [requests, setRequests] = useState([]);
  const { userInfo, isLoading, logout, switchAccount } = useContext(AuthContext);
  const [statuses, setStatuses] = useState([]); // State to store statuses
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch requests data from your API using Axios
    const fetchRequests = async () => {
      try {
        const token = userInfo.token;
        const response = await axios.get(`${BASE_URL}/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setRequests(response.data.borrower.service_requests);
      } catch (error) {
        console.error('Error fetching service_requests:', error);
      }
    };

    fetchRequests();
  }, [refreshing]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/requests`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });

        setStatuses(response.data.status); // Set options state with fetched data
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatuses();
  }, [userInfo.token]);

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing state to true
    // Perform any additional tasks if needed before setting refreshing state to false
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulating a delay before resetting refreshing state
  };

  const navigateToRequestInfo = (item) => {
    navigation.navigate('ServiceRequestInfoScreen', { request: item });
  };
  
  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity style={styles.InfoButton} onPress={() => navigateToRequestInfo(item)}>
        <Text style={styles.InfoButtonText}>{`Request ID: ${item.id}`}</Text>
        {statuses.map((status) => (
          item.status_id === status.id && // Check if the status id matches the item's status id
          <Text key={status.id} style={styles.title}>{`Status: ${status.description}`}</Text>
        ))}
      </TouchableOpacity>
      {/* Render other details of the request here */}
    </View>
  );
  

  return (
    <View style={styles.container}>
      <FlatList
       data={requests.sort((a, b) => b.id - a.id)} // Sort the requests array in descending order based on IDs
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    color: 'black',
  },
  InfoButton: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
  },
  InfoButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ServiceRequestHistory;
