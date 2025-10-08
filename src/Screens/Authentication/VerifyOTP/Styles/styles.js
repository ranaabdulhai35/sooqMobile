import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../../Constants';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../../Utils/helpers';

export const styles = StyleSheet.create({
  formattedText: {
    ...FONTS.JakartaSansLight_14_Gray,
    width: WIDTH_BASE_RATIO(226),
    textAlign: 'center',
    marginTop: HEIGHT_BASE_RATIO(23),
  },
  otpInputStyle: {
    width: WIDTH_BASE_RATIO(76),
    height: HEIGHT_BASE_RATIO(80),
    borderBottomWidth: 2,
    ...FONTS.AvenirBold_24_black,
    fontSize: FONT_SIZE(35),
  },
  resendButton: {
    ...FONTS.JakartaSans_Bold_16,
    color: COLORS.Brown,
    marginTop: HEIGHT_BASE_RATIO(20),
  },
  inputFieldContainer: {marginTop: HEIGHT_BASE_RATIO(50)},
  OTP: {
    gap: WIDTH_BASE_RATIO(10),
    flexDirection: 'row',
  },
});
