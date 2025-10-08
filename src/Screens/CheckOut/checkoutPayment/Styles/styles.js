import {StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../../Utils/helpers';
import {COLORS, FONTS} from '../../../../Constants';

const styles = StyleSheet.create({
  heading: {
    ...FONTS.JakartaSans_Bold_18,
    color: COLORS.DARK,
    marginTop: HEIGHT_BASE_RATIO(25),
  },
  textContainer: {
    marginTop: HEIGHT_BASE_RATIO(25),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    width: '100%',
    height: 0.1,
    borderRadius: 5,
    backgroundColor: COLORS.LightBrown,
    marginVertical: HEIGHT_BASE_RATIO(16),
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visaTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: WIDTH_BASE_RATIO(16),
  },
  innerMapContainer: {
    // height: HEIGHT_BASE_RATIO(145),
    paddingHorizontal: WIDTH_BASE_RATIO(16),
    paddingVertical: HEIGHT_BASE_RATIO(16),
  },
  mapViewStyle: {
    width: '100%',
    height: HEIGHT_BASE_RATIO(145),
    borderRadius: 10,
  },
  mapContainer: {
    // height: HEIGHT_BASE_RATIO(276),
    borderWidth: 2,
    borderColor: COLORS.LightBrown,
    borderRadius: 12,
    marginVertical: HEIGHT_BASE_RATIO(16),
  },
  addressText: {
    ...FONTS.JakartaSansLight_16_black,
    marginTop: HEIGHT_BASE_RATIO(8),
  },
  toggleStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapBottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    width: WIDTH_BASE_RATIO(25),
    height: HEIGHT_BASE_RATIO(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaText: {
    ...FONTS.JakartaSansMedium_14,
    color: COLORS.BLACK,
    marginLeft: WIDTH_BASE_RATIO(16),
  },
  summaryTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHT_BASE_RATIO(16),
  },
  bottomButtonContainer: {
    width: '100%',
    paddingHorizontal: WIDTH_BASE_RATIO(16),
    paddingVertical: HEIGHT_BASE_RATIO(16),
    position: 'absolute',
    zIndex: 11111,
    bottom: 0,
    backgroundColor: COLORS.WHITE,
  },
  googlePay: {
    width: WIDTH_BASE_RATIO(358),
    height: HEIGHT_BASE_RATIO(60),
    // marginVertical: 20,
  },
  applePayButton: {
    width: WIDTH_BASE_RATIO(358),
    height: HEIGHT_BASE_RATIO(40),
    borderRadius: 10,
  },

  validateButton: {
    // width: WIDTH_BASE_RATIO(80),
    height: HEIGHT_BASE_RATIO(30),
    paddingHorizontal: WIDTH_BASE_RATIO(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.GREEN,
    borderRadius: 8,
    // marginTop: HEIGHT_BASE_RATIO(10),
  },
});
export default styles;
