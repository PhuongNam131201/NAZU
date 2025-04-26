import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {
  Modal,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Alert,
} from 'react-native'; // Thêm Alert từ React Native
import {launchImageLibrary} from 'react-native-image-picker'; // Thêm thư viện chọn ảnh
import {getDatabase, ref, set, push} from '@react-native-firebase/database'; // Sử dụng API mới của Firebase
import storage from '@react-native-firebase/storage'; // Thêm Firebase Storage
import {CommonActions} from '@react-navigation/native'; // Sử dụng CommonActions để reset navigation
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
} from '../components';
import ChoiceLocation from '../components/ChoiceLocation';
import {authSelector} from '../redux/reducers/authReducer';

const initValue = {
  id: '',
  ownerId: '',
  title: '',
  description: '',
  price: 0,
  location: {
    address: '',
    title: '',
  },
  imageUrl: '',
  verificationDocument: '', // CMND/CCCD
  landCertificate: '', // Giấy chứng nhận quyền sử dụng đất
  amenities: [],
  time: Date.now(),
  status: 'Còn trống', // Trạng thái xét duyệt (tiếng Việt)
  ownerName: '', // Họ và tên chủ trọ
  ownerPhone: '', // Số điện thoại chủ trọ
  isApproved: false, // Mặc định là chưa được duyệt
};

const amenitiesOptions = [
  'Phòng đơn',
  'Phòng ghép',
  'Chung cư',
  'Nhà trọ',
  'Nhà nguyên căn',
  'WiFi',
  'Thú cưng',
  'Điều hoà',
  'An ninh tốt',
];

const AddNewScreen = ({navigation}) => {
  const auth = useSelector(authSelector); // Lấy thông tin người dùng từ Redux
  const [eventData, setEventData] = useState<any>({
    ...initValue,
    ownerId: auth.id, // Gán ownerId là id của người dùng hiện tại
    authorId: auth.id, // Giữ lại authorId nếu cần
  });

  const currentDateTime = new Date().toLocaleString(); // Lấy ngày giờ hiện tại

  const [isAmenitiesModalVisible, setIsAmenitiesModalVisible] = useState(false);

  const handleChangeValue = (key: string, value: any) => {
    const items = {...eventData};
    items[`${key}`] = value;
    setEventData(items);
  };

  const toggleAmenity = (amenity: string) => {
    const updatedAmenities = eventData.amenities?.includes(amenity)
      ? eventData.amenities.filter((item: string) => item !== amenity) // Bỏ chọn nếu đã chọn
      : [...(eventData.amenities || []), amenity]; // Thêm vào nếu chưa chọn
    handleChangeValue('amenities', updatedAmenities);
  };

  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        handleChangeValue('imageUrl', selectedImage); // Cập nhật URL hình ảnh
      }
    });
  };

  const handleSelectDocument = (key: string) => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        handleChangeValue(key, response.assets[0].uri);
      }
    });
  };

  const uploadImageToStorage = async (uri: string, fileName: string) => {
    const reference = storage().ref(`images/${fileName}`);
    const task = reference.putFile(uri);

    return new Promise<string>((resolve, reject) => {
      task.on(
        'state_changed',
        taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        },
        error => {
          console.error('Lỗi khi tải hình ảnh lên Storage:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await reference.getDownloadURL();
          console.log('URL hình ảnh:', downloadURL); // Log URL hình ảnh
          resolve(downloadURL); // Trả về URL tải xuống của hình ảnh
        },
      );
    });
  };

  const handleAddEvent = async () => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!eventData.title.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề.');
        return;
      }
      if (!eventData.description.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập mô tả.');
        return;
      }
      if (!eventData.price || isNaN(eventData.price) || eventData.price <= 0) {
        Alert.alert('Lỗi', 'Vui lòng nhập giá hợp lệ.');
        return;
      }
      if (!eventData.imageUrl) {
        Alert.alert('Lỗi', 'Vui lòng chọn hình ảnh.');
        return;
      }
      if (!eventData.location.address.trim()) {
        Alert.alert('Lỗi', 'Vui lòng chọn địa chỉ hợp lệ.');
        return;
      }
      if (!eventData.verificationDocument) {
        Alert.alert('Lỗi', 'Vui lòng tải lên CMND/CCCD.');
        return;
      }
      if (!eventData.landCertificate) {
        Alert.alert(
          'Lỗi',
          'Vui lòng tải lên giấy chứng nhận quyền sử dụng đất.',
        );
        return;
      }
      if (!eventData.ownerName.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập họ và tên chủ trọ.');
        return;
      }
      if (!eventData.ownerPhone.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại chủ trọ.');
        return;
      }

      // Tải hình ảnh và tài liệu lên Firebase Storage
      const imageFileName = `room_${Date.now()}.jpg`;
      const imageUrl = await uploadImageToStorage(
        eventData.imageUrl,
        imageFileName,
      );

      const verificationFileName = `verification_${Date.now()}.jpg`;
      const verificationDocumentUrl = await uploadImageToStorage(
        eventData.verificationDocument,
        verificationFileName,
      );

      const landCertificateFileName = `land_certificate_${Date.now()}.jpg`;
      const landCertificateUrl = await uploadImageToStorage(
        eventData.landCertificate,
        landCertificateFileName,
      );

      const db = getDatabase();
      const roomRef = push(ref(db, '/rooms'));
      const formattedData = {
        ...eventData,
        id: roomRef.key,
        ownerId: auth.id,
        price: parseInt(eventData.price, 10),
        time: new Date(eventData.time).toISOString(),
        imageUrl,
        verificationDocument: verificationDocumentUrl,
        landCertificate: landCertificateUrl,
        isApproved: false, // Mặc định là chưa được duyệt
        status: 'pending', // Mặc định là "Chờ duyệt"
      };

      console.log('Dữ liệu sẽ lưu vào Firebase:', formattedData);

      // Lưu dữ liệu vào Firebase Realtime Database
      await set(roomRef, formattedData);

      Alert.alert(
        'Thành công',
        'Phòng trọ đã được tạo thành công và đang chờ duyệt!',
      );

      setEventData({...initValue, ownerId: auth.id});

      // Điều hướng về HomeScreen nếu nó tồn tại trong navigator
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}], // Điều hướng về HomeScreen
        }),
      );
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu vào Firebase:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tạo phòng trọ.');
    }
  };

  return (
    <ContainerComponent isScroll>
      <SectionComponent styles={{marginTop: 50}}>
        <TextComponent title text="Tạo phòng trọ" />
      </SectionComponent>
      <SectionComponent>
        <InputComponent
          placeholder="Ngày giờ hiện tại"
          value={currentDateTime} // Hiển thị ngày giờ hiện tại
          onChange={() => {}} // Không cho phép chỉnh sửa
          styles={{color: '#555'}}
        />
        <InputComponent
          placeholder="Tiêu đề"
          allowClear
          value={eventData.title}
          onChange={val => handleChangeValue('title', val)}
        />
        <InputComponent
          placeholder="Mô tả"
          multiline
          allowClear
          numberOfLines={8}
          value={eventData.description}
          onChange={val => handleChangeValue('description', val)}
        />
        <InputComponent
          placeholder="Giá (VNĐ)"
          allowClear
          keyboardType="numeric" // Đảm bảo keyboardType là giá trị hợp lệ
          value={eventData.price.toString()}
          onChange={val => handleChangeValue('price', parseInt(val, 10) || 0)}
        />
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            marginBottom: 10,
            alignItems: 'center',
          }}
          onPress={handleSelectImage}>
          <TextComponent
            text={
              eventData.imageUrl
                ? 'Hình ảnh đã chọn'
                : 'Chọn hình ảnh từ điện thoại'
            }
            styles={{color: '#555'}}
          />
        </TouchableOpacity>
        {eventData.imageUrl ? (
          <View
            style={{
              width: '100%',
              height: 200,
              marginBottom: 10,
              borderRadius: 8,
              overflow: 'hidden',
            }}>
            <Image
              source={{uri: eventData.imageUrl}}
              style={{width: '100%', height: '100%'}}
              resizeMode="cover"
            />
          </View>
        ) : null}
        <ChoiceLocation
          onSelect={val => handleChangeValue('location', val)} // Cập nhật eventData.location khi chọn địa chỉ
        />
      </SectionComponent>

      <SectionComponent>
        <TextComponent text="Tiện ích" />
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            marginTop: 10,
          }}
          onPress={() => setIsAmenitiesModalVisible(true)}>
          <TextComponent
            text={
              Array.isArray(eventData.amenities) &&
              eventData.amenities.length > 0
                ? eventData.amenities
                    .filter((item: string) => item.trim() !== '') // Đảm bảo item là string
                    .join(', ') // Loại bỏ tiện ích rỗng và nối bằng dấu phẩy
                : 'Chọn tiện ích'
            }
            styles={{color: '#555'}}
          />
        </TouchableOpacity>
      </SectionComponent>

      <Modal
        visible={isAmenitiesModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAmenitiesModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '80%',
              backgroundColor: '#fff',
              borderRadius: 8,
              padding: 20,
            }}>
            <TextComponent text="Chọn tiện ích" styles={{marginBottom: 10}} />
            <FlatList
              data={amenitiesOptions}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 5,
                  }}
                  onPress={() => toggleAmenity(item)}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                    {eventData.amenities.includes(item) && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: '#007bff',
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </View>
                  <TextComponent text={item} />
                </TouchableOpacity>
              )}
            />
            <ButtonComponent
              text="Xong"
              onPress={() => setIsAmenitiesModalVisible(false)}
              type="primary"
              styles={{marginTop: 20}}
            />
          </View>
        </View>
      </Modal>

      <SectionComponent>
        <TextComponent text="CMND/CCCD" />
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            marginBottom: 10,
            alignItems: 'center',
          }}
          onPress={() => handleSelectDocument('verificationDocument')}>
          <TextComponent
            text={
              eventData.verificationDocument
                ? 'CMND/CCCD đã tải lên'
                : 'Tải lên CMND/CCCD'
            }
            styles={{color: '#555'}}
          />
        </TouchableOpacity>
        {eventData.verificationDocument ? (
          <Image
            source={{uri: eventData.verificationDocument}}
            style={{width: '100%', height: 200, marginBottom: 10}}
            resizeMode="cover"
          />
        ) : null}

        <TextComponent text="Giấy chứng nhận quyền sử dụng đất" />
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            marginBottom: 10,
            alignItems: 'center',
          }}
          onPress={() => handleSelectDocument('landCertificate')}>
          <TextComponent
            text={
              eventData.landCertificate
                ? 'Giấy chứng nhận đã tải lên'
                : 'Tải lên giấy chứng nhận quyền sử dụng đất'
            }
            styles={{color: '#555'}}
          />
        </TouchableOpacity>
        {eventData.landCertificate ? (
          <Image
            source={{uri: eventData.landCertificate}}
            style={{width: '100%', height: 200, marginBottom: 10}}
            resizeMode="cover"
          />
        ) : null}
      </SectionComponent>

      <SectionComponent>
        <InputComponent
          placeholder="Họ và tên chủ trọ"
          allowClear
          value={eventData.ownerName}
          onChange={val => handleChangeValue('ownerName', val)}
        />
        <InputComponent
          placeholder="Số điện thoại chủ trọ"
          allowClear
          keyboardType="phone-pad"
          value={eventData.ownerPhone}
          onChange={val => handleChangeValue('ownerPhone', val)}
        />
        <InputComponent
          placeholder="Số tài khoản chủ trọ"
          allowClear
          value={eventData.ownerBankAccount}
          onChange={val => handleChangeValue('ownerBankAccount', val)}
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent
          text="Xác nhận tạo phòng"
          onPress={handleAddEvent}
          type="primary"
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScreen;
