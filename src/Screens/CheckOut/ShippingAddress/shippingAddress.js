import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../../Constants';
import Header from '../../../Components/Common/header';
import {
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
  getDifferences,
  getCountryInfo,
  locationPermission,
  handleLangChange,
} from '../../../Utils/helpers';
import * as SVGS from '../../../Assets/svgs';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AddressPickup from './Components/shippingAddressMap';
import CustomInputTitle from '../../../Components/Common/customInputTitle';
import PhoneInput from 'react-native-phone-number-input';
import SwitchToggle from 'react-native-switch-toggle';
import CustomButton from '../../../Components/Common/customButton';
import styles from './Styles/styles';
import axios from 'axios';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {ScrollView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {
  useCreateOrderMutation,
  useGetShipmentDetailsQuery,
} from '../../../Apis/orderApiCall';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {AuthSlice} from '../../../Redux/slice';
import parsePhoneNumberFromString from 'libphonenumber-js';
import {useUpdateUserMutation} from '../../../Apis/userApiCall';
import OrContinueWith from '../../../Components/Common/orContinueWith';

const ShippingAddress = ({route}) => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const params = route?.params;
  const mapRef = useRef(null);
  const formikRef = useRef(null);
  const {t} = useTranslation();

  const [createOrderApi, {isLoading}] = useCreateOrderMutation();
  const [updateUser, {isLoading: isUpdatingUser}] = useUpdateUserMutation();

  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [latDelta, setLatDelta] = useState(0.02);
  const [lngDelta, setLngDelta] = useState(0.02);
  const [address, setAddress] = useState(null);
  const [initialValuesForOrder, setInitialValuesForOrder] = useState(null);

  const phoneRegex = /^\+966\s?5\d{2}[\s-]?\d{3}[\s-]?\d{3}$/;
  const senderValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),

    // phoneNumber: Yup.string()
    //   .required('Phone Number is required')
    //   .test('is-valid-phone', 'Invalid phone number', value => {
    //     if (!value) return false;
    //     const phoneNumber = parsePhoneNumberFromString(value);
    //     return phoneNumber ? phoneNumber.isValid() : false;
    //   }),
    phoneNumber: Yup.string()
      .required('Phone Number is required')
      .matches(phoneRegex, 'Invalid phone number format'),
    address: Yup.string().required('Address is required'),
  });
  const initialValues = {
    name: '',
    phoneNumber: '',
    address: '',
  };

  const fetchDestinationCords = async (lat, lng) => {
    setLongitude(lng);
    setLatitude(lat);

    mapRef.current.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000,
    );

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
        console.log('address', response.data);
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
  const handleUpdateUser = async values => {
    try {
      const data = new FormData();
      const phoneNumber = values.phoneNumber
        ? '+' +
          getCountryInfo(values.phoneNumber)?.countryCodeNumber +
          ' ' +
          getCountryInfo(values.phoneNumber)?.nationalNumber
        : undefined;
      const userId = state.user.id;

      const fields = {
        name: values.name,
        address: values.address,
        phoneNumber: phoneNumber,
      };

      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          data.append(key, value);
        }
      });
      const response = await updateUser({userId, data});

      if (response.error) {
        console.error('Error Occurred while updating user', response.error);
        Alert.alert('Sorry!', response.error.data.message);
        return false; // Indicate failure
      }

      if (response.data) {
        dispatch(AuthSlice.actions.setUser(response?.data));
      }

      return true; // Indicate success
    } catch (error) {
      console.error('Unexpected error in handleUpdateUser:', error);
      return false; // Stop execution on unexpected errors
    }
  };
  const createOrder = async values => {
    if (getDifferences(initialValuesForOrder, values)) {
      console.error(
        'updated values',
        getDifferences(initialValuesForOrder, values),
      );
      const differences = getDifferences(initialValuesForOrder, values);
      const userUpdated = await handleUpdateUser(differences);
      if (!userUpdated) {
        return;
      }
    }
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
    const response = await createOrderApi({data});
    if (response?.data) {
      console.log('order created', response?.data);
      params?.method !== 'buy' &&
        dispatch(
          AuthSlice.actions.setCartItems(
            state?.cartItems - params?.itemsInCart,
          ),
        );

      navigation.navigate('Success', {
        text: 'Order Created Successfully',
      });
    }
    // navigation.navigate('CheckoutPayment', {
    //   text: 'Order Created Successfully',
    // });
    if (response?.error) {
      console.error('error occured creating order', response?.error);
      // Alert.alert('Sorry, An error occured', response?.error?.data?.message);
      if (response?.error?.status == 400) {
        Alert.alert('Sorry!', response.error.data.message);
        navigation.navigate('BottomTabBar');
      }
    }
  };
  const handleContinue = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  };

  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();

      if (formikRef.current) {
        setTimeout(() => {
          formikRef.current.setValues({
            name: handleLangChange(state?.user?.name, state?.language) || '',
            phoneNumber: state?.user?.phoneNumber || '',
            address: state?.user?.address || '',
          });

          setInitialValuesForOrder({
            name: state?.user?.name || '',
            phoneNumber: state?.user?.phoneNumber || '',
            address: state?.user?.address || '',
          });
        }, 300);
      }
    }, []),
  );
  useEffect(() => {
    if (formikRef.current && address) {
      formikRef.current.setValues({
        name: formikRef.current?.values?.name || '',
        phoneNumber: formikRef.current?.values?.phoneNumber || '',
        address: address?.display_name || '',
      });
    }
  }, [address]);
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
        screennName={t('shippingAddress')}
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
      <KeyboardAvoidingView
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}>
        <ScrollView
          style={[GeneralStyles.generalPaddingHomeStack]}
          contentContainerStyle={{
            paddingBottom: HEIGHT_BASE_RATIO(100),
            flexGrow: 1,
          }}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
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
                {address?.display_name}
              </Text>
              <Text
                style={{
                  ...styles.addressText,
                  ...FONTS.JakartaSans_Bold_14,
                  color: state.darkTheme ? COLORS.WHITE : COLORS.BLACK,
                }}>
                {address?.address?.country}
              </Text>
              {/* <TouchableOpacity
                style={{marginTop: HEIGHT_BASE_RATIO(24)}}
                onPress={() => {
                  getCurrentLocation();
                }}>
                <Text
                  style={{...FONTS.JakartaSans_Bold_14, color: COLORS.Brown}}>
                  {t('currentLocation')}
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
          <Formik
            innerRef={formikRef}
            validationSchema={senderValidationSchema}
            initialValues={initialValues}
            onSubmit={async (values, {setSubmitting, resetForm}) => {
              createOrder(values);
            }}>
            {({handleChange, values, errors, touched}) => (
              <View style={{marginTop: HEIGHT_BASE_RATIO(10)}}>
                {/* <AddressPickup
                  placheholderText={t('recieversAddress')}
                  fetchAddress={fetchDestinationCords}
                  route
                  
                /> */}
                <View style={styles.nameInput}>
                  <CustomInputTitle
                    placeholder={t('name')}
                    borderColor={
                      state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                    }
                    placeholderColor={COLORS.Gray}
                    width={'100%'}
                    height={HEIGHT_BASE_RATIO(60)}
                    borderRadius={12}
                    borderWidth={2}
                    value={values.name}
                    onChangeText={handleChange('name')}
                  />
                  {touched.name && errors.name && (
                    <View style={{...GeneralStyles.errorStyle, width: 'auto'}}>
                      <Text
                        style={[
                          FONTS.AvenirMedium_16_black,
                          {
                            color: COLORS.RED,
                          },
                        ]}>
                        {errors.name}
                      </Text>
                    </View>
                  )}
                </View>
                {/* <View style={styles.nameInputContainer}>
                  <View style={styles.nameInput}>
                    <CustomInputTitle
                      placeholder={t('lastName')}
                      borderColor={
                        state?.darkTheme
                          ? COLORS.DARK_BTN_BG
                          : COLORS.LightBrown
                      }
                      placeholderColor={COLORS.Gray}
                      width={WIDTH_BASE_RATIO(175)}
                      height={HEIGHT_BASE_RATIO(60)}
                      borderRadius={12}
                      borderWidth={2}
                      value={values.lastName}
                      onChangeText={handleChange('lastName')}
                    />
                    {touched.lastName && errors.lastName && (
                      <View
                        style={{...GeneralStyles.errorStyle, width: 'auto'}}>
                        <Text
                          style={[
                            FONTS.AvenirMedium_16_black,
                            {
                              color: COLORS.RED,
                            },
                          ]}>
                          {errors.lastName}
                        </Text>
                      </View>
                    )}
                  </View>
                </View> */}
                <CustomInputTitle
                  placeholder={'phone number'}
                  borderColor={
                    state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                  }
                  maxLength={14}
                  placeholderColor={COLORS.Gray}
                  width={'100%'}
                  height={HEIGHT_BASE_RATIO(60)}
                  borderRadius={12}
                  borderWidth={2}
                  marginTop={HEIGHT_BASE_RATIO(5)}
                  value={values?.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  keyboardType={'phone-pad'}
                />
                {/* <PhoneInput
                  defaultCode={
                    getCountryInfo(state?.user?.phoneNumber)?.countryCode
                      ? getCountryInfo(state?.user?.phoneNumber)?.countryCode
                      : 'SA'
                  }
                  layout="first"
                  keyboardType="phone-pad"
                  textInputProps={{maxLength: 10}}
                  onChangeFormattedText={handleChange('phoneNumber')}
                  defaultValue={
                    getCountryInfo(state?.user?.phoneNumber)?.nationalNumber
                  }
                  value={
                    getCountryInfo(state?.user?.phoneNumber)?.nationalNumber
                  }
                  i18nIsDynamicList={true}
                  containerStyle={[
                    styles.phoneInputContainer,
                    {
                      borderColor: state.darkTheme
                        ? COLORS.DARK_BTN_BG
                        : COLORS.LightBrown,
                    },
                  ]}
                  textContainerStyle={styles.phoneInputTextContainer}
                  withDarkTheme={state?.darkTheme}
                  textInputStyle={[
                    FONTS.JakartaSansLight_16_black,
                    {
                      color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
                    },
                  ]}
                  codeTextStyle={[
                    {
                      color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
                    },
                    FONTS.JakartaSansLight_16_black,
                  ]}
                /> */}
                {touched.phoneNumber && errors.phoneNumber && (
                  <View style={GeneralStyles.errorStyle}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                        },
                      ]}>
                      {errors.phoneNumber}
                    </Text>
                  </View>
                )}
                <Text
                  style={{
                    ...styles.fieldText,
                    color: state?.darkTheme ? COLORS.WHITE : COLORS.DARK,
                  }}>
                  Enter Short National Address
                </Text>
                <CustomInputTitle
                  placeholder={'Street Address'}
                  borderColor={
                    state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                  }
                  placeholderColor={COLORS.Gray}
                  width={'100%'}
                  height={HEIGHT_BASE_RATIO(60)}
                  borderRadius={12}
                  borderWidth={2}
                  marginTop={HEIGHT_BASE_RATIO(8)}
                  value={values?.address}
                  onChangeText={handleChange('address')}
                />
                {touched.address && errors.address && (
                  <View style={GeneralStyles.errorStyle}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                        },
                      ]}>
                      {errors.address}
                    </Text>
                  </View>
                )}
                <OrContinueWith marginTop={HEIGHT_BASE_RATIO(10)} />
                <TouchableOpacity
                  style={{
                    marginTop: HEIGHT_BASE_RATIO(10),
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    getCurrentLocation();
                  }}>
                  <Text
                    style={{...FONTS.JakartaSans_Bold_14, color: COLORS.Brown}}>
                    {t('currentLocation')}
                  </Text>
                </TouchableOpacity>
                {/* <CustomInputTitle
                  placeholder={t('city')}
                  borderColor={
                    state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                  }
                  placeholderColor={COLORS.Gray}
                  width={'100%'}
                  value={values?.city}
                  height={HEIGHT_BASE_RATIO(60)}
                  borderRadius={12}
                  borderWidth={2}
                  marginTop={HEIGHT_BASE_RATIO(8)}
                  onChangeText={handleChange('city')}
                />
                {touched.city && errors.city && (
                  <View style={GeneralStyles.errorStyle}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                        },
                      ]}>
                      {errors.city}
                    </Text>
                  </View>
                )}

                
                <CustomInputTitle
                  placeholder={'State'}
                  borderColor={
                    state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                  }
                  placeholderColor={COLORS.Gray}
                  width={'100%'}
                  height={HEIGHT_BASE_RATIO(60)}
                  borderRadius={12}
                  borderWidth={2}
                  marginTop={HEIGHT_BASE_RATIO(8)}
                  value={values?.state}
                  onChangeText={handleChange('state')}
                />
                {touched.state && errors.state && (
                  <View style={GeneralStyles.errorStyle}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                        },
                      ]}>
                      {errors.state}
                    </Text>
                  </View>
                )}
                <CustomInputTitle
                  placeholder={'Zip Code'}
                  borderColor={
                    state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                  }
                  placeholderColor={COLORS.Gray}
                  width={'100%'}
                  height={HEIGHT_BASE_RATIO(60)}
                  borderRadius={12}
                  borderWidth={2}
                  marginTop={HEIGHT_BASE_RATIO(8)}
                  value={values.zipcode}
                  onChangeText={handleChange('zipcode')}
                  mode={'numeric'}
                />
                {touched.zipcode && errors.zipcode && (
                  <View style={GeneralStyles.errorStyle}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                        },
                      ]}>
                      {errors.zipcode}
                    </Text>
                  </View>
                )}
                <CustomInputTitle
                  placeholder={'Country'}
                  borderColor={
                    state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                  }
                  placeholderColor={COLORS.Gray}
                  width={'100%'}
                  height={HEIGHT_BASE_RATIO(60)}
                  borderRadius={12}
                  borderWidth={2}
                  marginTop={HEIGHT_BASE_RATIO(8)}
                  value={values?.location}
                  onChangeText={handleChange('location')}
                />
                {touched.location && errors.location && (
                  <View style={GeneralStyles.errorStyle}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                        },
                      ]}>
                      {errors.location}
                    </Text>
                  </View>
                )}
                <CustomInputTitle
                  placeholder={t('landMark')}
                  borderColor={
                    state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                  }
                  placeholderColor={COLORS.Gray}
                  width={'100%'}
                  height={HEIGHT_BASE_RATIO(60)}
                  borderRadius={12}
                  borderWidth={2}
                  marginTop={HEIGHT_BASE_RATIO(8)}
                  value={values?.landmark}
                  onChangeText={handleChange('landmark')}
                />
                {touched.landmark && errors.landmark && (
                  <View style={GeneralStyles.errorStyle}>
                    <Text
                      style={[
                        FONTS.AvenirMedium_16_black,
                        {
                          color: COLORS.RED,
                        },
                      ]}>
                      {errors.landmark}
                    </Text>
                  </View>
                )} */}
              </View>
            )}
          </Formik>
          {/* <View style={styles.toggleStyle}>
            <Text
              style={{
                ...FONTS.AvenirLight_14_black,
                marginTop: HEIGHT_BASE_RATIO(16),
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {t('saveThisInformation')}
            </Text>
            <SwitchToggle
              switchOn={on}
              onPress={() => setOn(!on)}
              backgroundColorOff={
                state.darkTheme ? COLORS.DARK_BTN_BG : '#E9E9EA'
              }
              backgroundColorOn={COLORS.GREEN}
              circleColorOff={COLORS.WHITE}
              containerStyle={styles.switchContainerStyle}
              circleStyle={styles.circleStyle}
            />
          </View> */}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomButton}>
        <CustomButton
          backgroundColor={COLORS.Brown}
          width={WIDTH_BASE_RATIO(358)}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          boderColor={COLORS.Brown}
          text={'Continue'}
          textStyle={{
            ...FONTS.AvenirMedium_16_black,
            color: COLORS.WHITE,
          }}
          onPress={() => {
            if (!isLoading) {
              handleContinue();
            }
          }}
          load={isLoading}
        />
      </View>
    </View>
  );
};

export default ShippingAddress;
