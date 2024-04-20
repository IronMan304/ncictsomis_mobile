import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RequestInfoScreen = ({ route }) => {
  const { request } = route.params;
  const { userInfo } = useContext(AuthContext);

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 10: // Replace with the appropriate status ID for 'Approved'
        return '#4CAF50'; // Green
      case 14: // Replace with the appropriate status ID for 'Pending'
        return '#FFC107'; // Yellow
      case 15: // Replace with the appropriate status ID for 'Rejected'
        return '#F44336'; // Red
        case 16:
          return '#008cff';
          case 2:
            return '#999999';
            case 6:
              return '#0099CC';
      default:
        return '#000000'; // Black
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.label}>Request ID:</Text>
          <Text style={styles.text}>{request.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Requester:</Text>
          <Text style={styles.text}>{userInfo.first_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Request Number:</Text>
          <Text style={styles.text}>{request.request_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date needed:</Text>
          <Text style={styles.text}>{request.date_needed}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date return:</Text>
          <Text style={styles.text}>{request.estimated_return_date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Purpose:</Text>
          <Text style={styles.text}>{request.purpose}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.text, { color: getStatusColor(request.status.id) }]}>
            {request.status.description}
          </Text>
        </View>
      </View>
      {request.tool_keys && request.tool_keys.length > 0 ? (
        <View style={styles.toolsContainer}>
          <Text style={styles.title}>Tools:</Text>
          <ScrollView>
            {request.tool_keys.map((toolKey) => (
              <View key={toolKey.id} style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.label}>Tool ID:</Text>
                  <Text style={styles.text}>{toolKey.tools ? toolKey.tools.id : ''}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Property Number:</Text>
                  <Text style={styles.text}>{toolKey.tools ? toolKey.tools.property_number : ''}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Status:</Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: getStatusColor(
                          toolKey.status ? toolKey.status.id : toolKey.tool_status.id
                        ),
                      },
                    ]}
                  >
                    {toolKey.status ? toolKey.status.description : ''} ({toolKey.tool_status ? toolKey.tool_status.description : ''})
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <Text style={[styles.title, styles.text]}>No tool keys found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5', // Light gray background
  },
  table: {
    borderWidth: 1,
    borderColor: '#DDDDDD', // Light gray border
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#FFFFFF', // White background
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Dark gray text
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333333', // Dark gray text
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333', // Dark gray text
  },
  toolsContainer: {
    marginTop: 20,
    maxHeight: 300, // Set a maximum height for the tools section
  },
});

export default RequestInfoScreen;