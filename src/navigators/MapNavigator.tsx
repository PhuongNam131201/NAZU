import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MapScreen from '../screens/map/MapScreen';
import PlaceDetail from '../screens/place/PlaceDetail';

const MapNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetail} />
    </Stack.Navigator>
  );
};

export default MapNavigator;
