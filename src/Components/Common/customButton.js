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
} from '../../Utils/helpers';
import {COLORS} from '../../Constants/index';

const CustomButton = ({
  load,
  onPress,
  backgroundColor,
  text,
  width,
  loading,
  fontColor,
  boderColor,
  borderRadius,
  rightArrow,
  height,
  textStyle,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  shadowStyle,
  svgIcon,
  display,
}) => {
  return (
    <TouchableOpacity
      // activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          width: width ? width : WIDTH_BASE_RATIO(340),
          height: height ? height : HEIGHT_BASE_RATIO(56),
          borderWidth: 1,
          borderColor: boderColor,
          borderRadius: borderRadius ? borderRadius : 30,
          flexDirection: 'row',
          marginTop: marginTop ? marginTop : 0,
          marginBottom: marginBottom ? marginBottom : 0,
          marginLeft: marginLeft ? marginLeft : 0,
          marginRight: marginRight ? marginRight : 0,
          display: display ? display : 'flex',
          ...shadowStyle,
        },
      ]}
      onPress={onPress}>
      <Text style={[textStyle]}>
        {load ? <ActivityIndicator color={'#ffffff'} /> : text}

        {/* {text} */}
      </Text>
      {rightArrow && (
        <Image style={{marginLeft: WIDTH_BASE_RATIO(10)}} source={rightArrow} />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    // marginVertical: HEIGHT_BASE_RATIO(8),
    marginBottom: HEIGHT_BASE_RATIO(8),
    height: HEIGHT_BASE_RATIO(56),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 20,
  },
  btnText: {
    color: COLORS.WHITE,
  },
});
