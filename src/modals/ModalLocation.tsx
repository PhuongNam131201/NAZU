import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import {appColors} from '../constants/appColors';
import axios from 'axios';
import {LocationModel} from '../models/LocationModel';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (val: string) => void;
}

const ModalLocation = ({visible, onClose, onSelect}: Props) => {
  const [searchKey, setSearchKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<LocationModel[]>([]);
  useEffect(() => {
    if (!searchKey) {
      setLocations([]);
    }
  }, [searchKey]);
  const handleClose = () => {
    onClose();
  };
  const handleSearchLocation = async () => {
    const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=10&apiKey=6dVvU0jSlISYFm251QMhjRjMAwHvOllgnQhW_Sq3PBE`;
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
      <View style={{paddingVertical: 42, paddingHorizontal: 20}}>
        <RowComponent justify="flex-end" styles={{marginVertical: 20}}>
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
          <SpaceComponent width={12} />
          <ButtonComponent
            text="Huỷ"
            type="link"
            onPress={handleClose}
            styles={{justifyContent: 'center'}}
          />
          {/* <TouchableOpacity onPress={handleClose}>
            <AntDesign name="close" size={22} color={appColors.text} />
          </TouchableOpacity> */}
        </RowComponent>
      </View>
      <View style={{padding: 20}}>
        {isLoading ? (
          <ActivityIndicator size="large" color={appColors.primary} />
        ) : locations.length > 0 ? (
          <FlatList
            data={locations}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item.title);
                  handleClose();
                }}>
                <TextComponent text={`${item.title} - ${item.address.city}`} />
              </TouchableOpacity>
            )}
          />
        ) : (
          <View>
            <TextComponent
              text={searchKey ? 'Không tìm thấy địa điểm' : 'Tìm kiếm địa điểm'}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ModalLocation;
