import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {
  CategoriesList,
  CircleComponent,
  PlaceItem,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TagBarComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {authSelector} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../styles/globalStyles';

import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {fontFamilies} from '../../constants/fontFamilies';
import {AddressModel} from '../../models/AddressModel';
import Geocoder from 'react-native-geocoding';
import database from '@react-native-firebase/database';
import haversine from 'haversine-distance'; // Thêm thư viện tính khoảng cách

Geocoder.init(process.env.MAP_API_GOONG as string);

const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  console.log(process.env.MAP_API_GOONG);
  const [currenLocation, setCurrenLocation] = useState<{
    lat: number;
    lon: number;
    address?: {
      district: string;
      city: string;
      countryName: string;
    };
  } | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [nearbyRooms, setNearbyRooms] = useState<any[]>([]); // Danh sách nhà trọ gần bạn

  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      if (position.coords) {
        const currentLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setCurrenLocation(currentLocation);
        reverseGeoCode(currentLocation); // Lấy địa chỉ hiện tại
      }
    });
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const snapshot = await database().ref('/rooms').once('value');
        const data = snapshot.val();
        if (data) {
          const roomsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          setRooms(roomsArray);

          if (currenLocation) {
            calculateNearbyRooms(roomsArray, currenLocation); // Tính nhà trọ gần bạn
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ Firebase:', error);
      }
    };

    fetchRooms();
  }, [currenLocation]);

  const reverseGeoCode = async ({lat, lon}: {lat: number; lon: number}) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lon}&lang=vi-VI&apiKey=6dVvU0jSlISYFm251QMhjRjMAwHvOllgnQhW_Sq3PBE`;
    try {
      const res = await axios(api);
      if (res && res.status == 200 && res.data) {
        const items = res.data.items;
        if (items && items.length > 0) {
          const address = items[0].address;
          setCurrenLocation({lat, lon, address}); // Cập nhật vị trí hiện tại
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateNearbyRooms = (
    rooms: any[],
    currentLocation: {lat: number; lon: number} | null, // Đổi 'long' thành 'lon' để phù hợp với kiểu LatLon
  ) => {
    if (!currentLocation) {
      console.error('currentLocation is null or undefined'); // Log lỗi nếu currentLocation bị null
      return;
    }

    const sortedRooms = rooms
      .map(room => {
        if (room.location?.position) {
          const roomLocation = {
            lat: room.location.position.lat,
            lon: room.location.position.long, // Đổi 'long' thành 'lon' để phù hợp với kiểu LatLon
          };

          // Kiểm tra giá trị hợp lệ trước khi tính khoảng cách
          if (
            typeof currentLocation.lat !== 'number' ||
            typeof currentLocation.lon !== 'number' ||
            typeof roomLocation.lat !== 'number' ||
            typeof roomLocation.lon !== 'number' ||
            isNaN(currentLocation.lat) ||
            isNaN(currentLocation.lon) ||
            isNaN(roomLocation.lat) ||
            isNaN(roomLocation.lon)
          ) {
            console.warn('Invalid location data detected:', {
              currentLocation,
              roomLocation,
            });
            return {...room, distance: Infinity}; // Đặt khoảng cách là vô cực nếu dữ liệu không hợp lệ
          }

          try {
            const distance = haversine(currentLocation, roomLocation); // Tính khoảng cách
            if (isNaN(distance)) {
              console.error('Calculated distance is NaN:', {
                currentLocation,
                roomLocation,
              });
              return {...room, distance: Infinity}; // Đặt khoảng cách là vô cực nếu tính toán thất bại
            }

            return {...room, distance};
          } catch (error) {
            console.error('Error calculating distance:', error, {
              currentLocation,
              roomLocation,
            });
            return {...room, distance: Infinity}; // Đặt khoảng cách là vô cực nếu xảy ra lỗi
          }
        }

        console.warn('roomLocation is undefined for room:', room); // Log cảnh báo nếu không có vị trí
        return {...room, distance: Infinity}; // Nếu không có vị trí, đặt khoảng cách là vô cực
      })
      .sort((a, b) => a.distance - b.distance); // Sắp xếp theo khoảng cách từ gần đến xa

    setNearbyRooms(sortedRooms);
  };

  const itemPlace = {
    id: 'room_001',
    ownerId: '1',
    title: 'NHÀ ĐẸP',
    description: 'Xin chào bạn, đây là căn nhà lý tưởng cho bạn!',
    price: 5000000,
    location: {
      address: '123 Đường ABC',
      title: 'Nhà đẹp',
    },
    imageUrl: '',
    amenities: ['Wifi', 'Điều hòa', 'Nóng lạnh', 'Gác lửng'],
    time: Date.now(),
  };

  return (
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          backgroundColor: appColors.primary,
          height: 190,
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
              {currenLocation && currenLocation.address && (
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
          </View>
          <SpaceComponent height={15} />
          <TagBarComponent title="Đề xuất" onPress={() => {}} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={rooms} // Lấy danh sách phòng trọ từ Firebase
            keyExtractor={item => item.id}
            renderItem={({item}) => <PlaceItem type="card" item={item} />}
          />

          <TagBarComponent title="Gần bạn" onPress={() => {}} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={nearbyRooms} // Sử dụng danh sách nhà trọ gần bạn
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <PlaceItem
                type="card"
                item={{
                  ...item,
                  distanceText: item.distance
                    ? `${(item.distance / 1000).toFixed(2)} km` // Hiển thị khoảng cách theo km
                    : 'Không xác định',
                }}
              />
            )}
          />
        </SectionComponent>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
