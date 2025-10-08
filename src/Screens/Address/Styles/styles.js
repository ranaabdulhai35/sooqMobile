import {StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {COLORS, FONTS} from '../../../Constants';

const styles = StyleSheet.create({
  mapContainer: {
    height: HEIGHT_BASE_RATIO(276),
    borderWidth: 2,
    borderColor: COLORS.LightBrown,
    borderRadius: 12,
    marginVertical: HEIGHT_BASE_RATIO(16),
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
});

export default styles;
