import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import ContainerComponent from '../../components/ContainerComponent';
import {appColors} from '../../constants/appColors';
import {fontFamilies} from '../../constants/fontFamilies';
import SocialLogin from './components/SocialLogin';
const initValue = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};
const SignUpScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initValue);
  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};

    data[`${key}`] = value;

    setValues(data);
  };

  return (
    <ContainerComponent isImageBackground isScroll back>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TextComponent
          text="Đăng ký"
          font={fontFamilies.semiBold}
          size={30}
          styles={{
            marginBottom: 20,
            color: appColors.primary,
          }}
        />
        <InputComponent
          value={values.username}
          placeholder="Tên đăng nhập"
          onChange={val => handleChangeValue('username', val)}
          // isPassword
          allowClear
          affix={<AntDesign name="user" size={22} color={appColors.text} />}
        />
        <InputComponent
          value={values.email}
          placeholder="Email"
          onChange={val => handleChangeValue('email', val)}
          // isPassword
          allowClear
          affix={<AntDesign name="mail" size={22} color={appColors.text} />}
        />
        <InputComponent
          value={values.password}
          placeholder="Mật khẩu"
          onChange={val => handleChangeValue('password', val)}
          isPassword
          allowClear
          affix={<Feather name="lock" size={22} color={appColors.text} />}
        />
        <InputComponent
          value={values.confirmPassword}
          placeholder="Xác nhận mật khẩu"
          onChange={val => handleChangeValue('confirmPassword', val)}
          isPassword
          allowClear
          affix={<Feather name="lock" size={22} color={appColors.text} />}
        />
        {/* <InputComponent
          value={password}
          placeholder="Password"
          onChange={val => setPassword(val)}
          isPassword
          allowClear
          affix={<Feather name="lock" size={22} color={appColors.text} />}
        /> */}
      </SectionComponent>
      <SpaceComponent height={20} />
      <SectionComponent styles={{marginTop: 20}}>
        <ButtonComponent text="Đăng ký" type="primary" />
      </SectionComponent>
      <SocialLogin />
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Bạn đã có tài khoản? " />
          <ButtonComponent
            text=" Đăng nhập"
            type="link"
            onPress={() => navigation.navigate('LoginScreen')}
          />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default SignUpScreen;
