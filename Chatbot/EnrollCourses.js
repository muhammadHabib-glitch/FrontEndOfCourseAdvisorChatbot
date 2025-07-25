import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const EnrollCourses = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Enroll Course screen</Text>
    </View>
  );
};

export default EnrollCourses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#1E897A',
  },
});
