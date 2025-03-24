import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
} from '../components';
import {useSelector} from 'react-redux';
import {authSelector} from '../redux/reducers/authReducer';
import ChoiceLocation from '../components/ChoiceLocation';

const initValue = {
  id: '',
  ownerId: '',
  title: '',
  description: '',
  price: 0,
  location: {
    address: '',
    city: '',
    district: '',
    ward: '',
  },
  imageUrl: '',
  amenities: [''],
  availableFrom: Date.now(),
  availableTo: Date.now() + 30 * 24 * 60 * 60 * 1000,
};
const AddNewScreen = () => {
  const auth = useSelector(authSelector);
  const [eventData, setEventData] = useState<any>({
    ...initValue,
    authorId: auth.id,
  });

  const handleChangeValue = (key: string, value: string) => {
    const items = {...eventData};
    items[`${key}`] = value;
    setEventData(items);
  };
  const handleAddEvent = async () => {
    console.log(eventData);
  };
  return (
    <ContainerComponent isScroll>
      <SectionComponent styles={{marginTop: 50}}>
        <TextComponent title text="THEM" />
      </SectionComponent>
      <SectionComponent>
        <InputComponent
          placeholder="Tieu De"
          allowClear
          value={eventData.title}
          onChange={val => handleChangeValue('title', val)}
        />
        <InputComponent
          placeholder="Mo Ta"
          multiline
          allowClear
          numberOfLines={8}
          value={eventData.description}
          onChange={val => handleChangeValue('description', val)}
        />
        <ChoiceLocation />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent text="add" onPress={handleAddEvent} type="primary" />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScreen;
