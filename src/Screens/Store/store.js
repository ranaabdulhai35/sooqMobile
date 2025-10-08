import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../../Constants';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {useSelector} from 'react-redux';
import Header from '../../Components/Common/header';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import * as SVGS from '../../Assets/svgs/index';
import * as Images from '../../Assets/PresetImages/index';
import * as ContentImages from '../../Assets/Images/index';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import styles from './Styles/styles';
import RenderProducts from '../../Components/Common/renderProducts';
import {useTranslation} from 'react-i18next';
import {
  useGetAllAprovedProductsQuery,
  useLazyGetAllAprovedProductsQuery,
  useLazyGetVendorProductsQuery,
} from '../../Apis/productApiCall';
const Store = ({route}) => {
  const navigation = useNavigation();
  const flatListRef = useRef();
  const {t} = useTranslation();
  const state = useSelector(state => state.auth);
  const lang = state?.language;
  const vendor = route?.params?.vendor;
  const vendorId = vendor?.id;
  const limit = 5;

  // const [
  //   triggerGetProductsByVendor,
  //   {
  //     data: products,
  //     isFetching: isFetchingProducts,
  //     isSuccess: isSuccessFetchingProducts,
  //     isError: isProductsError,
  //   },
  // ] = useLazyGetAllAprovedProductsQuery();

  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);

  const params = {
    page: page,
    limit: limit,
    lang: lang,
    vendorId: vendorId,
  };
  const {
    data: products,
    error: productsError,
    isFetching: isFetchingProducts,
    isLoading: isLoadingProducts,
    isSuccess: isSuccessFetchingProducts,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGetAllAprovedProductsQuery(params);

  const handleProducts = () => {
    if (products && isSuccessFetchingProducts) {
      page > 1
        ? setProductList(prevList => [...prevList, ...products?.products])
        : setProductList(products?.products);
    }
  };
  // const getProductsByVendor = (vendorId, page) => {
  //   triggerGetProductsByVendor(page, limit, lang, vendorId);
  // };
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  const handleRefetch = () => {
    // const page = 1;
    // const params = {
    //   vendorId: vendor?.id,
    // };
    // triggerGetProductsByVendor(page, limit, lang, params);
    refetchProducts();
  };
  // useFocusEffect(
  //   useCallback(() => {
  //     getProductsByVendor(vendor?.id, 1);
  //   }, []),
  // );
  useEffect(() => {
    handleProducts();
  }, [products]);
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
          ...styles.header,
          borderBottomColor: state?.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}
        rightIcon={<View style={{width: WIDTH_BASE_RATIO(20)}}></View>}
        leftIcon={state.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        screennName={vendor?.firstName + ' ' + vendor?.lastName}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
      />
      <ScrollView
        contentContainerStyle={[
          GeneralStyles.generalPaddingHomeStack,
          {paddingBottom: HEIGHT_BASE_RATIO(20)},
        ]}
        onScroll={({nativeEvent}) => {
          const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20
          ) {
            if (!isFetchingProducts && page < products?.totalPages)
              handleLoadMore();
          }
        }}
        scrollEventThrottle={16}>
        <ImageBackground
          source={
            vendor?.profilePic
              ? {uri: vendor?.profilePic}
              : ContentImages.heroImage1
          }
          style={styles.imageBackground}
          borderRadius={10}
          resizeMode="cover"
          resizeMethod="auto">
          <Text style={styles.storeName}>
            {vendor?.firstName + ' ' + vendor?.lastName}
          </Text>
          <View style={styles.storeInfoContainer}>
            <Text
              style={{...FONTS.JakartaSans_Regular_16, color: COLORS.WHITE}}>
              {vendor?.totalProducts} Products
            </Text>
            <View style={styles.ratingContainer}>
              <StarRatingDisplay
                rating={vendor?.averageRating}
                starSize={15}
                starStyle={styles.starStyle}
              />
              <Text
                style={[
                  FONTS.JakartaSans_Bold_14,
                  {...styles.ratingsText, color: COLORS.WHITE},
                ]}>
                {'(' + vendor?.averageRating + ')'}
              </Text>
            </View>
          </View>
        </ImageBackground>

        <Text
          style={[
            FONTS.JakartaSans_Bold_18,
            {
              color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              ...styles.productsText,
            },
          ]}>
          {t('products')}
        </Text>
        <FlatList
          data={isProductsError ? [] : productList}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          ref={flatListRef}
          renderItem={item => (
            <RenderProducts item={item.item} handleRefetch={handleRefetch} />
          )}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginTop: HEIGHT_BASE_RATIO(16),
          }}
          ListFooterComponent={
            isFetchingProducts && (
              <ActivityIndicator size={35} color={COLORS.Brown} />
            )
          }
        />
        {products?.products?.length == 0 && (
          <Text
            style={[
              FONTS.JakartaSansMedium_14,
              {
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                ...styles.emptyComponent,
              },
            ]}>
            No products
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Store;
