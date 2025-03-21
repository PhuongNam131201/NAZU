import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import SearchPlace from '../screens/place/SearchPlace';
import PlaceDetail from '../screens/place/PlaceDetail';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SearchPlace" component={SearchPlace} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetail} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
