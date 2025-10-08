import {StyleSheet} from 'react-native';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../Utils/helpers';
import {COLORS, FONTS} from '../../../Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  viewPosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  subOptionHeading: {
    marginTop: HEIGHT_BASE_RATIO(24),
    color: COLORS.DARK,
    ...FONTS.JakartaSans_Bold_16,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
    marginTop: HEIGHT_BASE_RATIO(16),
  },
  emptyComponent: {
    alignSelf: 'center',
    marginTop: HEIGHT_BASE_RATIO(30),
  },
});

export default styles;
