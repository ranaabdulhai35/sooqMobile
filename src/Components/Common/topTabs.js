import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';

const TopTabs = ({marginTop, tabs, selectedTab, onPress}) => {
  const state = useSelector(state => state.auth);

  return (
    <View
      style={{
        width: '100%',
        height: HEIGHT_BASE_RATIO(60),
        borderWidth: 2,
        borderColor: state.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown,
        borderRadius: 10,
        marginTop: marginTop,
        paddingHorizontal: WIDTH_BASE_RATIO(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {tabs?.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onPress(item);
            }}
            style={{
              width: '50%',
              height: HEIGHT_BASE_RATIO(50),
              borderRadius: 10,
              backgroundColor:
                selectedTab == item ? COLORS.Brown : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...FONTS.JakartaSans_Bold_14,
                color:
                  selectedTab == item
                    ? COLORS.WHITE
                    : state.darkTheme
                    ? COLORS.WHITE
                    : COLORS.DARK,
              }}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TopTabs;
