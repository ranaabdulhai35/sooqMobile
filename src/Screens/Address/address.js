import {View, Text, TouchableOpacity, PermissionsAndroid} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../Constants';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import * as SVGS from '../../Assets/svgs/index';
import {useNavigation} from '@react-navigation/native';
import Header from '../../Components/Common/header';
import styles from './Styles/styles';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {useTranslation} from 'react-i18next';
import axios from '../../Requests/axios';
const Address = () => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();
  const mapRef = useRef(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [latDelta, setLatDelta] = useState(0.02);
  const [lngDelta, setLngDelta] = useState(0.02);
  const [address, setAddress] = useState(null);
  const [location, setLocation] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: t('permissionTitle'),
          message: t('permissionText'),
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
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

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
        leftIcon={state?.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        screennName={t('address')}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
      />
      <View style={GeneralStyles.generalPaddingHomeStack}>
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
            <TouchableOpacity
              style={{marginTop: HEIGHT_BASE_RATIO(24)}}
              onPress={() => {
                getCurrentLocation();
              }}>
              <Text style={{...FONTS.JakartaSans_Bold_14, color: COLORS.Brown}}>
                {t('currentLocation')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Address;
