import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../Constants';
import CustomCarousel from '../../Components/Common/customCarousel';
import {StyleSheet} from 'react-native';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {useDispatch, useSelector} from 'react-redux';
import * as ContentImages from '../../Assets/Images/index';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {AuthSlice} from '../../Redux/slice';
const RenderCategories = ({data}) => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const renderCategories = item => {
    return (
      <TouchableOpacity
        style={styles.category}
        onPress={async () => {
          await dispatch(AuthSlice.actions.setCategory(item));
          navigation.navigate('CategoriesScreen');
        }}>
        {item?.image ? (
          <FastImage source={{uri: item?.image}} style={styles.categoryImage} />
        ) : (
          <FastImage source={ContentImages.men} style={styles.categoryImage} />
        )}
        <Text
          style={[
            FONTS.JakartaSansLight_16_black,
            styles.categoryTxt,
            {color: state.darkTheme ? COLORS.WHITE : COLORS.DARK},
          ]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <CustomCarousel
      data={data}
      wrapperStyle={styles.categoriesWrapper}
      dots={false}
      renderItem={renderCategories}
      pagingEnabled={false}
      generalPadding={true}
    />
  );
};
const styles = StyleSheet.create({
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
  categoryTxt: {marginTop: HEIGHT_BASE_RATIO(10), color: COLORS.DARK},
  categoryImage: {
    width: WIDTH_BASE_RATIO(88),
    height: HEIGHT_BASE_RATIO(84),
    borderRadius: 14,
  },
});

export default RenderCategories;
