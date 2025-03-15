import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {RowComponent, SpaceComponent, TextComponent} from '.';
import {appColors} from '../constants/appColors';
import {authSelector, removeAuth} from '../redux/reducers/authReducer';
import {globalStyles} from '../styles/globalStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const DrawerCustom = ({navigation}: any) => {
  const user = useSelector(authSelector);
  const dispatch = useDispatch();
  const size = 20;
  const color = appColors.watermelon;
  const profileMenu = [
    {
      key: 'MyProfile',
      title: 'Thông tin',
      icon: <AntDesign name="user" size={size} color={color} />,
    },
    {
      key: 'Message',
      title: 'Tin nhắn',
      icon: <AntDesign name="message1" size={size} color={color} />,
    },
    {
      key: 'ContactUs',
      title: 'Liên hệ với chúng tôi',
      icon: <AntDesign name="phone" size={size} color={color} />,
    },
    {
      key: 'Settings',
      title: 'Cài đặt',
      icon: <AntDesign name="setting" size={size} color={color} />,
    },
    {
      key: 'HelpAndFAQs',
      title: 'Câu hỏi và trợ giúp',
      icon: <AntDesign name="questioncircleo" size={size} color={color} />,
    },
    {
      key: 'SignOut',
      title: 'Đăng xuất',
      icon: <FontAwesome name="sign-out" size={size} color={color} />,
    },
  ];

  const handleSignOut = async () => {
    dispatch(removeAuth({}));
    await AsyncStorage.clear();
  };

  return (
    <View style={[localStyles.container]}>
      <TouchableOpacity
        onPress={() => {
          navigation.closeDrawer();

          navigation.navigate('HomeNavigator', {screen: 'Profile'});
        }}>
        {user.photo ? (
          <Image source={{uri: user.photo}} style={[localStyles.avatar]} />
        ) : (
          <Image
            source={require('../assets/images/1.png')} // Đường dẫn đến ảnh mặc định
            style={[localStyles.avatar]}
          />
        )}

        <TextComponent text={user.name} title size={18} />
      </TouchableOpacity>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={profileMenu}
        style={{flex: 1, marginVertical: 20}}
        renderItem={({item, index}) => (
          <RowComponent
            styles={[localStyles.listItem]}
            onPress={
              item.key === 'SignOut'
                ? () => handleSignOut()
                : () => {
                    console.log(item.key);
                    navigation.closeDrawer();
                  }
            }>
            {item.icon}
            <TextComponent
              text={item.title}
              styles={localStyles.listItemText}
            />
          </RowComponent>
        )}
      />
      {/* <RowComponent justify="flex-start">
        <TouchableOpacity
          style={[
            globalStyles.button,
            {backgroundColor: '#00F8FF33', height: 'auto'},
          ]}>
          <MaterialCommunityIcons name="crown" size={22} color={'#00F8FF'} />
          <SpaceComponent width={8} />
          <TextComponent color="#00F8FF" text="Upgrade Pro" />
        </TouchableOpacity>
      </RowComponent> */}
    </View>
  );
};

export default DrawerCustom;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 48,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },

  listItemText: {
    paddingLeft: 12,
  },
});
