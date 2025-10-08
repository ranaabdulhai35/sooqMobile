import {View, Text, Image} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../../../Constants';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../../Utils/helpers';
import QuantityButtons from '../../../../Components/Common/quantityButtons';
import {GeneralStyles} from '../../../../GeneralStyles/generalStyles';
import RayalSymbol from '../../../../Components/Common/rayalSymbol';

const AddedProducts = ({item, state}) => {
  return (
    <View>
      <Text
        style={{
          ...FONTS.JakartaSans_Bold_16,
          color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
        }}>
        {item?.store?.name}
      </Text>
      <View
        style={{
          width: '100%',
          paddingHorizontal: WIDTH_BASE_RATIO(16),
          paddingVertical: HEIGHT_BASE_RATIO(16),
          borderWidth: 1,
          borderRadius: 12,
          borderColor: state.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown,
          flexDirection: 'row',
          marginTop: HEIGHT_BASE_RATIO(16),
        }}>
        <Image
          source={item?.item?.image}
          style={{
            width: WIDTH_BASE_RATIO(105),
            height: HEIGHT_BASE_RATIO(144),
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
        <View style={{marginLeft: WIDTH_BASE_RATIO(12)}}>
          <Text
            style={{
              ...FONTS.JakartaSans_Bold_14,
              color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
            }}>
            {item?.item?.name}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: WIDTH_BASE_RATIO(87),
                height: HEIGHT_BASE_RATIO(35),
                backgroundColor: state.darkTheme
                  ? COLORS.DARK_BTN_BG
                  : COLORS.LightGray,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                flexDirection: 'row',
                marginTop: HEIGHT_BASE_RATIO(10),
              }}>
              <Text style={{...FONTS.JakartaSansMedium_12, color: COLORS.Gray}}>
                Size :
              </Text>
              <Text
                style={{
                  ...FONTS.JakartaSansMedium_12,
                  color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                }}>
                {item?.item?.size}
              </Text>
            </View>
            <View
              style={{
                width: WIDTH_BASE_RATIO(87),
                height: HEIGHT_BASE_RATIO(35),
                backgroundColor: state.darkTheme
                  ? COLORS.DARK_BTN_BG
                  : COLORS.LightGray,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                flexDirection: 'row',
                marginTop: HEIGHT_BASE_RATIO(10),
                marginLeft: HEIGHT_BASE_RATIO(10),
              }}>
              <Text style={{...FONTS.JakartaSansMedium_12, color: COLORS.Gray}}>
                Color :
              </Text>
              <Text
                style={{
                  ...FONTS.JakartaSansMedium_12,
                  color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                }}>
                {item?.item?.color}
              </Text>
            </View>
          </View>
          <View style={{marginTop: HEIGHT_BASE_RATIO(24)}}>
            <QuantityButtons />
          </View>
        </View>
        <View style={GeneralStyles.rayalSymbol}>
          <Text
            style={{
              ...FONTS.JakartaSans_Bold_18,
              color: COLORS.Brown,
              position: 'absolute',
              top: HEIGHT_BASE_RATIO(135),
              right: WIDTH_BASE_RATIO(15),
            }}>
            {item?.item?.price}
          </Text>
          <RayalSymbol />
        </View>
      </View>
    </View>
  );
};

export default AddedProducts;
