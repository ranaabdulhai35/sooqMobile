import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../../Constants';
import {HEIGHT_BASE_RATIO} from '../../../../Utils/helpers';

export const styles = StyleSheet.create({
  imageButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.LightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {width: 120, height: 120, borderRadius: 60},
  profileTxt: {
    ...FONTS.JakartaSans_Bold_16,
    color: COLORS.Brown,
    marginTop: HEIGHT_BASE_RATIO(16),
  },
  guide: {
    ...FONTS.JakartaSansLight_14_Gray,
    marginTop: HEIGHT_BASE_RATIO(24),
    marginBottom: HEIGHT_BASE_RATIO(26),
  },
  verticalGap: {
    marginTop: HEIGHT_BASE_RATIO(8),
  },
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
});
