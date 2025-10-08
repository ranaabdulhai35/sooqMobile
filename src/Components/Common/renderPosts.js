import {ActivityIndicator, Alert, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import * as SVGS from '../../Assets/svgs';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {COLORS, FONTS} from '../../Constants';
import {
  findProductFromFavourites,
  handleLangChange,
  HEIGHT_BASE_RATIO,
  simpleTruncateText,
  truncateText,
  WIDTH_BASE_RATIO,
} from '../../Utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  useAddProductToFavouritesMutation,
  useDeleteProductFromFavouritesMutation,
} from '../../Apis/favouritesApiCall';
import CustomCarousel from './customCarousel';
import FastImage from 'react-native-fast-image';
import * as IMAGES from '../../Assets/Images/index';
import {productApiCall} from '../../Apis/productApiCall';
import SvgUri from 'react-native-svg-uri';
import {AuthSlice} from '../../Redux/slice';
import {Path, Svg} from 'react-native-svg';
import RayalSymbol from './rayalSymbol';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';

const RenderPosts = ({item, handleRefetch}) => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const userId = state?.user?.id;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isWishListed, setIsWishListed] = useState(item?.wishlisted);
  const [addToFavourites, {isAddLoading}] = useAddProductToFavouritesMutation();
  const [deleteFromFavourites, {isDeleteLoading}] =
    useDeleteProductFromFavouritesMutation();

  const handleAdd = async id => {
    const response = await addToFavourites({userId, id});
    if (response.data) {
      setIsLoading(false);
      handleAddAndRemove(state?.favourites, id);
      handleRefetch();
    }
    if (response.error) {
      console.error('Error Occured', response.error);
    }
  };

  const handleDelete = async id => {
    const response = await deleteFromFavourites({userId, id});
    if (response.data) {
      setIsLoading(false);
      handleAddAndRemove(state?.favourites, id);
      handleRefetch();
    }
    if (response.error) {
      console.error('Error Occured while deleting', response.error);
    }
  };

  const handleAddAndRemove = (favourites = [], id) => {
    const index = favourites.indexOf(id);
    const updatedFavourites =
      index === -1
        ? [...favourites, id]
        : favourites?.filter(favId => favId !== id);

    console.error('updatedFavourites', updatedFavourites);
    dispatch(AuthSlice.actions.setFavourites(updatedFavourites));
  };

  const handleOnpress = id => {
    dispatch(
      productApiCall.util.prefetch('getProductDetails', id, {
        force: true,
      }),
    );
    navigation.navigate('PostDetails', {id});
  };

  // useEffect(() => {
  //   setIsWishListed(item?.wishlisted);
  // }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        handleOnpress(item?.id);
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
        <TouchableOpacity
          style={styles.favouriteButton}
          onPress={() => {
            setIsLoading(true);
            findProductFromFavourites(state.favourites, item?.id)
              ? handleDelete(item?.id)
              : handleAdd(item?.id);
          }}>
          <View style={styles.favouriteButtonBackground}></View>
          {isLoading ? (
            <ActivityIndicator
              size={20}
              color={COLORS.Brown}
              style={styles.favouriteIcon}
            />
          ) : findProductFromFavourites(state.favourites, item?.id) ? (
            <SVGS.heartActive style={styles.favouriteIcon} />
          ) : (
            <SVGS.favourite style={styles.favouriteIcon} />
          )}
        </TouchableOpacity>
        {item?.images[0] !== null ? (
          <FastImage
            source={{uri: item.images[0]}}
            style={styles.postImage}
            resizeMode="cover"
          />
        ) : (
          <Image source={IMAGES.placeholder} style={styles.postImage} />
        )}
        <View
          style={[
            styles.postContent,
            {alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline'},
          ]}>
          <Text
            style={[
              FONTS.JakartaSans_Bold_14,
              styles.postTitle,
              {
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              },
            ]}>
            {typeof item?.name == 'object'
              ? truncateText(handleLangChange(item?.name, state?.language), 28)
              : truncateText(item?.name, 28)}
          </Text>
          <View style={GeneralStyles.rayalSymbol}>
            <Text style={[FONTS.JakartaSans_Bold_14, styles.postPrice]}>
              {item?.fixedPrice ? item?.fixedPrice : item?.variations[0]?.price}
            </Text>
            <RayalSymbol />
          </View>
        </View>
        <View
          style={[
            styles.postFooter,
            {
              flexDirection: state.language == 'ar' ? 'row-reverse' : 'row',
              paddingRight: WIDTH_BASE_RATIO(16),
              paddingLeft: state.language == 'ar' ? WIDTH_BASE_RATIO(16) : 0,
            },
          ]}>
          <View>
            <View style={styles.ratingContainer}>
              <StarRatingDisplay
                rating={item?.averageRating ? item?.averageRating : 0}
                starSize={15}
                starStyle={styles.starStyle}
              />
              <Text
                style={[
                  FONTS.JakartaSans_Bold_14,
                  styles.ratingsText,
                  {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
                ]}>
                {item?.averageRating ? item?.averageRating : '(' + '0' + ')'}
              </Text>
            </View>
            <View
              style={[
                styles.sellerContainer,
                {flexDirection: state.language == 'ar' ? 'row-reverse' : 'row'},
              ]}>
              {item?.vendor?.profilePic ? (
                <FastImage
                  source={{uri: item?.vendor?.profilePic}}
                  style={styles.sellerImage}
                />
              ) : (
                <SVGS.profile />
              )}
              <Text
                style={[
                  FONTS.JakartaSans_Regular_12,
                  styles.sellerName,
                  {
                    color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                    marginHorizontal: WIDTH_BASE_RATIO(6),
                  },
                ]}>
                {typeof item?.name == 'object'
                  ? simpleTruncateText(
                      handleLangChange(
                        item?.vendor?.firstName,
                        state?.language,
                        7,
                      ),
                    )
                  : simpleTruncateText(item?.vendor?.firstName, 7)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              handleOnpress(item?.id);
            }}
            style={[
              styles.cartButton,
              {
                backgroundColor: state.darkTheme
                  ? COLORS.DARK_BTN_BG
                  : COLORS.LightBrown,
              },
            ]}>
            <SVGS.cartBrown />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default RenderPosts;
const styles = StyleSheet.create({
  postWrapper: {marginTop: HEIGHT_BASE_RATIO(24)},
  carouselPostWrapper: {width: WIDTH_BASE_RATIO(273)},
  postContainer: {
    width: WIDTH_BASE_RATIO(253),
    // height: HEIGHT_BASE_RATIO(365),
    borderWidth: 1.5,
    borderColor: COLORS.LightBrown,
    borderRadius: 12,
    paddingBottom: HEIGHT_BASE_RATIO(15),
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
    height: HEIGHT_BASE_RATIO(209),
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  postContent: {
    paddingHorizontal: WIDTH_BASE_RATIO(16),
    paddingTop: HEIGHT_BASE_RATIO(16),
  },
  postTitle: {
    color: COLORS.DARK,
  },
  postPrice: {
    color: COLORS.Brown,
    marginTop: HEIGHT_BASE_RATIO(8),
  },
  postFooter: {
    marginTop: HEIGHT_BASE_RATIO(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: WIDTH_BASE_RATIO(10),
  },
  starStyle: {
    width: WIDTH_BASE_RATIO(5),
    height: HEIGHT_BASE_RATIO(13),
  },
  ratingsText: {
    marginLeft: WIDTH_BASE_RATIO(8),
  },
  sellerContainer: {
    marginLeft: WIDTH_BASE_RATIO(16),
    marginTop: HEIGHT_BASE_RATIO(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sellerName: {
    color: COLORS.DARK,
  },
  cartButton: {
    width: WIDTH_BASE_RATIO(40),
    height: HEIGHT_BASE_RATIO(48),
    borderRadius: 8,
    backgroundColor: COLORS.LightBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
