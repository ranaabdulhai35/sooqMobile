import {StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {COLORS, FONTS} from '../../../Constants';

const styles = StyleSheet.create({
  items: {
    ...FONTS.JakartaSans_Bold_18,
    color: COLORS.DARK,
    marginTop: HEIGHT_BASE_RATIO(24),
  },
  bottomButtonContainer: {
    width: '100%',
    // height: HEIGHT_BASE_RATIO(290),
    paddingHorizontal: WIDTH_BASE_RATIO(16),
    paddingVertical: HEIGHT_BASE_RATIO(16),
    position: 'absolute',
    zIndex: 11111,
    bottom: 0,
    backgroundColor: COLORS.WHITE,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.LightBrown,
    marginVertical: HEIGHT_BASE_RATIO(16),
  },
  summaryTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHT_BASE_RATIO(16),
  },
});

export default styles;
