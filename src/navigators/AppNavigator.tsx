import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import PlaceDetail from '../screens/place/PlaceDetail';
import AdminApprovalScreen from '../screens/AdminApprovalScreen';

export type RootStackParamList = {
  Home: undefined;
  PlaceDetail: {roomId: string}; // Định nghĩa tham số cho PlaceDetail
  MapScreen: undefined;
  AdminApproval: undefined; // Thêm màn hình AdminApproval
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetail} />
      <Stack.Screen name="AdminApproval" component={AdminApprovalScreen} />{' '}
      {/* Thêm màn hình */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
