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
import {getDatabase, ref, update} from '@react-native-firebase/database';
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

      await proofRef.putFile(proofImage);
      await cccdRef.putFile(depositorCCCD);

      const proofImageUrl = await proofRef.getDownloadURL();
      const cccdImageUrl = await cccdRef.getDownloadURL();

      const db = getDatabase();
      const customerRef = ref(db, `/customers`);
      const newCustomerRef = push(customerRef);

      // Lưu thông tin khách hàng vào cột `customers`
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

      // Cập nhật trạng thái phòng
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
      Alert.alert('Lỗi', 'Không thể đặt cọc phòng.');
    }
  };

  return (