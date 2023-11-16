import { View, Text, StyleSheet, Pressable, Keyboard } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import t from "../components/stylesVar";

import {
  IconHomeFill,
  IconHeartLine,
  IconStallLine,
  IconUserLine,
  IconHomeLine,
  IconHeart,
  IconStall,
  IconUser,
} from "./Icons";
import { useNavigation } from "@react-navigation/native";
import Context from "./Context";

const NavBar = ({ active }) => {
  const { userData } = useContext(Context);
  const nav = useNavigation();
  const goHome = () => {
    nav.navigate("Home");
  };
  const goFav = () => {
    if(!userData._id) return goProfile() 
    nav.navigate("Favorites");
  };
  const goMarket = () => {
    if(!userData._id) return goProfile() 
    nav.navigate("Commerce");
  };
  const goProfile = () => {
    nav.navigate("Profile");
  };

  const [keyboardStatus, setKeyboardStatus] = useState("");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (!keyboardStatus) {
    return (
      <View style={st.navbar_ctn}>
        <Pressable style={st.btn} onPress={goHome}>
          {active === 0 ? <IconHomeFill /> : <IconHomeLine />}
        </Pressable>
        <Pressable style={st.btn} onPress={goFav}>
          {active === 1 ? <IconHeart /> : <IconHeartLine />}
        </Pressable>
        <Pressable style={st.btn} onPress={goMarket}>
          {active === 2 ? <IconStall /> : <IconStallLine />}
        </Pressable>
        <Pressable style={st.btn} onPress={goProfile}>
          {active === 3 ? <IconUser /> : <IconUserLine />}
        </Pressable>
      </View>
    );
  }
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
  btn: ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }),
});
