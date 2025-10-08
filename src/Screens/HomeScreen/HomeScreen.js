import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeHeader from './Components/homeHeader';
import * as SVGS from '../../Assets/svgs/index';
import * as Images from '../../Assets/PresetImages/index';
import * as ContentImages from '../../Assets/Images/index';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../Constants';
import CustomCarousel from '../../Components/Common/customCarousel';
import {
  FONT_SIZE,
  handleLangChange,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../Utils/helpers';
import styles from './styles/styles';
import RenderPosts from '../../Components/Common/renderPosts';
import RenderProducts from '../../Components/Common/renderProducts';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RenderCategories from '../../Components/Common/renderCategories';
import {
  useGetAllAprovedProductsQuery,
  useGetAllProductsQuery,
} from '../../Apis/productApiCall';
import {useGetCategoriesQuery} from '../../Apis/categoriesApiCall';
import {AuthSlice} from '../../Redux/slice';
import {useGetUserDetailsQuery} from '../../Apis/userApiCall';
import {useGetCartQuery} from '../../Apis/cartApiCall';
import {useGetFavouritesQuery} from '../../Apis/favouritesApiCall';
import {baseUrl} from '@env';
import {io} from 'socket.io-client';
import notifee from '@notifee/react-native';
import i18next from 'i18next';
import {setSocket} from '../../Utils/socket';
import axios from 'axios';
const heroImages = [
  ContentImages.heroImage1,
  ContentImages.heroImage2,
  ContentImages.heroImage3,
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  const state = useSelector(state => state.auth);
  const userId = state?.user?.id;
  const id = state?.user?.id;
  const lang = state?.language;
  const {t} = useTranslation();

  const [productList, setProductList] = useState([]);
  const [recommendedProductList, setRecommendedProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [recommendedListPage, setRecommendedListPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isFetchingRecommendedProducts, setIsFetchingRecommendedProducts] =
    useState(false);
  const [totalPages, setTotalPages] = useState(false);
  const [recommendedListTotalPages, setRecommendedListTotalPages] =
    useState(false);

  const limit = 10;

  // const {
  //   data: productsData,
  //   error: productsError,
  //   isFetching: isFetchingProducts,
  //   isLoading: isLoadingProducts,
  //   isSuccess: isSuccessProducts,
  //   isError: isProductsError,
  //   refetch: refetchProducts,
  // } = useGetAllAprovedProductsQuery(params);
  const {
    data: categoriesData,
    error: categoriesError,
    isFetching: isFetchingCategories,
    isLoading: isLoadingCategories,
    isSuccess: isSuccessCategories,
    refetch: refetchCategories,
  } = useGetCategoriesQuery({lang});
  const {
    data: userData,
    error: userError,
    isFetching: isFetchingUser,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
    isError: isUserError,
    refetch: refetchUser,
  } = useGetUserDetailsQuery({userId});
  const {
    data: cartData,
    isLoading: isLoadingCart,
    refetch: refetchCart,
    isFetching: isFetchingCart,
  } = useGetCartQuery({id});
  const {data: favouriteProductsData, refetch: refetchFavouriteProducts} =
    useGetFavouritesQuery({userId});

  const calculateTotalQuantity = data => {
    return data?.reduce((totalQuantity, vendor) => {
      const vendorQuantity = vendor?.items.reduce(
        (sum, item) => sum + item?.quantity,
        0,
      );
      return totalQuantity + vendorQuantity;
    }, 0);
  };
  // const handleProducts = () => {
  //   if (productsData && isSuccessProducts) {
  //     console.log('products data', productsData);

  //     // Append new products to the existing list
  //     page > 1
  //       ? setProductList(prevList => [...prevList, ...productsData?.products])
  //       : setProductList(productsData?.products);
  //   }

  //   if (productsError) {
  //     console.error('error occurred', productsError);
  //     if (productsError?.status === 401) {
  //       dispatch(AuthSlice.actions.log_out());
  //     }
  //   }
  // };
  const handleCategories = () => {
    if (categoriesData && isSuccessCategories) {
      console.log('categories', categoriesData);
    }
    if (categoriesError) {
      console.error('error occured', categoriesError);
    }
  };
  // const handleUser = async () => {
  //   if (userData && isSuccessUser) {
  //     console.log('user', userData);
  //     console.log('user id', userId);
  //     refetchUser();
  //     if (userData) {
  //       dispatch(AuthSlice.actions.setUser(userData));
  //     } else {
  //       handleUser();
  //     }
  //   }
  //   if (isUserError) {
  //     console.error('error occured fetching user', userError);
  //     console.log('user id', userId);
  //   }
  // };
  const onRefresh = () => {
    setPage(1);
    setRecommendedListPage(1);
    setRefreshing(true);
    refetchFavouriteProducts();
    getApprovedProducts(1, 10, state?.language);
    refetchCategories();
    refetchUser();
    refetchCart();
    setRefreshing(false);
  };
  const handleLoadMore = () => {
    if (!isFetchingProducts && page < totalPages) {
      getApprovedProducts(page + 1, 10, state?.language);
      setPage(prev => prev + 1);
    }
  };
  const handleLoadMoreRecommendedList = () => {
    console.log('working');

    if (!isFetchingRecommendedProducts && recommendedListPage < totalPages) {
      getTopSellingProducts(page + 1, 10, state?.language);
      setRecommendedListPage(prev => prev + 1);
    }
  };
  const handleRefetch = async () => {
    getApprovedProducts(page, 10);
  };
  const handleFavourites = () => {
    const favouriteProductsIds = favouriteProductsData?.products?.map(
      product => product?.id,
    );
    if (favouriteProductsIds && favouriteProductsIds?.length != 0) {
      dispatch(AuthSlice.actions.setFavourites(favouriteProductsIds));
    }
  };
  const displayNotificationFunction = async data => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: handleLangChange(data?.title, state?.language),
      body: handleLangChange(data?.message, state?.language),
    });
  };
  const setSocketFunc = ws => {
    setSocket(ws);
  };
  const connectSocket = async () => {
    const socket = io('https://backend.soogalbalad.sa/', {
      transports: ['websocket', 'polling'],
      extraHeaders: {
        Authorization: `Bearer ${state.token}`,
      },
    });

    socket.on('connect', () => {
      console.error('Connected to notification service:', socket.id);
    });

    socket.on('connect_error', error => {
      console.error('Connection error:', error.message);
    });

    socket.on('notification', data => {
      console.error('New notification received:', data);
      displayNotificationFunction(data);
    });
    setSocketFunc(socket);
  };
  const getWishlistedProductIds = productsArray => {
    const wishlistedIds = [];
    for (const product of productsArray) {
      if (product.wishlisted === true) {
        wishlistedIds.push(product.id);
      }
    }
    return wishlistedIds;
  };
  const getTopSellingProducts = async ({page = page, limit = 10}) => {
    try {
      setIsFetchingRecommendedProducts(true);
      const response = await axios.get(`${baseUrl}products/top-selling`, {
        params: {
          limit,
          lang: state?.language,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state?.token}`,
        },
      });

      // Assuming the response has a `data` object that holds the products
      if (response?.data) {
        console.log('response from recommended products api', response?.data);
        page > 1
          ? setRecommendedProductList(prevList => [
              ...prevList,
              ...response?.data?.products,
            ])
          : setRecommendedProductList(response?.data?.products);
        setRecommendedListTotalPages(response?.data?.totalPages);

        dispatch(
          AuthSlice.actions.setFavourites(
            getWishlistedProductIds(response?.data?.products),
          ),
        );
      }
    } catch (error) {
      console.error(
        'Error fetching approved products:',
        error?.response?.data || error.message,
      );
      if (error?.response?.data?.statusCode === 401) {
        dispatch(AuthSlice.actions.log_out());
      }
    } finally {
      setIsFetchingRecommendedProducts(false);
    }
  };
  const getApprovedProducts = async ({page = page, limit = 10}) => {
    try {
      setIsFetchingProducts(true);
      const response = await axios.get(`${baseUrl}products/verified`, {
        params: {
          page,
          limit,
          lang: state?.language,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state?.token}`,
        },
      });

      // Assuming the response has a `data` object that holds the products
      if (response?.data) {
        console.log('response from api', response.data);
        page > 1
          ? setProductList(prevList => [
              ...prevList,
              ...response?.data?.products,
            ])
          : setProductList(response?.data?.products);

        setTotalPages(response?.data?.totalPages);
        dispatch(
          AuthSlice.actions.setFavourites(
            getWishlistedProductIds(response?.data?.products),
          ),
        );
      }
    } catch (error) {
      console.error(
        'Error fetching approved products:',
        error?.response?.data || error.message,
      );
      if (error?.response?.data?.statusCode === 401) {
        dispatch(AuthSlice.actions.log_out());
      }
    } finally {
      setIsFetchingProducts(false);
    }
  };

  useEffect(() => {
    connectSocket();
    handleRefetch();
    handleCategories();
    getTopSellingProducts(1, 10);
    // handleUser();
  }, []);
  useEffect(() => {
    getApprovedProducts(page, 10);
    getTopSellingProducts(recommendedListPage, 10);
  }, [state?.language]);
  useEffect(() => {
    if (cartData === undefined) {
      dispatch(AuthSlice.actions.setCartItems(0));
    } else {
      dispatch(
        AuthSlice.actions.setCartItems(calculateTotalQuantity(cartData?.items)),
      );
    }
  }, [cartData]);
  useEffect(() => {
    handleFavourites();
  }, [favouriteProductsData]);
  return (
    <View
      style={[
        GeneralStyles.container,
        GeneralStyles.containerTopPadding,
        state?.darkTheme
          ? {backgroundColor: COLORS.DARK}
          : {backgroundColor: COLORS.WHITE},
      ]}>
      <HomeHeader
        pfp={ContentImages.logo}
        icon={state.darkTheme ? SVGS.cartWhite : SVGS.cart}
        padding={GeneralStyles.generalPaddingHomeStack}
        style={{marginBottom: HEIGHT_BASE_RATIO(16)}}
        onPressIcon={() => {
          navigation.navigate('Cart');
        }}
        onPressPfp={() => {
          navigation.navigate('Settings');
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[COLORS.Brown]}
            onRefresh={() => {
              onRefresh();
            }}
          />
        }
        scrollEnabled={true}
        onScroll={({nativeEvent}) => {
          const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20
          ) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <CustomCarousel
          data={heroImages}
          containerStyle={styles.heroContainer}
          imageStyle={styles.image}
          wrapperStyle={styles.heroWrapper}
          dots={true}
          pagingEnabled={true}
          generalPadding={true}
          infiniteScroll={true}
        />
        <View
          style={{
            ...styles.categoriesContainer,
            flexDirection: state.language == 'ar' ? 'row-reverse' : 'row',
          }}>
          <Text
            style={[
              FONTS.JakartaSans_Bold_18,
              {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
            ]}>
            {t('categories')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CategoriesScreen');
            }}>
            <Text style={[FONTS.JakartaSans_Bold_14, {color: COLORS.Brown}]}>
              {t('seeAll')}
            </Text>
          </TouchableOpacity>
        </View>

        <RenderCategories data={categoriesData} />
        {categoriesData?.length == 0 && (
          <Text
            style={[
              FONTS.JakartaSansMedium_14,
              {
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                alignSelf: 'center',
              },
            ]}>
            {t('noCategoriesYet')}
          </Text>
        )}
        <View style={styles.postHeadingContainer}>
          <Text
            style={[
              FONTS.JakartaSans_Bold_18,
              {
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline',
              },
            ]}>
            {t('recommendedDeals')}
          </Text>

          {productList?.length == 0 && !isFetchingProducts && (
            <Text
              style={[
                FONTS.JakartaSansMedium_14,
                {
                  color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                  ...styles.emptyComponent,
                },
              ]}>
              {t('noProductsYet')}
            </Text>
          )}
        </View>

        <CustomCarousel
          data={recommendedProductList}
          wrapperStyle={styles.postWrapper}
          dots={false}
          renderItem={item => (
            <RenderPosts
              item={item}
              handleRefetch={() =>
                getTopSellingProducts(recommendedListPage, 10)
              }
            />
          )}
          handleLoadMore={() => handleLoadMoreRecommendedList()}
          generalPadding={true}
        />
        <View style={GeneralStyles.generalPaddingHomeStack}>
          <View style={[styles.productsHeadingContainer]}>
            <Text
              style={[
                FONTS.JakartaSans_Bold_18,
                {
                  color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                  alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline',
                },
              ]}>
              {t('products')}
            </Text>
          </View>
          {/* {isProductsError && (
            <Text
              style={[
                FONTS.JakartaSansMedium_14,
                {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
              ]}>
              An error occured!
            </Text>
          )} */}
          {productList?.length == 0 && !isFetchingProducts && (
            <Text
              style={[
                FONTS.JakartaSansMedium_14,
                {
                  color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                  ...styles.emptyComponent,
                },
              ]}>
              {t('noProductsYet')}
            </Text>
          )}
          <FlatList
            data={productList}
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
          />
          {isFetchingProducts && (
            <ActivityIndicator size={35} color={COLORS.Brown} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
