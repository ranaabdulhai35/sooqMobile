import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {COLORS, FONTS} from '../../../../Constants/index';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../../Utils/helpers';
import {useSelector} from 'react-redux';
const GOOGLE_MAP_KEY = 'AIzaSyC8nAkZUpCghSDZJLw_5RDzGL80KC8XLYk';

const AddressPickup = ({
  placheholderText,
  fetchAddress,
  route,
  value,
  onChangeText,
}) => {
  const googlePlacesRef = useRef();
  const state = useSelector(state => state.auth);

  const onPressAddress = (data, details) => {
    let resLength = details.address_components;
    let zipCode = '';

    let filtersResCity = details.address_components.filter(val => {
      if (val.types.includes('locality') || val.types.includes('sublocality')) {
        return val;
      }
      if (val.types.includes('postal_code')) {
        let postalCode = val?.long_name;
        zipCode = postalCode;
      }
      return false;
    });

    let dataTextCityObj =
      filtersResCity.length > 0
        ? filtersResCity[0]
        : details.address_components[
            resLength > 1 ? resLength - 2 : resLength - 1
          ];

    let cityText =
      dataTextCityObj.long_name && dataTextCityObj.long_name.length > 17
        ? dataTextCityObj.short_name
        : dataTextCityObj.long_name;

    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    setTimeout(() => {
      Keyboard.dismiss();
      googlePlacesRef.current?.blur(); // explicitly blur input
    }, 100);

    fetchAddress(lat, lng, zipCode, cityText);
  };

  return (
    <View
      style={[
        styles.container,
        {borderColor: state.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown},
      ]}>
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder={placheholderText}
        onPress={onPressAddress}
        disableScroll={true}
        fetchDetails={true}
        query={{
          key: GOOGLE_MAP_KEY,
          language: 'en',
        }}
        textInputProps={{
          placeholderTextColor: COLORS.Gray,
          value: value, // Set the initial value from props
          // onChangeText: text => onChangeText(text),
        }}
        styles={{
          textInputContainer: {
            ...styles.containerStyle,
            backgroundColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE,
            alignItems: 'center',
            height: HEIGHT_BASE_RATIO(60),
          },

          textInput: {
            ...styles.textInputStyle,
            color: COLORS.Gray,
            backgroundColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE,
          },
          predefinedPlacesDescription: {
            color: COLORS.Gray,
          },
          description: {
            color: COLORS.Gray,
          },
          poweredContainer: {
            backgroundColor: COLORS.WHITE,
          },
          placeholderTextColor: COLORS.Gray,
        }}
        enableHighAccuracyLocation={true}
        renderLeftButton={() => (
          <View
            style={{
              justifyContent: 'center',
              marginRight: route ? null : '-3%',
              marginLeft: route ? null : '-6%',
              marginTop: route ? null : '3%',
            }}></View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: WIDTH_BASE_RATIO(323),
    // backgroundColor: COLORS.WHITE,
    overflow: 'hidden',
    paddingHorizontal: WIDTH_BASE_RATIO(10),
    borderRadius: 12,
    color: COLORS.Gray,
    borderWidth: 2,
    borderColor: COLORS.LightBrown,
  },
  containerStyle: {
    height: HEIGHT_BASE_RATIO(60),
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  textInputStyle: {
    color: COLORS.Gray,
    placeholderTextColor: COLORS.Gray,
    ...FONTS.JakartaSansLight_16_black,
  },
});

export default AddressPickup;
