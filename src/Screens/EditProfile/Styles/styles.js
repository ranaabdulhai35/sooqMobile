import {Platform, StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {COLORS, FONTS} from '../../../Constants';

const styles = StyleSheet.create({
  imageContainer: {marginTop: HEIGHT_BASE_RATIO(50), alignSelf: 'center'},
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHT_BASE_RATIO(5),
    width: '100%',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  mainHeading: {
    ...FONTS.JakartaSans_Bold_18,
    color: COLORS.Brown,
    marginTop: HEIGHT_BASE_RATIO(12),
    alignSelf: 'center',
  },
  uploadPictureText: {
    ...FONTS.JakartaSansLight_14_Gray,
    color: COLORS.Gray,
    marginTop: HEIGHT_BASE_RATIO(24),
    alignSelf: 'center',
  },
  phoneInputContainer: {
    borderWidth: 0.5,
    borderRadius: Platform.OS === 'ios' ? 10 : 8,
    borderColor: COLORS.LightBrown,
    borderWidth: 2,
    borderRadius: 12,
    height: HEIGHT_BASE_RATIO(60),
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: HEIGHT_BASE_RATIO(5),
  },
  phoneInputTextContainer: {
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  bottomButton: {
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    zIndex: 9999,
    bottom: 0,
    alignSelf: 'center',
    paddingBottom: HEIGHT_BASE_RATIO(18),
  },
  fieldText: {
    ...FONTS.JakartaSans_Bold_14,
    color: COLORS.DARK,
    marginTop: HEIGHT_BASE_RATIO(8),
  },
  imageButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.LightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {width: 120, height: 120, borderRadius: 60},
  profileTxt: {
    ...FONTS.JakartaSans_Bold_16,
    color: COLORS.Brown,
    marginTop: HEIGHT_BASE_RATIO(16),
  },
  guide: {
    ...FONTS.JakartaSansLight_14_Gray,
    marginTop: HEIGHT_BASE_RATIO(24),
    marginBottom: HEIGHT_BASE_RATIO(26),
  },
  verticalGap: {
    marginTop: HEIGHT_BASE_RATIO(8),
  },
  heading: {
    ...FONTS.JakartaSans_24_Bold,
    marginTop: HEIGHT_BASE_RATIO(35),
    marginBottom: HEIGHT_BASE_RATIO(10),
    color: COLORS.BLACK,
  },
  rBSheetContainer: {
    height: HEIGHT_BASE_RATIO(390),
  },
  contentPadding: {
    paddingHorizontal: WIDTH_BASE_RATIO(10),
  },
  bottomSheetImageContainer: {
    marginTop: HEIGHT_BASE_RATIO(10),
    alignSelf: 'center',
  },
  flatListContainer: {rowGap: HEIGHT_BASE_RATIO(10), alignItems: 'center'},
  bottomSheetImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 7,
  },
  rBButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: HEIGHT_BASE_RATIO(30),
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
    marginTop: HEIGHT_BASE_RATIO(16),
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
