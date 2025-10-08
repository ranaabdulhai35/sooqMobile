import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

const OrContinueWith = ({marginTop, text}) => {
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: WIDTH_BASE_RATIO(348),
        marginTop: marginTop,
      }}>
      <View
        style={{
          ...style.line,
          backgroundColor: state?.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}></View>
      <Text style={FONTS.JakartaSansLight_14_Gray}>
        {' '}
        {text ? text : t('or_continue_with')}
      </Text>
      <View
        style={{
          ...style.line,
          backgroundColor: state?.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}></View>
    </View>
  );
};

export default OrContinueWith;

const style = StyleSheet.create({
  line: {
    width: WIDTH_BASE_RATIO(115),
    height: HEIGHT_BASE_RATIO(2),
    backgroundColor: COLORS.LightBrown,
  },
});
