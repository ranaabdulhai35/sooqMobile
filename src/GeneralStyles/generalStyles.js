import {COLORS} from '../Constants';
import {WIDTH_BASE_RATIO, HEIGHT_BASE_RATIO} from '../Utils/helpers';
const {StyleSheet} = require('react-native');

export const GeneralStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rayalSymbol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WIDTH_BASE_RATIO(5),
  },
  containerTopPadding: {paddingTop: HEIGHT_BASE_RATIO(8)},
  backButton: {
    marginLeft: WIDTH_BASE_RATIO(20),
    marginTop: HEIGHT_BASE_RATIO(34),
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: HEIGHT_BASE_RATIO(30),
  },
  errorStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: HEIGHT_BASE_RATIO(2),
    width: WIDTH_BASE_RATIO(348),
  },
  generalPadding: {
    paddingHorizontal: WIDTH_BASE_RATIO(20),
  },
  line: {
    backgroundColor: COLORS.BORDER,
    height: 1.5,
    borderRadius: 10,
    width: WIDTH_BASE_RATIO(160),
  },
  generalPaddingHomeStack: {
    paddingHorizontal: WIDTH_BASE_RATIO(16),
  },
  langButton: {
    width: WIDTH_BASE_RATIO(60),
    height: HEIGHT_BASE_RATIO(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
