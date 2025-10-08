import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {useTranslation} from 'react-i18next';
import * as SVGS from '../../Assets/svgs/index';
import CustomInputTitle from '../../Components/Common/customInputTitle';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './Styles/styles';
import RenderCategories from '../../Components/Common/renderCategories';
import RenderProducts from '../../Components/Common/renderProducts';
import {useSearchProductsQuery} from '../../Apis/productApiCall';
import {useGetCategoriesQuery} from '../../Apis/categoriesApiCall';

const SearchResultScreen = ({route}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState(route?.params?.searchTerm);
  const [payLoad, setPayLoad] = useState(null);
  const {t} = useTranslation();
  const params = payLoad ? payLoad : route?.params;
  const state = useSelector(state => state.auth);
  const lang = state?.language;
  const userId = state?.user?.id;
  const {
    data: productsData,
    isError: isSearchError,
    error: searchError,
    isFetching: isProductsLoading,
    refetch: refetchProducts,
  } = useSearchProductsQuery({params, userId, lang});
  const {
    data: categoriesData,
    error: categoriesError,
    isFetching: isFetchingCategories,
  } = useGetCategoriesQuery({lang});

  const handleSearch = () => {
    if (searchError) {
      console.error('error occured', searchError);
    }
  };
  console.error('searched product', productsData);
  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <View
      style={[
        GeneralStyles.container,
        GeneralStyles.containerTopPadding,
        {backgroundColor: state?.darkTheme ? COLORS.DARK : COLORS.WHITE},
      ]}>
      <View style={styles.searchBarContainer}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          {state.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        </Pressable>
        <CustomInputTitle
          placeholder={t('search')}
          placeholderColor={state.darkTheme ? COLORS.WHITE : COLORS.DARK}
          width={WIDTH_BASE_RATIO(320)}
          height={HEIGHT_BASE_RATIO(50)}
          borderRadius={8}
          borderWidth={2}
          borderColor={
            state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
          }
          reverse={state?.language == 'ar' ? true : false}
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
          }}
          onSubmitEditing={() => {
            setPayLoad({searchTerm: searchText});
          }}
          SVGright={<SVGS.search />}
        />
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          {backgroundColor: state?.darkTheme ? COLORS.DARK : COLORS.WHITE},
        ]}>
        <RenderCategories data={categoriesData} />
        <View
          style={{
            marginTop: HEIGHT_BASE_RATIO(26),
            flexDirection: state.language ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...GeneralStyles.generalPadding,
          }}>
          <Text
            style={{
              ...FONTS.JakartaSans_Bold_18,
              color: state.darkTheme ? COLORS.LightGray : COLORS.DARK,
            }}>
            {productsData?.results?.length || 0} {t('results')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Filters', {
                categories: categoriesData,
                searchTerm: payLoad
                  ? payLoad?.searchTerm
                  : route?.params?.searchTerm,
              });
              setPayLoad(null);
            }}>
            {state?.darkTheme ? <SVGS.filterWhite /> : <SVGS.filter />}
          </TouchableOpacity>
        </View>
        <View style={GeneralStyles.generalPaddingHomeStack}>
          <FlatList
            data={productsData?.products}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            renderItem={item => <RenderProducts item={item.item} />}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginTop: HEIGHT_BASE_RATIO(16),
            }}
          />
          {isSearchError && (
            <Text
              style={[
                FONTS.JakartaSansMedium_14,
                {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
              ]}>
              An error occurred!
            </Text>
          )}
          {productsData?.results?.length === 0 && !isSearchError && (
            <Text
              style={[
                FONTS.JakartaSansMedium_14,
                {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
              ]}>
              No Results found!
            </Text>
          )}
          {isProductsLoading && (
            <ActivityIndicator size={35} color={COLORS.Brown} />
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SearchResultScreen;
