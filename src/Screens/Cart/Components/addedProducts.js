import {View, Text} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS} from '../../../Constants';
import {
  handleLangChange,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../Utils/helpers';
import AddButton from './addButton';
import RemoveButton from './removeButton';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
import RayalSymbol from '../../../Components/Common/rayalSymbol';

const AddedProducts = ({item, state, refetch, screen}) => {
  return (
    <View>
      <Text
        style={{
          ...FONTS.JakartaSans_Bold_16,
          color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
          alignSelf: state?.language == 'ar' ? 'flex-end' : 'baseline',
        }}>
        {handleLangChange(item?.vendor, state?.language)}
      </Text>
      {item?.items?.map((product, index) => (
        <View
          key={index}
          style={{
            width: '100%',
            paddingHorizontal: WIDTH_BASE_RATIO(16),
            paddingVertical: HEIGHT_BASE_RATIO(16),
            borderWidth: 1,
            borderRadius: 12,
            borderColor: state.darkTheme
              ? COLORS.DARK_BTN_BG
              : COLORS.LightBrown,
            flexDirection: state?.language == 'ar' ? 'row-reverse' : 'row',
            marginTop: HEIGHT_BASE_RATIO(16),
          }}>
          <FastImage
            source={{uri: product?.productImg[0]}}
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
                alignSelf: state?.language == 'ar' ? 'flex-end' : 'baseline',
              }}>
              {handleLangChange(product?.product, state?.language)}
            </Text>
            {/* Variations Section */}
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: HEIGHT_BASE_RATIO(10),
              }}>
              {['color', 'size', 'length', 'weight'].map(key =>
                product?.variation?.[key] ? (
                  <View
                    key={key}
                    style={{
                      // width: WIDTH_BASE_RATIO(87),
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
                      {`${key.charAt(0).toUpperCase() + key.slice(1)}: `}
                    </Text>
                    <Text
                      style={{
                        ...FONTS.JakartaSansMedium_12,
                        color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                      }}>
                      {handleLangChange(
                        product.variation[key],
                        state?.language,
                      )}
                    </Text>
                  </View>
                ) : null,
              )}
            </View>
            {screen == 'Cart' && (
              <AddButton product={product} refetch={refetch} />
            )}
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
              {Math.floor(product?.price)}
            </Text>
            <RayalSymbol />
          </View>
          {screen == 'Cart' && (
            <RemoveButton itemId={product?.itemId} refetchCart={refetch} />
          )}
        </View>
      ))}
    </View>
  );
};

export default AddedProducts;
