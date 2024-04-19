import { Text as RNText } from "react-native";
import React from "react";
import {filter as f } from '../helpers/filter'

export default function Text({ children, ff = "Regular",fs=14,filter=false, ...props }) {
  return (
    <RNText
    {...props}
    style={[{
      fontFamily: ff,
      fontSize:fs
    },{...props.style}]}
    >
      {filter ? f.clean(children):children}
    </RNText>
  );
}
