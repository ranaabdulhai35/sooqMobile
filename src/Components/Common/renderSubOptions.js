import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';

const RenderSubOptions = ({
  marginTop,
  subOptions,
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
        }}>
        {subOptions?.map(item => {
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: WIDTH_BASE_RATIO(10),
              }}>
              <TouchableOpacity
                onPress={() => {
                  buttonPress(item);
                }}>
                <Text
                  style={[
                    FONTS.JakartaSansMedium_14,
                    {
                      color:
                        currentSubOption?.name == item?.name
                          ? COLORS.Brown
                          : COLORS.Gray,
                    },
                  ]}>
                  {item?.name}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: '99%',
                  height: HEIGHT_BASE_RATIO(6),
                  backgroundColor:
                    currentSubOption?.name == item?.name
                      ? COLORS.Brown
                      : 'transparent',
                  marginTop: HEIGHT_BASE_RATIO(6),
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}></View>
            </View>
          );
        })}
      </ScrollView>
      <View
        style={{
          width: '100%',
          height: 2,
          backgroundColor: state.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}></View>
    </View>
  );
};

export default RenderSubOptions;
