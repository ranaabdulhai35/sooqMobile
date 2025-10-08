import React, {useState, useRef, useEffect, useCallback} from 'react';
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
import {useSelector} from 'react-redux';
import Header from '../../Components/Common/header';
import {HEIGHT_BASE_RATIO} from '../../Utils/helpers';
import * as SVGS from '../../Assets/svgs/index';
import * as Images from '../../Assets/PresetImages/index';
import * as ContentImages from '../../Assets/Images/index';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RenderProducts from '../../Components/Common/renderProducts';
import {useTranslation} from 'react-i18next';
import {useGetFavouritesQuery} from '../../Apis/favouritesApiCall';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const limit = 10;
  const flatListRef = useRef(null);
  const userId = state?.user?.id;
  const lang = state?.language;
  const {
    data: favouriteProductsData,
    error: productsError,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    refetch: refetchProducts,
  } = useGetFavouritesQuery({userId, lang});

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchProducts();
    console.error('products', favouriteProductsData);
    setRefreshing(false);
  };
  const handleRefetch = () => {
    refetchProducts();
  };

  useFocusEffect(
    useCallback(() => {
      handleRefetch();
    }, []),
  );
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
        screennName={t('favourites')}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
      />
      <ScrollView
        contentContainerStyle={[GeneralStyles.generalPaddingHomeStack]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[COLORS.Brown]}
            onRefresh={() => {
              onRefresh();
            }}
          />
        }>
        {favouriteProductsData?.products?.length == 0 && (
          <Text
            style={[
              FONTS.JakartaSansMedium_14,
              {
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                alignSelf: 'center',
                marginTop: HEIGHT_BASE_RATIO(80),
              },
            ]}>
            {t('noProductsAddedToWishlist')}
          </Text>
        )}
        {favouriteProductsData?.products &&
          favouriteProductsData?.products?.length > 0 && (
            <FlatList
              data={productsError ? [] : favouriteProductsData?.products}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              ref={flatListRef}
              renderItem={item => (
                <RenderProducts
                  item={item.item}
                  handleRefetch={handleRefetch}
                />
              )}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginTop: HEIGHT_BASE_RATIO(16),
              }}
            />
          )}
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;
