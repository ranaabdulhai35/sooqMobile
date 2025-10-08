import {View, Text} from 'react-native';
import React from 'react';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import {FlatList} from 'react-native-gesture-handler';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';

const RatingBar = ({data}) => {
  const state = useSelector(state => state?.auth);
  const calculateRatingWidth = (star, ratings, reviewsAverage) => {
    const totalRatings = reviewsAverage?.reduce(
      (sum, item) => sum + item.ratings,
      0,
    );
    if (totalRatings === 0) return 0;

    const percentage = (ratings / totalRatings) * 100;

    return `${percentage}%`;
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: HEIGHT_BASE_RATIO(8),
        }}>
        <StarRatingDisplay
          rating={item?.ratingStar}
          starSize={20}
          starStyle={{
            width: WIDTH_BASE_RATIO(8),
            height: HEIGHT_BASE_RATIO(20),
          }}
        />

        <Text
          style={{
            ...FONTS.JakartaSans_Bold_14,
            color: state.darkTheme ? COLORS.LightGray : COLORS.DARK,
          }}>
          {item?.ratings}
        </Text>

        <View
          style={{
            width: WIDTH_BASE_RATIO(216),
            height: HEIGHT_BASE_RATIO(5),
            backgroundColor: COLORS.LightBrown,
            borderRadius: 9,
          }}>
          <View
            style={{
              height: '100%',
              width: calculateRatingWidth(
                item?.ratingStar,
                item?.ratings,
                data,
              ),
              backgroundColor: COLORS.GREEN,
              borderRadius: 9,
            }}></View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default RatingBar;
