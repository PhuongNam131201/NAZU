import React, {useState} from 'react';
import {Alert} from 'react-native';
import authenticationAPI from '../../api/authApi';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {LoadingModal} from '../../modals';
import {Validate} from '../../utils/validate';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckEmail = () => {
    const isValidEmail = Validate.email(email);
    setIsDisable(!isValidEmail);
  };

  const handleForgotPassword = async () => {
    const api = `/forgotPassword`;
    setIsLoading(true);
    try {
      const res: any = await authenticationAPI.HandleAuthentication(
        api,
        {email},
        'post',
      );

      console.log(res);

      Alert.alert(
        'Yêu cầu đặt lại mật khẩu',
        'Chúng tôi đã gửi email hỗ trợ đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến hoặc thư rác.',
        [{text: 'OK', style: 'default'}],
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(`Không thể tạo api mật khẩu mới quên mật khẩu, ${error}`);
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text="Quên mật khẩu" title />
        <SpaceComponent height={12} />
        <TextComponent text="Vui lòng nhập địa chỉ email của bạn để yêu cầu đặt lại mật khẩu" />
        <SpaceComponent height={26} />
        <InputComponent
          value={email}
          onChange={val => setEmail(val)}
          placeholder="abc@gmail.com"
          onEnd={handleCheckEmail}
        />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          onPress={handleForgotPassword}
          disable={isDisable}
          text="Gửi"
          type="primary"
          iconFlex="right"
        />
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default ForgotPassword;
