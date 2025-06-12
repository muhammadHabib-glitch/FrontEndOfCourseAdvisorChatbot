import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {IconButton, TextInput} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';

const LoginScreen = ({navigation}) => {
  const [reg_no, setReg_no] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const EnrollementKnowledgeBase = async () => {
    if (reg_no === 'Admin' && password === '123') {
      navigation.navigate('KnowledgeBaseTabNavigation');
      return;
    }
    try {
      let response = await fetch(`${global.MyIpAddress}/StudentLogin`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({reg_no, password}),
      });

      if (!response.ok) {
        if (response.status === 401) {
          Alert.alert(
            'Invalid login',
            'Incorrect registration number or password.',
          );
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
        return;
      }
      let jsonResponse = await response.json();
      const username =
        jsonResponse.data.St_firstname + jsonResponse.data.St_lastname;

      //Navigation.dispatch : manually trigger a navigation action. You're telling React Navigation ,  Replaces the entire navigation history with just the Home screen, and sends username as data — so user can’t go back to login by pressing back.
      navigation.dispatch(
        CommonActions.reset({
          // index: 0
          // This sets the current screen index.
          index: 0,
          routes: [{name: 'Home', params: {username}}],
          // The new screen stack should have just one screen — Home — and pass this data as params."
        }),
      );
      if (jsonResponse.data && reg_no === jsonResponse.data.Reg_No) {
        global.REG_NO = reg_no;
        navigation.navigate('Home', {username});
      } else {
        Alert.alert('Incorrect username and password');
      }
    } catch (error) {
      Alert.alert('Error Occurs', error.message || error.toString());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.inputContainer}>
        <IconButton icon="account" size={20} />
        <TextInput
          label="0000-ARID-0000"
          value={reg_no}
          onChangeText={setReg_no}
          style={styles.input}
          underlineColor="purple"
          placeholderTextColor={'black'}
        />
      </View>
      <View style={styles.inputContainer}>
        <IconButton icon="lock" size={20} />
        <TextInput
          label="Password"
          value={password}
          placeholderTextColor="black"
          onChangeText={setPassword}
          mode="flat"
          keyboardType="numeric"
          style={styles.input}
          secureTextEntry={!passwordVisible}
        />
        <IconButton
          icon={passwordVisible ? 'eye-off' : 'eye'}
          size={20}
          onPress={() => setPasswordVisible(!passwordVisible)}
        />
      </View>
      <TouchableOpacity style={{alignSelf: 'flex-start', marginBottom: 20}}>
        <Text style={{color: '#17B8A6'}}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={EnrollementKnowledgeBase}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Already have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E897A',
    textAlign: 'center',
    width: '100%',
  },
  welcomeText: {
    color: '#17B8A6',
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  loginButton: {
    width: '50%',
    height: 45,
    backgroundColor: '#17B8A6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#17B8A6',
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
    marginTop: 10,
  },
});
export default LoginScreen;
