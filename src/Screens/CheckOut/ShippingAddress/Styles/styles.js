import {Platform, StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../../Utils/helpers';
import {COLORS, FONTS} from '../../../../Constants';

const styles = StyleSheet.create({
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHT_BASE_RATIO(8),
  },
  nameInput: {flexDirection: 'column'},
  phoneInputContainer: {
    borderWidth: 0.5,
    borderRadius: Platform.OS === 'ios' ? 10 : 8,
    borderColor: COLORS.LightBrown,
    borderWidth: 2,
    borderRadius: 12,
    height: HEIGHT_BASE_RATIO(60),
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: HEIGHT_BASE_RATIO(8),
  },
  phoneInputTextContainer: {
    backgroundColor: 'transparent',
    borderRadius: 8,
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
  switchContainerStyle: {
    marginTop: 16,
    width: WIDTH_BASE_RATIO(51),
    height: HEIGHT_BASE_RATIO(35),
    borderRadius: 16,
    padding: 5,
  },
  circleStyle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  bottomButton: {
    position: 'absolute',
    zIndex: 9999,
    bottom: 0,
    alignSelf: 'center',
    marginBottom:
      Platform.OS == 'ios' ? HEIGHT_BASE_RATIO(22) : HEIGHT_BASE_RATIO(18),
  },
  fieldText: {
    ...FONTS.JakartaSans_Bold_14,
    color: COLORS.DARK,
    marginTop: HEIGHT_BASE_RATIO(8),
  },
});
export default styles;
