import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import t from "../components/stylesVar";

import {
  IconHomeFill,
  IconHeartLine,
  IconStallLine,
  IconUserLine,
} from "./Icons";
import { useNavigation } from "@react-navigation/native";

const NavBar = () => {
  const nav = useNavigation();
  const goTo = (name) => {
    nav.navigate(name);
  };
  return (
    <View style={st.navbar_ctn}>
      <Box goTo={goTo} name="Home">
        <IconHomeFill />
      </Box>
      <Box goTo={goTo} name="Favorites">
        <IconHeartLine />
      </Box>
      <Box goTo={goTo} name="Commerce">
        <IconStallLine />
      </Box>
      <Box goTo={goTo} name="Profile">
        <IconUserLine />
      </Box>
    </View>
  );
};

export default NavBar;

const Box = ({ children, name, goTo }) => {
  const onPress = () => {
    goTo(name);
  };
  return (
    <Pressable
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

const st = StyleSheet.create({
  navbar_ctn: {
    position: "absolute",
    height: 52,
    width: "100%",
    backgroundColor: t.prime,
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 40,
    paddingVertical: 14,
    justifyContent: "space-between",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});
