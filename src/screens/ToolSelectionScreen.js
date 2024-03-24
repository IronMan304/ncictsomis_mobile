import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ToolSelectionScreen = ({ navigation }) => {
  const [selectedTools, setSelectedTools] = useState([]);

  const handleToolSelect = (toolId) => {
    // Toggle selection of the tool
    setSelectedTools((prevSelected) =>
      prevSelected.includes(toolId)
        ? prevSelected.filter((id) => id !== toolId)
        : [...prevSelected, toolId]
    );
  };

  const handleDone = () => {
    // Pass selected tools back to the previous screen or handle as needed
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Tools</Text>
      <View style={styles.toolsContainer}>
        {/* Render your list of tools here */}
        <TouchableOpacity
          style={[styles.toolItem, selectedTools.includes('tool1') && styles.selected]}
          onPress={() => handleToolSelect('tool1')}>
          <Text style={styles.toolText}>Tool 1</Text>
        </TouchableOpacity>
        {/* Add more tool items as needed */}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleDone}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  toolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  toolItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  selected: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  toolText: {
    color: 'black',
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ToolSelectionScreen;
