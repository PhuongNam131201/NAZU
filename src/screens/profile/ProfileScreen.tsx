import React from 'react';
import {Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {ButtonComponent, ContainerComponent} from '../../components';
import {removeAuth} from '../../redux/reducers/authReducer';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  return (
    <ContainerComponent back>
      <Text>Thông tin cá nhân</Text>
      <ButtonComponent
        type="primary"
        text="Đăng xuất"
        onPress={() => {
          dispatch(removeAuth({}));
        }}
      />
    </ContainerComponent>
  );
};

export default ProfileScreen;
