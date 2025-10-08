import {View, Text} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS} from '../../Constants';
import {
  handleLangChange,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../Utils/helpers';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import RayalSymbol from '../../Components/Common/rayalSymbol';
import RemoveButton from '../../Screens/Cart/Components/removeButton';
import AddButton from '../../Screens/Cart/Components/addButton';

const CheckoutProduct = ({item, state, refetch, variationId, variation}) => {
  function findVariationById(id, variations) {
    return variations.find(variation => variation?.id === id);
  }
  return (
    <View>
      <Text
        style={{
          ...FONTS.JakartaSans_Bold_16,
          color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
          alignSelf: state?.language == 'ar' ? 'flex-end' : 'baseline',
        }}>
        {handleLangChange(item?.vendor?.businessName, state?.language)}
      </Text>
      <View
        style={{
          width: '100%',
          paddingHorizontal: WIDTH_BASE_RATIO(16),
          paddingVertical: HEIGHT_BASE_RATIO(16),
          borderWidth: 1,
          borderRadius: 12,
          borderColor: state.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown,
          flexDirection: state?.language == 'ar' ? 'row-reverse' : 'row',
          marginTop: HEIGHT_BASE_RATIO(16),
        }}>
        <FastImage
          source={{uri: item?.images?.[0]}}
          style={{
            width: WIDTH_BASE_RATIO(105),
            height: HEIGHT_BASE_RATIO(144),
            marginBottom: HEIGHT_BASE_RATIO(36),
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
        <View
          style={{
            marginLeft: WIDTH_BASE_RATIO(12),
            flex: 1,
          }}>
          <Text
            style={{
              ...FONTS.JakartaSans_Bold_14,
              color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              width: WIDTH_BASE_RATIO(150),
            }}>
            {handleLangChange(item?.name, state?.language)}
          </Text>
          {/* Variations Section */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: HEIGHT_BASE_RATIO(10),
              marginBottom: HEIGHT_BASE_RATIO(20),
            }}>
            {variation &&
              variation.attributes &&
              Object.keys(variation.attributes).map(attrKey => {
                const attrValue = variation.attributes[attrKey];

                const displayValue = handleLangChange(
                  attrValue,
                  state?.language,
                );

                return (
                  <View
                    key={attrKey}
                    style={{
                      height: HEIGHT_BASE_RATIO(35),
                      backgroundColor: state.darkTheme
                        ? COLORS.DARK_BTN_BG
                        : COLORS.LightGray,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                      flexDirection: 'row',
                      marginRight: WIDTH_BASE_RATIO(10),
                      marginBottom: HEIGHT_BASE_RATIO(10),
                      paddingHorizontal: WIDTH_BASE_RATIO(16),
                    }}>
                    <Text
                      style={{
                        ...FONTS.JakartaSansMedium_12,
                        color: COLORS.Gray,
                      }}>
                      {`${
                        attrKey.charAt(0).toUpperCase() + attrKey.slice(1)
                      }: `}
                    </Text>
                    <Text
                      style={{
                        ...FONTS.JakartaSansMedium_12,
                        color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                      }}>
                      {displayValue}
                    </Text>
                  </View>
                );
              })}
          </View>

          {/* <AddButton product={item} refetch={refetch} /> */}
        </View>

        <View
          style={[
            GeneralStyles.rayalSymbol,
            {
              position: 'absolute',
              bottom: 0,
              right: WIDTH_BASE_RATIO(15),
              marginBottom: HEIGHT_BASE_RATIO(16),
            },
          ]}>
          <Text
            style={{
              ...FONTS.JakartaSans_Bold_18,
              color: COLORS.Brown,
            }}>
            {variation?.price !== null && Math.floor(variation?.price) !== 0
              ? Math.floor(variation?.price)
              : Math.floor(item?.fixedPrice)}
          </Text>
          <RayalSymbol />
        </View>

        {/* <RemoveButton itemId={item?.productId} refetchCart={refetch} /> */}
      </View>
    </View>
  );
};

export default CheckoutProduct;
