import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';
import RequestServiceConfirmationScreen from './RequestServiceConfirmationScreen'; // Import the confirmation page component
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook

const RequestServiceScreen = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [sources, setSources] = useState([]);
  const [tools, setTools] = useState([]);
  const [services, setServices] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control displaying confirmation

  const [newRequest, setNewRequest] = useState({
    brand: '',
    property_number: '',
    barcode: '',
    category_id: '',
    type_id: '',
    source_id: '',
    tool_id: '',
  });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/service_requests`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });
      setSources(response.data.sources);
      setTools(response.data.tools);
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSources();
    }, [])
  );

  const handleInputChange = (key, value) => {
    setNewRequest({ ...newRequest, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!newRequest.source_id || !newRequest.tool_id) {
        setError('Please select source and tool before submitting');
        return;
      }

      await axios.post(`${BASE_URL}/service_requests`, newRequest, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });

      // Reset the form after submission
      setNewRequest({
        brand: '',
        property_number: '',
        barcode: '',
        category_id: '',
        type_id: '',
        source_id: '',
        tool_id: '',
      });
      // setSuccessMessage('Request submitted successfully.');
      setError(null);
      setShowConfirmation(true); // Show confirmation page
    } catch (error) {
      console.error('Error submitting service request:', error);
      setError('Failed to submit request. Please try again.');
      //setSuccessMessage(null);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false); // Close confirmation page
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestItemHeader}>
        <Text style={[styles.requestItemTitle, { color: 'black' }]}>{item.brand}</Text>
        <Text style={[styles.requestItemStatus, { color: 'black' }]}>{item.status.description}</Text>
      </View>
      <View style={styles.requestItemDetails}>
        <Text style={[styles.requestText, { color: 'black' }]}>Property Number: {item.property_number}</Text>
        <Text style={[styles.requestText, { color: 'black' }]}>Barcode: {item.barcode}</Text>
        <Text style={[styles.requestText, { color: 'black' }]}>Category: {item.category.description}</Text>
        <Text style={[styles.requestText, { color: 'black' }]}>Type: {item.type.description}</Text>
        <Text style={[styles.requestText, { color: 'black' }]}>Source: {item.source.description}</Text>
      </View>
    </View>
  );

  const filteredTools = tools.filter((tool) => {
    const isPersonal = newRequest.source_id === '4';
    const isOwnedByUser = tool.owner_id === userInfo.user.borrower.id;
    const isSourceCICTSO = tool.source_id === 3 && (tool.owner_id === null || tool.owner_id === undefined);
    const isInStock = tool.status_id === 1; // Check if the tool is in stock
    return (isPersonal || isOwnedByUser || isSourceCICTSO) && tool.source_id === newRequest.source_id;
  });

  return (
    <View style={styles.container}>
      {showConfirmation ? (
        <RequestServiceConfirmationScreen onClose={handleConfirmationClose} />
      ) : (
        <View style={styles.formContainer}>
          {/* <Text style={[styles.requestText, { color: 'black' }]}>Barcode: {userInfo.user.borrower.user_id}</Text> */}
          <Text style={[styles.requestText, { color: 'black' }]}>Requester: {userInfo.user.first_name}</Text>
          <Picker
            selectedValue={newRequest.source_id}
            style={styles.picker}
            onValueChange={(itemValue) => handleInputChange('source_id', itemValue)}
          >
            <Picker.Item label="Select Source" value="" style={{ color: 'black' }} />
            {sources.map((source) => (
              <Picker.Item key={source.id} label={source.description} value={source.id} style={{ color: 'black' }} />
            ))}
          </Picker>
          <Picker
            selectedValue={newRequest.tool_id}
            style={styles.picker}
            onValueChange={(itemValue) => handleInputChange('tool_id', itemValue)}
          >
            <Picker.Item label="Select Tool" value="" style={{ color: 'black' }} />
            {filteredTools.map((tool) => (
              <Picker.Item
                key={tool.id}
                label={`${tool.brand} - ${tool.property_number} (${tool.status.description})`}
                value={tool.id}
                enabled={tool.status_id === 1} // Enable only if status_id is 1
                style={{ color: tool.status_id === 1 ? 'black' : 'gray' }} // Change color for disabled items
              />
            ))}
          </Picker>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={[styles.submitButtonText, { color: 'black' }]}>Submit</Text>
          </TouchableOpacity>
          {/* Inside the return statement, after the TouchableOpacity for submission button */}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
          {/* {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>} */}
        </View>
      )}
      <FlatList
        data={serviceRequests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  requestItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  requestItemStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4caf50',
  },
  requestItemDetails: {
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default RequestServiceScreen;
