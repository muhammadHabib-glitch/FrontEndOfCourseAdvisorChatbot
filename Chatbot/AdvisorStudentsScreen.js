import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';

const AdvisorStudents = ({navigation}) => {
  const Emp_no = global.Emp_no;
  const password = global.password;

  const [students, setStudents] = useState([]);
  const [searchRegNo, setSearchRegNo] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${global.MyIpAddress}/AdvisorLogin`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({Emp_no, password}),
        });

        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data.students);
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    };

    fetchStudents();
  }, [Emp_no, password]);

  const handleSearch = () => {
    const foundStudent = students.find(
      student => student.Reg_No === searchRegNo,
    );

    if (foundStudent) {
      navigation.navigate('ChatScreen', {
        Reg_No: foundStudent.Reg_No,
        studentName: foundStudent.St_firstname + ' ' + foundStudent.St_lastname,
      });
    } else {
      Alert.alert('Student Not Found', 'Please enter a valid Reg_No');
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChatScreen', {
            Reg_No: item.Reg_No,
            studentName: item.St_firstname + ' ' + item.St_lastname,
          })
        }>
        <Text style={styles.cell}>{item.Reg_No}</Text>
      </TouchableOpacity>
      <Text style={styles.cell}>
        {item.St_firstname} {item.St_lastname}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Advisor's Students</Text>

      <TextInput
        style={styles.input}
        placeholderTextColor={'black'}
        placeholder="Please enter the Reg_no of Student"
        value={searchRegNo}
        onChangeText={setSearchRegNo}
      />
      <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
        <Text style={styles.searchBtnText}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={item => item.Reg_No}
        ListEmptyComponent={
          <Text style={styles.noData}>No students found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 10},
  header: {
    color: '#1E897A',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1E897A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: 'black',
  },
  searchBtn: {
    backgroundColor: '#1E897A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default AdvisorStudents;
