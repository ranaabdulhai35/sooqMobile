import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {URL} from 'react-native-url-polyfill'; // for parsing URL in React Native
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {useCreateOrderMutation} from '../../../Apis/orderApiCall';
import {AuthSlice} from '../../../Redux/slice';

const PaymentScreen = ({route}) => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const {invoiceUrl} = route.params;

  const [createOrderApi, {isLoading}] = useCreateOrderMutation();

  const handleWebViewNavigationStateChange = async navState => {
    const {url} = navState;

    if (url.includes('/PayInvoice/Result?paymentId=')) {
      const parsedUrl = new URL(url);
      const paymentId = parsedUrl.searchParams.get('paymentId');

      confirmPayment(paymentId);
    }
  };
  const confirmPayment = async paymentId => {
    try {
      const data = JSON.stringify({Key: paymentId, KeyType: 'PaymentId'});
      const response = await axios.post(
        'https://apitest.myfatoorah.com/v2/GetPaymentStatus',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL`,
          },
        },
      );
      if (response.data?.Data?.InvoiceStatus == 'Paid') {
        createOrder();
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
      return false;
    }
  };
  const createOrder = async () => {
    const data = {...route?.params?.orderData};
    console.log('data in create order', data);
    const response = await createOrderApi({data});
    if (response?.data) {
      console.log('order created', response?.data);
      route.params?.method !== 'buy' &&
        dispatch(
          AuthSlice.actions.setCartItems(
            state?.cartItems - route.params?.itemsInCart,
          ),
        );

      navigation.navigate('Success', {
        text: 'Order Created Successfully',
      });
    }
    // navigation.navigate('CheckoutPayment', {
    //   text: 'Order Created Successfully',
    // });
    if (response?.error) {
      console.error('error occured creating order', response?.error);
      // Alert.alert('Sorry, An error occured', response?.error?.data?.message);
      if (response?.error?.status == 400) {
        Alert.alert('Sorry!', response.error.data.message);
        navigation.navigate('BottomTabBar');
      }
    }
  };
  return (
    <WebView
      source={{uri: invoiceUrl}}
      onNavigationStateChange={handleWebViewNavigationStateChange}
      startInLoadingState
      renderLoading={() => <ActivityIndicator size="large" />}
    />
  );
};

export default PaymentScreen;
