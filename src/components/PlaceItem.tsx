import React, {useState} from 'react';
import {Dimensions, Image, ImageBackground, View} from 'react-native';
import {
  AvatarGroup,
  CardComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '.';
import Icon from 'react-native-vector-icons/Ionicons';
import {appColors} from '../constants/appColors';
import {globalStyles} from '../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
interface Props {
  item: any;
  type: 'list' | 'card';
}

const PlaceItem = (props: Props) => {
  const {item, type} = props;
  const navigation: any = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  return type === 'card' ? (
    <CardComponent
      isShadow
      styles={{width: Dimensions.get('window').width * 0.6}}
      onPress={() => navigation.navigate('PlaceDetail')}>
      <ImageBackground
        style={{flex: 1, marginBottom: 12, height: 131, padding: 10}}
        source={require('../assets/images/1.png')}
        imageStyle={{
          resizeMode: 'cover',
          borderRadius: 12,
        }}>
        <RowComponent justify="space-between">
          <CardComponent
            styles={[globalStyles.cardsmail]}
            bgColor={appColors.citymoke}>
            <TextComponent text="14" />
            <TextComponent text="12" />
          </CardComponent>
          <CardComponent
            styles={[globalStyles.cardsmail]}
            bgColor={appColors.citymoke}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? appColors.tomato : appColors.white}
              onPress={() => setIsFavorite(!isFavorite)}
            />
          </CardComponent>
        </RowComponent>
      </ImageBackground>

      <TextComponent numberOfLine={1} text={item.title} title size={18} />

      <SpaceComponent height={5} />
      <TextComponent text={item.price} size={16} color={appColors.tomato} />
      <SpaceComponent height={5} />
      <RowComponent>
        <Icon name="location-outline" size={24} color="red" />
        <TextComponent
          text={item?.location?.address || 'Không có địa chỉ'}
          flex={1}
          size={12}
          color={appColors.text}
          numberOfLine={1}
        />
      </RowComponent>
    </CardComponent>
  ) : null;
};

export default PlaceItem;
