import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

const FailCourses = ({route, navigation}) => {
  const [failCourses, setFailCourse] = useState([]);
  const regNo = route.params?.regNo ?? global.REG_NO;
  console.log(regNo);

  useEffect(() => {
    const GetFailCourses = async () => {
      try {
        const response = await fetch(`${global.MyIpAddress}/ShowFailCourses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reg_no: regNo,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('Fetched Data:', data);

        setFailCourse(data.data);
      } catch (error) {
        console.log('Error:', error.message);
      }
    };
    GetFailCourses();
  }, [regNo]);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.courseText}>Course No: {item.Course_no}</Text>
      {/* <Text style={styles.courseText}>Course Name: {item.Course_name}</Text> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Fail Courses</Text>
      <FlatList
        data={failCourses}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default FailCourses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1E897A',
    fontSize: 22,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  courseText: {
    fontSize: 16,
    color: '#333',
  },
});
