import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatScreen from './ChatScreen';
import FAQs from './FAQ';

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 25,

          backgroundColor: '#fff',
          borderTopColor: '#ccc',
          borderTopWidth: 0.5,
        },

        inputArea: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
        },
        response: {
          fontSize: 16,
          color: '#333',
          marginBottom: 20,
          backgroundColor: '#f2f2f2',
          padding: 15,
          borderRadius: 10,
        },

        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1E897A',
        },
      }}>
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="FAQ"
        component={FAQs}
        options={{
          tabBarLabel: 'FAQs',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
