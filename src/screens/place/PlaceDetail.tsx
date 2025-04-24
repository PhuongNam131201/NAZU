import React, {useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  CardComponent,
  RowComponent,
  TextComponent,
  SpaceComponent,
  ButtonComponent,
} from '../../components';
import {appInfo} from '../../constants/appinfos';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appColors} from '../../constants/appColors';
import database from '@react-native-firebase/database';
import {Button} from '@react-navigation/elements';

const PlaceDetail = ({navigation, route}: any) => {
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const roomId = route?.params?.roomId; // Lấy roomId từ route.params

  useEffect(() => {
    if (roomId) {
      const fetchRoomDetails = async () => {
        try {
          const snapshot = await database()
            .ref(`/rooms/${roomId}`)
            .once('value');
          const data = snapshot.val();
          if (data) {
            setRoom(data);
          }
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu phòng trọ từ Firebase:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRoomDetails();
    } else {
      setLoading(false);
    }
  }, [roomId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.errorContainer}>
        <TextComponent text="Không tìm thấy thông tin phòng trọ." size={18} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <TextComponent text="Quay lại" size={16} color={appColors.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Hình ảnh phòng trọ */}
        <ImageBackground
          source={{uri: room.imageUrl}}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}>
          <RowComponent styles={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={appColors.white} />
            </TouchableOpacity>
            <TextComponent
              text={room.title}
              title
              size={24}
              color={appColors.white}
              styles={{
                marginLeft: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          </RowComponent>
        </ImageBackground>

        {/* Thông tin chi tiết */}

        <View style={styles.detailsContainer}>
          <TextComponent
            text={`Giá: ${room.price.toLocaleString()} VNĐ/tháng`}
            size={22}
            color={appColors.tomato}
            styles={styles.price}
          />
          <SpaceComponent height={10} />
          <TextComponent
            text="Thông tin: "
            size={16}
            color={appColors.text}
            styles={styles.description}
          />
          <TextComponent
            text={room.description}
            size={16}
            color={appColors.text}
            styles={styles.description}
          />
          <SpaceComponent height={15} />
          <TextComponent
            text={`Địa chỉ: ${room.location.address}`}
            size={16}
            color={appColors.text}
            styles={styles.address}
          />
          <SpaceComponent height={20} />
          <TextComponent
            title
            text="Tiện ích"
            size={18}
            styles={styles.sectionTitle}
          />
          <View style={styles.amenitiesContainer}>
            {room.amenities.map((amenity: string, index: number) => (
              <CardComponent key={index} styles={styles.amenityCard}>
                <TextComponent
                  text={amenity}
                  size={14}
                  color={appColors.text}
                />
              </CardComponent>
            ))}
          </View>
          <View>
            <ButtonComponent
              text="Liên hệ với chủ nhà"
              type="primary"
              onPress={() => {
                // Xử lý khi nhấn nút liên hệ
                console.log('Liên hệ với chủ nhà');
              }}
              color={appColors.tomato}
              styles={{
                marginTop: 20,
                padding: 10,
                borderRadius: 8,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageBackground: {
    width: appInfo.sizes.WIDTH,
    top: 0,
    left: 0,
    height: 300,
    backgroundColor: appColors.tomato,
  },
  imageStyle: {
    resizeMode: 'cover',
    height: 300,
    width: appInfo.sizes.WIDTH,
  },
  headerRow: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButton: {
    padding: 10,
    backgroundColor: appColors.primary,
    marginTop: 18,
    borderRadius: 50,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: appColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
  },
  price: {
    fontWeight: 'bold',
  },
  description: {
    lineHeight: 22,
  },
  address: {
    marginTop: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityCard: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: appColors.gray3,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default PlaceDetail;
