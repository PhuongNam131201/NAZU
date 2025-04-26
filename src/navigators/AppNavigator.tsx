import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import PlaceDetail from '../screens/place/PlaceDetail';

export type RootStackParamList = {
  Home: undefined;
  PlaceDetail: {roomId: string};
  DepositScreen: {roomId: string; price: number; ownerBankAccount: string}; // Định nghĩa tham số cho DepositScreen
  MapScreen: undefined;
  AdminApproval: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetail} />

      {/* Đảm bảo màn hình được khai báo */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
