import React, {useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import {
  CardComponent,
  RowComponent,
  TextComponent,
  SpaceComponent,
  ButtonComponent,
  InputComponent,
} from '../../components';
import {appInfo} from '../../constants/appinfos';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appColors} from '../../constants/appColors';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {
  getDatabase,
  ref,
  update,
  push,
  set,
} from '@react-native-firebase/database';
import {launchImageLibrary} from 'react-native-image-picker';

const PlaceDetail = ({navigation, route}: any) => {
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [depositorName, setDepositorName] = useState('');
  const [depositorPhone, setDepositorPhone] = useState('');
  const [depositorCCCD, setDepositorCCCD] = useState<string | null>(null);
  const [depositorNote, setDepositorNote] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);

  const roomId = route?.params?.roomId;

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

  const handleSelectImage = (setter: (uri: string | null) => void) => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setter(response.assets[0].uri);
      }
    });
  };

  const handleConfirmDeposit = async () => {
    if (
      !depositorName.trim() ||
      !depositorPhone.trim() ||
      !depositorCCCD ||
      !proofImage
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin và tải lên hình ảnh.');
      return;
    }

    try {
      const proofFileName = `deposit_proof_${Date.now()}.jpg`;
      const cccdFileName = `cccd_${Date.now()}.jpg`;

      const proofRef = storage().ref(`deposits/${proofFileName}`);
      const cccdRef = storage().ref(`deposits/${cccdFileName}`);

      // Lưu hình ảnh vào Firebase Storage
      await proofRef.putFile(proofImage);
      await cccdRef.putFile(depositorCCCD);

      // Lấy URL của hình ảnh đã lưu
      const proofImageUrl = await proofRef.getDownloadURL();
      const cccdImageUrl = await cccdRef.getDownloadURL();

      const db = getDatabase();
      const customerRef = ref(db, `/customers`);
      const newCustomerRef = push(customerRef);

      // Lưu dữ liệu vào bảng `customers`
      await set(newCustomerRef, {
        id: newCustomerRef.key,
        roomId: roomId,
        depositorName,
        depositorPhone,
        depositorCCCD: cccdImageUrl,
        depositorImage: proofImageUrl,
        depositorNote,
        createdAt: Date.now(),
      });

      // Cập nhật trạng thái phòng trong bảng `rooms`
      const roomRef = ref(db, `/rooms/${roomId}`);
      await update(roomRef, {
        isDeposited: true,
        status: 'Đã đặt cọc',
      });

      Alert.alert('Thành công', 'Đặt cọc thành công!');
      setIsDepositModalVisible(false);
      setRoom({...room, isDeposited: true, status: 'Đã đặt cọc'});
    } catch (error) {
      console.error('Lỗi khi đặt cọc:', error);
      if (error.code === 'database/permission-denied') {
        Alert.alert('Lỗi', 'Bạn không có quyền thực hiện thao tác này.');
      } else {
        Alert.alert('Lỗi', 'Không thể đặt cọc phòng.');
      }
    }
  };

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
            {room.isDeposited ? (
              <TextComponent
                text="Phòng này đã được đặt cọc"
                size={16}
                color={appColors.gray}
                styles={{marginTop: 20, textAlign: 'center'}}
              />
            ) : (
              <>
                <ButtonComponent
                  text="Liên hệ với chủ nhà"
                  type="primary"
                  onPress={() => {
                    Alert.alert(
                      'Thông tin chủ nhà',
                      `Chủ trọ: ${room.ownerName}\nSố điện thoại: ${room.ownerPhone}`,
                      [{text: 'Đóng', style: 'cancel'}],
                    );
                  }}
                  color={appColors.tomato}
                  styles={{
                    marginTop: 20,
                    padding: 10,
                    borderRadius: 8,
                  }}
                />
                <ButtonComponent
                  text="Đặt cọc"
                  type="primary"
                  onPress={() => setIsDepositModalVisible(true)}
                  color={appColors.primary}
                  styles={{
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 8,
                  }}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal đặt cọc */}
      <Modal
        visible={isDepositModalVisible}
        animationType="slide"
        onRequestClose={() => setIsDepositModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TextComponent
            text="Thông tin đặt cọc"
            size={18}
            styles={styles.modalTitle}
          />
          {/* Hiển thị thông tin chủ phòng */}
          <TextComponent
            text={`Chủ phòng: ${room.ownerName}`}
            size={16}
            styles={{marginBottom: 10}}
          />
          <TextComponent
            text={`Số tài khoản: ${room.ownerBankAccount}`}
            size={16}
            styles={{marginBottom: 20}}
          />
          {/* Các input để nhập thông tin */}
          <InputComponent
            placeholder="Họ và tên"
            value={depositorName}
            onChange={setDepositorName}
          />
          <InputComponent
            placeholder="Số điện thoại"
            value={depositorPhone}
            onChange={setDepositorPhone}
            keyboardType="phone-pad"
          />
          <InputComponent
            placeholder="Ghi chú"
            value={depositorNote}
            onChange={setDepositorNote}
            multiline
          />
          <ButtonComponent
            text={depositorCCCD ? 'Hình CCCD đã chọn' : 'Tải lên hình CCCD'}
            onPress={() => handleSelectImage(setDepositorCCCD)}
            type="primary"
            styles={styles.uploadButton}
          />
          <ButtonComponent
            text={
              proofImage ? 'Hình biên lai đã chọn' : 'Tải lên hình biên lai'
            }
            onPress={() => handleSelectImage(setProofImage)}
            type="primary"
            styles={styles.uploadButton}
          />
          <ButtonComponent
            text="Xác nhận đặt cọc"
            onPress={handleConfirmDeposit}
            type="primary"
            styles={styles.confirmButton}
          />
          <ButtonComponent
            text="Hủy"
            onPress={() => setIsDepositModalVisible(false)}
            type="text"
            styles={styles.cancelButton}
          />
        </View>
      </Modal>
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
  ownerInfo: {
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
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: appColors.white,
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uploadButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  confirmButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
});

export default PlaceDetail;
