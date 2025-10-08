import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../Constants';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';

const styles = StyleSheet.create({
  mainHeading: {
    ...FONTS.JakartaSans_24_Bold,
    alignSelf: 'center',
    marginTop: HEIGHT_BASE_RATIO(16),
  },
  starStyle: {
    width: WIDTH_BASE_RATIO(45),
    height: HEIGHT_BASE_RATIO(41),
  },
  starRatingContainer: {
    alignItems: 'center',
    marginTop: HEIGHT_BASE_RATIO(12),
  },
  galleryBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: HEIGHT_BASE_RATIO(20),
    borderRadius: 10,
    flexDirection: 'row',
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
  submitButtonText: {
    ...FONTS.JakartaSans_Bold_16,
    marginLeft: WIDTH_BASE_RATIO(8),
    color: COLORS.Gray,
  },
  imageStyle: {
    width: WIDTH_BASE_RATIO(100),
    height: HEIGHT_BASE_RATIO(120),
    alignItems: 'flex-end',
    paddingHorizontal: WIDTH_BASE_RATIO(8),
    paddingVertical: HEIGHT_BASE_RATIO(8),
  },
  imageContainer: {
    marginTop: HEIGHT_BASE_RATIO(20),
    marginBottom: HEIGHT_BASE_RATIO(90),
  },
});

export default styles;
