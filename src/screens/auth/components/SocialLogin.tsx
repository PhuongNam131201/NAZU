import React from 'react';
import {
  ButtonComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import {appColors} from '../../../constants/appColors';
import {fontFamilies} from '../../../constants/fontFamilies';
import {Image} from 'react-native';

const SocialLogin = () => {
  return (
    <SectionComponent>
      <TextComponent
        text="Hoặc"
        color={appColors.gray4}
        size={16}
        styles={{textAlign: 'center'}}
        font={fontFamilies.medium}
      />
      <SpaceComponent height={16} />

      <ButtonComponent
        type="primary"
        onPress={() => {}}
        color={appColors.white}
        textColor={appColors.text}
        text="Đăng nhập với Google"
        textFont={fontFamilies.regular}
        iconFlex="left"
        icon={
          <Image
            style={{width: 20, height: 20, marginRight: 8}}
            source={require('../../../assets/images/google.png')}
            resizeMode="contain"
          />
        }
      />
      <ButtonComponent
        type="primary"
        color={appColors.white}
        textColor={appColors.text}
        text="Đăng nhập với Facebook"
        textFont={fontFamilies.regular}
        onPress={() => {}}
        iconFlex="left"
        icon={
          <Image
            style={{
              width: 20,
              height: 20,
            }}
            source={require('../../../assets/images/facebook.png')}
            resizeMode="contain"
          />
        }
      />
    </SectionComponent>
  );
};

export default SocialLogin;
