import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {RowComponent, TextComponent} from '.';
import {appColors} from '../constants/appColors';

interface Props {
  title: string;
  onPress: () => void;
}

const TagBarComponent = (props: Props) => {
  const {title, onPress} = props;

  return (
    <RowComponent
      onPress={onPress}
      styles={{marginBottom: 12, paddingHorizontal: 16}}>
      <TextComponent numberOfLine={1} size={18} title text={title} flex={1} />
      <RowComponent>
        <TextComponent text="Mở rộng" color={appColors.gray} />
        <FontAwesome name="arrow-right" size={14} color={appColors.citymoke} />
      </RowComponent>
    </RowComponent>
  );
};

export default TagBarComponent;
