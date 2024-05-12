import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, Button, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import DatePicker from 'react-native-date-picker';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import RequestToolConfirmationScreen from './RequestToolConfirmationScreen';

const RequestToolScreen = () => {
  const [purpose, setPurpose] = useState('');
  const [dateNeeded, setDateNeeded] = useState(null);
  const [dateReturn, setDateReturn] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const [tools, setTools] = useState([]);
  const [open, setOpen] = useState(false);
  const [openR, setOpenR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const [options, setOptions] = useState([]); // State to store options

  useEffect(() => {
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

        const toolsWithCombinedString = filteredTools.map((tool) => ({
          ...tool,
          combinedString: `${tool.category.description}(${tool.type.description}): ${tool.property_number} (${tool.status.description})`,
        }));
        setTools(toolsWithCombinedString);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTools();
  }, [userInfo.token]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/requests`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });

        setOptions(response.data.options); // Set options state with fetched data
      } catch (error) {
        console.error(error);
      }
    };

    fetchOptions();
  }, [userInfo.token]);

  useEffect(() => {
    const isFilled = purpose.trim() !== '' && selectedItems.length > 0;
    setIsFormValid(isFilled);
  }, [purpose, selectedItems]);

  const handleSubmit = async () => {
   // Check if all required fields are filled, including date fields
   if (!isFormValid || selectedOption === null || !dateNeeded || !dateReturn) {
    Alert.alert('Error', 'Please fill in all the required fields.');
    return;
  }
  
    setIsSubmitting(true);
  
    const formattedDate = dateNeeded.toISOString().split('T')[0];
    const formattedEDate = dateReturn.toISOString().split('T')[0];
  
    const data = {
      option_id: selectedOption,
      estimated_return_date: formattedEDate,
      purpose,
      date_needed: formattedDate,
      toolItems: selectedItems,
    };
  
    try {
      const token = userInfo.token;
      // await axios.post(`${BASE_URL}/requests`, data, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });

      // Example using Axios for the API request
// Example using Axios for the API request
axios.post(`${BASE_URL}/requests`, data, {
  headers: {
      'Authorization': `Bearer ${token}`,
  },
})
.then(function (response) {
  // Upon successful response, trigger Livewire events or actions
  if (response.status === 201) {
      // Assuming 'refreshParentRequest' and 'refreshTable' are Livewire events
      // Livewire.emit('refreshParentRequest');
      // Livewire.emit('refreshTable');
  } else {
      console.error('Request failed:', response.data);
  }
})
.catch(function (error) {
  console.error('Error:', error);
});


  
    // Reset form fields
      setPurpose('');
      setSelectedOption([]);
      setDateNeeded(null); // Reset dateNeeded
      setDateReturn(null); // Reset dateReturn
      setSelectedItems([]);
      setIsSubmitting(false);
      Alert.alert('Success', 'Request submitted successfully.');

      // Refresh tools
    fetchTools();
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', 'All selected tools must be In Stock (Please refresh the screen before requesting)');
      } else {
        Alert.alert('Error', 'Failed to submit request. Please try again.');
      }
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true); // set refreshing to true to show spinner
    // Your refresh logic here, e.g., refetch tools data
    fetchTools().then(() => setRefreshing(false)); // once done, set refreshing to false
  };

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

      const toolsWithCombinedString = filteredTools.map((tool) => ({
        ...tool,
        combinedString: `${tool.category.description}(${tool.type.description}): ${tool.property_number} (${tool.status.description})`,
      }));
      setTools(toolsWithCombinedString);
    } catch (error) {
      console.error(error);
    }
  };

  const enabledTools = tools.filter(tool => tool.status_id === 1);
  // Filter the disabled tools
const disabledTools = tools.filter(tool => tool.status_id !== 1);

  return (
    <FlatList
      style={styles.container}
      data={[{ key: '1' }]}
      renderItem={({ item }) => (
        <View>
          <Text style={styles.label}>Equipments:</Text>
          <SectionedMultiSelect
         
            items={[...enabledTools, ...disabledTools.map(tool => ({ ...tool, disabled: true }))]}
            uniqueKey="id"
            onSelectedItemsChange={setSelectedItems}
            selectedItems={selectedItems}
            selectText="Select Available Equipments"
            searchInputPlaceholderText=""
            searchPlaceholderText='Search Available Equipments'
            displayKey="combinedString"
            style={styles.multiSelect}
            IconRenderer={Icon}
          />
          
          <Text style={styles.label}>Select Option:</Text>
          <Picker
    selectedValue={selectedOption}
    onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}>
    <Picker.Item label="Do you need an operator?" value={null} style={{ color: 'black' }}/>
    {options.map((option) => (
      <Picker.Item key={option.id} label={option.description} value={option.id} style={{ color: 'black' }}/>
    ))}
  </Picker>

          {/* <Text style={{ color: 'black' }}>Date Needed: {dateNeeded.toISOString().split('T')[0]}</Text> */}
          <Text style={{ color: 'black' }}>Date Needed: {dateNeeded ? dateNeeded.toISOString().split('T')[0] : 'Select Date'}</Text>
          <Button title="Date Needed" onPress={() => setOpen(true)} />
          <DatePicker
            modal
            open={open}
            //date={new Date(dateNeeded.getTime() - (480 * 60000))}
            date={dateNeeded || new Date()} // Use new Date() if dateNeeded is null
            mode="date"
            onConfirm={(dateNeeded) => {
              setOpen(false);
              setDateNeeded(dateNeeded);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />

          {/* <Text style={{ color: 'black' }}>Estimated Return Date: {dateReturn.toISOString().split('T')[0]}</Text> */}
          <Text style={{ color: 'black' }}>Estimated Return Date: {dateReturn ? dateReturn.toISOString().split('T')[0] : 'Select Date'}</Text>
          <Button title="Estimated Return Date" onPress={() => setOpenR(true)} />
          <DatePicker
            modal
            open={openR}
            //date={new Date(dateReturn.getTime() - (480 * 60000))}
            date={dateReturn || new Date()} // Use new Date() if dateNeeded is null
            mode="date"
            onConfirm={(dateReturn) => {
              setOpenR(false);
              setDateReturn(dateReturn);
            }}
            onCancel={() => {
              setOpenR(false);
            }}
          />

          <Text style={styles.label}>Purpose:</Text>
          <TextInput
            style={styles.input}
            value={purpose}
            onChangeText={(text) => setPurpose(text)}
          />

          <TouchableOpacity
            style={[styles.button/*, !isFormValid && styles.disabledButton*/]}
            onPress={handleSubmit}
            // disabled={!isFormValid || isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  datePicker: {
    marginBottom: 15,
  },
  multiSelect: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'blue',
    padding: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: 'gray', // Apply disabled style
  },
});

export default RequestToolScreen;
