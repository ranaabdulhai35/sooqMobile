import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../../Constants';
import * as Images from '../../../Assets/Images/index';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import QuantityButtons from '../../../Components/Common/quantityButtons';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import * as SVGS from '../../../Assets/svgs/index';
import {
  useAddToCartMutation,
  useSubtractFromCartMutation,
} from '../../../Apis/cartApiCall';

const AddButton = ({product, refetch}) => {
  const state = useSelector(state => state.auth);
  const [addToCart, {isAddLoading}] = useAddToCartMutation();
  const [subtractFromCart, {isSubtractLoading}] = useSubtractFromCartMutation();
  const handleAddToCart = async product => {
    const data = JSON.stringify({
      userId: state?.user?.id,
      productId: product?.productId,
      variationId: product?.variation?.variationId,
      quantity: product?.quantity + 1,
    });
    const response = await addToCart({data});
    console.log('payload', data);
    console.log('variation', product?.variation);

    if (response.data) {
      refetch();
    }
    if (response.error) {
      Alert.alert('Error occured while adding to cart');
      console.error('error occured while adding to cart', response.error);
    }
  };
  const handleSubtractFromCart = async product => {
    const data = JSON.stringify({
      userId: state?.user?.id,
      productId: product?.productId,
      variationId: product?.variation?.variationId,
    });
    const response = await subtractFromCart({data});
    console.log('payload', data);
    console.log('variation', product?.variation);

    if (response.data) {
      console.log('response from subtract api', response?.data);
      refetch();
    }
    if (response.error) {
      Alert.alert('Error occured while subtracting from to cart');
      console.error('error occured while adding to cart', response.error);
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: HEIGHT_BASE_RATIO(24),
      }}>
      <TouchableOpacity
        onPress={() => {
          !isAddLoading && handleAddToCart(product);
        }}
        style={[
          {
            width: WIDTH_BASE_RATIO(44),
            height: HEIGHT_BASE_RATIO(52),
            borderRadius: 10,
            borderWidth: 1,
            borderColor: COLORS.LightGray,
            alignItems: 'center',
            justifyContent: 'center',
          },
          {
            borderColor: state?.darkTheme
              ? COLORS.DARK_BTN_BG
              : COLORS.LightGray,
          },
        ]}>
        {isAddLoading ? (
          <ActivityIndicator size={'small'} color={COLORS.Brown} />
        ) : (
          <SVGS.plus />
        )}
      </TouchableOpacity>
      <Text
        style={{
          ...FONTS.JakartaSans_Bold_16,
          color: state?.darkTheme ? COLORS.LightGray : COLORS.DARK,
          width: WIDTH_BASE_RATIO(50),
          textAlign: 'center',
        }}>
        {product?.quantity}
      </Text>
      <TouchableOpacity
        onPress={() => {
          !isSubtractLoading && handleSubtractFromCart(product);
        }}
        style={[
          {
            width: WIDTH_BASE_RATIO(44),
            height: HEIGHT_BASE_RATIO(52),
            borderRadius: 10,
            borderWidth: 1,
            borderColor: COLORS.LightGray,
            alignItems: 'center',
            justifyContent: 'center',
          },
          {
            borderColor: state?.darkTheme
              ? COLORS.DARK_BTN_BG
              : COLORS.LightGray,
          },
        ]}>
        {isSubtractLoading ? (
          <ActivityIndicator size={'small'} color={COLORS.Brown} />
        ) : (
          <SVGS.minus />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddButton;
