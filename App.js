import React from 'react';
import ProjectNavigation from './Chatbot/StackNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';

const App = () => {
  global.MyIpAddress = 'http://10.19.132.130:5000';

  return (
    <GestureHandlerRootView style={styles.container}>
      <ProjectNavigation />
    </GestureHandlerRootView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
