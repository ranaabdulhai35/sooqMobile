import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {COLORS, FONTS} from '../../../Constants';
import {useRemoveFromCartMutation} from '../../../Apis/cartApiCall';
import {useDispatch, useSelector} from 'react-redux';
import {AuthSlice} from '../../../Redux/slice';

const RemoveButton = ({itemId, refetchCart}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.auth);
  const userId = state?.user?.id;
  const [removeProduct, {isLoading, isSuccess}] = useRemoveFromCartMutation();
  const handleDelete = async () => {
    const response = await removeProduct({userId, itemId});
    if (response.data) {
      Alert.alert('Product Deleted');
      refetchCart();
      console.log('deleted successfully', response.data);
      dispatch(AuthSlice.actions.setCartItems(state?.cartItems - 1));
    }
    if (response.error) {
      Alert.alert("Could'nt delete the product");
      console.log('error occured in deleting the product', response.error);
    }
  };
  const handleOnPress = () => {
    Alert.alert('Are you sure', 'Do you really want to delete this product?', [
      {
        text: 'Cancel',
        onPress: () => console.log("user don't want to delete the product"),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => handleDelete(),
      },
    ]);
  };
  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          size={'small'}
          color={COLORS.Brown}
          style={{
            position: 'absolute',
            top: 0,
            right: WIDTH_BASE_RATIO(15),
            marginTop: HEIGHT_BASE_RATIO(10),
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={() => handleOnPress()}
          style={{
            position: 'absolute',
            top: 0,
            right: state?.language == 'ar' ? null : WIDTH_BASE_RATIO(15),
            left: state?.language == 'ar' ? WIDTH_BASE_RATIO(15) : null,
            marginTop: HEIGHT_BASE_RATIO(10),
            width: WIDTH_BASE_RATIO(60),
            height: HEIGHT_BASE_RATIO(30),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...FONTS.JakartaSansLight_14_Gray,
              color: COLORS.RED,
            }}>
            Remove
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default RemoveButton;
