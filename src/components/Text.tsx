import { StyleProp, Text as RNText, TextProps, TextStyle } from "react-native";
import React, { PropsWithChildren } from "react";
import { filter as f } from '../helpers/filter'


type CustomTextType = PropsWithChildren & TextProps & {
  ff?: 'Regular' | 'Medium' | 'Bold',
  fs?: number,
  filter?: boolean,
  style?: StyleProp<TextStyle>
}

export default function Text({ children, ff = "Regular", fs = 14, filter = false, style, ...props }: CustomTextType) {
  return (
    <RNText
      {...props}
      style={[{
        fontFamily: ff,
        fontSize: fs
      }, style]}
    >
      {filter ? f.clean(children) : children}
    </RNText>
  );
}
