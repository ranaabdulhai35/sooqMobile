import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTS} from '../../../Constants';
import {
  formatDate,
  handleLangChange,
  HEIGHT_BASE_RATIO,
  simpleTruncateText,
  WIDTH_BASE_RATIO,
} from '../../../Utils/helpers';
import * as SVGS from '../../../Assets/svgs/index';
import * as Images from '../../../Assets/Images/index';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {useAddReviewMutation} from '../../../Apis/reviewsApiCall';
import RayalSymbol from '../../../Components/Common/rayalSymbol';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';
const UpComingOrder = ({item, tab}) => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const {t} = useTranslation();
  const [expand, setExpand] = useState(false);
  const returnColorForStatus = status => {
    const colorsAgainstStatuses = {
      processing: COLORS.BLUE,
      completed: COLORS.Brown,
      canceled: COLORS.RED,
      returned: COLORS.Gray,
      delivered: COLORS.GREEN,
      approved: COLORS.GREEN,
      dispatched: COLORS.Brown,
      process: COLORS.GREEN,
      completed: COLORS.Brown,
    };
    if (colorsAgainstStatuses[status]) {
      return colorsAgainstStatuses[status];
    } else {
      return COLORS.Yellow;
    }
  };
  return (
    <View style={{marginTop: HEIGHT_BASE_RATIO(20)}}>
      <Pressable
        onPress={() => {
          setExpand(!expand);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{width: WIDTH_BASE_RATIO(320)}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                ...FONTS.JakartaSans_Bold_16,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {item?.orderItems?.length} items
            </Text>
            <View
              style={{
                width: WIDTH_BASE_RATIO(80),
                height: HEIGHT_BASE_RATIO(27),
                // backgroundColor:
                //   item?.status == 'process'
                //     ? COLORS.GREEN
                //     : item?.status == 'completed'
                //     ? COLORS.Brown
                //     : COLORS.Yellow,
                backgroundColor: returnColorForStatus(item?.status),
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  ...FONTS.JakartaSans_Regular_12,
                  color: COLORS.WHITE,
                  textTransform: 'capitalize',
                }}>
                {item?.status}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: HEIGHT_BASE_RATIO(15),
            }}>
            <Text
              style={{
                ...FONTS.JakartaSansMedium_14,
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
              }}>
              {formatDate(item?.createdAt)}
            </Text>
            <View style={GeneralStyles.rayalSymbol}>
              <Text style={{...FONTS.JakartaSans_Bold_16, color: COLORS.Brown}}>
                {item?.totalAmount}
              </Text>
              <RayalSymbol />
            </View>
          </View>
        </View>
        <View>{expand ? <SVGS.contract /> : <SVGS.expand />}</View>
      </Pressable>
      {expand &&
        item?.orderItems?.map((order, index) => {
          return (
            <View key={index} style={{marginTop: HEIGHT_BASE_RATIO(24)}}>
              <Text
                style={{
                  ...FONTS.JakartaSans_Bold_16,
                  color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                  alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline',
                }}>
                {handleLangChange(order?.vendor, state?.language)}
              </Text>
              {order?.items?.map(item => {
                return (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        width: '100%',
                        marginTop: HEIGHT_BASE_RATIO(18),
                      }}>
                      <FastImage
                        source={{uri: item?.images[0]}}
                        style={{
                          width: WIDTH_BASE_RATIO(46),
                          height: HEIGHT_BASE_RATIO(55),
                          borderRadius: 8,
                        }}
                        resizeMode="cover"
                      />
                      <View>
                        <Text
                          style={{
                            ...FONTS.JakartaSansLight_14_Gray,
                            color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                            width: WIDTH_BASE_RATIO(200),
                            lineHeight: 25,
                          }}>
                          {item?.quantity +
                            ' x ' +
                            handleLangChange(item?.product, state?.language)}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: HEIGHT_BASE_RATIO(8),
                          }}>
                          <FastImage
                            source={{uri: order?.vendorProfilePic}}
                            style={{width: 20, height: 20, borderRadius: 10}}
                          />
                          <Text
                            style={{
                              ...FONTS.JakartaSansLight_12_Gray,
                              color: state.darkTheme
                                ? COLORS.WHITE
                                : COLORS.DARK,
                              marginLeft: WIDTH_BASE_RATIO(6),
                            }}>
                            {simpleTruncateText(
                              handleLangChange(order?.vendor, state?.language),
                              24,
                            )}
                          </Text>
                        </View>
                        {tab == t('history') && (
                          <TouchableOpacity
                            style={{
                              width: WIDTH_BASE_RATIO(105),
                              height: HEIGHT_BASE_RATIO(41),
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: state.darkTheme
                                ? COLORS.DARK_BTN_BG
                                : COLORS.LightGray,
                              borderRadius: 6,
                              marginVertical: HEIGHT_BASE_RATIO(16),
                            }}
                            onPress={() => {
                              navigation.navigate('GiveReview', {
                                orderProduct: item,
                              });
                            }}>
                            <Text
                              style={{
                                ...FONTS.JakartaSansLight_12_Gray,
                                color: state.darkTheme
                                  ? COLORS.WHITE
                                  : COLORS.Gray,
                              }}>
                              Write Review
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <StarRatingDisplay
                          rating={order?.store?.overallRating}
                          starSize={15}
                          starStyle={{
                            width: WIDTH_BASE_RATIO(5),
                            height: HEIGHT_BASE_RATIO(11),
                          }}
                        />
                        <Text
                          style={[
                            FONTS.JakartaSans_Bold_14,
                            {
                              marginLeft: WIDTH_BASE_RATIO(6),
                              color: state?.darkTheme
                                ? COLORS.WHITE
                                : COLORS.DARK,
                            },
                          ]}>
                          {order?.store?.overallRating
                            ? order?.store?.overallRating
                            : '(' + '0' + ')'}
                          {console.log('order', item)}
                        </Text>
                      </View>
                    </View>
                    {/* <View
                      style={{
                        marginTop: HEIGHT_BASE_RATIO(5),
                        width: WIDTH_BASE_RATIO(80),
                        height: HEIGHT_BASE_RATIO(27),
                        backgroundColor:
                          item?.status == 'processing'
                            ? COLORS.BLUE
                            : item?.status == 'completed'
                            ? COLORS.Brown
                            : item?.status == 'canceled'
                            ? COLORS.RED
                            : item?.status == 'returned'
                            ? COLORS.Gray
                            : item?.status == 'delivered'
                            ? COLORS.GREEN
                            : item?.status == 'approved'
                            ? COLORS.GREEN
                            : item?.status == 'dispatched'
                            ? COLORS.Brown
                            : COLORS.Yellow,
                        borderRadius: 6,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          ...FONTS.JakartaSans_Regular_12,
                          color: COLORS.WHITE,
                        }}>
                        {item?.status}
                      </Text>
                    </View> */}
                    <View
                      style={{
                        marginTop: HEIGHT_BASE_RATIO(5),
                        width: WIDTH_BASE_RATIO(80),
                        height: HEIGHT_BASE_RATIO(27),
                        backgroundColor: returnColorForStatus('processing'),
                        borderRadius: 6,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          ...FONTS.JakartaSans_Regular_12,
                          color: COLORS.WHITE,
                          textTransform: 'capitalize',
                        }}>
                        {item?.status}
                      </Text>
                    </View>
                  </>
                );
              })}
            </View>
          );
        })}
      <View
        style={{
          width: '100%',
          height: HEIGHT_BASE_RATIO(1),
          backgroundColor: state.darkTheme
            ? COLORS.DARK_BTN_BG
            : COLORS.LightBrown,
          marginTop: HEIGHT_BASE_RATIO(16),
        }}></View>
    </View>
  );
};

export default UpComingOrder;
