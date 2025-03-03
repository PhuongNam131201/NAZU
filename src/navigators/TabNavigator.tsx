import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/home/HomeScreen';

const TabNavigator = () => {
    const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions = {{headerShown : false}}>
        <Tab.Screen name="HomeScreen" component={HomeScreen}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;