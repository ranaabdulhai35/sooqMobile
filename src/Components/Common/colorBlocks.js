import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  handleLangChange,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../Utils/helpers';
import {useSelector} from 'react-redux';
import {COLORS} from '../../Constants';

const ColorBlocks = ({colors, selected, handleSelect}) => {
  const {language, darkTheme} = useSelector(state => state.auth); // Assuming language state exists
  const state = useSelector(state => state.auth);
  const colorsArray = [
    {name: {en: 'Red', ar: 'أحمر'}, code: '#FF0000'},
    {name: {en: 'Blue', ar: 'أزرق'}, code: '#0000FF'},
    {name: {en: 'Green', ar: 'أخضر'}, code: '#008000'},
    {name: {en: 'Black', ar: 'أسود'}, code: '#000000'},
    {name: {en: 'White', ar: 'أبيض'}, code: '#FFFFFF'},
    {name: {en: 'Yellow', ar: 'أصفر'}, code: '#FFFF00'},
    {name: {en: 'Orange', ar: 'برتقالي'}, code: '#FFA500'},
    {name: {en: 'Purple', ar: 'أرجواني'}, code: '#800080'},
    {name: {en: 'Pink', ar: 'وردي'}, code: '#FFC0CB'},
    {name: {en: 'Brown', ar: 'بني'}, code: '#A52A2A'},
    {name: {en: 'Gray', ar: 'رمادي'}, code: '#808080'},
    {name: {en: 'Cyan', ar: 'سماوي'}, code: '#00FFFF'},
    {name: {en: 'Magenta', ar: 'أرجواني محمر'}, code: '#FF00FF'},
    {name: {en: 'Gold', ar: 'ذهبي'}, code: '#FFD700'},
    {name: {en: 'Silver', ar: 'فضي'}, code: '#C0C0C0'},
    {name: {en: 'Beige', ar: 'بيج'}, code: '#F5F5DC'},
    {name: {en: 'Navy', ar: 'كحلي'}, code: '#000080'},
    {name: {en: 'Teal', ar: 'تركوازي'}, code: '#008080'},
    {name: {en: 'Olive', ar: 'زيتي'}, code: '#808000'},
    {name: {en: 'Maroon', ar: 'خمري'}, code: '#800000'},
    {name: {en: 'Mint', ar: 'نعناعي'}, code: '#98FF98'},
    {name: {en: 'Coral', ar: 'مرجاني'}, code: '#FF7F50'},
    {name: {en: 'Lavender', ar: 'أرجواني فاتح'}, code: '#E6E6FA'},
  ];

  const findColorByCode = name => {
    return colorsArray.find(
      color =>
        color.name.en.toLowerCase() === name.toLowerCase() ||
        color.name.ar.toLowerCase() === name.toLowerCase(),
    );
  };

  const colorName = colors?.code; // Get the correct language name
  const matchedColor = findColorByCode(colorName);

  return (
    <TouchableOpacity
      onPress={() => handleSelect(colors.code)}
      style={{
        backgroundColor: matchedColor?.code || '#000',
        width:
          selected === colors?.code
            ? WIDTH_BASE_RATIO(44)
            : WIDTH_BASE_RATIO(36),
        height:
          selected === colors?.code
            ? HEIGHT_BASE_RATIO(46)
            : HEIGHT_BASE_RATIO(40),
        marginRight: WIDTH_BASE_RATIO(12),
        borderRadius: 8,
        borderColor: darkTheme ? COLORS.DARK_BTN_BG : COLORS.Brown,
        borderWidth: 1,
      }}
    />
  );
};

export default ColorBlocks;
