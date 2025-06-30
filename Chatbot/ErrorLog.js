import React, {useEffect, useState} from 'react';
import {Text, View, FlatList, Alert, StyleSheet} from 'react-native';

const ErrorLog = () => {
  const [data, setData] = useState([]);

  const fetchErrorLog = async () => {
    try {
      let response = await fetch(`${global.MyIpAddress}/get_ErrorLog`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let result = await response.json();
      console.log('Error Log:', result);
      setData(result.missing_tags || []);
    } catch (error) {
      Alert.alert('Error Occurred', error.message || error.toString());
    }
  };

  useEffect(() => {
    fetchErrorLog();
  }, []);

  const renderItem = ({item, index}) => (
    <View style={styles.row}>
      <Text style={styles.index}>{index + 1}.</Text>
      <Text style={styles.tag}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tags Not in KnowledgeBase</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No missing tags found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  header: {
    marginTop:50,
    justifyContent: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E897A',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  index: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  tag: {
    fontSize: 16,
    color: 'black',
  },
  emptyText: {
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
    fontSize: 20,
  },
});

export default ErrorLog;
