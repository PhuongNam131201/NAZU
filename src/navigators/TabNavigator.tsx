import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {ReactNode} from 'react';
import {Platform} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CircleComponent, TextComponent} from '../components';
import {appColors} from '../constants/appColors';
import AddNewScreen from '../screens/AddNewScreen';
import {globalStyles} from '../styles/globalStyles';
import HomeNavigator from './HomeNavigator';
import MapNavigator from './MapNavigator';
import PlaceNavigator from './PlaceNavigator';
import ProfileNavigator from './ProfileNavigator';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: appColors.white,
        }, // <--- Thiếu dấu ',' đã được thêm vào đây
        tabBarIcon: ({focused, color, size}) => {
          let icon: ReactNode;
          color = focused ? appColors.primary : appColors.gray5;
          size = 24;
          switch (route.name) {
            case 'Home':
              icon = <AntDesign name="home" size={size} color={color} />;
              break;
            case 'Map':
              icon = <Feather name="map" size={size} color={color} />;
              break;
            case 'Place':
              icon = (
                <FontAwesome6
                  name="place-of-worship"
                  size={size}
                  color={color}
                />
              );
              break;
            case 'Profile':
              icon = <AntDesign name="user" size={size} color={color} />;
              break;
            case 'Add':
              icon = (
                <CircleComponent
                  size={52}
                  styles={[
                    globalStyles.shadow,
                    {marginTop: Platform.OS === 'ios' ? -50 : -60},
                  ]}>
                  <MaterialIcons
                    name="add-home-work"
                    size={24}
                    color={appColors.white}
                  />
                </CircleComponent>
              );
              break;
          }
          return icon;
        },
        tabBarLabel: ({focused}) => {
          return route.name === 'Add' ? null : (
            <TextComponent
              text={route.name}
              flex={0}
              size={12}
              color={focused ? appColors.primary : appColors.gray5}
              styles={{
                marginBottom: Platform.OS === 'android' ? 12 : 0,
              }}
            />
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Map" component={MapNavigator} />
      <Tab.Screen name="Add" component={AddNewScreen} />
      <Tab.Screen name="Place" component={PlaceNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
