import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS} from '../../Constants';

const SelectCircle = ({selected, handleSelect, method}) => {
  return (
    <TouchableOpacity
      style={{
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: selected ? COLORS.Brown : COLORS.LightBrown,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => {
        handleSelect(method);
      }}>
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: selected ? COLORS.Brown : 'transparent',
        }}></View>
    </TouchableOpacity>
  );
};

export default SelectCircle;
