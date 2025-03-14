import React, {useState} from 'react';
import {Alert, Image, Switch} from 'react-native';
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
import authenticationAPI from '../../api/authApi';
import {Validate} from '../../utils/validate';
import {useDispatch} from 'react-redux';
import {addAuth} from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(true);
  const dispatch = useDispatch();
  const handleLogin = async () => {
    const emailValidation = Validate.email(email);
    if (emailValidation) {
      try {
        const res = await authenticationAPI.HandleAuthentication(
          '/login',
          {
            email,
            password,
          },
          'post',
        );
        dispatch(addAuth(res.data));

        await AsyncStorage.setItem(
          'auth',
          isRemember ? JSON.stringify(res.data) : email,
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert('Email không tồn tại');
    }

    //   const api = `http://192.168.88.163:3001/hello`;
    //   try {
    //     const res = await fetch(api, {
    //       method: 'get',
    //     });
    //     console.log(res);
    //   } catch (error) {
    //     console.log(error);
    //   }
  };
  return (
    <ContainerComponent isImageBackground isScroll>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
          // marginTop: -200,
        }}>
        <Image
          style={{width: 200, height: 200}}
          source={require('../../assets/images/2.png')}
        />
        <TextComponent
          text="Đăng nhập"
          font={fontFamilies.semiBold}
          size={30}
          styles={{
            marginTop: -20,
            marginBottom: 20,
            color: appColors.primary,
          }}
        />
        <InputComponent
          value={email}
          placeholder="Email"
          onChange={val => setEmail(val)}
          // isPassword
          allowClear
          affix={<AntDesign name="mail" size={22} color={appColors.text} />}
        />
        <InputComponent
          value={password}
          placeholder="Password"
          onChange={val => setPassword(val)}
          isPassword
          allowClear
          affix={<Feather name="lock" size={22} color={appColors.text} />}
        />
      </SectionComponent>
      <SectionComponent>
        <RowComponent justify="space-between">
          <RowComponent onPress={() => setIsRemember(!isRemember)}>
            <Switch
              trackColor={{true: appColors.primary}}
              thumbColor={appColors.white}
              value={isRemember}
              onChange={() => setIsRemember(!isRemember)}
            />
            <TextComponent text="Ghi nhớ tài khoản" />
          </RowComponent>
          <ButtonComponent
            text="Quên mật khẩu?"
            onPress={() => navigation.navigate('ForgotPassword')}
            type="text"
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={20} />
      <SectionComponent styles={{marginTop: 20}}>
        <ButtonComponent
          text="Đăng nhập"
          type="primary"
          onPress={handleLogin}
        />
      </SectionComponent>
      <SocialLogin />
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Bạn chưa có tài khoản?" />
          <ButtonComponent
            text=" Đăng ký"
            type="link"
            onPress={() => navigation.navigate('SignUpScreen')}
          />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default LoginScreen;
