import {StyleSheet} from 'react-native';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../Utils/helpers';
import {COLORS, FONTS} from '../../../Constants';

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: HEIGHT_BASE_RATIO(16),
    paddingBottom: HEIGHT_BASE_RATIO(60),
  },
  profileInfo: {
    width: '100%',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.LightBrown,
    paddingHorizontal: WIDTH_BASE_RATIO(16),
    paddingVertical: HEIGHT_BASE_RATIO(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {width: 68, height: 68, borderRadius: 34},
  nameAndEmailContainer: {
    flexDirection: 'column',
    marginLeft: WIDTH_BASE_RATIO(12),
  },
  editButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: WIDTH_BASE_RATIO(30),
    height: HEIGHT_BASE_RATIO(30),
    marginTop: HEIGHT_BASE_RATIO(16),
    marginRight: HEIGHT_BASE_RATIO(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchContainerStyle: {
    width: WIDTH_BASE_RATIO(51),
    height: HEIGHT_BASE_RATIO(35),
    borderRadius: 16,
    padding: 5,
  },
  circleStyle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  settingOptionContainer: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.LightBrown,
    borderRadius: 15,
    paddingHorizontal: WIDTH_BASE_RATIO(16),
    paddingVertical: HEIGHT_BASE_RATIO(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHT_BASE_RATIO(16),
  },
  iconNameContainer: {flexDirection: 'row', alignItems: 'center'},
  userEmail: {
    ...FONTS.JakartaSans_Regular_16,
    marginTop: HEIGHT_BASE_RATIO(8),
    width: WIDTH_BASE_RATIO(200),
  },
  userName: {
    ...FONTS.JakartaSans_Bold_18,
    width: WIDTH_BASE_RATIO(150),
  },
});

export default styles;
