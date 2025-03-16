import React, {ReactNode} from 'react';
import {FlatList} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RowComponent, SpaceComponent, TextComponent} from '.';
import {appColors} from '../constants/appColors';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  isColor?: boolean;
}

interface Category {
  key: string;
  title: string;
  icon: ReactNode;
  iconColor: string;
}

const CategoriesList = (props: Props) => {
  const {isColor} = props;
  const color = appColors.white;
  const size = 22;
  const categories: Category[] = [
    {
      key: '1',
      icon: <Ionicons name="person-outline" size={size} color={color} />,
      iconColor: appColors.tomato,
      title: 'Phòng đơn',
    },
    {
      key: '2',
      icon: <Ionicons name="people-outline" size={size} color={color} />,
      iconColor: appColors.organge,
      title: 'Phòng ghép',
    },
    {
      key: '3',
      icon: <FontAwesome name="building-o" size={size} color={color} />,
      iconColor: '#29D697',
      title: 'Chung cư',
    },
    {
      key: '4',
      icon: <Ionicons name="home-outline" size={size} color={color} />,
      iconColor: '#46CDFB',
      title: 'Nhà trọ',
    },
    {
      key: '5',
      icon: (
        <MaterialCommunityIcons
          name="home-city-outline"
          size={size}
          color={color}
        />
      ),
      iconColor: appColors.watermelon,
      title: 'Nhà nguyên căn',
    },
    {
      key: '6',
      icon: <Ionicons name="wifi" size={size} color={color} />,
      iconColor: appColors.skyblue,
      title: 'WiFi',
    },
    {
      key: '7',
      icon: <FontAwesome name="paw" size={size} color={color} />,
      iconColor: appColors.piece,
      title: 'Thú cưng',
    },
    {
      key: '8',
      icon: <FontAwesome name="snowflake-o" size={size} color={color} />,
      iconColor: appColors.clearchii,
      title: 'Điều hoà',
    },
    {
      key: '9',
      icon: <Ionicons name="shield-checkmark" size={size} color={color} />,
      iconColor: appColors.limesoap,
      title: 'An ninh tốt',
    },
  ];

  const renderTagCategory = (item: Category) => {
    return (
      <RowComponent
        onPress={() => {}}
        styles={[
          globalStyles.tag,
          {
            backgroundColor: isColor ? item.iconColor : appColors.white,
          },
        ]}>
        {item.icon}
        <SpaceComponent width={8} />
        <TextComponent
          text={item.title}
          color={isColor ? appColors.white : appColors.gray}
        />
      </RowComponent>
    );
  };

  return (
    <FlatList
      style={{paddingHorizontal: 16}}
      showsHorizontalScrollIndicator={false}
      horizontal
      data={categories}
      renderItem={({item}) => renderTagCategory(item)}
    />
  );
};

export default CategoriesList;
