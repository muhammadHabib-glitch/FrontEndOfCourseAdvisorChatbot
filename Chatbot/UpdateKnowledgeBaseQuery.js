import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

const UpdateKnowledgeBaseQuery = ({route, navigation}) => {
  const {item} = route.params;
  const [value, setValue] = useState(item.Value);

  const handleUpdate = async () => {
    if (!value) {
      Alert.alert('Validation Error', 'Please enter a new value');
      return;
    }

    try {
      const response = await fetch(
        `${global.MyIpAddress}/updateKnowledgeBase`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key_name: item.Key_name,
            value: value,
            type: item.Type,
            status: item.Status,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      Alert.alert('Success', 'Knowledge Base updated successfully');
      navigation.navigate('KnowledgeBaseQueryScreen');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Knowledge Base</Text>
      <Text style={styles.label}>Key Name</Text>
      <TextInput value={item.Key_name} editable={false} style={styles.input} />

      <Text style={styles.label}>Value</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Enter new value"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  label: {margin: 5, fontWeight: 'bold', fontSize: 25, color: 'black'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
    color: '#1E897A',
  },
  button: {
    backgroundColor: '#1E897A',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default UpdateKnowledgeBaseQuery;
