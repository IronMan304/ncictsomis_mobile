import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';

const RequestServiceScreen = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [sources, setSources] = useState([]);
  const [tools, setTools] = useState([]);
  const [services, setServices] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [error, setError] = useState(null);
const [successMessage, setSuccessMessage] = useState(null);

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

  const handleInputChange = (key, value) => {
    setNewRequest({ ...newRequest, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!newRequest.source_id || !newRequest.tool_id || !selectedService) {
        setError('Please select a source, a tool, and a service before submitting.');
        return;
      }
      
      const requestData = {
        ...newRequest,
        service_id: selectedService,
      };
  
      await axios.post(`${BASE_URL}/service_requests`, requestData, {
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
      setSelectedService(null);
      setSuccessMessage('Request submitted successfully.');
      setError(null);
    } catch (error) {
      console.error('Error submitting service request:', error);
      setError('Failed to submit request. Please try again.');
      setSuccessMessage(null);
    }
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
    return (isPersonal || isOwnedByUser || isSourceCICTSO) && isInStock && tool.source_id === newRequest.source_id;
  });
  

  return (
    <View style={styles.container}>
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
  {tools.map((tool) => (
    <Picker.Item
      key={tool.id}
      label={`${tool.brand} - ${tool.property_number} (${tool.status.description})`}
      value={tool.id}
      enabled={tool.status_id === 1} // Enable only if status_id is 1
      style={{ color: tool.status_id === 1 ? 'black' : 'gray' }} // Change color for disabled items
    />
  ))}
</Picker>


        <Picker
    selectedValue={selectedService}
    onValueChange={(itemValue, itemIndex) => setSelectedService(itemValue)}>
    <Picker.Item label="Service" value={null} style={{ color: 'black' }}/>
    {services.map((service) => (
      <Picker.Item key={service.id} label={service.description} value={service.id} style={{ color: 'black' }}/>
    ))}
  </Picker>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={[styles.submitButtonText, { color: 'black' }]}>Submit</Text>
        </TouchableOpacity>
        {/* // Inside the return statement, after the TouchableOpacity for submission button */}
  {error && <Text style={{ color: 'red' }}>{error}</Text>}
  {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}
      </View>
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
    backgroundColor: '#fff',
    padding: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  picker: {
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 8,
  },
  requestItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
    padding: 16,
  },
  requestItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  requestItemStatus: {
    fontSize: 16,
  },
  requestItemDetails: {
    flexDirection: 'column',
  },
  requestText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default RequestServiceScreen;