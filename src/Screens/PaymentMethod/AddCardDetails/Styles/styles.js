import {StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../../Utils/helpers';
import { COLORS } from '../../../../Constants';

const styles = StyleSheet.create({
  bottomFieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: HEIGHT_BASE_RATIO(10),
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
});

export default styles;
