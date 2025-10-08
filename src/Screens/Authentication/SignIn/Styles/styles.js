import {Platform, StyleSheet} from 'react-native';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../../Utils/helpers';
import {FontFamily} from '../../../../GeneralStyles/generalFonts';
import {COLORS, FONTS} from '../../../../Constants';
import {GeneralStyles} from '../../../../GeneralStyles/generalStyles';

export const styles = StyleSheet.create({
  oAuth_Container: {marginTop: HEIGHT_BASE_RATIO(10)},
  oAuth_Btn_Bg: {
    flexDirection: 'row',
    alignItems: 'center',
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
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: HEIGHT_BASE_RATIO(10),
    marginBottom: HEIGHT_BASE_RATIO(30),
  },
  rememberMe: {
    width: Platform.OS === 'ios' ? '100%' : '105%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHT_BASE_RATIO(20),
  },
  inputFieldContainer: {marginTop: HEIGHT_BASE_RATIO(0)},
  languageSwitch: {
    alignItems: 'flex-end',
    width: '100%',
    marginTop: HEIGHT_BASE_RATIO(30),
    ...GeneralStyles.generalPaddingHomeStack,
  },
  logo: {height: HEIGHT_BASE_RATIO(229), width: WIDTH_BASE_RATIO(229)},
});
