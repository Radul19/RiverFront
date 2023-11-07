import { View, StyleSheet, Pressable } from "react-native";
import React from "react";
import Text from "./Text";
import t from "./stylesVar";

export const PrimaryBtn = ({ text, action }) => {
  return (
    <Pressable onPress={action} style={st.primary_btn}>
      <Text ff='Bold' style={{color:t.prime}} >{text}</Text>
    </Pressable>
  );
};

const st = StyleSheet.create({
  primary_btn: ({ pressed }) => ({
    height: 50,
    width: "100%",
    backgroundColor: t.four,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: pressed ? 0.5 : 1,
    borderRadius:12,
    // marginTop:'auto'
  }),
});
