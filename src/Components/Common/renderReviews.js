import {View, Text, Image, FlatList} from 'react-native';
import React from 'react';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {COLORS, FONTS} from '../../Constants';
import {
  formatDate,
  HEIGHT_BASE_RATIO,
  simpleTruncateText,
  WIDTH_BASE_RATIO,
} from '../../Utils/helpers';
import * as Presets from '../../Assets/PresetImages/index';
import * as SVGS from '../../Assets/svgs/index';
import RenderSampleImages from './renderSampleImages';
import {useSelector} from 'react-redux';

const RenderReviews = ({reviews}) => {
  const state = useSelector(state => state.auth);
  const renderReview = ({item}) => {

    return (
      <View style={{marginTop: HEIGHT_BASE_RATIO(20)}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item?.user?.profilePic ? (
              <Image
                source={{uri: item?.user?.profilePic}}
                style={{width: 50, height: 50, borderRadius: 25}}
                resizeMode="cover"
              />
            ) : (
              <SVGS.userIcon />
            )}

            <View style={{marginLeft: WIDTH_BASE_RATIO(14)}}>
              <Text
                style={{
                  ...FONTS.JakartaSans_Bold_14,
                  color: state.darkTheme ? COLORS.LightGray : COLORS.DARK,
                }}>
                {item?.user?.firstName + item?.user?.lastName
                  ? simpleTruncateText(
                      item?.user?.firstName + item?.user?.lastName,
                      15,
                    )
                  : 'User'}
              </Text>
              <Text
                style={{
                  ...FONTS.JakartaSansLight_14_Gray,
                  marginTop: HEIGHT_BASE_RATIO(3),
                }}>
                {formatDate(item?.reviewDate)}
              </Text>
            </View>
          </View>

          <StarRatingDisplay
            rating={item?.rating}
            starSize={15}
            starStyle={{
              width: WIDTH_BASE_RATIO(7),
              height: HEIGHT_BASE_RATIO(13),
            }}
          />
        </View>
        <View
          style={{
            width: WIDTH_BASE_RATIO(300),
            marginLeft: WIDTH_BASE_RATIO(45),
          }}>
          <Text
            style={{
              ...FONTS.JakartaSansLight_14_Gray,
              marginTop: HEIGHT_BASE_RATIO(10),
              width: WIDTH_BASE_RATIO(280),
              marginLeft: WIDTH_BASE_RATIO(16),
              color: state.darkTheme ? COLORS.LightGray : COLORS.DARK,
            }}>
            {item?.message}
          </Text>
          <RenderSampleImages
            data={item?.mediaUrls}
            style={{width: WIDTH_BASE_RATIO(64), height: HEIGHT_BASE_RATIO(70)}}
          />
        </View>
      </View>
    );
  };
  return (
    <FlatList
      data={reviews}
      renderItem={renderReview}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default RenderReviews;
