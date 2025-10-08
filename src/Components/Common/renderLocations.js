import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../Utils/helpers';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';

const RenderLocations = ({
  marginTop,
  locations,
  buttonPress,
  currentSubOption,
}) => {
  const state = useSelector(state => state.auth);

  return (
    <View>
      <ScrollView
        horizontal={true}
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: marginTop,
          paddingHorizontal: WIDTH_BASE_RATIO(32),
          alignItems: 'center',
        }}>
        {locations?.map(item => {
          return (
            // <View
            //   style={{
            //     alignItems: 'center',
            //     justifyContent: 'center',
            //     marginRight: WIDTH_BASE_RATIO(10),
            //   }}>
            <TouchableOpacity
              style={{
                marginRight: WIDTH_BASE_RATIO(10),
                padding: FONT_SIZE(15),
                backgroundColor:
                  currentSubOption?.name[state.language] ==
                  item?.name[state.language]
                    ? COLORS.Brown
                    : state.darkTheme
                    ? COLORS.DARK
                    : COLORS.LightGray,
                borderRadius: 10,
              }}
              onPress={() => {
                buttonPress(item);
              }}>
              <Text
                style={[
                  FONTS.JakartaSansMedium_14,
                  {
                    color:
                      currentSubOption?.name[state.language] ==
                      item?.name[state.language]
                        ? COLORS.WHITE
                        : state.darkTheme
                        ? COLORS.WHITE
                        : COLORS.DARK,
                  },
                ]}>
                {item?.name[state.language]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View
        style={{
          width: '100%',
          height: 2,
          marginTop: HEIGHT_BASE_RATIO(15),
          backgroundColor: state.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}></View>
    </View>
  );
};

export default RenderLocations;
