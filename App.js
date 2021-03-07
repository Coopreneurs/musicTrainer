import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import {
  HomeScreen, 
  HistoryScreen, 
  TrainingScreen,
  PrivacyScreen,
  TnCScreen
} from './Screens';

import { toaster} from './Toaster';
// import { pulse } from './Pulse';
const Stack = createStackNavigator();
const BACKGROUNDCOLOR = '#06c2ac'; //'#000044' '#06c2ac';
const HEADERCOLOR = '#d8877a'; //'#000044';

export default class App extends React.Component {
  state = {
    isReady: false,
  };
  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
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
              name="Privacy"
              component={PrivacyScreen}
              options={{ 
                title: 'Datenschutzunterrichtung'
              }}
            />
            <Stack.Screen
              name="TermsAndConditions"
              component={TnCScreen}
              options={{ 
                title: 'Nutzungsvereinbarung'
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

  async _cacheResourcesAsync() {
    const images = [require('./assets/icon.png')];
    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    }); 
    return Promise.all(cacheImages);
  }
}