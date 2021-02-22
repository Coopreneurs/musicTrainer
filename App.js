import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  View 
} from 'react-native';

import {
  HomeScreen, 
  HistoryScreen, 
  TrainingScreen
} from './Screens';

import { toaster} from './Toaster';
// import { pulse } from './Pulse';
const Stack = createStackNavigator();
const BACKGROUNDCOLOR = '#06c2ac'; //'#000044' '#06c2ac';
const HEADERCOLOR = '#d8877a'; //'#000044';

export default function App() {
  return (
      <>
        {/* {pulse} */}
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{
              headerStyle: {
                backgroundColor: BACKGROUNDCOLOR,
                borderBottomColor: BACKGROUNDCOLOR,
                borderBottomWidth: 0
              },
              headerTintColor: '#fff',
              cardStyle: { backgroundColor: BACKGROUNDCOLOR}
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
        {toaster}
      </>
  );
}