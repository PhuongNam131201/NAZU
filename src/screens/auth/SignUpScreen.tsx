import React, {useEffect, useState} from 'react';
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
import {LoadingModal} from '../../modals';
import authenticationAPI from '../../api/authApi';
import {Validate} from '../../utils/validate';
const initValue = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};
const SignUpScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>();
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    if (values.email || values.password || values.username) {
      setErrorMessage('');
    }
  }, [values.email, values.password, values.username]);
  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};

    data[`${key}`] = value;

    setValues(data);
  };
  const handleRegister = async () => {
    const {email, password, username, confirmPassword} = values;
    const emailValidation = Validate.email(email);
    const passwordValidation = Validate.Password(password);
    if (email && password && username && confirmPassword) {
      if (emailValidation && passwordValidation) {
        setIsLoading(true);
        try {
          const res = await authenticationAPI.HandleAuthentication(
            '/register',
            values,
            'post',
          );
          console.log('res', res);
          setIsLoading(false);
        } catch (error) {
          console.log('error', error);
          setIsLoading(false);
        }
      } else {
        setErrorMessage({
          email: 'Email không hợp lệ',
          password: 'Mật khẩu phải có ít nhất 6 ký tự',
        });
      }
    } else {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
    }
  };
  return (
    <>
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
        {errorMessage && (
          <SectionComponent>
            {Object.keys(errorMessage).map(
              (error, index) =>
                errorMessage[`${error}`] && (
                  <TextComponent
                    text={errorMessage[`${error}`]}
                    key={`error${index}`}
                    color={appColors.tomato}
                  />
                ),
            )}
          </SectionComponent>
        )}
        <SpaceComponent height={20} />
        <SectionComponent styles={{marginTop: 20}}>
          <ButtonComponent
            text="Đăng ký"
            type="primary"
            onPress={handleRegister}
          />
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
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default SignUpScreen;
