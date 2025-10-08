import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../../Constants';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../Components/Common/header';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import RenderOptions from '../../Components/Common/renderOptions';
import RenderSubOptions from '../../Components/Common/renderSubOptions';
import styles from './styles/styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import * as Images from '../../Assets/PresetImages/index';
import * as ContentImages from '../../Assets/Images/index';
import * as SVGS from '../../Assets/svgs/index';
import RenderStores from './Components/renderStores';
import {useTranslation} from 'react-i18next';
import {useGetCategoriesQuery} from '../../Apis/categoriesApiCall';
import {
  useLazyGetProductsByCategoriesQuery,
  useLazyGetProductsBySubCategoriesQuery,
} from '../../Apis/productApiCall';
import RenderProducts from '../../Components/Common/renderProducts';
import {AuthSlice} from '../../Redux/slice';

const CategoriesScreen = ({route}) => {
  const navigation = useNavigation();
  const flatListRef = useRef();
  const state = useSelector(state => state.auth);
  const lang = state?.language;
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const {
    data: categoriesData,
    error: categoriesError,
    isFetching: isFetchingCategories,
    isLoading: isLoadingCategories,
    isSuccess: isSuccessCategories,
    refetch: refetchCategories,
  } = useGetCategoriesQuery({lang});
  const [
    triggerGetProductsByCategories,
    {data: categoryProducts, isFetching: isFetchingProductsByCategories},
  ] = useLazyGetProductsByCategoriesQuery();
  const [
    triggerGetProductsBySubCategories,
    {data: subCategoryProducts, isFetching: isFetchingProductsBySubCategories},
  ] = useLazyGetProductsBySubCategoriesQuery();

  const [option, setOption] = useState(null);
  const [subOption, setSubOption] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchedProductsFromCategories, setFetchedProductsFromCategories] =
    useState(false);

  const handleOptionOnPress = selectedOption => {
    setOption(selectedOption);
    if (selectedOption?.subcategories?.length > 0) {
      const firstSubCategory = selectedOption?.subcategories[0];
      setSubOption(firstSubCategory);
      triggerGetProductsBySubCategories(firstSubCategory?.id);
      setFetchedProductsFromCategories(false);
    } else {
      setSubOption(null);
      triggerGetProductsByCategories(selectedOption?.id);
      setFetchedProductsFromCategories(true);
    }
  };
  const handleSubOptionOnPress = selectedSubOption => {
    setSubOption(selectedSubOption);
    triggerGetProductsBySubCategories(selectedSubOption?.id);
    setFetchedProductsFromCategories(false);
    console.error('subCategory id', selectedSubOption?.id);
  };
  const onRefresh = async () => {
    setRefreshing(true);
    if (subOption) {
      triggerGetProductsBySubCategories(subOption?.id);
    } else {
      triggerGetProductsByCategories(option?.id);
    }
    await refetchCategories();
    setRefreshing(false);
  };
  const handleRefetchProducts = () => {
    if (subOption) {
      triggerGetProductsBySubCategories(subOption?.id);
    } else {
      triggerGetProductsByCategories(option?.id);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (categoriesData?.length > 0) {
      const initialOption = categoriesData[0];
      setOption(initialOption);

      if (initialOption?.subcategories?.length > 0) {
        setSubOption(initialOption?.subcategories[0]);
        triggerGetProductsBySubCategories(initialOption?.subcategories[0]?.id, {
          signal: controller.signal, // Attach abort signal
        });
        setFetchedProductsFromCategories(false);
      } else {
        triggerGetProductsByCategories(initialOption?.id, {
          signal: controller.signal, // Attach abort signal
        });
        setFetchedProductsFromCategories(true);
      }
    }

    // Cleanup: Abort ongoing fetches
    return () => {
      controller.abort();
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      if (state?.categoryOption) {
        setOption(state?.categoryOption);
        if (state?.categoryOption?.subcategories?.length > 0) {
          setSubOption(state?.categoryOption?.subcategories[0]);
          triggerGetProductsBySubCategories(
            state?.categoryOption?.subcategories[0]?.id,
          );
          setFetchedProductsFromCategories(false);
          console.warn('fetched from categories', false);
        } else {
          triggerGetProductsByCategories(state?.categoryOption?.id);
          setFetchedProductsFromCategories(true);
          console.warn('fetched from categories', true);
        }
        dispatch(AuthSlice.actions.setCategory(null));
      }
    }),
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
        leftIcon={
          !state?.darkTheme ? <SVGS.backIcon /> : <SVGS.backIconWhite />
        }
        onPressLeftIcon={() => navigation.goBack()}
        screennName={t('categories')}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: HEIGHT_BASE_RATIO(20)}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[COLORS.Brown]}
            onRefresh={() => {
              onRefresh();
            }}
          />
        }>
        <View style={[GeneralStyles.generalPaddingHomeStack]}>
          <RenderOptions
            marginTop={HEIGHT_BASE_RATIO(16)}
            options={categoriesData}
            selected={option}
            buttonPress={handleOptionOnPress}
          />
        </View>
        <RenderSubOptions
          marginTop={HEIGHT_BASE_RATIO(16)}
          subOptions={option?.subcategories}
          currentSubOption={subOption}
          buttonPress={handleSubOptionOnPress}
        />
        <View style={{paddingHorizontal: WIDTH_BASE_RATIO(16)}}>
          <Text
            style={[
              styles.subOptionHeading,
              {
                color: state?.darkTheme ? COLORS.WHITE : COLORS.DARK,
                alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline',
              },
            ]}>
            {subOption ? subOption?.name : option?.name}
          </Text>
          <FlatList
            data={
              fetchedProductsFromCategories
                ? categoryProducts?.products
                : subCategoryProducts?.products
            }
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            ref={flatListRef}
            renderItem={item => (
              <RenderProducts
                item={item.item}
                handleRefetch={handleRefetchProducts}
              />
            )}
            columnWrapperStyle={styles.columnWrapperStyle}
            ListFooterComponent={
              (isFetchingProductsBySubCategories ||
                isFetchingProductsByCategories) && (
                <ActivityIndicator size={35} color={COLORS.Brown} />
              )
            }
          />
          {categoryProducts?.products?.length == 0 && !categoryProducts && (
            <Text
              style={[
                FONTS.JakartaSansMedium_14,
                {
                  color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                  ...styles.emptyComponent,
                },
              ]}>
              No products from{' '}
              {fetchedProductsFromCategories ? option?.name : subOption?.name}
            </Text>
          )}
          {subCategoryProducts?.products?.length == 0 &&
            subCategoryProducts && (
              <Text
                style={[
                  FONTS.JakartaSansMedium_14,
                  {
                    color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                    ...styles.emptyComponent,
                  },
                ]}>
                No products from{' '}
                {fetchedProductsFromCategories ? option?.name : subOption?.name}
              </Text>
            )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoriesScreen;
