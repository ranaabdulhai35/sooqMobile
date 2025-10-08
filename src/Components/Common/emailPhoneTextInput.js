import {View, Text, TextInput, StyleSheet, Image, Platform} from 'react-native';
import React, {useRef, useState} from 'react';

import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
  wp,
} from '../../Utils/helpers';
import * as ICONS from '../../Assets/Icons/index';
import PhoneInput from 'react-native-phone-number-input';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';
import CustomInputTitle from './customInputTitle';

const EmailPhoneTextInput = ({
  title,
  placeholder,
  onChangeText,
  Icon,
  countryCode,
  secureEntry,
  titleIcon,
  defaultValue,
  maxLength,
  password,
  value,
  SVG,
  number,
  editable,
  borderColor,
  placeholderColor,
  width,
  height,
  borderRadius,
  borderWidth,
  onBlur,
}) => {
  const [inputValue, setInputValue] = useState('');
  const state = useSelector(state => state.auth);
  const handleInputChange = text => {
    onChangeText(text);

    setInputValue(text);
  };

  const isPhoneNumber = value => {
    return Number.isInteger(parseInt(value));
  };

  // console.log(formattedValue, 'formattedValue');

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={[
            {
              marginBottom: HEIGHT_BASE_RATIO(7),
            },
            FONTS.AvenirLTStd_Black_900_14,
            {color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK},
          ]}>
          {title}
        </Text>
        {titleIcon && (
          <Image
            style={{marginLeft: WIDTH_BASE_RATIO(10)}}
            source={titleIcon}
          />
        )}
      </View>
      {number ? (
        <CustomInputTitle
          placeholder={placeholder}
          borderColor={
            state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
          }
          maxLength={14}
          placeholderColor={COLORS.Gray}
          width={width}
          height={height}
          onBlur={onBlur}
          borderRadius={12}
          borderWidth={2}
          marginTop={HEIGHT_BASE_RATIO(5)}
          value={value}
          defaultValue={defaultValue}
          onChangeText={handleInputChange}
          keyboardType={'phone-pad'}
        />
      ) : isPhoneNumber(inputValue) ? (
        <CustomInputTitle
          placeholder={placeholder}
          borderColor={
            state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
          }
          maxLength={14}
          placeholderColor={COLORS.Gray}
          width={width}
          height={height}
          borderRadius={12}
          borderWidth={2}
          marginTop={HEIGHT_BASE_RATIO(5)}
          value={value}
          onBlur={onBlur}
          defaultValue={defaultValue}
          onChangeText={handleInputChange}
          keyboardType={'phone-pad'}
        />
      ) : (
        <View
          style={{
            width: width,
            height: height,
            borderRadius: borderRadius,
            color: COLORS.BLACK,
            fontSize: FONT_SIZE(11),
            fontWeight: '300',
            paddingHorizontal: WIDTH_BASE_RATIO(10),
            borderWidth: borderWidth,
            borderColor: borderColor ? borderColor : '',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {countryCode && (
            <Text style={{marginHorizontal: WIDTH_BASE_RATIO(10)}}>
              {countryCode}
            </Text>
          )}

          <TextInput
            placeholder={placeholder}
            editable={editable ? false : true}
            onChangeText={handleInputChange}
            secureTextEntry={secureEntry}
            defaultValue={defaultValue}
            placeholderTextColor={placeholderColor}
            autoCapitalize="none"
            onBlur={onBlur}
            maxLength={maxLength ? maxLength : 100}
            keyboardType={title === 'Phone Number' ? 'number-pad' : 'default'}
            value={value}
            style={[
              FONTS.JakartaSansLight_16_black,
              {
                width: password ? wp(65) : wp(75),
                color: state?.darkTheme ? COLORS.WHITE : COLORS.BLACK,
                marginLeft: 10,
              },
            ]}
          />

          {password && (
            <Image
              source={ICONS.openeye}
              style={{marginRight: WIDTH_BASE_RATIO(5)}}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default EmailPhoneTextInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    // marginBottom: HEIGHT_BASE_RATIO(10),
  },
  phoneInputContainer: {
    // borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: Platform.OS === 'ios' ? 10 : 8,
  },
  phoneInputTextContainer: {
    backgroundColor: 'transparent',
    // backgroundColor:'green',
    borderRadius: 8,

    // height:48
  },
});
