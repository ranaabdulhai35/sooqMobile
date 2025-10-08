import {
  View,
  Text,
  Platform,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../Constants';
import Header from '../../Components/Common/header';
import {
  deepEqual,
  getCountryInfo,
  getDifferences,
  handleLangChange,
  HEIGHT_BASE_RATIO,
  locationPermission,
  requestLocationPermission,
  simpleTruncateText,
  WIDTH_BASE_RATIO,
} from '../../Utils/helpers';
import * as SVGS from '../../Assets/svgs/index';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import styles from './Styles/styles';
import CustomInputTitle from '../../Components/Common/customInputTitle';
import CustomButton from '../../Components/Common/customButton';
import {useTranslation} from 'react-i18next';
import {useUpdateUserMutation} from '../../Apis/userApiCall';
import {AuthSlice} from '../../Redux/slice';
import Geolocation from 'react-native-geolocation-service';
import axios from '../../Requests/axios';
import * as Yup from 'yup';
import {Formik} from 'formik';
import OrContinueWith from '../../Components/Common/orContinueWith';
import MapView, {Marker} from 'react-native-maps';
import AddressPickup from '../CheckOut/ShippingAddress/Components/shippingAddressMap';
import WithoutFeedbackWrapper from '../../GeneralStyles/withoutFeedbackWrapper';

const EditProfile = ({route}) => {
  const navigation = useNavigation();
  const params = route?.params;
  const formikRef = useRef(null);
  const mapRef = useRef(null);
  const refRBSheet = useRef();
  const dispatch = useDispatch();
  const state = useSelector(state => state.auth);
  const userId = state?.user?.id;
  const {t} = useTranslation();

  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [latDelta, setLatDelta] = useState(0.02);
  const [lngDelta, setLngDelta] = useState(0.02);
  const [phoneDisplay, setPhoneDisplay] = useState('+966');

  const [updateUser, {isLoading: isUpdatingUser}] = useUpdateUserMutation();
  // const [initialValues, setInitialValues] = useState(null); // No longer needed as a separate state
  const [address, setAddress] = useState(null);

  const phoneRegex = /^\+9665\d{8}$/;
  const senderValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),

    phoneNumber: Yup.string()
      .required('Phone Number is required')
      .matches(phoneRegex, 'Invalid Saudi phone number format'),

    address: Yup.string().required('Address is required'),
  });
  // Dynamically create initialValues based on Redux state
  const currentInitialValues = React.useMemo(() => {
    return {
      name: handleLangChange(state?.user?.name, state?.language) || '',
      phoneNumber: state?.user?.phoneNumber || '',
      address: state?.user?.address || '',
    };
  }, [
    state?.user?.name,
    state?.user?.phoneNumber,
    state?.user?.address,
    state?.language,
  ]);

  const handleSubmit = async values => {
    const data = new FormData();

    const fields = {
      name: values.name,
      address: values.address,
      phoneNumber: values.phoneNumber,
    };

    // Calculate differences to send only changed fields
    const changes = getDifferences(currentInitialValues, values);

    Object.entries(changes).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        data.append(key, value);
      }
    });
    console.log('data in payload', data);
    const response = await updateUser({userId, data});

    if (response.data) {
      console.log('response', response?.data);
      dispatch(AuthSlice.actions.setUser(response?.data));
      if (params?.screen === 'checkout') {
        let updatedOrder = params?.orderDetail;
        updatedOrder.address = response?.data?.address;
        navigation.navigate('CheckoutPayment', {
          orderDetail: updatedOrder,
          screen: 'EditProfile',
          address: response?.data?.address,
        });
      } else {
        navigation.navigate('BottomTabBar', {screen: 'HomeScreen'});
      }
    }
    if (response.error) {
      console.error('Error Occured while updating user', response.error);
      if (response.error.status === 400) {
        Alert.alert('Sorry!', response.error.data.message);
      }
    }
  };
  const requestLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      return true;
    }

    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        'Location Permission Needed',
        'Please enable location access in your device settings to continue.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => openSettings()},
        ],
      );
      return false;
    }

    const newStatus = await request(permission); // 👉 Shows native OS popup

    return newStatus === RESULTS.GRANTED;
  };
  const getPermission = async () => {
    const granted = await locationPermission(t);

    if (granted) {
      Geolocation.getCurrentPosition(
        position => console.log('Position:', position),
        error => console.log('Location error:', error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      // requestLocationPermission(t);
      console.log('Permission not granted');
    }
  };
  const fetchDestinationCords = async (lat, lng) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lng);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: latNum,
          longitude: lonNum,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    } else {
      console.warn('mapRef is not yet ready');
    }

    setLocation({latitude: latNum, longitude: lonNum});

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
  const fetchDestinationCordsWhenUserHasAddress = async address => {
    try {
      console.log('Address callback');
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
  const getCurrentLocation = async () => {
    const granted = await locationPermission();
    if (granted) {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;

          fetchDestinationCords(latitude, longitude);
          setLatitude(latitude);
          setLongitude(longitude);
          // if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.01,
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
    } else {
      console.log('Permission not granted');
      getPermission();
    }
  };
  const handleUpdateOnPress = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Fetch address if user has one
      if (state.user?.address) {
        fetchDestinationCordsWhenUserHasAddress(state.user?.address);
      }
      getPermission();

      // No need to setValues here directly, Formik's enableReinitialize will handle it
      // as currentInitialValues will change based on state.user updates.
    }, [
      state.user?.address,
      state.user?.name,
      state.user?.phoneNumber,
      state?.language,
    ]),
  );

  useEffect(() => {
    if (address?.display_name && formikRef.current) {
      const currentValues = formikRef.current.values;
      // Only update address field, preserve others
      formikRef.current.setFieldValue('address', address?.display_name);
    }
  }, [address]);

  return (
    <>
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
          rightIcon={<View style={{width: WIDTH_BASE_RATIO(25)}}></View>}
          leftIcon={
            state?.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />
          }
          screennName={t('editProfile')}
          screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
          onPressLeftIcon={() => {
            if (params?.screen === 'checkout') {
              navigation.navigate('CheckoutPayment', {
                screen: 'EditProfile',
                orderDetail: params?.orderDetail,
                address: address?.display_name,
              });
            } else {
              state.user?.address &&
                state.user?.name &&
                state.user?.phoneNumber &&
                navigation.navigate('Settings');
            }
          }}
        />
        <ScrollView
          style={{
            ...GeneralStyles.generalPaddingHomeStack,
            marginBottom: HEIGHT_BASE_RATIO(90),
          }}
          keyboardShouldPersistTaps="always"
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
                  latitude: location?.latitude
                    ? location?.latitude
                    : latitude
                    ? latitude
                    : 31.5203696,
                  longitude: location?.longitude
                    ? location?.longitude
                    : longitude
                    ? longitude
                    : 74.3587473,
                  latitudeDelta: latDelta,
                  longitudeDelta: lngDelta,
                }}>
                <Marker
                  coordinate={{
                    latitude: location?.latitude
                      ? location?.latitude
                      : latitude
                      ? latitude
                      : 31.5203696,
                    longitude: location?.longitude
                      ? location?.longitude
                      : longitude
                      ? longitude
                      : 74.3587473,
                  }}
                  title={'Origin'}
                />
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
            </View>
          </View>
          <TouchableOpacity
            style={{
              marginTop: HEIGHT_BASE_RATIO(4),
              alignItems: 'center',
            }}
            onPress={() => {
              getCurrentLocation();
              // After getting current location and fetching address, update formik field
              // This will happen in the useEffect for 'address' state.
            }}>
            <Text
              style={{
                ...FONTS.JakartaSans_Bold_14,
                color: COLORS.Brown,
              }}>
              {t('currentLocation')}
            </Text>
          </TouchableOpacity>
          <Formik
            innerRef={formikRef}
            validationSchema={senderValidationSchema}
            validateOnBlur={true}
            validateOnChange={false}
            initialValues={currentInitialValues}
            enableReinitialize={true}
            onSubmit={async (values, {setSubmitting, resetForm}) => {
              const differences = getDifferences(currentInitialValues, values);

              if (Object.keys(differences).length > 0) {
                handleSubmit(differences);
              } else {
                // if (params?.screen === 'checkout') {
                //   navigation.push('CheckoutPayment', {
                //     orderDetail: params?.orderDetail,
                //     screen: 'EditProfile',
                //   });
                // } else {
                //   navigation.navigate('BottomTabBar', {screen: 'HomeScreen'});
                // }
              }
            }}>
            {({handleChange, values, errors, touched, setFieldValue}) => (
              <WithoutFeedbackWrapper>
                <>
                  <Text
                    style={{
                      ...styles.fieldText,
                      marginTop: HEIGHT_BASE_RATIO(12),
                      color: state.darkTheme ? COLORS.WHITE : COLORS.BLACK,
                      alignSelf:
                        state?.language == 'ar' ? 'flex-end' : 'flex-start',
                    }}>
                    {t('editYourName')}
                  </Text>
                  <View style={styles.nameInput}>
                    <CustomInputTitle
                      placeholder={t('name')}
                      borderColor={
                        state?.darkTheme
                          ? COLORS.DARK_BTN_BG
                          : COLORS.LightBrown
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
                      <View
                        style={{
                          ...GeneralStyles.errorStyle,
                        }}>
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
                  <Text
                    style={{
                      ...styles.fieldText,
                      color: state.darkTheme ? COLORS.WHITE : COLORS.BLACK,
                      alignSelf:
                        state?.language == 'ar' ? 'flex-end' : 'flex-start',
                    }}>
                    {t('editPhoneNumber')}
                  </Text>
                  <CustomInputTitle
                    placeholder="Phone number"
                    borderColor={
                      state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
                    }
                    maxLength={13} // +9665xxxxxxxx = 13 characters total
                    placeholderColor={COLORS.Gray}
                    width="100%"
                    height={HEIGHT_BASE_RATIO(60)}
                    borderRadius={12}
                    borderWidth={2}
                    marginTop={HEIGHT_BASE_RATIO(5)}
                    value={values.phoneNumber || '+966'} // show +966 if empty
                    onChangeText={text => {
                      // Always ensure it starts with +966
                      if (!text.startsWith('+966')) return;

                      // If trying to delete below +966, stop it
                      if (text.length < 4) return;

                      // Remove all non-digit characters
                      const digitsOnly = text.replace(/\D/g, '');

                      // Get the digits after +966
                      const nationalPart = digitsOnly.slice(3);

                      // Must start with '5'
                      if (nationalPart && !nationalPart.startsWith('5')) return;

                      // Limit to 9 digits after +966
                      const limited = nationalPart.slice(0, 9);
                      const formatted = `+966${limited}`;

                      // Update Formik
                      setFieldValue('phoneNumber', formatted);
                    }}
                    keyboardType="phone-pad"
                  />
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
                      alignSelf:
                        state?.language == 'ar' ? 'flex-end' : 'flex-start',
                    }}>
                    {t('enterShortNationalAddress')}
                  </Text>
                  <View>
                    <AddressPickup
                      placheholderText={
                        values.address // Use formik's value for the placeholder
                          ? simpleTruncateText(values.address, 38)
                          : t('recieversAddress')
                      }
                      fetchAddress={(lat, lng) => {
                        fetchDestinationCords(lat, lng);
                        // Also update Formik's address field directly
                        setFieldValue('address', address?.display_name || ''); // Make sure to use the resolved address
                      }}
                      route
                    />
                  </View>
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
                </>
              </WithoutFeedbackWrapper>
            )}
          </Formik>
        </ScrollView>
        <View
          style={{
            ...styles.bottomButton,
            backgroundColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE,
          }}>
          <CustomButton
            backgroundColor={COLORS.Brown}
            width={WIDTH_BASE_RATIO(358)}
            height={HEIGHT_BASE_RATIO(60)}
            borderRadius={12}
            boderColor={COLORS.Brown}
            text={t('update')}
            textStyle={{
              ...FONTS.AvenirMedium_16_black,
              color: COLORS.WHITE,
            }}
            onPress={() => {
              if (!isUpdatingUser) {
                handleUpdateOnPress();
              }
            }}
            load={isUpdatingUser}
          />
        </View>
      </View>
    </>
  );
};

export default EditProfile;
