import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');
import {FontFamily} from '../../GeneralStyles/generalFonts';
import {FONT_SIZE, HEIGHT_BASE_RATIO} from '../../Utils/helpers';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#0B0B0B',
  BLUE: '#008AFB',
  RED: '#EE1C25',
  DARK: '#15120F',
  DARK_BTN_BG: '#24221F',
  GREEN: '#24B036',
  Brown: '#AC8964',
  Gray: '#7E7E7E',
  LightBrown: '#F4EFE9',
  LightGray: '#F7F7F7',
  Yellow: '#E5C140',
};
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  logowidth: 176,
  logoheight: 51,
  paddingH: width * 0.086,
  paddingH: width * 0.086,
  iconWidth: width / 30 + 13,
  iconHeight: height / 40 + 13,

  // shadow
  shadowANDROID: {
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 10,
    zIndex: 999,
  },
  PinkshadowANDROID: {
    shadowColor: '#fe3f6c',
    shadowOffset: {width: 5, height: 5},

    shadowOpacity: 0.1,
    elevation: -3,
    zIndex: 66,
  },

  shadow_ios_android: {
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    elevation: 4,
    backgroundColor: 'white',
  },
  lightShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.41,

    elevation: 1,
  },

  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6.27,
  },

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  PlusJakartaSans_600_12: {
    fontSize: FONT_SIZE(12),
    FontFamily: FontFamily.PlusJakartaSansBold,
  },
  JakartaSans_Bold_14: {
    fontSize: FONT_SIZE(14),
    fontFamily: FontFamily.PlusJakartaSansBold,
  },
  JakartaSans_Bold_10: {
    fontSize: FONT_SIZE(10),
    fontFamily: FontFamily.PlusJakartaSansBold,
  },
  JakartaSans_Bold_16: {
    fontSize: FONT_SIZE(16),
    fontFamily: FontFamily.PlusJakartaSansBold,
  },
  JakartaSans_Bold_12: {
    fontSize: FONT_SIZE(12),
    fontFamily: FontFamily.PlusJakartaSansBold,
  },
  JakartaSans_Regular_18: {
    fontSize: FONT_SIZE(18),
    FontFamily: FontFamily.PlusJakartaSanRegular,
  },
  JakartaSansMedium_14: {
    fontFamily: FontFamily.PlusJakartaSansMedium,
    fontSize: FONT_SIZE(14),
  },
  JakartaSansMedium_12: {
    fontFamily: FontFamily.PlusJakartaSansMedium,
    fontSize: FONT_SIZE(12),
  },
  JakartaSansMedium_16: {
    fontFamily: FontFamily.PlusJakartaSansMedium,
    fontSize: FONT_SIZE(16),
  },
  JakartaSans_Regular_10: {
    fontSize: FONT_SIZE(10),
    FontFamily: FontFamily.PlusJakartaSanRegular,
  },
  JakartaSans_Regular_12: {
    fontSize: FONT_SIZE(12),
    FontFamily: FontFamily.PlusJakartaSanRegular,
  },
  JakartaSans_Regular_14: {
    fontSize: FONT_SIZE(14),
    FontFamily: FontFamily.PlusJakartaSanRegular,
  },
  JakartaSans_Regular_16: {
    fontSize: FONT_SIZE(16),
    FontFamily: FontFamily.PlusJakartaSanRegular,
  },
  JakartaSans_Bold_18: {
    fontSize: FONT_SIZE(18),
    fontFamily: FontFamily.PlusJakartaSansBold,
  },
  JakartaSans_Bold_32: {
    fontFamily: FontFamily.PlusJakartaSansBold,
    fontSize: FONT_SIZE(32),
  },
  JakartaSans_24_Bold: {
    fontFamily: FontFamily.PlusJakartaSansBold,
    fontSize: FONT_SIZE(24),
  },
  JakartaSansLight_14_Gray: {
    fontSize: FONT_SIZE(14),
    fontFamily: FontFamily.PlusJakartaSansLight,
    color: COLORS.Gray,
    letterSpacing: 0.05,
  },
  JakartaSansLight_12_Gray: {
    fontSize: FONT_SIZE(12),
    fontFamily: FontFamily.PlusJakartaSansLight,
    color: COLORS.Gray,
    letterSpacing: 0.05,
  },
  JakartaSansLight_16_black: {
    fontSize: FONT_SIZE(16),
    fontFamily: FontFamily.PlusJakartaSansLight,
    letterSpacing: 0.05,
  },
  AvenirBold_24_black: {
    fontSize: FONT_SIZE(24),
    fontFamily: FontFamily.AvenirNextBold,
    color: COLORS.BLACK,
  },
  AvenirMedium_16_black: {
    fontSize: FONT_SIZE(16),
    fontFamily: FontFamily.AvenirNextMedium,
    color: COLORS.BLACK,
  },
  AvenirLight_14_black: {
    fontSize: FONT_SIZE(14),
    fontFamily: FontFamily.AvenirNextLight,
    color: COLORS.BLACK,
  },
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
