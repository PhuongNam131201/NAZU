import React from 'react';
import {
  Button,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector, removeAuth} from '../../redux/reducers/authReducer';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {
  CategoriesList,
  CircleComponent,
  PlaceItem,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TagBarComponent,
  TagComponent,
  TextComponent,
} from '../../components';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {fontFamilies} from '../../constants/fontFamilies';
import {RoomModel} from '../../models/RoomModel';
const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const auth = useSelector(authSelector);
  const itemPlace = {
    id: 'room_001',
    ownerId: '1',
    title: 'NHÀ ĐẸP',
    description: 'Xin chào bạn, đây là căn nhà lý tưởng cho bạn!',
    price: 5000000,
    location: {
      address: '123 Đường ABC',
      city: 'Bình Dương',
      district: 'Thủ Dầu Một',
      ward: 'Phú Hòa',
    },
    imageUrl:
      'https://example.com/image.jpghttps://www.bing.com/images/search?view=detailV2&ccid=CIOqQQDy&id=A8EB4CBE440FA6A2DDDBA13A55849BD0043CF0BB&thid=OIP.CIOqQQDySSZ83WzjutEX4wHaEK&mediaurl=https%3a%2f%2fphunugioi.com%2fwp-content%2fuploads%2f2022%2f07%2fAnh-Lien-Quan-hinh-nen-Lien-Quan.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.0883aa4100f249267cdd6ce3bad117e3%3frik%3du%252fA8BNCbhFU6oQ%26pid%3dImgRaw%26r%3d0&exph=1080&expw=1920&q=lieen+quan&simid=608039749496408723&FORM=IRPRST&ck=E50E47B22A73693F586985C2988BCC2E&selectedIndex=2&itb=0https://www.bing.com/images/search?view=detailV2&ccid=CIOqQQDy&id=A8EB4CBE440FA6A2DDDBA13A55849BD0043CF0BB&thid=OIP.CIOqQQDySSZ83WzjutEX4wHaEK&mediaurl=https%3a%2f%2fphunugioi.com%2fwp-content%2fuploads%2f2022%2f07%2fAnh-Lien-Quan-hinh-nen-Lien-Quan.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.0883aa4100f249267cdd6ce3bad117e3%3frik%3du%252fA8BNCbhFU6oQ%26pid%3dImgRaw%26r%3d0&exph=1080&expw=1920&q=lieen+quan&simid=608039749496408723&FORM=IRPRST&ck=E50E47B22A73693F586985C2988BCC2E&selectedIndex=2&itb=0',
    amenities: ['Wifi', 'Điều hòa', 'Nóng lạnh', 'Gác lửng'],
    availableFrom: Date.now(),
    availableTo: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };

  return (
    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   <Text>HomeScreen</Text>
    //   <Button title="Logout" onPress={async () => dispatch(removeAuth({}))} />
    // </View>
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          backgroundColor: appColors.primary,
          height: 200,
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
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
              <TextComponent
                text="Bình Dương"
                flex={0}
                color={appColors.white}
                font={fontFamilies.medium}
              />
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
          <SpaceComponent height={10} />
        </View>

        <View style={{paddingBottom: 14}}>
          <CategoriesList isColor />
        </View>
      </View>
      <SpaceComponent height={10} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          marginBottom: 16,
        }}>
        <SectionComponent styles={{paddingHorizontal: 0, paddingTop: 20}}>
          <TagBarComponent title="Đề xuất" onPress={() => {}} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={Array.from({length: 5})}
            renderItem={({item, index}) => (
              <PlaceItem type="card" item={itemPlace} key={`place${index}`} />
            )}
          />
          <TagBarComponent title="Gần bạn" onPress={() => {}} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={Array.from({length: 5})}
            renderItem={({item, index}) => (
              <PlaceItem type="card" item={itemPlace} key={`place${index}`} />
            )}
          />
        </SectionComponent>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
