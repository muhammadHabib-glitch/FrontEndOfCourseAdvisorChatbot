import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {IconButton, TextInput} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';

const LoginScreen = ({navigation}) => {
  const [reg_no, setReg_no] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const CheckLogin = async () => {
    if (reg_no === 'Admin' && password === '123') {
      navigation.navigate('KnowledgeBaseTabNavigation');
      return;
    }

    try {
      // First try advisor login
      let advisorResponse = await fetch(`${global.MyIpAddress}/AdvisorLogin`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({Emp_no: reg_no, password}), // 👈 Adjust for advisor
      });

      if (advisorResponse.ok) {
        let advisorData = await advisorResponse.json();
        console.log(advisorData.employee.Emp_firstname);
        const advisorName =
          advisorData.employee.Emp_firstname +
          ' ' +
          advisorData.employee.Emp_lastname;

        global.Emp_no = reg_no;
        global.password = password;

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Welcome',
                params: {advisorName},
              },
            ],
          }),
        );
        return;
      }

      let studentResponse = await fetch(`${global.MyIpAddress}/StudentLogin`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({reg_no, password}),
      });

      if (!studentResponse.ok) {
        if (studentResponse.status === 401) {
          Alert.alert(
            'Invalid login',
            'Incorrect registration number or password.',
          );
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
        return;
      }

      let jsonResponse = await studentResponse.json();
      const username =
        jsonResponse.data.St_firstname + ' ' + jsonResponse.data.St_lastname;
      const currentSemester = jsonResponse.data.currentsemesterno;
      global.currentSemester;
      console.log(currentSemester)
      global.REG_NO = reg_no;

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home', params: {username}}],
        }),
      );
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
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            marginRight: 45,
          }}
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
      <TouchableOpacity style={styles.loginButton} onPress={CheckLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
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
