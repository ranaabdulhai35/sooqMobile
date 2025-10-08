import {StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {COLORS, FONTS} from '../../../Constants';

const styles = StyleSheet.create({
  postImageStyle: {
    height: HEIGHT_BASE_RATIO(277),
    resizeMode: 'cover',
  },
  imagesWrapper: {marginTop: HEIGHT_BASE_RATIO(16)},
  imageContainer: {
    alignItems: 'center',
    marginRight: WIDTH_BASE_RATIO(8),
  },
  postWrapper: {marginTop: HEIGHT_BASE_RATIO(24)},

  image: {
    width: WIDTH_BASE_RATIO(80),
    height: HEIGHT_BASE_RATIO(90),
    borderRadius: 10,
  },
  productNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: HEIGHT_BASE_RATIO(16),
  },
  descriptionText: {
    ...FONTS.JakartaSansLight_14_Gray,
    lineHeight: 20,
    letterSpacing: 0.15,
    color: COLORS.DARK,
    marginTop: HEIGHT_BASE_RATIO(12),
  },
  reviewsTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: HEIGHT_BASE_RATIO(24),
  },
  colorsContainer: {
    flexDirection: 'row',
    marginTop: HEIGHT_BASE_RATIO(10),
  },
});

export default styles;
