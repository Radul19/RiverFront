import { Text as RNText } from "react-native";
import React from "react";

export default function Text({ children, ff = "Regular", ...props }) {
  return (
    <RNText
    {...props}
    style={[{
      fontFamily: ff,
    },{...props.style}]}
    >
      {children}
    </RNText>
  );
}
