import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {CardComponent, RowComponent, TextComponent} from '../../components';
import {appInfo} from '../../constants/appinfos';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appColors} from '../../constants/appColors';
import {globalStyles} from '../../styles/globalStyles';

const PlaceDetail = ({navigation, route}: any) => {
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <ScrollView style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/images/1.png')}
        style={{flex: 1, height: 244}}
        imageStyle={{
          padding: 16,
          resizeMode: 'cover',
          height: 244,
          width: appInfo.sizes.WIDTH,
        }}>
        <RowComponent styles={{padding: 16}}>
          <RowComponent styles={{flex: 1}}>
            {/* Nút quay về */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{padding: 10}}>
              <Ionicons name="arrow-back" size={24} color={appColors.organge} />
            </TouchableOpacity>

            {/* Tiêu đề */}
            <TextComponent
              text="Nha em"
              title
              flex={1}
              styles={{marginLeft: 20}}
            />
          </RowComponent>
          <CardComponent
            styles={[globalStyles.cardsmail, {marginRight: 50}]}
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
    </ScrollView>
  );
};

export default PlaceDetail;
