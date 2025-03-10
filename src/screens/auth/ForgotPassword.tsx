import React, {useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  return (
    <ContainerComponent back isImageBackground>
      <SectionComponent>
        <TextComponent text="Quên mật khẩu" title />
        <TextComponent
          text="Vui lòng nhập email của bạn để lấy lại mật khẩu"
          styles={{marginTop: 10}}
        />
        <SpaceComponent height={26} />

        <InputComponent
          value={email}
          onChange={val => setEmail(val)}
          affix={
            <Ionicons name="mail-outline" size={22} color={appColors.text} />
          }
          placeholder="abc@gmail.com"
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent
          text="Gửi"
          type="primary"
          icon={<Ionicons name="send" size={22} color={appColors.white} />}
          iconFlex="right"
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ForgotPassword;
