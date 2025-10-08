import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONTS} from '../../Constants';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import * as SVGS from '../../Assets/svgs/index';
import * as Images from '../../Assets/Images/index';
import * as Presets from '../../Assets/PresetImages/index';
import {useSelector} from 'react-redux';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import Header from '../../Components/Common/header';
import {useNavigation} from '@react-navigation/native';
import RenderReviews from '../../Components/Common/renderReviews';
import {useTranslation} from 'react-i18next';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import RatingBar from '../../Components/Common/ratingBar';
import styles from './Styles/styles';
import {useGetReviewsQuery} from '../../Apis/reviewsApiCall';
import {use} from 'i18next';
import {AuthSlice} from '../../Redux/slice';
const CustomerReviews = ({route}) => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const params = route?.params;
  const {id} = params?.product;
  const {t} = useTranslation();
  const limit = 10;
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const {isLoading, error, isFetching, isError, isSuccess, data, refetch} =
    useGetReviewsQuery({
      id,
      limit,
      page,
    });
  const samples = [
    {image: Images.women, name: t('women'), state: state},
    {image: Images.kids, name: t('kids'), state: state},
    {image: Images.men, name: t('men'), state: state},
    {image: Images.bags, name: t('bags'), state: state},
    {image: Images.perfumes, name: t('perfumes'), state: state},
    {image: Images.wallets, name: t('wallets'), state: state},
  ];
  const reviews = [
    {
      pfp: Presets.image1,
      name: 'Lame  Nigga',
      date: 'May 3, 2021',
      rating: 4,
      totalRatings: 10,
      review:
        'Es un hecho establecido hace demasiado tiempo que un lector se distraerá con el contenido ',
      samples: samples,
    },
    {
      pfp: Presets.image2,
      name: 'Lame  Niggasss',
      date: 'May 9, 2021',
      rating: 3,
      totalRatings: 99,
      review:
        'Eac;amc;ma;smc;ma;cm;ams;cm;ams;camlkvnkjbvksbkvdbskjbvlsdbksvks kd vkjsbbvbksj lnlcnkankcnak ',
      samples: samples,
    },
  ];
  const reviewsAverage = [
    {
      ratingStar: 1,
      ratings: data?.ratingCounts['1'] ? data?.ratingCounts['1'] : 0,
    },
    {
      ratingStar: 2,
      ratings: data?.ratingCounts['2'] ? data?.ratingCounts['2'] : 0,
    },
    {
      ratingStar: 3,
      ratings: data?.ratingCounts['3'] ? data?.ratingCounts['3'] : 0,
    },
    {
      ratingStar: 4,
      ratings: data?.ratingCounts['4'] ? data?.ratingCounts['4'] : 0,
    },
    {
      ratingStar: 5,
      ratings: data?.ratingCounts['5'] ? data?.ratingCounts['5'] : 0,
    },
  ];
  const handleLoadMore = async () => {
    if (!isFetching && page < data?.totalPages) {
      setPage(prev => prev + 1);
    }
  };
  const onRefresh = async () => {
    setPage(1);
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const handleProducts = () => {
    if (data && isSuccess) {
      console.log('products data', data);
    }

    if (isError) {
      console.error('error occurred', error);
      if (error?.status == 404) {
        Alert.alert('message', 'No reviews found for this product.');
      }
      if (error?.status === 401) {
        dispatch(AuthSlice.actions.log_out());
      }
    }
  };
  useEffect(() => {
    handleProducts();
  }, []);
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
        rightIcon={<View style={{width: WIDTH_BASE_RATIO(30)}}></View>}
        leftIcon={state?.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        screennName={t('customerReviews')}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        scrollEnabled
        contentContainerStyle={{
          ...GeneralStyles.generalPaddingHomeStack,
          paddingBottom: HEIGHT_BASE_RATIO(10),
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[COLORS.Brown]}
            onRefresh={() => {
              onRefresh();
            }}
          />
        }
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
        <View style={styles.ratingAverageContainer}>
          <Text
            style={{
              ...styles.ratingAverageText,
              color: state.darkTheme ? COLORS.LightGray : COLORS.DARK,
            }}>
            {data?.averageRating ? data?.averageRating : 0 + ' ' + t('stars')}
          </Text>
          <StarRatingDisplay
            rating={data?.averageRating}
            starSize={40}
            starStyle={{
              width: WIDTH_BASE_RATIO(35),
              height: HEIGHT_BASE_RATIO(20),
            }}
          />
        </View>
        <RatingBar data={reviewsAverage} />
        {isFetching && (
          <ActivityIndicator
            size={'large'}
            color={COLORS.Brown}
            style={{marginTop: HEIGHT_BASE_RATIO(30)}}
          />
        )}
        <View style={{marginTop: HEIGHT_BASE_RATIO(10)}}>
          <RenderReviews reviews={data?.reviews} />
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomerReviews;
