import {Text} from 'react-native';
import React from 'react';
import {RFValue} from 'react-native-responsive-fontsize';

const CustomText = ({
  children,
  size = RFValue(12),
  color = 'white',
  opacity = 1,
  fontWeight = 'normal',
  style,
  ...props
}) => {
  return (
    <>
      <Text
        style={{fontSize: size, fontWeight, size, color, opacity}}
        {...props}>
        {children}
      </Text>
    </>
  );
};

export default CustomText;
