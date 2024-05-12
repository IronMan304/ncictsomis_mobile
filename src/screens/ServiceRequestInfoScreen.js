import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const ServiceRequestInfoScreen = ({ route }) => {
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
          <Text style={styles.label}>Date Requested:</Text>
          <Text style={styles.text}>
            {new Date(request.created_at).toLocaleString('en-US', {
              timeZone: 'Asia/Manila',
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Requester:</Text>
          <Text style={styles.text}>{request.borrower.first_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Request Number:</Text>
          <Text style={styles.text}>{request.request_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Appointed Date:</Text>
          <Text style={styles.text}>
            {new Date(request.set_date).toLocaleString('en-US', {
              timeZone: 'Asia/Manila',
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })}
          </Text>
        </View>

       

        <View style={styles.row}>
          <Text style={styles.label}>Operator:</Text>
          <Text style={styles.text}>{request.operator?.first_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Service:</Text>
          <Text style={styles.text}>{request.service?.description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Equipment:</Text>
          <Text style={styles.text}>({request.source?.description}) {request.tool.property_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.text, { color: getStatusColor(request.status.id) }]}>
            {request.status.description}
          </Text>
        </View>
      </View>
     
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

export default ServiceRequestInfoScreen;