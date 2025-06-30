import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

const Welcome = ({route, navigation}) => {
  const {advisorName} = route.params;
  console.log(advisorName);
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={() => navigation.navigate('AdvisorStudents')}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>HI {advisorName} </Text>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.chatbotText}>ChatBot</Text>
        <Image
          source={require('../Chatbot/Assests/pic.png')}
          style={styles.image}
        />
        <Text
          style={{
            marginTop: 25,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1E897A',
            marginBottom: 10,
          }}>
          Tab on Screen to see yours Students
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 330,
    height: 350,
    marginTop: 20,
    borderRadius: 10,
  },
  content: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E897A',
    marginBottom: 10,
  },
  toText: {
    fontSize: 30,
    color: '#1E897A',
    marginBottom: 10,
  },
  chatbotText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#1E897A',
    marginBottom: 20,
  },
  helpText: {
    fontSize: 20,
    color: '#1E897A',
  },
});

export default Welcome;
