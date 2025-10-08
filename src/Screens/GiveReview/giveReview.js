import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {COLORS, FONTS} from '../../Constants';
import {useSelector} from 'react-redux';
import Header from '../../Components/Common/header';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import StarRating from 'react-native-star-rating-widget';
import styles from './Styles/styles';
import CustomInputTitle from '../../Components/Common/customInputTitle';
import * as SVGS from '../../Assets/svgs/index';
import * as Images from '../../Assets/Images/index';
import CustomButton from '../../Components/Common/customButton';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {FlatList} from 'react-native-gesture-handler';
import {useAddReviewMutation} from '../../Apis/reviewsApiCall';
const GiveReview = ({route}) => {
  const navigation = useNavigation();
  const params = route?.params;
  const state = useSelector(state => state.auth);
  const {id} = state?.user;
  const {t} = useTranslation();

  const [addReview, {isLoading, isSuccess}] = useAddReviewMutation();
  const [rating, setRating] = useState(1);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState(null);

  const removeImage = url => {
    let index = images.indexOf(url);
    setImages(prevImages => prevImages.filter(url => images[index] !== url));
  };

  const handleSelectPicture = () => {
    let options = {
      mediaType: 'picture',
      includeBase64: false,
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled the picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImages(prevImages => [...prevImages, response.assets[0].uri]);
        console.log('image', response.assets[0].uri);
      }
    });
  };

  const renderImages = ({item}) => {
    return (
      <ImageBackground
        source={{uri: item}}
        borderRadius={10}
        style={styles.imageStyle}>
        <TouchableOpacity
          onPress={() => {
            removeImage(item);
          }}>
          <SVGS.remove />
        </TouchableOpacity>
      </ImageBackground>
    );
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append(' productId', params?.orderProduct?.productId);
      data.append('rating', rating);
      data.append('message', message);
      data.append('mediaUrls', images);
      console.log('payload data', data);
      const response = await addReview({id, data});
      if (response?.data) {
        navigation.navigate('Success', {
          text: 'Review Added Successfully',
        });
      }

      if (response?.error) {
        console.error('Error occured', response?.error);
        if (response.error?.status == 400) {
          Alert.alert(response.error.data.error, response.error.data.message);
          navigation.goBack();
        }
      }
    } catch (e) {
      console.error('Error occured', e);
    }
  };
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
        rightIcon={<View style={{width: WIDTH_BASE_RATIO(15)}}></View>}
        leftIcon={state?.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
        screennName={t('customerReviews')}
        screenNameColor={state?.darkTheme ? COLORS.WHITE : COLORS.DARK}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView
        style={{
          ...GeneralStyles.generalPaddingHomeStack,
        }}
        scrollEnabled
        showsVerticalScrollIndicator={false}>
        <Text
          style={{
            ...styles.mainHeading,
            color: state.darkTheme ? COLORS.WHITE : COLORS.DARK,
          }}>
          {t('selectRating')}
        </Text>
        <View style={{alignItems: 'center'}}>
          <StarRating
            rating={rating}
            onChange={setRating}
            starSize={45}
            starStyle={styles.starRatingContainer}
          />
        </View>
        <CustomInputTitle
          placeholder={t('writeReview')}
          borderColor={
            state?.darkTheme ? COLORS.DARK_BTN_BG : COLORS.LightBrown
          }
          placeholderColor={COLORS.Gray}
          width={'100%'}
          height={HEIGHT_BASE_RATIO(132)}
          borderRadius={12}
          borderWidth={2}
          marginTop={HEIGHT_BASE_RATIO(28)}
          defaultValue={message}
          onChangeText={text => {
            setMessage(text);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            handleSelectPicture();
          }}
          style={{
            backgroundColor: state.darkTheme
              ? COLORS.DARK_BTN_BG
              : COLORS.LightGray,
            ...styles.galleryBtn,
          }}>
          <SVGS.gallery />
          <Text style={styles.submitButtonText}>
            {t('uploadProductImages')}
          </Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <FlatList
            data={images}
            renderItem={renderImages}
            horizontal={true}
            contentContainerStyle={{gap: WIDTH_BASE_RATIO(8)}}
            scrollEnabled
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </KeyboardAwareScrollView>
      <View
        style={[
          styles.bottomButtonContainer,
          {backgroundColor: state.darkTheme ? COLORS.DARK : COLORS.WHITE},
        ]}>
        <CustomButton
          backgroundColor={COLORS.Brown}
          width={WIDTH_BASE_RATIO(358)}
          height={HEIGHT_BASE_RATIO(60)}
          borderRadius={12}
          boderColor={COLORS.Brown}
          text={t('submitReview')}
          textStyle={{
            ...FONTS.JakartaSans_Bold_16,
            color: COLORS.WHITE,
          }}
          onPress={() => {
            if (message && !isLoading) {
              handleSubmit();
            }
          }}
          load={isLoading}
        />
      </View>
    </View>
  );
};

export default GiveReview;
