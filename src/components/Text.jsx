import { Text as RNText } from "react-native";
import React from "react";

export default function Text({ children, ff = "Regular",fs=14, ...props }) {
  return (
    <RNText
    {...props}
    style={[{
      fontFamily: ff,
      fontSize:fs
    },{...props.style}]}
    >
      {children}
    </RNText>
  );
}
