import { View, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Text from "./Text";
import t from "./stylesVar";
import { IconLoad } from "./Icons";

export const PrimaryBtn = ({ text, action }) => {
  const [load, setLoad] = useState(false);

  const execute = async () => {
    setLoad(true);
    await action();
    setLoad(false);
  };

  return (
    <Pressable onPress={execute} style={st.primary_btn} disabled={load}>
      {load ? (
        <IconLoad color={t.prime} />
      ) : (
        <Text ff="Bold" style={{ color: t.prime }}>
          {text}
        </Text>
      )}
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
    borderRadius: 12,
    // marginTop:'auto'
  }),
});
