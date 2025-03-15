import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ProfileScreen from '../screens/profile/ProfileScreen';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
