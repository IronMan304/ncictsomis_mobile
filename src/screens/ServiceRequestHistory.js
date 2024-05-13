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

  const getStatusColor = (status_id) => {
    switch(status_id) {
      case 11://pending
        return '#EFEC22'; // Redish
      case 16://reviewed
        return '#60A6FF'; // Greyish
      case 10://approved
        return '#B89CF5'; // Blueish
      case 6://in progress
        return '#90ee90'; // Greenish
      case 13://incoplete
        return '#ffc0cb'; // Pinkish
      case 8://cancelled
        return '#F372A1'; // Blackish
      case 15: //rejected
        return '#ff6961'; // Dirty whitish
      default:
        return '#ffffff'; // Default white
    }
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.InfoButton, { backgroundColor: getStatusColor(item.status_id) }]} onPress={() => navigateToRequestInfo(item)}>
      <Text style={styles.InfoButtonText}>{`Request Number: ${item.request_number}`}</Text>
      {statuses.map((status) => (
        item.status_id === status.id && // Check if the status id matches the item's status id
        <Text key={status.id} style={styles.title}>{`Status: ${status.description}`}</Text>
      ))}
    </TouchableOpacity>
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
    paddingHorizontal: 10,
  },
  InfoButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  InfoButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    color: '#666',
  },
});

export default ServiceRequestHistory;
