import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet, TouchableOpacity} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import haversine from 'haversine-distance';
import database from '@react-native-firebase/database';
import {
  TextComponent,
  PlaceItem,
  SectionComponent,
  RowComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
const PlaceScreen = ({navigation}: any) => {
  const [currenLocation, setCurrenLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [nearbyRooms, setNearbyRooms] = useState<any[]>([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      if (position.coords) {
        const currentLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude, // Đổi 'long' thành 'lon' để phù hợp với thư viện haversine
        };
        setCurrenLocation(currentLocation);
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
            calculateNearbyRooms(roomsArray, currenLocation);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ Firebase:', error);
      }
    };

    fetchRooms();
  }, [currenLocation]);

  const calculateNearbyRooms = (
    rooms: any[],
    currentLocation: {lat: number; lon: number},
  ) => {
    const sortedRooms = rooms
      .map(room => {
        if (room.location?.position) {
          const roomLocation = {
            lat: room.location.position.lat,
            lon: room.location.position.long, // Đổi 'long' thành 'lon'
          };

          const distance = haversine(currentLocation, roomLocation);
          return {...room, distance};
        }
        return {...room, distance: Infinity};
      })
      .sort((a, b) => a.distance - b.distance);

    setNearbyRooms(sortedRooms);
  };

  return (
    <View style={styles.container}>
      <RowComponent styles={{marginTop: 30, marginBottom: 10}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: appColors.primary,
            padding: 10,
            borderRadius: 30,
          }}>
          <Ionicons name="arrow-back" size={24} color={appColors.white} />
        </TouchableOpacity>
        <TextComponent
          text="Danh sách phòng trọ gần bạn"
          size={20}
          styles={{marginLeft: 10}}
        />
      </RowComponent>

      <FlatList
        data={nearbyRooms}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <PlaceItem
            type="card"
            item={{
              ...item,
              distanceText: item.distance
                ? `${(item.distance / 1000).toFixed(2)} km`
                : 'Không xác định',
            }}
            customStyles={{width: '90%'}} // Truyền customStyles để điều chỉnh chiều ngang
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  listContainer: {
    padding: 10,
  },
});

export default PlaceScreen;
