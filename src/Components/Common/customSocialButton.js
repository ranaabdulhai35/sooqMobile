import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React from 'react';
import {
  HEIGHT_BASE_RATIO,
  WIDTH_BASE_RATIO,
  wp,
  FONT_SIZE,
} from '../../BusinessLogics/Utils/helpers';
import { COLORS } from '../../Constants';

const CustomSocialButton = ({
  onPress,
  backgroundColor,
  text,
  width,
  loading,
  icons,
  SVG,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          width: width ? width : WIDTH_BASE_RATIO(340),
        },
      ]}
      onPress={onPress}>
      {/* <Image
        resizeMode="contain"
        source={icons}
        style={{
          marginHorizontal: WIDTH_BASE_RATIO(20),
          width: WIDTH_BASE_RATIO(25),
          height: HEIGHT_BASE_RATIO(27),
        }}
      /> */}
      <SVG width={WIDTH_BASE_RATIO(25)} height={HEIGHT_BASE_RATIO(25)} />
      <Text
        style={[
          {marginLeft: WIDTH_BASE_RATIO(10)},
          FONTS.AvenirLTStd_Black_900_16,
        ]}>
        {loading ? <ActivityIndicator color={'#ffffff'} /> : text}

        {/* {text} */}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomSocialButton;

const styles = StyleSheet.create({
  container: {
    // marginVertical: HEIGHT_BASE_RATIO(8),
    marginBottom: HEIGHT_BASE_RATIO(8),
    height: HEIGHT_BASE_RATIO(56),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    flexDirection: 'row',

    // paddingVertical: 20,
  },
  btnText: {
    color: COLORS.WHITE,
  },
});
