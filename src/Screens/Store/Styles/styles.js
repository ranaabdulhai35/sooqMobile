import {StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {COLORS, FONTS} from '../../../Constants';

const styles = StyleSheet.create({
  header: {
    paddingBottom: HEIGHT_BASE_RATIO(20),
    borderBottomWidth: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starStyle: {
    width: WIDTH_BASE_RATIO(3),
    height: HEIGHT_BASE_RATIO(11),
  },
  ratingsText: {
    marginLeft: WIDTH_BASE_RATIO(10),
  },
  imageBackground: {
    width: '100%',
    height: HEIGHT_BASE_RATIO(200),
    marginTop: HEIGHT_BASE_RATIO(16),
  },
  storeName: {
    ...FONTS.JakartaSans_24_Bold,
    color: COLORS.WHITE,
    marginTop: HEIGHT_BASE_RATIO(115),
    marginLeft: WIDTH_BASE_RATIO(24),
  },
  storeInfoContainer: {
    marginTop: HEIGHT_BASE_RATIO(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WIDTH_BASE_RATIO(24),
  },
  productsText: {
    marginTop: HEIGHT_BASE_RATIO(32),
    marginBottom: HEIGHT_BASE_RATIO(12),
  },
});

export default styles;
