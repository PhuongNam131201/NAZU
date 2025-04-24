import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import database from '@react-native-firebase/database';
import {appColors} from '../../constants/appColors';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/AppNavigator'; // Import kiểu RootStackParamList

type MapScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MapScreen'
>;

const MapScreen = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const navigation = useNavigation<MapScreenNavigationProp>();

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
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ Firebase:', error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.762622, // Tọa độ mặc định (có thể thay đổi)
          longitude: 106.660172,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        {rooms.map(room => {
          if (room.location?.position) {
            return (
              <Marker
                key={room.id}
                coordinate={{
                  latitude: room.location.position.lat,
                  longitude: room.location.position.long,
                }}
                title={room.title || 'Không có tiêu đề'} // Kiểm tra giá trị title
                description={room.location.address || 'Không có địa chỉ'} // Kiểm tra giá trị address
              >
                <Image
                  source={require('../../assets/images/1.png')} // Đường dẫn đến biểu tượng tùy chỉnh
                  style={styles.markerIcon}
                />
                <Callout
                  onPress={
                    () => navigation.navigate('PlaceDetail', {roomId: room.id}) // Điều hướng với kiểu dữ liệu chính xác
                  }>
                  <View style={styles.calloutContainer}>
                    <View style={styles.calloutTextContainer}>
                      <Text style={styles.calloutTitle}>{room.title}</Text>
                      <Text style={styles.calloutAddress}>
                        {room.location.address}
                      </Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          }
          return null;
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerIcon: {
    width: 40, // Kích thước biểu tượng
    height: 40,
    resizeMode: 'contain',
  },
  calloutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 250,
  },
  calloutImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  calloutTextContainer: {
    flex: 1,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: appColors.text,
  },
  calloutAddress: {
    fontSize: 14,
    color: appColors.gray,
  },
  calloutPrice: {
    fontSize: 14,
    color: appColors.tomato,
    fontWeight: 'bold',
  },
});

export default MapScreen;
