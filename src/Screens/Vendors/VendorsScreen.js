import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../../Constants';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../Components/Common/header';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import RenderOptions from '../../Components/Common/renderOptions';
import RenderSubOptions from '../../Components/Common/renderSubOptions';
import styles from './styles/styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import * as Images from '../../Assets/PresetImages/index';
import * as ContentImages from '../../Assets/Images/index';
import RenderStores from './Components/renderStores';
import {useTranslation} from 'react-i18next';
import {useGetCategoriesQuery} from '../../Apis/categoriesApiCall';
import {
  useLazyGetProductsByCategoriesQuery,
  useLazyGetProductsBySubCategoriesQuery,
  useLazyGetVendorsByLocationQuery,
} from '../../Apis/productApiCall';
import RenderProducts from '../../Components/Common/renderProducts';
import {AuthSlice} from '../../Redux/slice';
import {address} from '../../Assets/svgs';
import RenderLocations from '../../Components/Common/renderLocations';

const Locations = [
  {value: 'سوق الزل – Souq Al-Zal', name: {en: 'SOUQ_AL_ZAL', ar: 'سوق الزل '}},
  {value: 'العطايف – Al-Atayef', name: {en: 'AL_ATAYEF', ar: 'العطايف'}},
  {
    value: 'شارع السويلم – Al-Suwailem Street',
    name: {en: 'AL_SUWAILEM', ar: 'شارع السويلم'},
  },
  {
    value: 'شارع الثميري – Al-Thumairi Street',
    name: {en: 'AL_THUMAIRI', ar: 'شارع الثميري'},
  },
  {
    value: 'المعيقلية – Al-Muqayliah',
    name: {en: 'AL_MUQAYLIAH', ar: 'المعيقلية'},
  },
  {value: 'الديرة – Ad-Dirah', name: {en: 'AD_DIRAH', ar: 'الديرة'}},
  {value: 'البطحاء – Al-Batha', name: {en: 'AL_BATHA', ar: 'البطحاء'}},
];

const VendorsScreen = ({route}) => {
  const navigation = useNavigation();
  const flatListRef = useRef();
  const state = useSelector(state => state.auth);
  const lang = state?.language;
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [
    triggerGetVendorsByAddress,
    {
      data: vendors,
      isFetching: isFetchingVendors,
      isSuccess: isSuccessFetchingVendors,
    },
  ] = useLazyGetVendorsByLocationQuery();

  const [subOption, setSubOption] = useState(Locations[0]);
  const [vendorsData, setVendorsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const getVendorsByLocation = (address, page) => {
    const params = {
      address: address,
      page: page,
      limit: 5,
      lang: lang,
    };
    triggerGetVendorsByAddress(params);
  };
  const handleSubOptionOnPress = selectedSubOption => {
    setSubOption(selectedSubOption);
    setPage(1);
    getVendorsByLocation(selectedSubOption?.value, 1);
  };
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    getVendorsByLocation(subOption?.value, 1);
    setRefreshing(false);
  };
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  const handleVendorsData = () => {
    if (vendors && isSuccessFetchingVendors) {
      page > 1
        ? setVendorsData(prevData => [...prevData, ...vendors?.vendors])
        : setVendorsData(vendors?.vendors);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSubOption(Locations[0]);
      setPage(1);
      getVendorsByLocation(Locations[0]?.value, 1);
    }, []),
  );
  useEffect(() => {
    handleVendorsData();
  }, [vendorsData]);
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
        rightIcon={<View></View>}
        leftIcon={<View></View>}
        screennName={t('vendors')}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[COLORS.Brown]}
            onRefresh={() => {
              onRefresh();
            }}
          />
        }
        onScroll={({nativeEvent}) => {
          const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20
          ) {
            if (!isFetchingVendors && page < vendors?.totalPages)
              handleLoadMore();
          }
        }}
        scrollEventThrottle={16}>
        <View style={[GeneralStyles.generalPaddingHomeStack]}></View>
        <RenderLocations
          marginTop={HEIGHT_BASE_RATIO(16)}
          locations={Locations}
          currentSubOption={subOption}
          buttonPress={handleSubOptionOnPress}
        />
        <View style={{paddingHorizontal: WIDTH_BASE_RATIO(16)}}>
          <Text
            style={[
              styles.subOptionHeading,
              {
                color: state?.darkTheme ? COLORS.WHITE : COLORS.DARK,
                alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline',
              },
            ]}>
            {subOption?.name[state.language]}
          </Text>

          {isFetchingVendors ? (
            <ActivityIndicator size={35} color={COLORS.Brown} />
          ) : (
            <RenderStores stores={vendors?.vendors} />
          )}
          {vendors?.vendors?.length == 0 && (
            <Text
              style={[
                FONTS.JakartaSansMedium_14,
                {
                  color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                  ...styles.emptyComponent,
                },
              ]}>
              {t('noProductsFrom') + ' ' + subOption?.name[state.language]}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default VendorsScreen;
