import {View, Text, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';

const RenderOptions = ({marginTop, options, buttonPress, selected}) => {
  const state = useSelector(state => state.auth);

  return (
    <ScrollView
      horizontal={true}
      style={{
        borderWidth: 1,
        borderColor: state.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown,
        borderRadius: 10,
        height: HEIGHT_BASE_RATIO(60),
        width: '100%',

        alignSelf: 'center',
        marginTop: marginTop,
      }}
      contentContainerStyle={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: WIDTH_BASE_RATIO(8),

      }}>
      {options?.map((item, index) => {
        return (
          <TouchableOpacity
            style={{
              height: HEIGHT_BASE_RATIO(50),
              borderRadius: 8,
              backgroundColor:
                selected?.name == item?.name ? COLORS.Brown : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: WIDTH_BASE_RATIO(16),
            }}
            key={index}
            onPress={() => {
              buttonPress(item);
            }}>
            <Text
              style={{
                ...FONTS.JakartaSansMedium_14,
                color:
                  selected?.name == item?.name
                    ? COLORS.WHITE
                    : state.darkTheme
                    ? COLORS.LightGray
                    : COLORS.DARK,
              }}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default RenderOptions;
