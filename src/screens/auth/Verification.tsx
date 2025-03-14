import AsyncStorage from '@react-native-async-storage/async-storage';
import {ArrowRight} from 'iconsax-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {useDispatch} from 'react-redux';
import authenticationAPI from '../../api/authApi';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {fontFamilies} from '../../constants/fontFamilies';
import {LoadingModal} from '../../modals';
import {addAuth} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../styles/globalStyles';

const Verification = ({navigation, route}: any) => {
  const {code, email, password, username} = route.params;

  const [currentCode, setCurrentCode] = useState<string>(code);
  const [codeValues, setCodeValues] = useState<string[]>([]);
  const [newCode, setNewCode] = useState('');
  const [limit, setLimit] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const ref1 = useRef<any>();
  const ref2 = useRef<any>();
  const ref3 = useRef<any>();
  const ref4 = useRef<any>();
  const ref5 = useRef<any>();
  const ref6 = useRef<any>();

  const dispatch = useDispatch();

  useEffect(() => {
    ref1.current.focus();
  }, []);

  useEffect(() => {
    if (limit > 0) {
      const interval = setInterval(() => {
        setLimit(limit => limit - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [limit]);

  useEffect(() => {
    let item = ``;

    codeValues.forEach(val => (item += val));

    setNewCode(item);
  }, [codeValues]);

  const handleChangeCode = (val: string, index: number) => {
    const data = [...codeValues];
    data[index] = val;

    setCodeValues(data);
  };

  const handleResendVerification = async () => {
    setCodeValues(['', '', '', '', '', '']);
    setNewCode('');

    const api = `/verification`;
    setIsLoading(true);
    try {
      const res: any = await authenticationAPI.HandleAuthentication(
        api,
        {email},
        'post',
      );

      setLimit(120);
      setCurrentCode(res.data.code);
      setIsLoading(false);

      console.log(res.data.code);
    } catch (error) {
      setIsLoading(false);
      console.log(`Lỗi khi gửi mã ${error}`);
    }
  };

  const handleVerification = async () => {
    if (limit > 0) {
      if (parseInt(newCode) !== parseInt(currentCode)) {
        setErrorMessage('Mã xác nhận không đúng!!!');
      } else {
        setErrorMessage('');

        const api = `/register`;
        const data = {
          email,
          password,
          username: username ?? '',
        };

        try {
          const res: any = await authenticationAPI.HandleAuthentication(
            api,
            data,
            'post',
          );
          dispatch(addAuth(res.data));
          await AsyncStorage.setItem('auth', JSON.stringify(res.data));
        } catch (error) {
          setErrorMessage('Tài khoản đã tồn tại!!!');
          console.log(`Không thể tạo người dùng mới ${error}`);
        }
      }
    } else {
      setErrorMessage('Mã xác minh hết thời gian, vui lòng gửi lại mã mới!!!');
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text="Mã xác minh" title />
        <SpaceComponent height={12} />
        <TextComponent
          text={`Chúng tôi đã gửi cho bạn mã xác minh vào email ${email.replace(
            /.{1,5}/,
            (m: any) => '*'.repeat(m.length),
          )}`}
        />
        <SpaceComponent height={26} />
        <RowComponent justify="space-around">
          <TextInput
            keyboardType="number-pad"
            ref={ref1}
            value={codeValues[0]}
            style={[styles.input, codeValues[0] && styles.inputFocused]}
            maxLength={1}
            onChangeText={val => {
              val.length > 0 && ref2.current.focus();
              handleChangeCode(val, 0);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref2}
            value={codeValues[1]}
            style={[styles.input, codeValues[0] && styles.inputFocused]}
            maxLength={1}
            onChangeText={val => {
              val.length > 0 && ref3.current.focus();
              handleChangeCode(val, 1);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref3}
            value={codeValues[2]}
            style={[styles.input, codeValues[0] && styles.inputFocused]}
            maxLength={1}
            onChangeText={val => {
              val.length > 0 && ref4.current.focus();
              handleChangeCode(val, 2);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref4}
            value={codeValues[3]}
            style={[styles.input, codeValues[0] && styles.inputFocused]}
            maxLength={1}
            onChangeText={val => {
              val.length > 0 && ref5.current.focus();
              handleChangeCode(val, 3);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref5}
            value={codeValues[4]}
            style={[styles.input, codeValues[0] && styles.inputFocused]}
            maxLength={1}
            onChangeText={val => {
              val.length > 0 && ref6.current.focus();
              handleChangeCode(val, 4);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref6}
            value={codeValues[5]}
            style={[styles.input, codeValues[0] && styles.inputFocused]}
            maxLength={1}
            onChangeText={val => {
              handleChangeCode(val, 5);
            }}
            placeholder="-"
          />
        </RowComponent>
      </SectionComponent>
      <SectionComponent styles={{marginTop: 40}}>
        <ButtonComponent
          disable={newCode.length !== 6}
          onPress={handleVerification}
          text="Continue"
          type="primary"
          iconFlex="right"
        />
      </SectionComponent>
      {errorMessage && (
        <SectionComponent>
          <TextComponent
            styles={{textAlign: 'center'}}
            text={errorMessage}
            color={appColors.danger}
          />
        </SectionComponent>
      )}
      <SectionComponent>
        {limit > 0 ? (
          <RowComponent justify="center">
            <TextComponent text="Re-send code in  " flex={0} />
            <TextComponent
              text={`${(limit - (limit % 60)) / 60}:${
                limit - (limit - (limit % 60))
              }`}
              flex={0}
              color={appColors.link}
            />
          </RowComponent>
        ) : (
          <RowComponent>
            <ButtonComponent
              type="link"
              text="Gửi lại xác minh email"
              onPress={handleResendVerification}
            />
          </RowComponent>
        )}
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default Verification;

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: 50,
    borderRadius: 16, // Bo góc mềm hơn
    borderWidth: 1.5,
    borderColor: appColors.gray2,
    backgroundColor: appColors.white, // Tạo cảm giác nhẹ nhàng
    shadowColor: '#000', // Bóng đổ nhẹ
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Hiệu ứng nổi trên Android
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
    color: appColors.primary, // Màu chữ nổi bật hơn
  },
  inputFocused: {
    borderColor: appColors.primary, // Border khi focus
    shadowOpacity: 0.3, // Tăng bóng đổ nhẹ khi focus
  },
  iconWrapper: {
    backgroundColor: appColors.primary,
    padding: 12,
    borderRadius: 12,
  },
  buttonContainer: {
    backgroundColor: appColors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
