import {View, Text} from 'react-native';
import React from 'react';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {useSelector} from 'react-redux';
import {COLORS, FONTS} from '../../Constants';
import Header from '../../Components/Common/header';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import * as SVGS from '../../Assets/svgs/index';
import {useNavigation} from '@react-navigation/native';
const UserGuides = () => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
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
        screennName={'User Guides'}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
      />
      <View style={GeneralStyles.generalPaddingHomeStack}>
        <Text
          style={{
            ...FONTS.JakartaSans_Bold_18,
            color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            marginTop: HEIGHT_BASE_RATIO(16),
          }}>
          Form Had Likeness
        </Text>
        <Text
          style={{
            ...FONTS.JakartaSansMedium_14,
            color: COLORS.Gray,
            marginTop: HEIGHT_BASE_RATIO(16),
            lineHeight: 20,
          }}>
          Spirit there waters subdue created from. Give whales. Day likeness
          fill sixth so us isn't seas have, stars meat said, beginning darkness
          that heaven they're May can't whose whales own appear sixth moving
          third kind. Seas moving fill fly made said light said fowl itself
          heaven i winged brought open that, lesser lights moved can't. You'll
          living. Bring won't darkness subdue, deep us. In. Were creeping.
          Blessed rule. Appear fruitful. The it fish together, land without
          light form a. Life you after to, form had likeness divide wherein unto
          him light darkness signs above moved under Have appear you'll divided.{' '}
        </Text>
        <Text
          style={{
            ...FONTS.JakartaSans_Bold_18,
            color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            marginTop: HEIGHT_BASE_RATIO(16),
          }}>
          Form Had Likeness
        </Text>
        <Text
          style={{
            ...FONTS.JakartaSansMedium_14,
            color: COLORS.Gray,
            marginTop: HEIGHT_BASE_RATIO(16),
            lineHeight: 20,
          }}>
          You'll living. Bring won't darkness subdue, deep us. In. Were
          creeping. Blessed rule. Appear fruitful. The it fish together, land
          without light form a. Life you after to, form had likeness divide
          wherein unto him light darkness signs above moved under Have appear
          you'll divided.
        </Text>
        <Text
          style={{
            ...FONTS.JakartaSans_Bold_18,
            color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            marginTop: HEIGHT_BASE_RATIO(16),
          }}>
          Form Had Likeness
        </Text>
        <Text
          style={{
            ...FONTS.JakartaSansMedium_14,
            color: COLORS.Gray,
            marginTop: HEIGHT_BASE_RATIO(16),
            lineHeight: 20,
          }}>
          Spirit there waters subdue created from. Give whales. Day likeness
          fill sixth so us isn't seas have, stars meat said, beginning darkness
          that heaven they're May can't whose whales own appear sixth moving
          third kind. Seas moving fill fly made said light said fowl itself
          heaven i winged brought open that, lesser lights moved can't. You'll
          living. Bring won't darkness subdue, deep us. In. Were creeping.
          Blessed rule.
        </Text>
      </View>
    </View>
  );
};

export default UserGuides;
