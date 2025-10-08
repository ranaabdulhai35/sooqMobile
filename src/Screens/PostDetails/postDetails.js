import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import * as SVGS from '../../Assets/svgs/index';
import * as Images from '../../Assets/Images/index';
import * as Presets from '../../Assets/PresetImages/index';
import {COLORS, FONTS} from '../../Constants';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../Components/Common/header';
import {useNavigation} from '@react-navigation/native';
import {
  FONT_SIZE,
  handleLangChange,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../Utils/helpers';
import CustomCarousel from '../../Components/Common/customCarousel';
import styles from './Styles/styles';
import {useTranslation} from 'react-i18next';
import {FontFamily} from '../../GeneralStyles/generalFonts';
import CustomButton from '../../Components/Common/customButton';
import BottomButtons from '../../Components/Common/bottomButtons';
import QuantityButtons from '../../Components/Common/quantityButtons';
import ColorBlocks from '../../Components/Common/colorBlocks';
import SizeButtons from '../../Components/Common/sizeButtons';
import RenderPosts from '../../Components/Common/renderPosts';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import RenderSampleImages from '../../Components/Common/renderSampleImages';
import RenderReviews from '../../Components/Common/renderReviews';
import {
  useGetProductDetailsQuery,
  useGetSpecificProductQuery,
} from '../../Apis/productApiCall';
import {userApiCall} from '../../Apis/userApiCall';
import FastImage from 'react-native-fast-image';
import {useAddToCartMutation} from '../../Apis/cartApiCall';
import {AuthSlice} from '../../Redux/slice';
import RenderHtml from 'react-native-render-html';
import RayalSymbol from '../../Components/Common/rayalSymbol';

const width = Dimensions.get('screen').width;

const PostDetails = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const state = useSelector(state => state.auth);
  const userId = state?.user?.id;
  const id = route?.params?.id;
  const {t} = useTranslation();
  const {
    data: productsData,
    error: productsError,
    isFetching: isFetchingProducts,
    isLoading: isLoadingProducts,
    isSuccess: isSuccessProducts,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGetSpecificProductQuery(
    {id},
    {skip: !id, refetchOnMountOrArgChange: id},
  );
  const [addToCart, {isLoading}] = useAddToCartMutation();

  const [variation, setVariation] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedLength, setSelectedLength] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleProducts = () => {
    refetchProducts();
    if (productsData && isSuccessProducts) {
      console.error('product data', productsData?.id);
    }
    if (isProductsError) {
      console.error('error occured fetching product', productsError);
    }
  };
  const renderImages = item => {
    return (
      <View style={[styles.imageContainer, {width: width}]}>
        <FastImage
          source={{uri: item}}
          style={[styles.image, {width: width, ...styles.postImageStyle}]}
          resizeMode="contain"
        />
      </View>
    );
  };
  const getVariationByAttributes = (
    variations,
    attr1,
    attr2,
    attr3 = null,
    attr4 = null,
    language = 'en',
  ) => {
    console.error('attributes', attr1, attr2, attr3, attr4);
    const attributesToMatch = [attr1, attr2, attr3, attr4].filter(Boolean);

    for (const variation of variations) {
      const variationAttributes = variation.attributes;

      // Check if the number of attributes in the variation is equal to the number of attributes provided
      if (
        Object.keys(variationAttributes).length !== attributesToMatch.length
      ) {
        continue;
      }

      // Get the attribute values from the variation in the same order as inputs
      const variationAttributeValues = Object.values(variationAttributes).map(
        attr =>
          typeof attr === 'object'
            ? attr[language]?.toLowerCase()
            : attr?.toLowerCase(),
      );

      const allMatch = attributesToMatch.every(attr =>
        variationAttributeValues.includes(attr.toLowerCase()),
      );

      if (allMatch) {
        console.error(variation);
        return variation;
      }
    }

    return null;
  };
  const handleRefetch = async () => {
    await refetchProducts();
  };
  const handleColorChange = item => {
    setSelectedColor(selectedColor == item ? null : item);
    setVariation(
      getVariationByAttributes(
        productsData?.variations,
        selectedColor == item ? null : item,
        selectedSize,
        selectedLength,
        selectedWeight,
        state?.language,
      ),
    );
  };
  const handleSizeChange = item => {
    setSelectedSize(selectedSize == item ? null : item);
    setVariation(
      getVariationByAttributes(
        productsData?.variations,
        selectedColor,
        selectedSize == item ? null : item,
        selectedLength,
        selectedWeight,
        state?.language,
      ),
    );
  };
  const handleLengthChange = item => {
    setSelectedLength(selectedLength == item ? null : item);
    setVariation(
      getVariationByAttributes(
        productsData?.variations,
        selectedColor,
        selectedLength == item ? null : item,
        selectedSize,
        selectedWeight,
        state?.language,
      ),
    );
  };
  const handleWeightChange = item => {
    setSelectedWeight(selectedWeight == item ? null : item);
    setVariation(
      getVariationByAttributes(
        productsData?.variations,
        selectedColor,
        selectedWeight == item ? null : item,
        selectedSize,
        selectedLength,
      ),
    );
  };
  const handleQuantityChange = item => {
    setQuantity(item);
  };
  const handleAddToCart = async () => {
    const data = JSON.stringify({
      userId: state?.user?.id,
      productId: productsData?.id,
      variationId: variation?.id,
      quantity: quantity,
    });
    const response = await addToCart({data});

    if (response.data) {
      navigation.navigate('Success', {
        text: 'Item Added to Cart Successfully',
        btnTxt: 'Continue Shopping',
      });
      dispatch(AuthSlice.actions.setCartItems(state?.cartItems + 1));
    }
    if (response.error) {
      Alert.alert('Error occured while adding to cart');
      console.error('error occured while adding to cart', response.error);
    }
  };
  const handleBuyNow = () => {
    navigation.navigate('CheckoutPayment', {
      productId: productsData?.id,
      variationId: variation?.id,
      quantity: quantity,
      method: 'buy',
      product: productsData,
      variation: variation,
      address: state?.user?.address,
    });
  };
  const attributesLangChange = (language, attribute) => {
    const attributeMap = {
      Color: {en: 'Color', ar: 'لون'},
      Size: {en: 'Size', ar: 'مقاس'},
      Length: {en: 'Length', ar: 'طول'},
      Weight: {en: 'Weight', ar: 'وزن'},
    };

    return attributeMap[attribute]?.[language] || attribute;
  };

  useEffect(() => {
    handleProducts();
    if (productsData?.variations?.[0]) {
      const firstVariation = productsData?.variations[0];
      setVariation(firstVariation);

      setSelectedColor(firstVariation?.attributes?.color?.en || null);
      setSelectedSize(firstVariation?.attributes?.size?.en || null);
      setSelectedLength(firstVariation?.attributes?.length?.en || null);
      setSelectedWeight(firstVariation?.attributes?.weight?.en || null);

      if (firstVariation?.quantity >= 1) {
        setQuantity(1);
      }
    }
  }, [productsData]);
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
        style={{paddingBottom: HEIGHT_BASE_RATIO(10)}}
        rightIcon={state?.darkTheme ? <SVGS.cartWhite /> : <SVGS.cart />}
        leftIcon={state?.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        screennName={t('productDetails')}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
        onPressRightIcon={() => {
          navigation.navigate('Cart');
        }}
      />
      <ScrollView
        scrollEnabled
        contentContainerStyle={{paddingBottom: HEIGHT_BASE_RATIO(100)}}
        showsVerticalScrollIndicator={false}>
        {isLoadingProducts ? (
          <ActivityIndicator
            color={COLORS.Brown}
            size={'large'}
            style={{marginTop: HEIGHT_BASE_RATIO(280)}}
          />
        ) : isProductsError && !isSuccessProducts ? (
          <Text
            style={[
              FONTS.JakartaSansMedium_14,
              {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
            ]}>
            {t('anErrorOccurred')}
          </Text>
        ) : (
          <>
            <CustomCarousel
              data={productsData?.images}
              containerStyle={{width: width}}
              imageStyle={{
                width: width,
                ...styles.postImageStyle,
              }}
              generalPadding={false}
              wrapperStyle={{marginTop: HEIGHT_BASE_RATIO(5)}}
              dots={false}
              hoverDots={true}
              pagingEnabled={true}
              renderItem={renderImages}
            />
            <RenderSampleImages data={productsData?.images} />
            <View style={GeneralStyles.generalPaddingHomeStack}>
              <View
                style={[
                  styles.productNameContainer,
                  {
                    flexDirection:
                      state.language == 'ar' ? 'row-reverse' : 'row',
                  },
                ]}>
                <Text
                  style={[
                    FONTS.JakartaSans_Bold_18,
                    {
                      color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                      // width: WIDTH_BASE_RATIO(200),
                    },
                  ]}>
                  {handleLangChange(productsData?.name, state?.language)}
                  {/* {state?.language == 'ar'
                    ? productsData?.name?.ar
                    : productsData?.name?.en} */}
                </Text>
                <Text
                  style={[
                    {
                      ...FONTS.JakartaSansMedium_14,
                      color: COLORS.RED,
                    },
                  ]}>
                  {variation?.quantity <= 5 &&
                    `Quantity is less than ${variation?.quantity}`}
                  {variation?.quantity == 0 && 'Not available'}
                </Text>
              </View>
              <View
                style={[
                  styles.productNameContainer,
                  {
                    flexDirection:
                      state.language == 'ar' ? 'row-reverse' : 'row',
                  },
                ]}>
                <View style={GeneralStyles.rayalSymbol}>
                  <Text
                    style={{
                      ...FONTS.JakartaSans_24_Bold,
                      color: COLORS.Brown,
                    }}>
                    {variation?.price
                      ? variation?.price
                      : productsData?.fixedPrice}
                  </Text>
                  <RayalSymbol />
                </View>
                <QuantityButtons
                  limit={variation?.quantity > 0 ? variation?.quantity : 0}
                  quantity={quantity}
                  handleChange={handleQuantityChange}
                />
                {console.log('variation?.quantity', variation?.quantity)}
              </View>

              {productsData?.attributes?.map(item => {
                return (
                  <View>
                    {handleLangChange(item?.name, state?.language) ==
                      attributesLangChange(state?.language, 'Color') && (
                      <>
                        <Text
                          style={[
                            FONTS.JakartaSans_Bold_14,
                            {
                              color: state.darkTheme
                                ? COLORS.WHITE
                                : COLORS.DARK,
                              marginTop: HEIGHT_BASE_RATIO(10),
                              alignSelf:
                                state.language == 'ar'
                                  ? 'flex-end'
                                  : 'baseline',
                            },
                          ]}>
                          {t('pick') +
                            ' ' +
                            `${handleLangChange(item?.name, state?.language)}`}
                        </Text>
                        <View
                          style={[
                            styles.colorsContainer,
                            {
                              alignSelf:
                                state.language == 'ar'
                                  ? 'flex-end'
                                  : 'baseline',
                            },
                          ]}>
                          {item?.values?.map(item => {
                            return (
                              <ColorBlocks
                                colors={item}
                                selected={selectedColor}
                                handleSelect={handleColorChange}
                              />
                            );
                          })}
                        </View>
                      </>
                    )}
                    {handleLangChange(item?.name, state?.language) ==
                      attributesLangChange(state?.language, 'Size') && (
                      <>
                        <Text
                          style={[
                            FONTS.JakartaSans_Bold_14,
                            {
                              color: state.darkTheme
                                ? COLORS.WHITE
                                : COLORS.DARK,
                              marginTop: HEIGHT_BASE_RATIO(16),
                              marginBottom: HEIGHT_BASE_RATIO(10),
                              alignSelf:
                                state.language == 'ar'
                                  ? 'flex-end'
                                  : 'baseline',
                            },
                          ]}>
                          {t('pick') +
                            ' ' +
                            `${handleLangChange(item?.name, state?.language)}`}
                        </Text>
                        <View
                          style={{
                            alignSelf:
                              state.language == 'ar' ? 'flex-end' : 'baseline',
                          }}>
                          <SizeButtons
                            sizes={item?.values}
                            selected={selectedSize}
                            handleSelect={handleSizeChange}
                          />
                        </View>
                      </>
                    )}
                    {handleLangChange(item?.name, state?.language) ==
                      attributesLangChange(state?.language, 'Length') && (
                      <>
                        <Text
                          style={[
                            FONTS.JakartaSans_Bold_14,
                            {
                              color: state.darkTheme
                                ? COLORS.WHITE
                                : COLORS.DARK,
                              marginTop: HEIGHT_BASE_RATIO(16),
                              marginBottom: HEIGHT_BASE_RATIO(10),
                              alignSelf:
                                state.language == 'ar'
                                  ? 'flex-end'
                                  : 'baseline',
                            },
                          ]}>
                          {t('pick') +
                            ' ' +
                            `${handleLangChange(item?.name, state?.language)}`}
                        </Text>
                        <View
                          style={{
                            alignSelf:
                              state.language == 'ar' ? 'flex-end' : 'baseline',
                          }}>
                          <SizeButtons
                            sizes={item?.values}
                            selected={selectedLength}
                            handleSelect={handleLengthChange}
                          />
                        </View>
                      </>
                    )}
                    {handleLangChange(item?.name, state?.language) ==
                      attributesLangChange(state?.language, 'Weight') && (
                      <>
                        <Text
                          style={[
                            FONTS.JakartaSans_Bold_14,
                            {
                              color: state.darkTheme
                                ? COLORS.WHITE
                                : COLORS.DARK,
                              marginTop: HEIGHT_BASE_RATIO(16),
                              marginBottom: HEIGHT_BASE_RATIO(10),
                              alignSelf:
                                state.language == 'ar'
                                  ? 'flex-end'
                                  : 'baseline',
                            },
                          ]}>
                          {t('pick') +
                            ' ' +
                            `${handleLangChange(item?.name, state?.language)}`}
                        </Text>
                        <View
                          style={{
                            alignSelf:
                              state.language == 'ar' ? 'flex-end' : 'baseline',
                          }}>
                          <SizeButtons
                            sizes={item?.values}
                            selected={selectedWeight}
                            handleSelect={handleWeightChange}
                          />
                        </View>
                      </>
                    )}
                  </View>
                );
              })}
              <Text
                style={[
                  FONTS.JakartaSans_Bold_18,
                  {
                    color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                    marginTop: HEIGHT_BASE_RATIO(24),
                    alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline',
                  },
                ]}>
                {t('description')}
              </Text>
              {/* <Text
                style={{
                  ...styles.descriptionText,
                  color: state.darkTheme ? COLORS.LightGray : COLORS.DARK,
                }}>
                {handleLangChange(productsData?.description, state?.language)}
              </Text> */}
              <RenderHtml
                width={'100%'}
                source={{
                  html: `${handleLangChange(
                    productsData?.description,
                    state?.language,
                  )}`,
                }}
                tagsStyles={{
                  p: {
                    ...styles.descriptionText,
                    color: state.darkTheme ? COLORS.LightGray : COLORS.DARK,
                    alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline',
                  },
                }}
              />

              <View
                style={[
                  styles.reviewsTextContainer,
                  {
                    flexDirection:
                      state.language == 'ar' ? 'row-reverse' : 'row',
                  },
                ]}>
                <Text
                  style={[
                    FONTS.JakartaSans_Bold_18,
                    {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
                  ]}>
                  {t('reviews')}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('CustomerReviews', {
                      product: productsData,
                    });
                  }}>
                  <Text
                    style={[FONTS.JakartaSans_Bold_14, {color: COLORS.Brown}]}>
                    {t('seeAll')}
                  </Text>
                </TouchableOpacity>
              </View>
              {productsData?.reviews?.length == 0 && (
                <Text
                  style={[
                    FONTS.JakartaSansMedium_14,
                    {
                      color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                      alignSelf: 'center',
                      marginTop: HEIGHT_BASE_RATIO(20),
                    },
                  ]}>
                  {t('noReviewsYet')}
                </Text>
              )}
              <RenderReviews
                reviews={productsData?.reviews?.slice(0, 3) || []}
                renderOnlyOne={false}
              />
              <Text
                style={[
                  FONTS.JakartaSans_Bold_18,
                  {
                    color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                    marginTop: HEIGHT_BASE_RATIO(24),
                    alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline',
                  },
                ]}>
                {t('relatedProducts')}
              </Text>

              {productsData?.relatedProducts?.length == 0 &&
                !isProductsError && (
                  <Text
                    style={[
                      FONTS.JakartaSansMedium_14,
                      {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
                    ]}>
                    {t('noProductsYet')}
                  </Text>
                )}
              <CustomCarousel
                data={isProductsError ? [] : productsData?.relatedProducts}
                wrapperStyle={styles.postWrapper}
                dots={false}
                renderItem={item => (
                  <RenderPosts item={item} handleRefetch={handleRefetch} />
                )}
                generalPadding={true}
              />
            </View>
          </>
        )}
      </ScrollView>
      {!isLoadingProducts && (
        <BottomButtons
          button1Text={t('addToCart')}
          button2Text={t('buyNow')}
          button1Onpress={() => {
            if (variation && variation?.quantity != 0 && !isLoading) {
              console.log(
                'variation variation?.quantity != 0',
                variation,
                variation?.quantity != 0,
              );
              handleAddToCart();
            }
          }}
          button2Onpress={() => {
            if (variation && variation?.quantity != 0 && !isLoading) {
              handleBuyNow();
            }
          }}
          isLoadingButton1={isLoading}
        />
      )}
    </View>
  );
};

export default PostDetails;
