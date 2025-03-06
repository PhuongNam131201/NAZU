import React from 'react';
import {ActivityIndicator, Image, ImageBackground, View} from 'react-native';
import {TextComponent} from '../components';
import SpaceComponent from '../components/SpaceComponent';
import {appColors} from '../constants/appColors';
import {appInfo} from '../constants/appinfos';

const SplashScreen = () => {
  return (
    <ImageBackground
      style={{
        backgroundColor: appColors.white,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      imageStyle={{flex: 1}}>
      <Image
        source={require('../assets/images/1.png')}
        style={{
          width: appInfo.sizes.WIDTH * 1,
          resizeMode: 'contain',
          marginTop: -50,
        }}
      />
      <View>
        <TextComponent
          text="Tìm phòng trọ gần bạn"
          size={18}
          styles={{marginTop: -50}}
          title={true}
        />
      </View>
      <SpaceComponent height={30} />
      <ActivityIndicator color={appColors.green} size={22} />
    </ImageBackground>
  );
};

export default SplashScreen;
