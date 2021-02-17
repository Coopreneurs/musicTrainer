import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  HomeScreen, 
  HistoryScreen, 
  TrainingScreen
} from './Screens';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#333',
            borderBottomColor: '#333',
            borderBottomWidth: 0
          },
          headerTintColor: '#fff'
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ 
            title: 'Music Trainer'
          }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ 
            title: 'History'
          }}
        />
        <Stack.Screen 
          name={"Training"} 
          component={TrainingScreen} 
          options={({navigation, route}) => ({
            title: route.params.name
          })}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}