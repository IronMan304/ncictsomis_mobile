import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';
import RequestServiceConfirmationScreen from './RequestServiceConfirmationScreen'; // Import the confirmation page component
// import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const [selectedItems, setSelectedItems] = useState([]); // State to store selected tools
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

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
      //setTools(response.data.tools);
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

    // Function to fetch tools
    const fetchTools = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/requests`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });
  
        const borrowerPositionId = response.data.borrower.position_id;
        const filteredTools = response.data.tools.filter((tool) =>
          tool.position_keys.some((key) => key.position_id === borrowerPositionId)
        );
  
        const toolsWithCombinedString = response.data.tools.map((tool) => ({
          ...tool,
          combinedString: `${tool.category.description}(${tool.type.description}): ${tool.property_number} (${tool.status.description})`,
        }));
        setTools(toolsWithCombinedString);
      } catch (error) {
        console.error(error);
      }
    };

  useFocusEffect(
    React.useCallback(() => {
      fetchSources();
      fetchTools();
    }, [])
  );

  const handleInputChange = (key, value) => {
    // Reset the tool_id when the source_id changes
    if (key === 'source_id') {
      setNewRequest({ ...newRequest, [key]: value, tool_id: '' });
    } else {
      setNewRequest({ ...newRequest, [key]: value });
    }
  };
  

  const handleSubmit = async () => {
    try {
      if (!newRequest.source_id || !newRequest.tool_id) {
        Alert.alert('Error', 'Please select source and tool before submitting');
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
      setError(null);
      setShowConfirmation(true); // Show confirmation page
    } catch (error) {
      console.error('Error submitting service request:', error);
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', 'All selected tools must be In Stock (Please refresh the screen before requesting)');
      } else {
        Alert.alert('Error', 'Failed to submit request. Please try again.');
      }
    }
  };
  

  const handleConfirmationClose = () => {
    setShowConfirmation(false); // Close confirmation page
  };

  const onRefresh = () => {
    setRefreshing(true); // set refreshing to true to show spinner
    // Your refresh logic here, e.g., refetch tools data
    fetchTools().then(() => setRefreshing(false)); // once done, set refreshing to false
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
  const enabledTools = filteredTools.filter(tool => tool.status_id === 1);
  // Filter the disabled tools
const disabledTools = filteredTools.filter(tool => tool.status_id !== 1);
  return (
    <View style={styles.container}>
      {showConfirmation ? (
        // <RequestServiceConfirmationScreen onClose={handleConfirmationClose} />
        // Inside the return statement, where you render the confirmation screen
        <RequestServiceConfirmationScreen onClose={handleConfirmationClose} onRefetch={fetchTools} />

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
          {/* <Picker
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
          </Picker> */}
          <SectionedMultiSelect
           items={[...enabledTools, ...disabledTools.map(tool => ({ ...tool, disabled: true }))]}
           uniqueKey="id"
           onSelectedItemsChange={(selectedItemId) => handleInputChange('tool_id', selectedItemId[0])}
           //      
           selectedItems={[newRequest.tool_id]}
           selectText="Select Equipment to be Repaired"
           searchInputPlaceholderText=""
           searchPlaceholderText='Search Available Equipments'
           displayKey="combinedString"
           styles={{
            searchTextInput: {
              color: 'black'
            },
            searchIcon: {
              color: "black", // Change the color of the search icon to black
            },
            chipIcon: {
              color: "black", // Change the color of the chips icon to black
            },
            arrowIcon: {
              color: "black", // Change the color of the arrow icon to black
            },
            removeIcon: {
              color: "black", // Change the color of the remove icon to black
            },
            searchIconContainer: {
              backgroundColor: "transparent", // Set the background color of the search icon container to transparent
            },
           }}
           IconRenderer={Icon}
           single
           iconStyle={styles.iconStyle}
          />
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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2196f3']} // Color of the refresh indicator
          tintColor={'#2196f3'} // Color of the refresh indicator on iOS
          progressBackgroundColor={'#ffffff'} // Background color of the refresh indicator
          title="Pull to refresh" // Text displayed while pulling down to refresh
          titleColor="#2196f3" // Text color of the refresh indicator
        />
       }
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
  multiSelect: {
    marginBottom: 15,
    // width: '10%', // Set to 100% to occupy full width
    // maxHeight: 200, // Set the max height to limit the dropdown size
    // borderWidth: 1, // Add border for better visibility
    // borderColor: '#ccc', // Border color
    // borderRadius: 5, // Border radius
    // height: '50%'
  },
  iconStyle: {
    color: 'black',
  },
});

export default RequestServiceScreen;
