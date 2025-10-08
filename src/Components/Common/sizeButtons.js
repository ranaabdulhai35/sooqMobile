import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  handleLangChange,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../Utils/helpers';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';

const SizeButtons = ({sizes, selected, handleSelect}) => {
  const state = useSelector(state => state?.auth);
  const language = state?.language || 'en'; // Assuming language is stored in Redux

  const defaultWidth = WIDTH_BASE_RATIO(74);
  const maxWidth = WIDTH_BASE_RATIO(270);

  // Calculate the width based on the text length
  const calculateWidth = text => {
    const textWidth = text.length * 8; // Assuming an average character width
    return Math.min(
      Math.max(defaultWidth, textWidth + WIDTH_BASE_RATIO(52)),
      maxWidth,
    );
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {sizes?.map(item => {
        const sizeName = item?.name?.[language] || item?.name?.en; // Get name based on language
        return (
          <TouchableOpacity
            key={item?.code}
            onPress={() => handleSelect(item?.code)}
            style={{
              width: calculateWidth(sizeName),
              height: HEIGHT_BASE_RATIO(50),
              marginRight: WIDTH_BASE_RATIO(8),
              borderColor: COLORS.LightBrown,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                item.code === selected ? COLORS.Brown : 'transparent',
              paddingHorizontal: WIDTH_BASE_RATIO(8),
            }}>
            <Text
              style={{
                ...FONTS.JakartaSans_Regular_14,
                color: state.darkTheme ? COLORS.LightBrown : COLORS.DARK,
              }}>
              {sizeName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SizeButtons;
