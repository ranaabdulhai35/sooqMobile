import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {useTranslation} from 'react-i18next';
import * as SVGS from '../../Assets/svgs/index';
import CustomInputTitle from '../../Components/Common/customInputTitle';
import BackButton from '../../Components/Common/backButton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './Styles/styles';
import CustomButton from '../../Components/Common/searchSuggestions';
import {
  useDeleteAllSearchHistoryMutation,
  useGetSearchHistoryQuery,
} from '../../Apis/productApiCall';
const width = Dimensions.get('screen').width;
const SearchScreen = () => {
  const navigation = useNavigation();
  const state = useSelector(state => state.auth);
  const userId = state?.user?.id;
  const {t} = useTranslation();

  const [searchText, setSearchText] = useState(null);

  const {
    data: searchHistoryData,
    error: searchHistoryError,
    isFetching: isFetchingSearches,
    isLoading: isLoadingSearches,
    isSuccess: isSuccessSearches,
    isError: isSearchHistoryError,
    refetch: refetchSearches,
  } = useGetSearchHistoryQuery({userId});
  const [deleteAllSearchHistory, {isLoading: isDeleteAllLoading}] =
    useDeleteAllSearchHistoryMutation();

  const handleRefetch = async () => {
    await refetchSearches();
  };
  const handleDeleteAllHistory = async () => {
    console.log('removing', userId);
    const response = await deleteAllSearchHistory({userId});
    if (response?.data) {
      console.error('History removed', response);
      handleRefetch();
    }
    if (response?.error) {
      console.error('Error Occured while removing history', response.error);
      handleRefetch();
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleRefetch();
    }, []),
  );
  return (
    <View
      style={[
        GeneralStyles.container,
        GeneralStyles.containerTopPadding,
        GeneralStyles.generalPaddingHomeStack,
        state?.darkTheme
          ? {backgroundColor: COLORS.DARK}
          : {backgroundColor: COLORS.WHITE},
      ]}>
      <View style={styles.searchBarContainer}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          {state.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        </Pressable>
        <CustomInputTitle
          placeholder={t('search')}
          placeholderColor={state.darkTheme ? COLORS.WHITE : COLORS.DARK}
          width={WIDTH_BASE_RATIO(320)}
          height={HEIGHT_BASE_RATIO(50)}
          borderRadius={8}
          borderWidth={2}
          reverse={state.language == 'ar' ? true : false}
          borderColor={
            state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
          }
          defaultValue={searchText}
          onChangeText={text => {
            setSearchText(text);
          }}
          autoFocus={false}
          SVGright={<SVGS.search />}
          returnKeyType={'search'}
          onSubmitEditing={() => {
            if (searchText) {
              navigation.navigate('SearchResultScreen', {
                searchTerm: searchText,
              });
            }
          }}
        />
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          state?.darkTheme
            ? {backgroundColor: COLORS.DARK}
            : {backgroundColor: COLORS.WHITE},
        ]}>
        <View
          style={{
            flexDirection: state.language == 'ar' ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: HEIGHT_BASE_RATIO(26),
          }}>
          <Text
            style={{
              ...FONTS.JakartaSans_Bold_16,
              color: state.darkTheme ? COLORS.LightGray : COLORS.DARK,
            }}>
            {t('searchDiscovery')}
          </Text>
          {!searchHistoryData?.length == 0 && (
            <TouchableOpacity
              onPress={() => {
                handleDeleteAllHistory();
              }}>
              <Text
                style={{
                  ...FONTS.JakartaSans_Bold_16,
                  color: COLORS.RED,
                }}>
                {t('removeAll')}{' '}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {searchHistoryData?.length == 0 && !isSearchHistoryError && (
          <Text
            style={[
              FONTS.JakartaSansMedium_14,
              {
                color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
                alignSelf: state.language == 'ar' ? 'flex-end' : 'baseline',
              },
            ]}>
            {t('noResultsfound')}{' '}
          </Text>
        )}

        <View style={styles.searchSuggestionsContainer}>
          {searchHistoryData?.map((item, index) => {
            return (
              <CustomButton
                onPress={() => {
                  navigation.navigate('SearchResultScreen', {
                    searchTerm: item?.term,
                  });
                }}
                key={index}
                text={item?.term}
                item={item}
                handleRefetch={handleRefetch}
              />
            );
          })}
        </View>
        {isFetchingSearches && (
          <ActivityIndicator size={35} color={COLORS.Brown} />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SearchScreen;
