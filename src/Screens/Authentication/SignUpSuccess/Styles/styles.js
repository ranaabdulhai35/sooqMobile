import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../../Constants';
import {HEIGHT_BASE_RATIO} from '../../../../Utils/helpers';

export const styles = StyleSheet.create({
  parentConatiner: {
    alignItems: 'center',
    marginTop: HEIGHT_BASE_RATIO(66),
  },
  profileTxt: {
    ...FONTS.JakartaSans_Bold_32,
    color: COLORS.BLACK,
  },
  infoTxt: {
    ...FONTS.JakartaSans_Regular_18,
    marginTop: HEIGHT_BASE_RATIO(55),
  },
});
