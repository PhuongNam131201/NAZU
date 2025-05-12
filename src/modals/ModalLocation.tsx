import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import {appColors} from '../constants/appColors';
import {LocationModel} from '../models/LocationModel';
import MapView, {Marker} from 'react-native-maps';
import {appInfo} from '../constants/appinfos';
import {AddressModel} from '../models/AddressModel';
import Geolocation from '@react-native-community/geolocation';
import GeoCoder from 'react-native-geocoding';
import Axios from 'axios';
GeoCoder.init(process.env.MAP_API_KEY as string);
interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (val: {
    address: string;
    position?: {
      lat: number;
      long: number;
    };
  }) => void;
}

const ModalLocation = ({visible, onClose, onSelect}: Props) => {
  const [searchKey, setSearchKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<LocationModel[]>([]);
  const [addressSelected, setAddressSelected] = useState('');
  const mapRef = useRef<MapView | null>(null);

  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currenLocation, setCurrenLocation] = useState<{
    lat: number;
    long: number;
  }>();

  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      if (position.coords) {
        setCurrenLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      }
    });
  }, []);

  useEffect(() => {
    const fetchLatLngFromGoong = async () => {
      if (addressSelected) {
        try {
          const res = await Axios.get(
            `https://rsapi.goong.io/Geocode?address=${encodeURIComponent(
              addressSelected,
            )}&api_key=api`,
          );
          if (res.data && res.data.results.length > 0) {
            const location = res.data.results[0].geometry.location;
            console.log('Goong lat/lng:', location);

            const newRegion = {
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };

            // Cập nhật marker
            setMarker({
              latitude: location.lat,
              longitude: location.lng,
            });

            // Animate map đến vị trí mới
            mapRef.current?.animateToRegion(newRegion, 1000);
          }
        } catch (error) {
          console.error('Goong Geocode Error:', error);
        }
      }
    };

    fetchLatLngFromGoong();
  }, [addressSelected]);

  useEffect(() => {
    if (!searchKey) {
      setLocations([]);
    }
  }, [searchKey]);

  const handleClose = () => {
    onClose();
  };

  const handleSearchLocation = async () => {
    const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=20&apiKey=api`;
    try {
      setIsLoading(true);
      const res = await axios.get(api);
      if (res && res.data && res.status === 200) {
        setLocations(res.data.items);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal animationType="slide" visible={visible} style={{flex: 1}}>
      <View style={{paddingVertical: 42}}>
        <RowComponent
          justify="flex-end"
          styles={{marginVertical: 20, paddingHorizontal: 20}}>
          <View style={{flex: 1}}>
            <InputComponent
              value={searchKey}
              onChange={val => setSearchKey(val)}
              affix={
                <AntDesign
                  name="search1"
                  size={22}
                  color={appColors.citymoke}
                />
              }
              allowClear
              placeholder="Tìm địa chỉ"
              styles={{paddingLeft: 20}}
              onEnd={handleSearchLocation}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 60,
              left: 10,
              right: 10,
              borderRadius: 12,
              backgroundColor: appColors.white,
              zIndex: 10,
              padding: 10, // Thêm padding để danh sách dễ nhìn hơn
            }}>
            {isLoading ? (
              <ActivityIndicator size="large" color={appColors.primary} />
            ) : locations.length > 0 ? (
              <FlatList
                data={locations}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: appColors.citymoke,
                    }}
                    onPress={() => {
                      setAddressSelected(item.address.label);
                      setSearchKey('');
                      if (item.access && item.access.length > 0) {
                        const selectedLocation = {
                          latitude: item.access[0].lat, // Lấy giá trị đầu tiên từ mảng access
                          longitude: item.access[0].lng,
                        };
                        setMarker(selectedLocation);
                        mapRef.current?.animateToRegion(
                          {
                            ...selectedLocation,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                          },
                          1000, // Thời gian chuyển động
                        );
                      } else if (item.position) {
                        const selectedLocation = {
                          latitude: item.position.lat,
                          longitude: item.position.lng,
                        };
                        setMarker(selectedLocation);
                        mapRef.current?.animateToRegion(
                          {
                            ...selectedLocation,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                          },
                          1000,
                        );
                      }
                    }}>
                    <TextComponent
                      text={`${item.title} - ${item.address.city}`}
                      styles={{color: appColors.text}}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={{alignItems: 'center', padding: 10}}>
                <TextComponent
                  text={
                    searchKey ? 'Không tìm thấy địa điểm' : 'Tìm kiếm địa điểm'
                  }
                  styles={{color: appColors.citymoke}}
                />
              </View>
            )}
          </View>
          <SpaceComponent width={12} />
          <ButtonComponent
            text="Huỷ"
            type="link"
            onPress={handleClose}
            styles={{justifyContent: 'center'}}
          />
        </RowComponent>
        {currenLocation && (
          <MapView
            ref={mapRef} // Tham chiếu đến bản đồ để điều khiển
            style={{width: appInfo.sizes.WIDTH, height: 450, marginTop: 20}}
            showsMyLocationButton
            showsUserLocation
            initialRegion={{
              latitude: currenLocation.lat,
              longitude: currenLocation.long,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            region={
              marker
                ? {
                    ...marker,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }
                : undefined
            }
            mapType="standard">
            {marker && (
              <Marker
                coordinate={marker}
                title="Địa điểm đã chọn"
                description={addressSelected}
              />
            )}
          </MapView>
        )}
        <ButtonComponent
          text="Đồng ý"
          onPress={() => {
            onSelect({
              address: addressSelected,
              position: marker
                ? {lat: marker.latitude, long: marker.longitude}
                : undefined, // Trả về undefined nếu marker không tồn tại
            });
            onClose();
          }}
          type="primary"
          styles={{
            marginTop: 20,
            backgroundColor: appColors.primary,
            borderRadius: 8,
            paddingVertical: 12, // Tăng kích thước nút
          }}
        />
      </View>
    </Modal>
  );
};

export default ModalLocation;
