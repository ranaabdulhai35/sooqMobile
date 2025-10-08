import {StyleSheet} from 'react-native';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../../Utils/helpers';
import {FontFamily} from '../../../../GeneralStyles/generalFonts';
import {COLORS, FONTS} from '../../../../Constants';
import { GeneralStyles } from '../../../../GeneralStyles/generalStyles';

export const styles = StyleSheet.create({
  oAuth_Container: {marginTop: HEIGHT_BASE_RATIO(14)},
  oAuth_Btn_Bg: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LightBrown,
    width: WIDTH_BASE_RATIO(348),
    height: HEIGHT_BASE_RATIO(65),
    paddingHorizontal: WIDTH_BASE_RATIO(24),
    marginTop: HEIGHT_BASE_RATIO(8),
    borderRadius: 12,
  },
  oAuth_Btn_Txt: {
    ...FONTS.JakartaSansLight_16_black,
    marginLeft: WIDTH_BASE_RATIO(16),
    letterSpacing: 0.3,
  },
  languageSwitch: {
    alignItems: 'flex-end',
    width: '100%',
    marginTop: HEIGHT_BASE_RATIO(30),
    ...GeneralStyles.generalPaddingHomeStack,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: HEIGHT_BASE_RATIO(10),
    marginBottom: HEIGHT_BASE_RATIO(10),
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH_BASE_RATIO(348),
    marginTop: HEIGHT_BASE_RATIO(10),
  },
  iosCheck: {
    width: WIDTH_BASE_RATIO(20),
    height: HEIGHT_BASE_RATIO(20),
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionText: {
    ...FONTS.AvenirLight_14_black,
    width: WIDTH_BASE_RATIO(260),
    lineHeight: 18,
    marginLeft: WIDTH_BASE_RATIO(10),
  },
  inputFieldContainer: {
    marginTop: HEIGHT_BASE_RATIO(10),
  },
  logo: {height: HEIGHT_BASE_RATIO(229), width: WIDTH_BASE_RATIO(229)},
});
