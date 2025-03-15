import React from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector, removeAuth} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {CircleComponent, RowComponent, TextComponent} from '../../components';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {fontFamilies} from '../../constants/fontFamilies';
const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  return (
    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   <Text>HomeScreen</Text>
    //   <Button title="Logout" onPress={async () => dispatch(removeAuth({}))} />
    // </View>
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          backgroundColor: appColors.primary,
          height: 179,
          borderBottomRightRadius: 50,
          borderBottomLeftRadius: 50,
          paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 42,
          paddingHorizontal: 16,
        }}>
        <RowComponent>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Entypo name="menu" color={appColors.white} size={28} />
          </TouchableOpacity>
          <View style={{flex: 1, alignItems: 'center'}}>
            <RowComponent>
              <TextComponent text="Địa chỉ" color={appColors.white2} />
              <Entypo name="chevron-down" size={28} color={appColors.white2} />
            </RowComponent>
            <TextComponent
              text="Bình Dương"
              flex={0}
              color={appColors.white}
              font={fontFamilies.medium}
            />
          </View>
          <CircleComponent color={appColors.limesoap} size={36}>
            <Ionicons
              name="notifications-circle-sharp"
              size={24}
              color={appColors.white}
            />
            <View
              style={{
                backgroundColor: appColors.watermelon,
                width: 8,
                height: 8,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: appColors.tomato,
                position: 'absolute',
                top: 5,
                right: 5,
              }}></View>
          </CircleComponent>
        </RowComponent>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: appColors.white,
        }}></View>
    </View>
  );
};

export default HomeScreen;
