import {StyleSheet} from 'react-native';
import { HEIGHT_BASE_RATIO } from '../../../Utils/helpers';
const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchSuggestionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: HEIGHT_BASE_RATIO(16),
  },
});

export default styles;
