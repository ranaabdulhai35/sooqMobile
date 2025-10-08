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
} from 'react-native';
import React from 'react';
import * as SVGS from '../../../Assets/svgs/index';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../../Constants';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO, wp} from '../../../Utils/helpers';
import {useTranslation} from 'react-i18next';

const HomeHeader = ({
  backgroundColor,
  pfp,
  icon,
  onPressPfp,
  onPressIcon,
  style,
  padding,
}) => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();
  return (
    <View style={{backgroundColor: backgroundColor}}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: backgroundColor,
          ...padding,
          ...style,
        }}>
        <Pressable
          style={{
            width: WIDTH_BASE_RATIO(30),
            height: HEIGHT_BASE_RATIO(30),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onPressPfp}>
          {/* state?.pfp ? (
              <Image
                source={pfp}
                style={{width: 40, height: 40, borderRadius: 20}}
              />
            ) : (
              <Image
                source={{uri: pfp}}
                style={{width: 40, height: 40, borderRadius: 20}}
              />
            ) */}
          {pfp ? (
            <Image
              source={pfp}
              style={{width: 40, height: 40, borderRadius: 20}}
            />
          ) : (
            <SVGS.userIcon />
          )}
        </Pressable>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SearchScreen');
          }}
          style={{
            width: WIDTH_BASE_RATIO(265),
            height: HEIGHT_BASE_RATIO(45),
            borderRadius: 8,
            borderWidth: 1,
            borderColor: state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.Brown,
            flexDirection: state?.language === 'ar' ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[
              FONTS.JakartaSansLight_16_black,
              {
                marginLeft: state?.language === 'ar' ? 0 : WIDTH_BASE_RATIO(16),
                width:
                  state?.language === 'ar'
                    ? WIDTH_BASE_RATIO(40)
                    : WIDTH_BASE_RATIO(200),
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              },
            ]}>
            {t('search')}
          </Text>
          <SVGS.search
            style={{
              marginRight: state?.language === 'ar' ? 0 : WIDTH_BASE_RATIO(16),
              marginLeft: state?.language === 'ar' ? WIDTH_BASE_RATIO(16) : 0,
            }}
          />
        </TouchableOpacity>

        <Pressable
          style={{
            width: WIDTH_BASE_RATIO(30),
            height: HEIGHT_BASE_RATIO(30),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onPressIcon}>
          {state?.darkTheme ? <SVGS.cartWhite /> : <SVGS.cartBrown />}
          {state?.cartItems !== 0 && (
            <View
              style={{
                width: WIDTH_BASE_RATIO(18),
                height: HEIGHT_BASE_RATIO(18),
                borderRadius: 10,
                backgroundColor: COLORS.GREEN,
                position: 'absolute',
                top: -4,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{...FONTS.JakartaSansMedium_12}}>
                {state.cartItems}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default HomeHeader;
