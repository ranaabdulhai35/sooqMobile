import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import * as SVGS from '../../Assets/svgs/index';
import React, {useState} from 'react';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';

const QuantityButtons = ({limit, quantity, handleChange}) => {
  const state = useSelector(state => state?.auth);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          quantity == 1
            ? console.log("can't subtract")
            : handleChange(quantity - 1);
        }}
        style={[
          styles.button,
          {
            borderColor: state.darkTheme
              ? COLORS.DARK_BTN_BG
              : COLORS.LightGray,
          },
        ]}>
        {quantity == 1 ? <SVGS.minus /> : <SVGS.minusActive />}
      </TouchableOpacity>
      <Text
        style={{
          ...FONTS.JakartaSans_Bold_16,
          color: state.darkTheme ? COLORS.LightGray : COLORS.DARK,
          width: WIDTH_BASE_RATIO(50),
          textAlign: 'center',
        }}>
        {quantity}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (quantity < limit) {
            handleChange(quantity + 1);
          }
        }}
        style={[
          styles.button,
          {
            borderColor: state.darkTheme
              ? COLORS.DARK_BTN_BG
              : COLORS.LightGray,
          },
        ]}>
        <SVGS.plus />
      </TouchableOpacity>
    </View>
  );
};

export default QuantityButtons;

const styles = StyleSheet.create({
  button: {
    width: WIDTH_BASE_RATIO(44),
    height: HEIGHT_BASE_RATIO(52),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.LightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
