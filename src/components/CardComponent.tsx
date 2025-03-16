import {View, Text, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';
import {appColors} from '../constants/appColors';

interface Props {
  children: ReactNode;
  bgColor?: string;
  styles?: StyleProp<ViewStyle>;
  onPress?: () => void;
  isShadow?: boolean;
}

const CardComponent = (props: Props) => {
  const {children, bgColor, styles, onPress, isShadow} = props;
  const localstyles: StyleProp<ViewStyle>[] = [
    isShadow ? globalStyles.shadow : undefined,
    globalStyles.card,
    {
      backgroundColor: bgColor ?? appColors.white,
    },
    styles,
  ];
  return (
    <TouchableOpacity style={localstyles} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default CardComponent;
