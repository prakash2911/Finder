import {View, Text, PermissionsAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConsumerHome from './src/pages/consumer/ConsumerHome';
import GovernmentHome from './src/pages/government/GovernmentHome';
import Login from './src/pages/Login';
const Stack = createNativeStackNavigator();

const App = () => {
  const [locationPermissionGranted, setPermissionGranted] = useState(false);

  const checkPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs to access your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true);
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ConsumerHome" component={ConsumerHome} />
        <Stack.Screen name="GovernmentHome" component={GovernmentHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
