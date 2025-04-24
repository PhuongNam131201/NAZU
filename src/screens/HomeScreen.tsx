import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import database from '@react-native-firebase/database';
import {
  ContainerComponent,
  SectionComponent,
  TextComponent,
} from '../components';

const HomeScreen = ({navigation}: any) => {
  const [rooms, setRooms] = useState<any[]>([]);

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

  const renderRoomItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.roomCard}
      onPress={() => navigation.navigate('RoomDetailScreen', {room: item})}>
      <Image
        source={{uri: item.imageUrl}}
        style={styles.roomImage}
        resizeMode="cover"
      />
      <View style={styles.roomInfo}>
        <Text style={styles.roomTitle}>{item.title}</Text>
        <Text style={styles.roomPrice}>{item.price.toLocaleString()} VNĐ</Text>
        <Text style={styles.roomLocation}>{item.location.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ContainerComponent>
      <SectionComponent>
        <TextComponent title text="Danh sách phòng trọ" />
      </SectionComponent>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={renderRoomItem}
        contentContainerStyle={styles.listContainer}
      />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  roomCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  roomImage: {
    width: '100%',
    height: 150,
  },
  roomInfo: {
    padding: 10,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomPrice: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 5,
  },
  roomLocation: {
    fontSize: 14,
    color: '#555',
  },
});

export default HomeScreen;
