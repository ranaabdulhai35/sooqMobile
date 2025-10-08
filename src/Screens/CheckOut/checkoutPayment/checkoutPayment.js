import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Button,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../../Constants';
import Header from '../../../Components/Common/header';
import {
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
  getDifferences,
  locationPermission,
} from '../../../Utils/helpers';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import * as SVGS from '../../../Assets/svgs/index';
import * as Images from '../../../Assets/Images/index';

import styles from './Styles/styles';
import SelectCircle from '../../../Components/Common/selectCircle';
import CustomInputTitle from '../../../Components/Common/customInputTitle';
import CustomButton from '../../../Components/Common/customButton';
import {useTranslation} from 'react-i18next';
import {useGetCartQuery} from '../../../Apis/cartApiCall';
import AddedProducts from '../../Cart/Components/addedProducts';
import {
  usePreparInvoiceMutation,
  useCreateOrderMutation,
  useValidateCouponMutation,
} from '../../../Apis/orderApiCall';
import {AuthSlice} from '../../../Redux/slice';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from '../../../Requests/axios';
import CheckoutProduct from '../../../Components/Common/checkoutProduct';
import RayalSymbol from '../../../Components/Common/rayalSymbol';
import {
  MFCountry,
  MFInitiateSessionRequest,
  MFInitiateSessionResponse,
  MFSDK,
  MFGooglePayRequest,
  MFGooglePayButton,
  MFCurrencyISO,
  GooglePayButtonConstants,
  MFApplePayRequest,
  MFApplePayButton,
  MFKeyType,
  MFLanguage,
  MFApplePayButtonView,
  MFExecutePaymentRequest,
  MFApplePayStyle,
} from 'myfatoorah-reactnative';
import {FATOORAH_API_KEY} from '@env';

const CheckoutPayment = ({route}) => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const googlePayButtonRef = useRef(null);
  const applePayView = useRef(null);

  // const applePayStyle = () => new MFApplePayStyle(30, 30, 'Buy with', false);
  const state = useSelector(state => state.auth);
  const id = state.user.id;
  const {t} = useTranslation();
  const params = route.params.orderDetail || route.params;
  console.log('params', params?.address);
  const {
    data: cartData,
    isLoading: isLoadingCart,
    refetch: refetchCart,
    isFetching: isFetchingCart,
  } = useGetCartQuery({id});
  const [createOrderApi, {isLoading}] = useCreateOrderMutation();
  const [preparInvoiceApi, {isInvoiceLoading}] = usePreparInvoiceMutation();
  const [validateCouponApi, {isValidateLoading}] = useValidateCouponMutation();

  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [latDelta, setLatDelta] = useState(0.02);
  const [lngDelta, setLngDelta] = useState(0.02);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(null);
  const [validateLoading, setValidateLoading] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [validity, setValidity] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Card');

  const summary = {
    subTotal: {
      name: t('subtotal'),
      value: '$350',
    },
    discount: {
      name: t('discount'),
      value: '-$50',
    },
    charges: {
      name: t('shippingCharges'),
      value: 'Free',
    },
    grandTotal: {
      name: t('grandTotal'),
      value: '$300',
    },
  };

  const parsePhoneNumber = phoneNumber => {
    // Remove any extra spaces
    const trimmed = phoneNumber.trim();

    // Use regex to split into country code and number
    const match = trimmed.match(/^\+(\d{1,4})\s*(\d+)$/);

    if (!match) {
      throw new Error('Invalid phone number format');
    }

    return {
      countryCode: `+${match[1]}`,
      number: match[2],
    };
  };
  const handlePaymentMethod = item => {
    setPaymentMethod(item);
  };
  const fetchDestinationCords = async (lat, lng) => {
    setLongitude(lng);
    setLatitude(lat);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    } else {
      console.warn('mapRef is not yet ready');
    }

    setLocation({latitude: lat, longitude: lng});

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (youremail@example.com)',
          },
        },
      );
      if (response.data) {
        const area = response.data;
        setAddress(area);
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  const requestLocationPermission = async () => {
    const locationDenied = await locationPermission();
  };
  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position);
        const {latitude, longitude} = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        fetchDestinationCords(latitude, longitude);
        // if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.01, // Adjust these values for desired zoom level
            longitudeDelta: 0.01,
          },
          1000,
        ); // Duration in milliseconds
        // }
      },
      error => {
        console.error('Geolocation error:', error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000},
    );
  };
  const extractItemIds = itemsArray => {
    const itemIds = [];

    itemsArray?.forEach(itemGroup => {
      itemGroup?.items.forEach(item => {
        itemIds?.push(item?.itemId);
      });
    });

    return itemIds;
  };
  const fetchDestinationCordsWhenUserHasAddress = async address => {
    console.log('address in function', address);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address,
        )}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (youremail@example.com)',
          },
        },
      );
      if (response.data && response.data.length > 0) {
        const latNum = parseFloat(response.data[0]?.lat);
        const lonNum = parseFloat(response.data[0]?.lon);
        fetchDestinationCords(latNum, lonNum);

        mapRef.current.animateToRegion(
          {
            latitude: latNum,
            longitude: lonNum,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000,
        );

        setLocation({latitude: latNum, longitude: lonNum});
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  const validateCoupon = async () => {
    if (validateLoading || validity) {
      return;
    }
    const data = JSON.stringify({
      couponCode: coupon,
      itemIds: extractItemIds(params?.products?.items),
      userId: state?.user?.id,
    });
    try {
      setValidateLoading(true);
      const response = await validateCouponApi({data});
      if (response.data) {
        refetchCart();
        setValidity(true);
      }
      if (response.error) {
        console.error(response.error);
        if (response.error?.data?.message) {
          Alert.alert(response.error?.data?.message);
        }
      }
    } catch (e) {
      console.error('error occurred', e);
    } finally {
      setValidateLoading(false);
    }
  };
  const handleRefetchCart = () => refetchCart();
  const handleCouponTextInput = text => {
    setCoupon(text);
  };
  useFocusEffect(
    useCallback(() => {
      console.log('address in params', params?.address);
      fetchDestinationCordsWhenUserHasAddress(params?.address);
      requestLocationPermission();
    }, []),
  );
  const preparInvoice = async () => {
    setLoading(true);
    const trimmedPhoneNumber = parsePhoneNumber(state?.user?.phoneNumber);
    const dynamicKeys =
      params?.method == 'buy'
        ? {
            productId: params?.productId,
            variationId: params?.variationId,
            quantity: params?.quantity,
          }
        : {cartItemIds: extractItemIds(params?.products?.items)};
    const data = JSON.stringify({
      ...dynamicKeys,
    });

    try {
      const response = await preparInvoiceApi({data});
      if (response?.data) {
        const {InvoiceValue, Suppliers} = response.data.data;
        return {InvoiceValue, Suppliers};
      }
      if (response?.error) {
        console.error('Error occurred creating invoice', response?.error);
        if (response?.error?.status == 400) {
          Alert.alert('Sorry!', response.error.data.message);
          navigation.navigate('BottomTabBar');
        }
      }
    } catch (e) {
      console.error('Error occurred', e);
    } finally {
      setLoading(false);
    }
  };
  const createOrder = async () => {
    try {
      setLoading(true);
      const dynamicKeys =
        params?.method == 'buy'
          ? {
              productId: params?.productId,
              variationId: params?.variationId,
              quantity: params?.quantity,
            }
          : {cartItemIds: extractItemIds(params?.products?.items)};
      const data = JSON.stringify({
        ...dynamicKeys,
        // suppliers: suppliers,
      });

      const response = await createOrderApi({data});
      if (response?.data) {
        params?.method !== 'buy' &&
          dispatch(
            AuthSlice.actions.setCartItems(
              state?.cartItems - route.params?.itemsInCart,
            ),
          );

        navigation.navigate('Success', {
          text: 'Order Created Successfully',
        });
      }

      if (response?.error) {
        console.error('error occured creating order', response?.error);
        // Alert.alert('Sorry, An error occured', response?.error?.data?.message);
        if (response?.error?.status == 400) {
          Alert.alert('Sorry!', response.error.data.message);
          navigation.navigate('BottomTabBar');
        }
      }
    } catch (e) {
      Alert.alert('Error Occurred', `${e}`);
    } finally {
      setLoading(false);
    }
  };
  const initiateSession = async () => {
    const initiateSessionRequest = new MFInitiateSessionRequest();
    // Do not set PaymentMethodId for Apple Pay
    try {
      const response = await MFSDK.initiateSession(initiateSessionRequest);
      const sessionId = response.SessionId ?? '';
      console.log('sessionId', sessionId);
      return sessionId;
    } catch (error) {
      console.log('Error initiating session:', error);
    }
  };
  const onApplePayPress = async () => {
    try {
      // 1. Get session and invoice data
      const sessionId = await initiateSession();
      const invoiceData = await preparInvoice();

      if (!sessionId || !invoiceData) {
        console.error('Missing session or invoice data');
        return;
      }

      // 2. Parse phone number (assuming this utility is correct)
      const trimmedPhoneNumber = parsePhoneNumber(state?.user?.phoneNumber);

      // 3. Prepare invoice value in cents to avoid float issues
      const invoiceValue = Number(invoiceData?.InvoiceValue);
      if (isNaN(invoiceValue)) {
        console.error('Invalid InvoiceValue:', invoiceData?.InvoiceValue);
        return;
      }
      const invoiceCents = Math.round(invoiceValue * 100);

      // 4. Convert suppliers shares to cents and sum
      const supplierCents = invoiceData.Suppliers.map(supplier => ({
        SupplierCode: supplier.SupplierCode,
        InvoiceShareCents: Math.round(Number(supplier.InvoiceShare || 0) * 100),
      }));

      let totalSupplierCents = supplierCents.reduce(
        (sum, s) => sum + s.InvoiceShareCents,
        0,
      );

      // 5. Adjust last supplier's cents to fix rounding difference
      const diff = invoiceCents - totalSupplierCents;
      if (supplierCents.length === 0) {
        console.error('No suppliers found');
        return;
      }
      supplierCents[supplierCents.length - 1].InvoiceShareCents += diff;

      // 6. Convert back to string shares with 2 decimals (API expects strings)
      const adjustedSuppliers = supplierCents.map(s => ({
        SupplierCode: s.SupplierCode,
        InvoiceShare: (s.InvoiceShareCents / 100).toFixed(2), // string, e.g. "123.45"
      }));

      // 7. Validate total supplier shares matches invoice value within tolerance
      const totalShare = adjustedSuppliers.reduce(
        (sum, s) => sum + parseFloat(s.InvoiceShare),
        0,
      );

      if (Math.abs(invoiceValue - totalShare) > 0.001) {
        console.error('❌ InvoiceShare mismatch', {
          expected: invoiceValue,
          actual: totalShare,
        });
        return;
      }

      const roundedInvoiceValue = Number(invoiceValue.toFixed(2));
      const executePaymentRequest = new MFExecutePaymentRequest(
        roundedInvoiceValue,
      );
      executePaymentRequest.InvoiceValue = roundedInvoiceValue;
      executePaymentRequest.InvoiceItems = [
        {
          ItemName: 'Product',
          Quantity: 1,
          UnitPrice: roundedInvoiceValue,
        },
      ];
      executePaymentRequest.DisplayCurrencyIso = 'SAR';
      executePaymentRequest.SessionId = sessionId;
      executePaymentRequest.Suppliers = adjustedSuppliers;
      executePaymentRequest.CustomerEmail = state?.user?.email || '';
      executePaymentRequest.MobileCountryCode = '966';
      executePaymentRequest.CustomerMobile = trimmedPhoneNumber?.number || '';
      executePaymentRequest.CustomerReference = state?.user?.id || '';
      executePaymentRequest.Language = state?.language || 'en';
      executePaymentRequest.CustomerName =
        state?.user?.name?.[state?.language] || '';

      // 10. Call Apple Pay API
      applePayView.current?.applePayPayment(
        executePaymentRequest,
        MFLanguage.ARABIC,
        invoiceId => {
          console.log('🎉 Apple Pay Success:', invoiceId);
          if (invoiceId?.InvoiceStatus === 'Paid') {
            Alert.alert('Success', 'Payment was successful');
            createOrder();
          } else {
            Alert.alert('Payment Error', 'Payment was not successful');
          }
          setLoading(false);
        },
      );

      console.log('🎉 Apple Pay Success:', invoiceId);
    } catch (error) {
      console.error('❌ Apple Pay Error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const prepareGooglePay = async () => {
        const sessionId = await initiateSession();
        if (!sessionId) {
          console.log('Session ID is invalid.');
          return;
        }

        const invoiceData = await preparInvoice();
        if (!invoiceData?.InvoiceValue || !invoiceData?.Suppliers) {
          console.log('Invoice data is incomplete.');
          return;
        }

        const trimmedPhoneNumber = parsePhoneNumber(state?.user?.phoneNumber);

        const request = new MFGooglePayRequest(
          invoiceData.InvoiceValue.toFixed(2),
          '01234567890123456789', // Merchant ID — replace with your real one
          'Devclan',
          'SA', // Country code
          'SAR', // Currency code
        );

        request.sessionId = sessionId;
        request.customerEmail = state?.user?.email;
        request.mobileCountryCode = trimmedPhoneNumber?.countryCode;
        request.customerMobile = trimmedPhoneNumber?.number;
        request.suppliers = invoiceData.Suppliers;
        request.customerReference = state?.user?.id;
        request.language = state?.language;
        request.customerName = state?.user?.name[state?.language];

        try {
          await googlePayButtonRef.current?.setupGooglePayHelper(
            sessionId,
            request,
            invoice => {
              console.log('🎉 Google Pay Invoice:', invoice);

              if (invoice?.InvoiceStatus === 'Paid') {
                Alert.alert('Success', 'Google Pay payment was successful');
                createOrder();
              } else {
                Alert.alert('Payment Error', 'Payment was not successful');
              }

              setLoading(false);
            },
          );
        } catch (error) {
          console.log('Google Pay setup error:', error);
        }
      };

      if (Platform.OS === 'android') {
        prepareGooglePay();
      } else {
        onApplePayPress();
      }
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
        backgroundColor={state?.darkTheme ? COLORS.DARK : COLORS.WHITE}
        rightIcon={<View style={{width: WIDTH_BASE_RATIO(20)}}></View>}
        leftIcon={state?.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        screennName={t('checkOut')}
        style={{
          paddingBottom: HEIGHT_BASE_RATIO(20),
          borderBottomWidth: 1,
          borderBottomColor: state?.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
        onPressLeftIcon={() => {
          params?.screen == 'EditProfile'
            ? navigation.goBack()
            : navigation.navigate('BottomTabBar');
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          GeneralStyles.generalPaddingHomeStack,
          {paddingBottom: HEIGHT_BASE_RATIO(110)},
        ]}>
        <View
          style={[
            styles.mapContainer,
            {
              borderColor: state.darkTheme
                ? COLORS.DARK_BTN_BG
                : COLORS.LightBrown,
            },
          ]}>
          <View style={styles.innerMapContainer}>
            <MapView
              ref={mapRef}
              style={styles.mapViewStyle}
              initialRegion={{
                latitude: latitude ? latitude : 31.5203696,
                longitude: longitude ? longitude : 74.3587473,
                latitudeDelta: latDelta,
                longitudeDelta: lngDelta,
              }}>
              {latitude && longitude && (
                <Marker
                  coordinate={{
                    latitude: latitude ? latitude : 31.5203696,
                    longitude: longitude ? longitude : 74.35874729999999,
                  }}
                  anchor={{x: 0.5, y: 0.5}}
                />
              )}
            </MapView>
            <Text
              style={{
                ...styles.addressText,
                color: state.darkTheme ? COLORS.WHITE : COLORS.BLACK,
              }}>
              {address ? address?.display_name : params?.address}
            </Text>
            <View style={styles.mapBottomContainer}>
              <Text
                style={{
                  ...styles.addressText,
                  ...FONTS.JakartaSans_Bold_14,
                  color: state.darkTheme ? COLORS.WHITE : COLORS.BLACK,
                }}>
                {address?.address?.country}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('EditProfile', {
                    screen: 'checkout',
                    orderDetail: params,
                  })
                }>
                <SVGS.edit />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text
          style={[
            styles.heading,
            {
              color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              marginTop: HEIGHT_BASE_RATIO(16),
              alignSelf: state?.language == 'ar' ? 'flex-end' : 'baseline',
            },
          ]}>
          {t('items')}
        </Text>

        {!params?.product ? (
          <View style={{marginTop: HEIGHT_BASE_RATIO(24)}}>
            <FlatList
              data={cartData?.items}
              renderItem={item => (
                <AddedProducts
                  item={item?.item}
                  state={state}
                  refetch={handleRefetchCart}
                  screen="Checkout"
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
                    No products found.
                  </Text>
                );
              }}
            />
          </View>
        ) : (
          <CheckoutProduct
            item={params?.product}
            state={state}
            refetch={handleRefetchCart}
            variationId={params?.variationId}
            variation={params?.variation}
          />
        )}

        {/* <View style={styles.textContainer}></View> */}
        {/* <Text
          style={[
            styles.heading,
            {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
          ]}>
          {t('paymentMethod')}
        </Text> */}
        {/* <View
          style={{...styles.optionContainer, marginTop: HEIGHT_BASE_RATIO(34)}}>
          <SelectCircle
            selected={paymentMethod == 'Card' ? true : false}
            handleSelect={handlePaymentMethod}
            method={'Card'}
          />
          <View style={styles.visaTextContainer}>
            <SVGS.visa />
            <Text
              style={[
                styles.visaText,
                {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
              ]}>
              XXXX XXXX XXXX 5232
            </Text>
          </View>
        </View> */}
        {/* <View
          style={[
            styles.separator,
            {
              backgroundColor: state.darkTheme
                ? COLORS.DARK_BTN_BG
                : COLORS.DARK,
            },
          ]}
        /> */}
        {/* <View style={styles.optionContainer}>
          <SelectCircle
            selected={paymentMethod == 'Cash' ? true : false}
            handleSelect={handlePaymentMethod}
            method={'Cash'}
          />
          <Text
            style={[
              styles.visaText,
              {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
            ]}>
            {t('cashOnDelivery')}
          </Text>
        </View> */}
        {params?.method !== 'buy' && (
          <>
            <Text
              style={{
                ...styles.heading,
                // marginTop: HEIGHT_BASE_RATIO(24),
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                alignSelf: state?.language == 'ar' ? 'flex-end' : 'baseline',
              }}>
              {t('voucherCode')}
            </Text>

            <View
              style={{
                width: '100%',
                borderColor: state?.darkTheme
                  ? COLORS.DARK_BTN_BG
                  : COLORS.LightBrown,
                height: HEIGHT_BASE_RATIO(60),
                borderRadius: 12,
                borderWidth: 2,
                marginTop: HEIGHT_BASE_RATIO(16),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: WIDTH_BASE_RATIO(20),
              }}>
              <CustomInputTitle
                placeholder={t('voucherCode')}
                // borderColor={
                //   state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                // }
                onChangeText={!validity && handleCouponTextInput}
                value={coupon}
                placeholderColor={COLORS.Gray}
                width={WIDTH_BASE_RATIO(240)}
                height={HEIGHT_BASE_RATIO(60)}
                maxLength={20}
                // editable={validity && false}
                // borderRadius={12}
                // borderWidth={2}
                // marginTop={HEIGHT_BASE_RATIO(16)}
              />
              <TouchableOpacity
                style={[
                  styles.validateButton,
                  {
                    backgroundColor: validity ? COLORS.GREEN : COLORS.Brown,
                  },
                ]}
                onPress={validateCoupon}>
                {validateLoading ? (
                  <ActivityIndicator size={'small'} color={COLORS.WHITE} />
                ) : validity ? (
                  <Text
                    style={{
                      color: COLORS.WHITE,
                    }}>
                    Valid
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: COLORS.WHITE,
                    }}>
                    Validate
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text
          style={{
            ...FONTS.JakartaSans_Bold_18,
            marginTop: HEIGHT_BASE_RATIO(24),
            color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            alignSelf: state?.language == 'ar' ? 'flex-end' : 'baseline',
          }}>
          {t('orderSummary')}
        </Text>
        <View
          style={[
            styles.summaryTextContainer,
            {flexDirection: state?.language == 'ar' ? 'row-reverse' : 'row'},
          ]}>
          <Text
            style={{
              ...FONTS.JakartaSansMedium_14,
              color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            }}>
            {summary.subTotal.name}
          </Text>
          <View style={GeneralStyles.rayalSymbol}>
            <Text
              style={{
                ...FONTS.JakartaSans_Bold_14,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {params.method == 'buy'
                ? params?.variation?.price !== null &&
                  Math.floor(params?.variation?.price) !== 0
                  ? Math.floor(params?.variation?.price)
                  : Math.floor(params?.product?.fixedPrice)
                : Math.floor(cartData?.subTotal)}
            </Text>
            <RayalSymbol
              color={state?.darkTheme ? COLORS.WHITE : COLORS.BLACK}
            />
          </View>
        </View>
        {params?.method !== 'buy' && (
          <View
            style={[
              styles.summaryTextContainer,
              {flexDirection: state?.language == 'ar' ? 'row-reverse' : 'row'},
            ]}>
            <Text
              style={{
                ...FONTS.JakartaSansMedium_14,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {summary.discount.name}
            </Text>
            <View style={GeneralStyles.rayalSymbol}>
              <Text
                style={{
                  ...FONTS.JakartaSans_Bold_14,
                  color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                }}>
                {Math.floor(cartData?.totalDiscount)}
              </Text>
              <RayalSymbol
                color={state?.darkTheme ? COLORS.WHITE : COLORS.BLACK}
              />
            </View>
          </View>
        )}
        <View
          style={[
            styles.summaryTextContainer,
            {flexDirection: state?.language == 'ar' ? 'row-reverse' : 'row'},
          ]}>
          <Text
            style={{
              ...FONTS.JakartaSansMedium_14,
              color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            }}>
            {summary.charges.name}
          </Text>
          <View style={GeneralStyles.rayalSymbol}>
            <Text
              style={{
                ...FONTS.JakartaSans_Bold_14,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              29.99
            </Text>
            <RayalSymbol
              color={state?.darkTheme ? COLORS.WHITE : COLORS.BLACK}
            />
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
        <View
          style={[
            styles.summaryTextContainer,
            {flexDirection: state?.language == 'ar' ? 'row-reverse' : 'row'},
          ]}>
          <Text
            style={{
              ...FONTS.JakartaSansMedium_14,
              color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            }}>
            {summary.grandTotal.name}
          </Text>
          <View style={GeneralStyles.rayalSymbol}>
            <Text
              style={{
                ...FONTS.JakartaSans_Bold_14,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {params?.method == 'buy'
                ? params?.variation?.price !== null &&
                  Math.floor(params?.variation?.price) !== 0
                  ? Math.floor(params?.variation?.price) + 29.99
                  : Math.floor(params?.product?.fixedPrice) + 29.99
                : Math.floor(cartData?.totalPrice) + 29.99}
            </Text>
            <RayalSymbol
              color={state?.darkTheme ? COLORS.WHITE : COLORS.BLACK}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          styles.bottomButtonContainer,
          {backgroundColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE},
        ]}>
        {Platform.OS === 'ios' ? (
          <MFApplePayButtonView
            ref={applePayView}
            style={styles.applePayButton}
          />
        ) : (
          <MFGooglePayButton
            ref={googlePayButtonRef}
            style={styles.googlePay}
            theme={GooglePayButtonConstants.Themes.Dark}
            type={GooglePayButtonConstants.Types.Checkout}
            radius={10}
          />
        )}
        {/* <CustomButton
          backgroundColor={COLORS.Brown}
          width={WIDTH_BASE_RATIO(358)}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          boderColor={COLORS.Brown}
          text={'Checkout'}
          textStyle={{
            ...FONTS.AvenirMedium_16_black,
            color: COLORS.WHITE,
          }}
          onPress={() => {
            if (!loading) {
              createOrder();
            }
          }}
          load={loading}
        /> */}
      </View>
      {loading && (
        <>
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}></View>
          <ActivityIndicator
            style={{
              position: 'absolute',
              top: HEIGHT_BASE_RATIO(300),
              left: 0,
              right: 0,
            }}
            color={COLORS.Brown}
            size={'large'}
          />
        </>
      )}
    </View>
  );
};

export default CheckoutPayment;
