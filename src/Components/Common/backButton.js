import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import * as SVGS from '../../Assets/svgs/index';
import {useSelector} from 'react-redux';
const BackButton = ({onPress, style}) => {
  const state = useSelector(state => state.auth);
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      {state.darkTheme ? <SVGS.backIconWhite /> : <SVGS.backIcon />}
    </TouchableOpacity>
  );
};

export default BackButton;
