import {View, Text, TouchableWithoutFeedback, Keyboard} from 'react-native';
import React, {useRef} from 'react';

const WithoutFeedbackWrapper = ({children}) => {
  const inputRef = useRef(null);
  const handleWrapperPress = () => {
    if (inputRef.current && inputRef.current.isFocused()) {
      inputRef.current.blur();
    }
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback style={{flex: 1}} onPress={handleWrapperPress}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default WithoutFeedbackWrapper;
