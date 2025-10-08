import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';
import Header from '../../Components/Common/header';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import * as SVGS from '../../Assets/svgs/index';
import {useNavigation} from '@react-navigation/native';
import RenderFilters from './Components/renderFilters';
import BottomButtons from '../../Components/Common/bottomButtons';
import PriceRange from './Components/priceRange';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import RayalSymbol from '../../Components/Common/rayalSymbol';

const Filters = ({route}) => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();
  const MIN_DEFAULT = 5;
  const MAX_DEFAULT = 260;
  const [minValue, setMinValue] = useState(MIN_DEFAULT);
  const [maxValue, setMaxValue] = useState(MAX_DEFAULT);
  const [size, setSize] = useState(null);
  const [weight, setWeight] = useState(null);
  const [length, setLength] = useState(null);
  const [color, setColor] = useState(null);
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const params = {searchTerm: route?.params?.searchTerm};
  const handleSizeSelect = item => {
    setSize(item);
  };
  const handleColorSelect = item => {
    setColor(item);
  };
  const handleCategorySelect = item => {
    setCategory(item);
  };
  const handleSubCategorySelect = item => {
    setSubCategory(item);
  };
  const handleWeightSelect = item => {
    setWeight(item);
  };
  const handleLengthSelect = item => {
    setLength(item);
  };
  const handleApply = () => {
    if (size) {
      params.size = size;
    }
    if (color) {
      params.color = color;
    }
    if (category) {
      params.categoryId = category?.id;
    }
    if (subCategory) {
      params.subcategoryId = subCategory?.id;
    }
    if (weight) {
      params.weight = weight;
    }
    if (length) {
      params.length = length;
    }
    if (minValue !== MIN_DEFAULT) {
      params.minPrice = minValue;
    }
    if (maxValue !== MAX_DEFAULT) {
      params.maxPrice = maxValue;
    }
    console.log('params in search result screen', params);
    navigation?.navigate('SearchResultScreen', params);
  };
  const filters = [
    {
      name: t('category'),
      options: route?.params?.categories,
      handleOnpress: handleCategorySelect,
      selected: category,
    },
    {
      name: t('subCategory'),
      options: category?.subcategories,
      handleOnpress: handleSubCategorySelect,
      selected: subCategory,
    },
    {
      name: t('sizes'),
      options: [
        'XXS',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        '3XL',
        '4XL',
        'Free Size',
        'One Size',
        'Petite',
        'Plus Size',
        'Tall',
        'Regular',
      ],
      handleOnpress: handleSizeSelect,
      selected: size,
    },
    {
      name: t('weight'),
      options: [
        'Light',
        'Medium',
        'Heavy',
        'Ultra Light',
        'Feather Weight',
        'Super Heavy',
        'Extra Heavy',
      ],
      handleOnpress: handleWeightSelect,
      selected: weight,
    },
    {
      name: t('length'),
      options: [
        'Mini',
        'Capris',
        'Midi',
        'Maxi',
        'Micro Crop',
        'Crop',
        'Extra Long',
        'Thigh Length',
        'Knee Length',
        'Bermuda Shorts',
        'Short',
        'Long',
        'Ankle Length',
        'Floor Length',
      ],
      handleOnpress: handleLengthSelect,
      selected: length,
    },
    {
      name: t('colors'),
      options: [
        {name: 'Red', code: '#FF0000'},
        {name: 'Blue', code: '#0000FF'},
        {name: 'Green', code: '#008000'},
        {name: 'Black', code: '#000000'},
        {name: 'White', code: '#FFFFFF'},
        {name: 'Yellow', code: '#FFFF00'},
        {name: 'Orange', code: '#FFA500'},
        {name: 'Purple', code: '#800080'},
        {name: 'Pink', code: '#FFC0CB'},
        {name: 'Brown', code: '#A52A2A'},
        {name: 'Gray', code: '#808080'},
        {name: 'Cyan', code: '#00FFFF'},
        {name: 'Magenta', code: '#FF00FF'},
        {name: 'Gold', code: '#FFD700'},
        {name: 'Silver', code: '#C0C0C0'},
        {name: 'Beige', code: '#F5F5DC'},
        {name: 'Navy', code: '#000080'},
        {name: 'Teal', code: '#008080'},
        {name: 'Olive', code: '#808000'},
        {name: 'Maroon', code: '#800000'},
        {name: 'Mint', code: '#98FF98'},
        {name: 'Coral', code: '#FF7F50'},
        {name: 'Lavender', code: '#E6E6FA'},
      ],
      handleOnpress: handleColorSelect,
      selected: color,
    },
  ];
  return (
    <View
      style={[
        GeneralStyles.container,
        GeneralStyles.containerTopPadding,
        state?.darkTheme
          ? {backgroundColor: COLORS.DARK}
          : {backgroundColor: COLORS.WHITE},
      ]}>
      <Header
        backgroundColor={
          state?.darkTheme
            ? {backgroundColor: COLORS.DARK}
            : {backgroundColor: COLORS.WHITE}
        }
        style={{
          paddingBottom: HEIGHT_BASE_RATIO(20),
          borderBottomWidth: 1,
          borderBottomColor: state?.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}
        rightIcon={<View style={{width: WIDTH_BASE_RATIO(20)}}></View>}
        leftIcon={state.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        screennName={t('filters')}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
      />
      <ScrollView
        style={{
          ...GeneralStyles.generalPaddingHomeStack,
          marginTop: HEIGHT_BASE_RATIO(16),
          marginBottom: HEIGHT_BASE_RATIO(125),
        }}
        showsVerticalScrollIndicator={false}>
        <FlatList
          data={filters}
          renderItem={item => {
            return (
              <RenderFilters
                item={item.item}
                onPress={item?.item?.handleOnpress}
                selected={item?.item?.selected}
              />
            );
          }}
        />

        <Text
          style={{
            ...FONTS.JakartaSansMedium_16,
            color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline',
          }}>
          {t('priceRange')}
        </Text>
        <View style={{marginTop: HEIGHT_BASE_RATIO(30)}}>
          <PriceRange
            sliderWidth={WIDTH_BASE_RATIO(340)}
            min={MIN_DEFAULT}
            max={MAX_DEFAULT}
            step={10}
            onValueChange={range => {
              setMinValue(range.min);
              setMaxValue(range.max);
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: HEIGHT_BASE_RATIO(20),
          }}>
          <View>
            <Text
              style={{
                ...FONTS.JakartaSansMedium_14,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {minValue}
            </Text>
            <RayalSymbol color={state.darkTheme ? COLORS.WHITE : COLORS.DARK} />
          </View>
          <View>
            <Text
              style={{
                ...FONTS.JakartaSansLight_14_Gray,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {maxValue}
            </Text>
            <RayalSymbol color={state.darkTheme ? COLORS.WHITE : COLORS.DARK} />
          </View>
        </View>
      </ScrollView>
      <BottomButtons
        button1Text={t('clearAll')}
        button2Text={t('applyFilters')}
        button1Onpress={() => navigation.goBack()}
        button2Onpress={() => handleApply()}
      />
    </View>
  );
};

export default Filters;
