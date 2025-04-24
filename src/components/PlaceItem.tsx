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
import defaultImage from '../assets/images/1.png'; // Import hình ảnh mặc định

interface Props {
  item: any;
  type: 'list' | 'card';
  customStyles?: object; // Thêm customStyles để nhận kiểu dáng tùy chỉnh
}

const PlaceItem = (props: Props) => {
  const {item, type, customStyles} = props;
  const navigation: any = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);

  // Lấy ngày và tháng từ thời gian đăng bài
  const postDate = item.time ? new Date(item.time) : null;
  const day = postDate ? postDate.getDate() : '--';
  const month = postDate ? postDate.getMonth() + 1 : '--'; // Tháng bắt đầu từ 0, cần +1

  // Sử dụng hình ảnh mặc định nếu không có `item.imageUrl`
  const imageUrl = item.imageUrl ? {uri: item.imageUrl} : defaultImage;

  return type === 'card' ? (
    <CardComponent
      isShadow
      styles={[{width: Dimensions.get('window').width * 0.6}, customStyles]} // Áp dụng customStyles nếu có
      onPress={() => navigation.navigate('PlaceDetail', {roomId: item.id})}>
      <ImageBackground
        style={{flex: 1, marginBottom: 12, height: 131, padding: 10}}
        source={imageUrl}
        imageStyle={{
          resizeMode: 'cover',
          borderRadius: 12,
        }}
        onError={() => console.error('Lỗi khi tải hình ảnh:', item.imageUrl)}>
        <RowComponent justify="space-between">
          <CardComponent
            styles={[globalStyles.cardsmail]}
            bgColor={appColors.citymoke}>
            <TextComponent text={`${day}`} />
            <TextComponent text={`${month}`} />
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
      <TextComponent
        text={`${item.price.toLocaleString()} VNĐ/tháng`}
        size={16}
        color={appColors.tomato}
      />
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
      {item.distanceText && ( // Hiển thị khoảng cách nếu có
        <TextComponent
          text={`Khoảng cách: ${item.distanceText}`}
          size={12}
          color={appColors.gray}
          styles={{marginTop: 5}}
        />
      )}
    </CardComponent>
  ) : null;
};

export default PlaceItem;
