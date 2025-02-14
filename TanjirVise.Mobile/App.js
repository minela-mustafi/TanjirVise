import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { navigationRef } from './navigation/RootNavigation';
import Navigator from './navigation/Navigator';
import { NativeBaseProvider } from "native-base";

const Stack = createStackNavigator();

export default function HomeApp () {
  let [fontsLoaded] = useFonts({
    'Inter': require('./assets/fonts/Inter/InterVariable.ttf')
  });

  if (!fontsLoaded)
  {
    return undefined;
  }
  else
  {
    SplashScreen.hideAsync();
    return (
      <NavigationContainer
        style={ { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 } }
        ref={ navigationRef }
      ><NativeBaseProvider>
          <Navigator />
        </NativeBaseProvider>
        {/* <Footer /> */ }
      </NavigationContainer>
    );
  }
}
