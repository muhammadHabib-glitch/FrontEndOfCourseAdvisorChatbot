import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

const AddKnowledgeBase = ({navigation}) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const handleSave = async () => {
    if (!key || !value) {
      Alert.alert('Validation Error', 'Please fill out both fields');
      return;
    }

    try {
      const response = await fetch(`${global.MyIpAddress}/addKnowledgeBase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key_name: key,
          value: value,
          type: 1,
          status: 0,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save data');
      }

      Alert.alert('Success', 'Knowledge Base added successfully');
      navigation.navigate('KnowledgeBaseScreen');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Knowledge Base</Text>
      <Text
        style={{margin: 5, fontWeight: 'bold', fontSize: 25, color: 'black'}}>
        Key
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the Key"
        placeholderTextColor={'black'}
        value={key}
        onChangeText={setKey}
      />
      <Text
        style={{margin: 5, fontWeight: 'bold', fontSize: 25, color: 'black'}}>
        Value
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the Value"
        placeholderTextColor={'black'}
        value={value}
        onChangeText={setValue}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddKnowledgeBase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
    color: '#1E897A',
  },
  input: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  saveButton: {
    margin: 10,
    backgroundColor: '#1E897A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

// AddKnowledgeBase;
