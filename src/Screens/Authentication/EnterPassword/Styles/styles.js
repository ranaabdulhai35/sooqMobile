import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../../Constants';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../../Utils/helpers';

export const styles = StyleSheet.create({
  heading: {
    ...FONTS.JakartaSans_24_Bold,
    marginTop: HEIGHT_BASE_RATIO(35),
    color: COLORS.BLACK,
  },
  email: {
    ...FONTS.JakartaSansLight_16_black,
    marginTop: HEIGHT_BASE_RATIO(10),
    marginBottom: HEIGHT_BASE_RATIO(35),
    color: COLORS.BLACK,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: WIDTH_BASE_RATIO(32),
    marginTop: HEIGHT_BASE_RATIO(15),
  },
  forgotPasswordText: {
    ...FONTS.JakartaSans_Bold_14,
    color: COLORS.Brown,
    letterSpacing: 0.15,
  },
});
