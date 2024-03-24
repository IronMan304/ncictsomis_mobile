import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import DatePicker from 'react-native-date-picker';
import MultiSelect from 'react-native-multiple-select';

const RequestToolScreen = () => {
  const [purpose, setPurpose] = useState('');
  const [dateNeeded, setDateNeeded] = useState(new Date());
  const [dateReturn, setDateReturn] = useState(new Date());
  const [selectedItems, setSelectedItems] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    // Fetch tools data
    const fetchTools = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/requests`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });
        setTools(response.data.tools);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTools();
  }, [userInfo.token]);

  const handleSubmit = async () => {
    const formattedDate = dateNeeded.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    const formattedEDate = dateReturn.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD

    const data = {
      option_id: 2, // You can set this value dynamically if needed
      estimated_return_date: formattedEDate, // You can set this value dynamically if needed
      purpose,
      date_needed: formattedDate, // Use the formatted date here
      toolItems: selectedItems,
    };

    try {
      const token = userInfo.token;
      const response = await axios.post(`${BASE_URL}/requests`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Purpose:</Text>
      <TextInput
        style={styles.input}
        value={purpose}
        onChangeText={(text) => setPurpose(text)}
      />

      <Text style={styles.label}>Date needed:</Text>
      <DatePicker
        style={styles.datePicker}
        date={dateNeeded}
        onDateChange={setDateNeeded}
        mode="date"
      />

      <Text style={styles.label}>Date return:</Text>
      <DatePicker
        style={styles.datePicker}
        date={dateReturn}
        onDateChange={setDateReturn}
        mode="date"
      />

      <Text style={styles.label}>Select Tool Items:</Text>
      <MultiSelect
        hideTags
        items={tools}
        uniqueKey="id"
        onSelectedItemsChange={setSelectedItems}
        selectedItems={selectedItems}
        selectText="Select Tool Items"
        searchInputPlaceholderText="Search Items..."
        displayKey="brand"
        style={styles.multiSelect}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
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
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RequestToolScreen;
