import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {COLORS, FONTS} from '../../../Constants';
import {useSelector} from 'react-redux';

const RenderButtons = ({item, selected, onPress}) => {
  const state = useSelector(state => state.auth);
  const defaultWidth = WIDTH_BASE_RATIO(74);
  const maxWidth = WIDTH_BASE_RATIO(270);
  // Calculate the width based on the length of the text
  const textWidth = item?.name?.length * 8; // Assuming 8 is an average character width
  const calculatedWidth = Math.min(
    Math.max(defaultWidth, textWidth + WIDTH_BASE_RATIO(32)), // Minimum width is defaultWidth
    maxWidth, // Maximum width is maxWidth
  ); 
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(item);
      }}
      style={{
        width: calculatedWidth,
        height: HEIGHT_BASE_RATIO(40),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 8,
        borderColor:
          selected?.id == item?.id
            ? COLORS.Brown
            : state.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightGray,
        backgroundColor:
          selected?.id == item?.id ? COLORS.Brown : 'transparent',
      }}>
      <Text
        style={{
          ...FONTS.JakartaSansMedium_14,
          color: selected?.id == item?.id ? COLORS.WHITE : COLORS.Gray,
        }}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );
};

export default RenderButtons;
