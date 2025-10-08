import {StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../../Utils/helpers';
import {COLORS} from '../../../../Constants';

const styles = StyleSheet.create({
  methodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: HEIGHT_BASE_RATIO(15),
  },
  method: {
    width: WIDTH_BASE_RATIO(175),
    height: HEIGHT_BASE_RATIO(60),
    borderWidth: 2,
    borderColor: COLORS.LightBrown,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: WIDTH_BASE_RATIO(16),
    paddingVertical: HEIGHT_BASE_RATIO(16),
    gap: WIDTH_BASE_RATIO(16),
  },
  visaMethod: {
    width: '100%',
    height: HEIGHT_BASE_RATIO(60),
    borderWidth: 2,
    borderColor: COLORS.LightBrown,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: WIDTH_BASE_RATIO(16),
    paddingVertical: HEIGHT_BASE_RATIO(16),
    gap: WIDTH_BASE_RATIO(16),
    marginTop: HEIGHT_BASE_RATIO(16),
  },
  visaMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: WIDTH_BASE_RATIO(16),
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
