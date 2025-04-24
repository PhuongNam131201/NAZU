import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import database from '@react-native-firebase/database';
import {TextComponent, ButtonComponent} from '../components';
import {appColors} from '../constants/appColors';

const AdminApprovalScreen = () => {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const fetchPendingRooms = async () => {
      try {
        const snapshot = await database()
          .ref('/rooms')
          .orderByChild('isApproved')
          .equalTo(false)
          .once('value');
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

    fetchPendingRooms();
  }, []);

  const handleApprove = async (roomId: string) => {
    try {
      await database().ref(`/rooms/${roomId}`).update({isApproved: true});
      Alert.alert('Thành công', 'Bài đăng đã được duyệt.');
      setRooms(prev => prev.filter(room => room.id !== roomId));
    } catch (error) {
      console.error('Lỗi khi duyệt bài đăng:', error);
      Alert.alert('Lỗi', 'Không thể duyệt bài đăng.');
    }
  };

  const handleReject = async (roomId: string) => {
    try {
      await database().ref(`/rooms/${roomId}`).remove();
      Alert.alert('Thành công', 'Bài đăng đã bị từ chối.');
      setRooms(prev => prev.filter(room => room.id !== roomId));
    } catch (error) {
      console.error('Lỗi khi từ chối bài đăng:', error);
      Alert.alert('Lỗi', 'Không thể từ chối bài đăng.');
    }
  };

  const renderRoomItem = ({item}: {item: any}) => (
    <View style={styles.roomCard}>
      <TextComponent text={`Tiêu đề: ${item.title}`} />
      <TextComponent text={`Giá: ${item.price.toLocaleString()} VNĐ`} />
      <TextComponent text={`Địa chỉ: ${item.location.address}`} />
      <View style={styles.buttonRow}>
        <ButtonComponent
          text="Duyệt"
          type="primary"
          onPress={() => handleApprove(item.id)}
        />
        <ButtonComponent
          text="Từ chối"
          type="danger"
          onPress={() => handleReject(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={renderRoomItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  roomCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: appColors.gray3,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: appColors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default AdminApprovalScreen;
