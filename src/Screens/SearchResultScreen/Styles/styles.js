import {StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {COLORS} from '../../../Constants';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: HEIGHT_BASE_RATIO(20),
    ...GeneralStyles.generalPaddingHomeStack,
  },
  searchSuggestionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: HEIGHT_BASE_RATIO(16),
  },
});

export default styles;
