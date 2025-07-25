import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './Login';
import Home from './Home';
import TabNavigation from './TabNavigation';
import PreviousCourse from './PreviousCourseScreen';
import FailCourses from './FailCourses';
import EnrollCourses from './EnrollCourses';
import AddKnowledgeBase from './AddknowledgeBaseHardCodedValue';
import AddKnowledgeBaseQuery from './AddKnowledgeBaseQueryBaseValue';
import UpdateKnowledgeBase from './UpdateKnowledgeBaseHardCodedValue';
import UpdateKnowledgeBaseQuery from './UpdateKnowledgeBaseQuery';
import KnowledgeBaseTabNavigation from './KnowledgeBase';
import KnowledgeBaseScreen from './KnowledgeBase';
import KnowledgeBaseQueryScreen from './KnowledgeBaseQueryScreen';
import AdvisorStudents from './AdvisorStudentsScreen';
import Welcome from './WelcomeAdvisorScreen';
import ChatScreen from './ChatScreen';

const ProjectNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerStyle: {backgroundColor: '#17B8A6'},
          headerShown: false,
        }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="AdvisorStudents" component={AdvisorStudents} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="TabNavigation" component={TabNavigation} />
        <Stack.Screen name="PreviousCourse" component={PreviousCourse} />
        <Stack.Screen name="FailCourses" component={FailCourses} />
        <Stack.Screen name="EnrollCourses" component={EnrollCourses} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />

        <Stack.Screen name="AddKnowledgeBase" component={AddKnowledgeBase} />
        <Stack.Screen
          name="AddKnowledgeBaseQuery"
          component={AddKnowledgeBaseQuery}
        />
        <Stack.Screen
          name="KnowledgeBaseScreen"
          component={KnowledgeBaseScreen}
        />
        <Stack.Screen
          name="UpdateKnowledgeBase"
          component={UpdateKnowledgeBase}
        />
        <Stack.Screen
          name="UpdateKnowledgeBaseQuery"
          component={UpdateKnowledgeBaseQuery}
        />
        <Stack.Screen
          name="KnowledgeBaseTabNavigation"
          component={KnowledgeBaseTabNavigation}
        />
        <Stack.Screen
          name="KnowledgeBaseQueryScreen"
          component={KnowledgeBaseQueryScreen}
        />

        {/* <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />

        <Stack.Screen
          name="KnowledgeBaseQueryScreen"
          component={KnowledgeBaseQueryScreen}
        />
      
        <Stack.Screen name="AddKnowledgeBase" component={AddKnowledgeBase} />
        <Stack.Screen
          name="AddKnowledgeBaseQuery"
          component={AddKnowledgeBaseQuery}
        />
        <Stack.Screen
          name="UpdateKnowledgeBase"
          component={UpdateKnowledgeBase}
        />

        <Stack.Screen
          name="UpdateKnowledgeBaseQuery"
          component={UpdateKnowledgeBaseQuery}
        />

        <Stack.Screen name="Enrollement" component={Enrollement} />

        <Stack.Screen name="UpdateScreen" component={UpdateScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ProjectNavigation;
