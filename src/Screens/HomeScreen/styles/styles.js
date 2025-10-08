import {StyleSheet} from 'react-native';
import {
  FONT_SIZE,
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
} from '../../../Utils/helpers';
import {COLORS} from '../../../Constants';
import {GeneralStyles} from '../../../GeneralStyles/generalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  viewPosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContainer: {
    width: WIDTH_BASE_RATIO(360),
  },
  image: {
    width: WIDTH_BASE_RATIO(352),
    height: HEIGHT_BASE_RATIO(200),
    borderRadius: 10,
  },
  heroWrapper: {marginTop: HEIGHT_BASE_RATIO(10)},
  categoriesWrapper: {marginTop: HEIGHT_BASE_RATIO(16)},
  categoriesContainer: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: HEIGHT_BASE_RATIO(24),
    ...GeneralStyles.generalPaddingHomeStack,
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchSuggestionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: HEIGHT_BASE_RATIO(16),
  },
  categoriesWrapper: {marginTop: HEIGHT_BASE_RATIO(16)},

  category: {
    alignItems: 'center',
    marginRight: WIDTH_BASE_RATIO(20),
  },
  categoryImage: {
    width: WIDTH_BASE_RATIO(90),
    height: HEIGHT_BASE_RATIO(98),
    borderRadius: 14,
  },
  categoryTxt: {marginTop: HEIGHT_BASE_RATIO(10), color: COLORS.DARK},
  postHeadingContainer: {
    marginTop: HEIGHT_BASE_RATIO(32),
    ...GeneralStyles.generalPaddingHomeStack,
  },
  postWrapper: {marginTop: HEIGHT_BASE_RATIO(24)},
  carouselPostWrapper: {width: WIDTH_BASE_RATIO(273)},
  postContainer: {
    width: WIDTH_BASE_RATIO(253),
    height: HEIGHT_BASE_RATIO(357),
    borderWidth: 1.5,
    borderColor: COLORS.LightBrown,
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
    paddingRight: WIDTH_BASE_RATIO(16),
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
    backgroundColor: COLORS.LightBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsHeadingContainer: {
    marginTop: HEIGHT_BASE_RATIO(32),
  },
  emptyComponent: {
    alignSelf: 'center',
    marginTop: HEIGHT_BASE_RATIO(30),
  },
});

export default styles;
