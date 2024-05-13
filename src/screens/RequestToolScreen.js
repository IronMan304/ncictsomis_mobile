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
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook

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
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control displaying confirmation

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

    // Function to fetch options
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
  
    useEffect(() => {
      // fetchTools();
      fetchOptions();
    }, [userInfo.token]);

  useEffect(() => {
    const isFilled = purpose.trim() !== '' && selectedItems.length > 0;
    setIsFormValid(isFilled);
  }, [purpose, selectedItems]);

  useFocusEffect(
    React.useCallback(() => {
      fetchTools();
      fetchOptions();
    }, [])
  );

  const handleSubmit = async () => {
   // Check if all required fields are filled, including date fields
   if (!isFormValid || !selectedOption || !dateNeeded || !dateReturn) {
    Alert.alert('Error', 'Please fill in all the required fields.');
    return;
  }
  
    setIsSubmitting(true);
    //setShowConfirmation(true); // Show confirmation page
  
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
  
      // Example using Axios for the API request
      axios.post(`${BASE_URL}/requests`, data, {
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      })
      .then(function (response) {
          // Upon successful response, trigger Livewire events or actions
          if (response.status === 201) {
              setShowConfirmation(true); // Show confirmation page after successful submission
              // Reset form fields
              setPurpose('');
              setSelectedOption([]);
              setDateNeeded(null); // Reset dateNeeded
              setDateReturn(null); // Reset dateReturn
              setSelectedItems([]);
              setIsSubmitting(false);
              // Refresh tools
              fetchTools();
          } else {
              console.error('Request failed:', response.data);
              Alert.alert('Error', 'Failed to submit request. Please try again.');
          }
      })
      .catch(function (error) {
          console.error('Error:', error);
          if (error.response && error.response.status === 400) {
              Alert.alert('Error', 'All selected tools must be In Stock (Please refresh the screen before requesting)');
          } else {
              Alert.alert('Error', 'Failed to submit request. Please try again.');
          }
          setIsSubmitting(false);
      });
  
  } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
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
  <>
    {showConfirmation ? (
      <RequestToolConfirmationScreen onClose={handleConfirmationClose} />
    ) : (
      <FlatList
        style={styles.container}
        data={[{ key: '1' }]}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* <Text style={styles.label}>Equipments:</Text> */}
            <SectionedMultiSelect
              items={[...enabledTools, ...disabledTools.map(tool => ({ ...tool, disabled: true }))]}
              uniqueKey="id"
              onSelectedItemsChange={setSelectedItems}
              selectedItems={selectedItems}
              selectText="Select Equipments to be Borrowed"
              searchInputPlaceholderText=""
              searchPlaceholderText='Search Equipment'
              displayKey="combinedString"
              style={styles.multiSelect}
              IconRenderer={Icon}
            />

            {/* <Text style={styles.label}>Select Option:</Text> */}
            {/* <Picker
              selectedValue={selectedOption}
              onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Do you need an operator?" value={null} style={{ color: 'black' }}/>
              {options.map((option) => (
                <Picker.Item key={option.id} label={option.description} value={option.id} style={{ color: 'black' }}/>
              ))}
            </Picker> */}

          

            <SectionedMultiSelect
        items={options}
              uniqueKey="id"
              onSelectedItemsChange={(selectedOptionId) => setSelectedOption(selectedOptionId[0])}
              selectedItems={[selectedOption]}
              selectText="Do you need an operator?"
              searchInputPlaceholderText=""
              searchPlaceholderText="Search Equipment Sources"
              displayKey="description"
              single
              styles={{
                searchTextInput: {
                  color: 'black'
                },
              }}
              IconRenderer={Icon}
              iconStyle={styles.iconStyle}
            >
              {options.map((option) => (
                <Picker.Item
                  key={option.id}
                  label={option.description}
                  value={option.id}
                  style={{ color: 'black' }}
                />
              ))}
            </SectionedMultiSelect>


            {/* <Text style={styles.dateLabel}>Date Needed: {dateNeeded ? dateNeeded.toISOString().split('T')[0] : 'Select Date'}</Text> */}
            <View style={styles.buttonContainer}>
            <Button
        title={`Date Needed: ${dateNeeded ? dateNeeded.toISOString().split('T')[0] : 'Select Date'}`}
        onPress={() => setOpen(true)}
        style={styles.dateButton}
      />
            <DatePicker
              modal
              open={open}
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
            </View>
        

            {/* <Text style={styles.dateLabel}>Estimated Return Date: {dateReturn ? dateReturn.toISOString().split('T')[0] : 'Select Date'}</Text> */}
            <View style={styles.buttonContainer}>
            <Button 
            title={`Estimated Return Date: ${dateReturn ? dateReturn.toISOString().split('T')[0] : 'Select Date'}`}
            onPress={() => setOpenR(true)} style={styles.dateButton} />
            <DatePicker
              modal
              open={openR}
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
            </View>
       

            {/* <Text style={styles.label}>Purpose:</Text> */}
            <TextInput
  placeholder="Purpose"
  style={[styles.input, { height: 5 * 20 }]} // Adjust the height according to your font size and line height
  multiline
  numberOfLines={5}
  textAlignVertical="top" // Align placeholder text to the top
  value={purpose}
  onChangeText={(text) => setPurpose(text)}
/>



            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={[styles.submitButtonText, { color: 'black' }]}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
            </TouchableOpacity>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9Bd35A', '#689F38']}
          />
        }
      />
    )}
  </>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  multiSelect: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  dateLabel: {
    color: 'black',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    marginBottom: 20,
    margin: 10, 
    padding: 100
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
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
  buttonContainer: {
    marginBottom: 20, // or any other value as per your preference
    borderRadius: 10, // Add border radius here
    overflow: 'hidden', // Ensure children don't overflow the rounded corners
  },
});


export default RequestToolScreen;
