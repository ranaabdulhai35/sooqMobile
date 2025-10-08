import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../Constants';
import Header from '../../Components/Common/header';
import * as SVGS from '../../Assets/svgs/index';
import * as Images from '../../Assets/Images/index';
import {useNavigation} from '@react-navigation/native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import QuantityButtons from '../../Components/Common/quantityButtons';
import AddedProducts from './Components/addedProducts';
import styles from './Styles/styles';
import CustomButton from '../../Components/Common/customButton';
import {useTranslation} from 'react-i18next';
import {useGetCartQuery} from '../../Apis/cartApiCall';
import {RefreshControl} from 'react-native-gesture-handler';
import {AuthSlice} from '../../Redux/slice';
import RayalSymbol from '../../Components/Common/rayalSymbol';

const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const state = useSelector(state => state.auth);
  const id = state.user.id;
  const {t} = useTranslation();

  const {
    data: cartData,
    isLoading: isLoadingCart,
    refetch: refetchCart,
    isFetching: isFetchingCart,
  } = useGetCartQuery({id});

  const [refreshing, setRefreshing] = useState(false);

  const calculateTotalQuantity = data => {
    return data?.reduce((totalQuantity, vendor) => {
      const vendorQuantity = vendor?.items.reduce(
        (sum, item) => sum + item?.quantity,
        0,
      );
      return totalQuantity + vendorQuantity;
    }, 0);
  };
  const handleRefetchCart = () => refetchCart();
  const handleRefresh = async () => {
    setRefreshing(true);
    refetchCart();
    setRefreshing(false);
  };

  useEffect(() => {
    refetchCart();
  }, []);
  useEffect(() => {
    if (cartData === undefined) {
      dispatch(AuthSlice.actions.setCartItems(0));
    } else {
      dispatch(
        AuthSlice.actions.setCartItems(calculateTotalQuantity(cartData?.items)),
      );
    }
  }, [cartData]);

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
        backgroundColor={state?.darkTheme ? COLORS.DARK : COLORS.WHITE}
        rightIcon={<View style={{width: WIDTH_BASE_RATIO(30)}}></View>}
        leftIcon={state?.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        screennName={t('cart')}
        style={{
          paddingBottom: HEIGHT_BASE_RATIO(20),
          borderBottomWidth: 1,
          borderBottomColor: state?.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[COLORS.Brown]}
            onRefresh={() => {
              handleRefresh();
            }}
          />
        }
        contentContainerStyle={[
          GeneralStyles.generalPaddingHomeStack,
          {paddingBottom: HEIGHT_BASE_RATIO(320)},
        ]}
        showsVerticalScrollIndicator={false}>
        {isLoadingCart ? (
          <ActivityIndicator size={'small'} color={COLORS.Brown} />
        ) : (
          <>
            <Text
              style={[
                styles.items,
                {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
              ]}>
              {cartData ? calculateTotalQuantity(cartData?.items) : 0}
              {' ' + t('itemsInCart')}
            </Text>
            <View style={{marginTop: HEIGHT_BASE_RATIO(24)}}>
              <FlatList
                data={cartData?.items}
                renderItem={item => (
                  <AddedProducts
                    item={item?.item}
                    state={state}
                    refetch={handleRefetchCart}
                    screen={t('cart')}
                  />
                )}
                contentContainerStyle={{gap: HEIGHT_BASE_RATIO(16)}}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                ListEmptyComponent={() => {
                  return (
                    <Text
                      style={{
                        ...FONTS.JakartaSansMedium_14,
                        color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                        alignSelf: 'center',
                        marginTop: HEIGHT_BASE_RATIO(160),
                      }}>
                      {t('noProductsYet')}
                    </Text>
                  );
                }}
              />
            </View>
          </>
        )}
      </ScrollView>
      <View
        style={[
          styles.bottomButtonContainer,
          {backgroundColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE},
        ]}>
        {/* <Text
          style={{
            ...FONTS.JakartaSans_Bold_18,
            color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            marginTop: HEIGHT_BASE_RATIO(24),
          }}>
          {t('orderSummary')}
        </Text> */}

        {/* <View style={styles.summaryTextContainer}>
          <Text
            style={{
              ...FONTS.JakartaSansMedium_14,
              color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            }}>
            {t('subtotal')}
          </Text>
          <View style={GeneralStyles.rayalSymbol}>
            <Text
              style={{
                ...FONTS.JakartaSans_Bold_14,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {`${cartData ? cartData?.subTotal : 0}`}
            </Text>
            <RayalSymbol color={state.darkTheme ? COLORS.WHITE : COLORS.DARK} />
          </View>
        </View>
        <View style={styles.summaryTextContainer}>
          <Text
            style={{
              ...FONTS.JakartaSansMedium_14,
              color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            }}>
            {t('discount')}
          </Text>
          <View style={GeneralStyles.rayalSymbol}>
            <Text
              style={{
                ...FONTS.JakartaSans_Bold_14,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {`${cartData ? cartData?.totalDiscount : 0}`}
            </Text>
            <RayalSymbol color={state.darkTheme ? COLORS.WHITE : COLORS.DARK} />
          </View>
        </View>
        <View
          style={[
            styles.separator,
            {
              backgroundColor: state.darkTheme
                ? COLORS.DARK_BTN_BG
                : COLORS.LightBrown,
            },
          ]}></View>
        <View style={{...styles.summaryTextContainer, marginTop: 0}}>
          <Text
            style={{
              ...FONTS.JakartaSansMedium_14,
              color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            }}>
            {t('grandTotal')}
          </Text>
          <View style={GeneralStyles.rayalSymbol}>
            <Text
              style={{
                ...FONTS.JakartaSans_Bold_14,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {`${cartData ? cartData?.totalPrice : 0}`}
            </Text>
            <RayalSymbol color={state.darkTheme ? COLORS.WHITE : COLORS.DARK} />
          </View>
        </View>
        <View
          style={[
            styles.separator,
            {
              backgroundColor: state.darkTheme
                ? COLORS.DARK_BTN_BG
                : COLORS.LightBrown,
            },
          ]}></View> */}

        <CustomButton
          backgroundColor={COLORS.Brown}
          width={WIDTH_BASE_RATIO(358)}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          boderColor={COLORS.Brown}
          text={t('checkOut')}
          marginBottom={HEIGHT_BASE_RATIO(10)}
          textStyle={{
            ...FONTS.AvenirMedium_16_black,
            color: COLORS.WHITE,
          }}
          onPress={() => {
            if (
              !isLoadingCart &&
              !isFetchingCart &&
              calculateTotalQuantity(cartData?.items)
            ) {
              navigation.navigate('CheckoutPayment', {
                products: cartData,
                method: 'cart',
                itemsInCart: calculateTotalQuantity(cartData?.items),
                address: state?.user?.address,
              });
            }
          }}
          load={isLoadingCart || isFetchingCart}
        />
      </View>
    </View>
  );
};

export default Cart;
