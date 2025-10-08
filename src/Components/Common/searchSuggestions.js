import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';
import * as SVGS from '../../Assets/svgs/index';
import {useDeleteSearchTermMutation} from '../../Apis/productApiCall';

const SearchSuggestions = ({item, text, onPress, style, handleRefetch}) => {
  const state = useSelector(state => state.auth);
  const userId = state?.user?.id;
  const [deleteSearchTerm, {isLoading: isDeleteLoading}] =
    useDeleteSearchTermMutation();

  const defaultWidth = WIDTH_BASE_RATIO(60);
  const maxWidth = WIDTH_BASE_RATIO(270);

  const textWidth = text.length * 8;
  const calculatedWidth = Math.min(
    Math.max(defaultWidth, textWidth + WIDTH_BASE_RATIO(40)),
    maxWidth,
  );
  const handleDelete = async id => {
    console.log('deleting', userId, id);
    const response = await deleteSearchTerm({userId, id});
    if (response?.data) {
      console.error('term deleted', response);
      handleRefetch();
    }
    if (response?.error) {
      console.error('Error Occured while deleting', response.error);
      handleRefetch();
    }
  };

  return (
    <Pressable
      style={[
        styles.buttonContainer,
        {width: calculatedWidth},
        {
          backgroundColor: state.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightGray,
        },
        style,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.buttonText,
          {color: state.darkTheme ? COLORS.LightGray : COLORS.Gray},
        ]}>
        {text}
      </Text>
      {isDeleteLoading ? (
        <ActivityIndicator size={15} color={COLORS.Brown} />
      ) : (
        <TouchableOpacity
          onPress={() => {
            handleDelete(item?.id);
          }}>
          <SVGS.cancel />
        </TouchableOpacity>
      )}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: WIDTH_BASE_RATIO(10),
    marginBottom: HEIGHT_BASE_RATIO(10),
    paddingHorizontal: WIDTH_BASE_RATIO(16),
    paddingVertical: HEIGHT_BASE_RATIO(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    ...FONTS.JakartaSansMedium_14,
    color: COLORS.Gray,
    marginRight: WIDTH_BASE_RATIO(5),
  },
});
export default SearchSuggestions;
