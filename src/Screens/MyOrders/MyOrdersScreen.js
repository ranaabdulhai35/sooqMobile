import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';
import {HEIGHT_BASE_RATIO} from '../../Utils/helpers';
import Header from '../../Components/Common/header';
import TopTabs from '../../Components/Common/topTabs';
import UpComingOrder from './Components/upComingOrder';
import * as Images from '../../Assets/Images/index';
import {useTranslation} from 'react-i18next';
import {
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
} from '../../Apis/orderApiCall';
import {useFocusEffect} from '@react-navigation/native';
import styles from './styles/styles';
import {getSocket} from '../../Utils/socket';

const MyOrdersScreen = () => {
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();
  const {id} = state?.user;
  const socket = getSocket();
  const statuses = {process: 'process', history: 'history'};
  const tabs = [t('upcoming'), t('history')];
  const limit = 10;

  const [
    triggerGetOrders,
    {data: ordersData, isError: isOrdersError, isFetching: isOrdersFetching},
  ] = useLazyGetOrdersQuery({id});

  const [selectedTab, setSelectedTab] = useState(t('upcoming'));
  const [orders, setOrders] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statusParam, setStatusParam] = useState(statuses.process);
  const [page, setPage] = useState(1);

  const handleTabChange = (item, langChanged = false, statusParam) => {
    setSelectedTab(item);
    setOrders([]);
    setPage(1);
    setStatusParam(item == t('upcoming') ? statuses.process : statuses.history);
    if (langChanged) {
      triggerGetOrders({id, statusParam, page, limit});
    }
  };
  const handleLoadMore = async () => {
    if (!isOrdersFetching && page < ordersData?.totalPages) {
      setPage(prev => prev + 1);
    }
  };
  const handleOrders = () => {
    if (ordersData) {
      page > 1
        ? setOrders(prevList => [...prevList, ...ordersData?.orders])
        : setOrders(ordersData?.orders);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    triggerGetOrders({id, statusParam});
    setRefreshing(false);
  };
  const refetchOnNotification = () => {
    socket.on('notification', data => {
      triggerGetOrders({id, statusParam});
    });
  };
  useEffect(() => {
    handleOrders();
    refetchOnNotification();
  }, [ordersData]);
  useEffect(() => {
    handleTabChange(tabs[0], (langChanged = true), statuses.process);
  }, [state?.language]);
  useFocusEffect(
    useCallback(() => {
      triggerGetOrders({id, statusParam, page, limit});
    }, [id, statusParam, page]),
  );
  return (
    <View
      style={[
        GeneralStyles.container,
        GeneralStyles.containerTopPadding,
        state?.darkTheme
          ? {backgroundColor: COLORS.DARK}
          : {backgroundColor: COLORS.WHITE},
      ]}>
      <Header
        backgroundColor={
          state?.darkTheme
            ? {backgroundColor: COLORS.DARK}
            : {backgroundColor: COLORS.WHITE}
        }
        style={{
          paddingBottom: HEIGHT_BASE_RATIO(20),
          borderBottomWidth: 1,
          borderBottomColor: state?.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
        }}
        rightIcon={<View></View>}
        leftIcon={<View></View>}
        screennName={t('orders')}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
      />
      <TopTabs
        tabs={[t('upcoming'), t('history')]}
        marginTop={HEIGHT_BASE_RATIO(16)}
        selectedTab={selectedTab}
        onPress={handleTabChange}
      />
      <ScrollView
        style={GeneralStyles.generalPaddingHomeStack}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[COLORS.Brown]}
            onRefresh={() => {
              onRefresh();
            }}
          />
        }
        scrollEnabled={true}
        onScroll={({nativeEvent}) => {
          const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20
          ) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <Text
          style={{
            ...FONTS.JakartaSans_Bold_18,
            ...styles.heading,
            color: state?.darkTheme ? COLORS.WHITE : COLORS.DARK,
          }}>
          {statusParam == 'process'
            ? orders?.length + ' ' + t('upcoming') + ' ' + t('orders')
            : t('history')}
        </Text>
        {orders?.orders?.length == 0 && !isOrdersFetching && (
          <Text
            style={{
              ...FONTS.JakartaSansMedium_12,
              ...styles.heading,
              color: state?.darkTheme ? COLORS.WHITE : COLORS.DARK,
              alignSelf: 'center',
            }}>
            {t('noOrdersPlaced')}
          </Text>
        )}
        <FlatList
          data={orders}
          renderItem={item => {
            return <UpComingOrder item={item?.item} tab={selectedTab} />;
          }}
          keyExtractor={(item, index) => index.toString}
        />
        {isOrdersFetching && !refreshing && (
          <ActivityIndicator
            size={'small'}
            color={COLORS.Brown}
            style={{marginTop: HEIGHT_BASE_RATIO(10)}}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default MyOrdersScreen;
