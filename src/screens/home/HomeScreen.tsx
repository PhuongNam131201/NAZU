import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector, removeAuth} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {
  CategoriesList,
  CircleComponent,
  PlaceItem,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TagBarComponent,
  TagComponent,
  TextComponent,
} from '../../components';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {fontFamilies} from '../../constants/fontFamilies';
import {RoomModel} from '../../models/RoomModel';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {Address, AddressModel} from '../../models/AddressModel';
const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  const [currenLocation, setCurrenLocation] = useState<AddressModel>();
  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      if (position.coords) {
        reverseGeoCode({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      }
    });
  }, []);
  const reverseGeoCode = async ({lat, long}: {lat: number; long: number}) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VI&apiKey=6dVvU0jSlISYFm251QMhjRjMAwHvOllgnQhW_Sq3PBE`;
    try {
      const res = await axios(api);
      if (res && res.status == 200 && res.data) {
        const items = res.data.items;
        setCurrenLocation(items[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const itemPlace = {
    id: 'room_001',
    ownerId: '1',
    title: 'NHÀ ĐẸP',
    description: 'Xin chào bạn, đây là căn nhà lý tưởng cho bạn!',
    price: 5000000,
    location: {
      address: '123 Đường ABC',
      city: 'Bình Dương',
      district: 'Thủ Dầu Một',
      ward: 'Phú Hòa',
    },
    imageUrl: '',
    amenities: ['Wifi', 'Điều hòa', 'Nóng lạnh', 'Gác lửng'],
    availableFrom: Date.now(),
    availableTo: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };

  return (
    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   <Text>HomeScreen</Text>
    //   <Button title="Logout" onPress={async () => dispatch(removeAuth({}))} />
    // </View>
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          backgroundColor: appColors.primary,
          height: 190,
          // borderBottomRightRadius: 30,
          // borderBottomLeftRadius: 30,
          paddingTop:
            Platform.OS === 'android'
              ? (StatusBar.currentHeight || 24) + 10 // Thêm 10px
              : 52, // Tăng giá trị mặc định trên iOS
        }}>
        <View style={{paddingHorizontal: 25}}>
          <RowComponent>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Entypo name="menu" color={appColors.white} size={28} />
            </TouchableOpacity>
            <View style={{flex: 1, alignItems: 'center'}}>
              <RowComponent>
                <TextComponent text="Địa chỉ" color={appColors.white2} />
                <Entypo
                  name="chevron-down"
                  size={28}
                  color={appColors.white2}
                />
              </RowComponent>
              {currenLocation && (
                <View>
                  <TextComponent
                    text={`${currenLocation.address.district}`}
                    flex={0}
                    color={appColors.white}
                    font={fontFamilies.medium}
                  />
                  <TextComponent
                    text={`${currenLocation.address.city},${currenLocation.address.countryName}`}
                    flex={0}
                    color={appColors.white}
                    font={fontFamilies.medium}
                  />
                </View>
              )}
            </View>
            <CircleComponent color={appColors.limesoap} size={36}>
              <Ionicons
                name="notifications-circle-sharp"
                size={24}
                color={appColors.white}
              />
              <View
                style={{
                  backgroundColor: appColors.watermelon,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: appColors.tomato,
                  position: 'absolute',
                  top: 5,
                  right: 5,
                }}></View>
            </CircleComponent>
          </RowComponent>
          <SpaceComponent height={10} />
          <RowComponent>
            <RowComponent styles={{flex: 1}}>
              <Ionicons
                name="search-outline"
                size={20}
                color={appColors.white}
              />
              <View
                style={{
                  width: 1,
                  backgroundColor: appColors.white,
                  marginHorizontal: 10,
                  height: 18,
                }}
              />
              <TextComponent
                flex={1}
                text="Tìm kiếm ..."
                color={appColors.citymoke}
              />
            </RowComponent>
            <RowComponent
              onPress={() =>
                navigation.navigate('SearchPlace', {
                  isFilter: true,
                })
              }
              styles={{
                backgroundColor: appColors.watermelon,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 100,
              }}>
              <CircleComponent size={19.3} color={appColors.citymoke}>
                <Ionicons name="filter-sharp" color={appColors.piece} />
              </CircleComponent>
              <SpaceComponent width={8} />
              <TextComponent text="Bộ lọc" color={appColors.white} />
            </RowComponent>
          </RowComponent>
        </View>
        <SpaceComponent height={10} />
        <View style={{paddingBottom: 10, zIndex: 1}}>
          <CategoriesList isColor />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          marginBottom: 16,
        }}>
        <SectionComponent styles={{paddingHorizontal: 0, paddingTop: 20}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../../assets/images/banner.png')}
              style={{
                width: '100%',
                height: 110,
                borderRadius: 10,
                marginTop: -20,
              }}
              resizeMode="cover"
            />
            {/* <TextComponent
              title
              text="Xin chào bạn"
              size={20}
              color={appColors.limesoap}
            /> */}
          </View>
          <SpaceComponent height={15} />
          <TagBarComponent title="Đề xuất" onPress={() => {}} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={Array.from({length: 5}).map((_, i) => ({
              ...itemPlace,
              id: `place_${i}`,
            }))}
            keyExtractor={item => item.id}
            renderItem={({item}) => <PlaceItem type="card" item={item} />}
          />

          <TagBarComponent title="Gần bạn" onPress={() => {}} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={Array.from({length: 5})}
            renderItem={({item, index}) => (
              <PlaceItem type="card" item={itemPlace} key={`place${index}`} />
            )}
          />
        </SectionComponent>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
