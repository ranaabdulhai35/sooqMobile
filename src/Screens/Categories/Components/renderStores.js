import {FlatList, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import * as SVGS from '../../../Assets/svgs';

import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {COLORS, FONTS} from '../../../Constants';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../../Utils/helpers';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const RenderStores = ({stores}) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const state = useSelector(state => state.auth);
  return (
    <>
      <FlatList
        data={stores}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ref={flatListRef}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Store');
              }}
              style={styles.carouselPostWrapper}>
              <View
                style={[
                  styles.postContainer,
                  {
                    borderColor: state.darkTheme
                      ? COLORS.DARK_BTN_BG
                      : COLORS.LightBrown,
                  },
                ]}>
                <Image source={item.image} style={styles.postImage} />
                <View style={{paddingHorizontal: WIDTH_BASE_RATIO(16)}}>
                  <View style={styles.sellerContainer}>
                    <Image
                      source={item.store.image}
                      style={styles.sellerImage}
                    />
                    <Text
                      style={[
                        FONTS.JakartaSans_Bold_14,
                        styles.sellerName,
                        {
                          color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                        },
                      ]}>
                      {item.store.name}
                    </Text>
                  </View>
                  <Text style={[FONTS.JakartaSansMedium_14, styles.postPrice]}>
                    {item.products} Products
                  </Text>
                  <Text
                    style={[
                      FONTS.JakartaSans_Regular_10,
                      styles.postTitle,
                      {
                        color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                      },
                    ]}>
                    Store Rating
                  </Text>
                </View>
                <View style={styles.ratingContainer}>
                  <StarRatingDisplay
                    rating={item.rating}
                    starSize={15}
                    starStyle={styles.starStyle}
                  />
                  <Text style={[FONTS.JakartaSans_Bold_14, styles.ratingsText]}>
                    {'(' + item.ratings + ')'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginTop: HEIGHT_BASE_RATIO(16),
        }}
        scrollEnabled={false}
      />
    </>
  );
};
export default RenderStores;
const styles = StyleSheet.create({
  postWrapper: {},
  carouselPostWrapper: {width: WIDTH_BASE_RATIO(175)},
  postContainer: {
    width: WIDTH_BASE_RATIO(175),
    height: HEIGHT_BASE_RATIO(286),
    borderWidth: 1.5,
    borderRadius: 12,
  },
  favouriteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 11111,
    right: 0,
    marginTop: HEIGHT_BASE_RATIO(12),
    marginRight: WIDTH_BASE_RATIO(12),
  },
  favouriteButtonBackground: {
    width: WIDTH_BASE_RATIO(32),
    height: HEIGHT_BASE_RATIO(38),
    borderRadius: 8,
    backgroundColor: COLORS.Gray,
    opacity: 0.5,
  },
  favouriteIcon: {
    position: 'absolute',
  },
  postImage: {
    width: '100%',
    height: HEIGHT_BASE_RATIO(148),
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  postContent: {
    paddingHorizontal: WIDTH_BASE_RATIO(12),
    paddingTop: HEIGHT_BASE_RATIO(16),
  },
  postTitle: {
    marginTop: HEIGHT_BASE_RATIO(12),
  },
  postPrice: {
    color: COLORS.Brown,
    marginTop: HEIGHT_BASE_RATIO(10),
  },
  postFooter: {
    marginTop: HEIGHT_BASE_RATIO(6),
    paddingRight: WIDTH_BASE_RATIO(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: WIDTH_BASE_RATIO(8),
    marginTop: HEIGHT_BASE_RATIO(2),
  },
  starStyle: {
    width: WIDTH_BASE_RATIO(3),
    height: HEIGHT_BASE_RATIO(11),
  },
  ratingsText: {
    marginLeft: WIDTH_BASE_RATIO(6),
  },
  sellerContainer: {
    marginTop: HEIGHT_BASE_RATIO(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  sellerName: {
    color: COLORS.DARK,
    marginLeft: WIDTH_BASE_RATIO(6),
  },
  cartButton: {
    width: WIDTH_BASE_RATIO(40),
    height: HEIGHT_BASE_RATIO(48),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
