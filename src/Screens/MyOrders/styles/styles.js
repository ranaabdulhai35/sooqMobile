import {StyleSheet} from 'react-native';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../Utils/helpers';
import {COLORS} from '../../../Constants';

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
  heading: {
    marginTop: HEIGHT_BASE_RATIO(24),
    marginBottom: HEIGHT_BASE_RATIO(10),
  },
});

export default styles;
