import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {CardComponent, RowComponent, TextComponent} from '.';
import Feather from 'react-native-vector-icons/Feather';
import {globalStyles} from '../styles/globalStyles';
import {appColors} from '../constants/appColors';
import ModalLocation from '../modals/ModalLocation';

const ChoiceLocation = () => {
  const [isVibleModalLocation, setIsVibleModalLocation] = useState(false);
  return (
    <>
      <RowComponent
        onPress={() => setIsVibleModalLocation(!isVibleModalLocation)}
        styles={[
          globalStyles.inputContainer,
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: 0,
          },
        ]}>
        <CardComponent
          styles={[
            globalStyles.cardsmail,
            {
              width: 45,
              height: 45,
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
              marginRight: 10,
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Feather name="map-pin" size={20} color={appColors.tomato} />
        </CardComponent>

        <TextComponent text="Địa chỉ" flex={0} />
      </RowComponent>
      <ModalLocation
        visible={isVibleModalLocation}
        onClose={() => setIsVibleModalLocation(false)}
        onSelect={val => console.log(val)}
      />
    </>
  );
};

export default ChoiceLocation;
