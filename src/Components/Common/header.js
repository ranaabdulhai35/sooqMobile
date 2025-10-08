import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  Pressable,
  noIcon,
  TextInput,
  useColorScheme,
} from 'react-native';
import React from 'react';
import * as SVGS from '../../Assets/svgs/index';
import {useNavigation} from '@react-navigation/native';
import CustomInputTitle from './customInputTitle';
import {useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../Constants';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO, wp} from '../../Utils/helpers';
import {useTranslation} from 'react-i18next';
const Header = ({
  backgroundColor,
  rightIcon,
  leftIcon,
  middleIcon,
  screennName,
  onPressLeftIcon,
  onPressMiddleIcon,
  onPressRightIcon,
  style,
  screenNameColor,
}) => {
  const isDarkTheme = useColorScheme() == 'dark';
  return (
    <View style={{backgroundColor: backgroundColor}}>
      {/* <StatusBar
        backgroundColor={isDarkTheme ? COLORS.DARK : COLORS.WHITE}
        translucent={true}
      /> */}
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: HEIGHT_BASE_RATIO(25),
          backgroundColor: backgroundColor,
          ...style,
        }}>
        <Pressable
          style={{
            width: WIDTH_BASE_RATIO(30),
            height: HEIGHT_BASE_RATIO(30),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onPressLeftIcon}>
          {leftIcon}
        </Pressable>
        {screennName ? (
          <Text style={{...FONTS.JakartaSans_Bold_18, color: screenNameColor}}>
            {screennName}
          </Text>
        ) : (
          <Pressable onPress={onPressMiddleIcon}>{middleIcon}</Pressable>
        )}
        <Pressable
          style={{
            width: WIDTH_BASE_RATIO(30),
            height: HEIGHT_BASE_RATIO(30),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onPressRightIcon}>
          {rightIcon}
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
