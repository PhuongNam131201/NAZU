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
import database from '@react-native-firebase/database'; // Thêm Firebase Realtime Database
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
  amenities: [''],
  time: Date.now(),
};

const amenitiesOptions = [
  'Điều hòa',
  'Phòng đơn',
  'Phòng ghép',
  'Wifi',
  'Nóng lạnh',
  'Gác lửng',
];

const AddNewScreen = () => {
  const auth = useSelector(authSelector); // Lấy thông tin người dùng từ Redux
  const [eventData, setEventData] = useState<any>({
    ...initValue,
    ownerId: auth.id, // Gán ownerId là id của người dùng hiện tại
    authorId: auth.id, // Giữ lại authorId nếu cần
  });
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

  const handleAddEvent = async () => {
    try {
      const formattedData = {
        ...eventData,
        id: database().ref().push().key, // Tạo id tự động từ Firebase
        ownerId: auth.id, // Đảm bảo ownerId là id của người dùng hiện tại
        price: parseInt(eventData.price, 10), // Đảm bảo giá là số
        time: new Date(eventData.time).toISOString(), // Chuyển thời gian sang định dạng ISO
        amenities: Array.isArray(eventData.amenities)
          ? eventData.amenities.filter((item: string) => item.trim() !== '') // Loại bỏ tiện ích rỗng
          : [],
      };

      console.log('Dữ liệu sẽ lưu vào Firebase:', formattedData);

      // Lưu dữ liệu vào Firebase Realtime Database
      await database().ref(`/rooms/${formattedData.id}`).set(formattedData);

      Alert.alert('Thành công', 'Phòng trọ đã được tạo thành công!');

      // Reset dữ liệu về giá trị mặc định
      setEventData({
        ...initValue,
        ownerId: auth.id, // Đặt lại ownerId sau khi reset
        title: '',
        description: '',
        price: 0,
        location: {
          address: '',
          title: '',
        },
        imageUrl: '',
        amenities: [],
      });
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
        <ChoiceLocation />
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
