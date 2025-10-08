import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import CustomCarousel from './customCarousel';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {COLORS} from '../../Constants';
import FastImage from 'react-native-fast-image';

const RenderSampleImages = ({data, style}) => {
  const renderImages = item => {
    return (
      <View style={styles.imageContainer}>
        <FastImage
          source={{uri: item}}
          style={[styles.image, style]}
          resizeMode="cover"
        />
      </View>
    );
  };
  return (
    <CustomCarousel
      data={data}
      wrapperStyle={styles.imagesWrapper}
      dots={false}
      renderItem={renderImages}
      pagingEnabled={false}
      generalPadding={true}
    />
  );
};

export default RenderSampleImages;
const styles = StyleSheet.create({
  imagesWrapper: {marginTop: HEIGHT_BASE_RATIO(16)},
  imageContainer: {
    alignItems: 'center',
    marginRight: WIDTH_BASE_RATIO(8),
  },
  image: {
    width: WIDTH_BASE_RATIO(80),
    height: HEIGHT_BASE_RATIO(90),
    borderRadius: 10,
  },
});
