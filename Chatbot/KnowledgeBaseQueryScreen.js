import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

const KnowledgeBaseQueryScreen = ({navigation}) => {
  const [Data, setData] = useState([]);

  useEffect(() => {
    GetAllKnowledgeBase();
  }, []);

  const GetAllKnowledgeBase = async () => {
    try {
      let response = await fetch(`${global.MyIpAddress}/getKnowledgeBase`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = await response.json();
      //   console.log('Knowledge Base Data:', data);
      const ShowType1Data = data.data.filter(item => item.Type === 2);
      console.log(ShowType1Data);
      setData(ShowType1Data);
    } catch (error) {
      Alert.alert('Error Occurred', error.message || error.toString());
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.Key_name}</Text>
      <Text style={styles.cell}>{item.Value}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => console.log('Disable', item.key)}>
          <Text style={styles.disableText}>Disable</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('UpdateKnowledgeBaseQuery', {item})
          }>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Knowledge Base</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Key</Text>
        <Text style={styles.headerCell}>Rules</Text>
        <Text style={styles.headerCell}>Actions</Text>
      </View>
      <View style={{margin: 5}}>
        <FlatList
          data={Data}
          renderItem={renderItem}
          // keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddKnowledgeBaseQuery')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    margin: 10,
    marginBottom: 50,
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#009688',
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    fontSize: 30,
    color: '#fff',
    lineHeight: 32,
    fontWeight: 'bold',
  },
  container: {flex: 1, backgroundColor: '#fff', padding: 10},
  header: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E897A',
    paddingVertical: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: 'black',
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  disableText: {color: '#1E897A', fontWeight: '500'},
  editText: {color: '#1E897A', fontWeight: '500'},
});

export default KnowledgeBaseQueryScreen;
