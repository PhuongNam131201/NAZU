import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import PlaceScreen from '../screens/place/PlaceScreen';

const PlaceNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="PlaceScreen" component={PlaceScreen} />
    </Stack.Navigator>
  );
};

export default PlaceNavigator;
