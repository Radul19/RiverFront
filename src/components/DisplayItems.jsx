import { View, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import img from "../images/item.png";
import Text from "./Text";
import { IconStar, IconStarLine } from "./Icons";

export const ww = Dimensions.get("window").width;
export const wh = Dimensions.get("window").height;

export const ItemsCtn = () => {
  return (
    <View
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        paddingHorizontal: 20,
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
    </View>
  );
};

export const Item = () => {
  return (
    <View style={st.item_ctn}>
      <Image source={img} style={st.item_img} />
      <Text numberOfLines={1}>
        Sandalia con nombre largo para hacer pruebas
      </Text>
      <View style={st.item_bottom}>
        <Text ff="Bold" style={{ fontSize: 16 }}>
          $29.99
        </Text>
        <StarsCtn />
      </View>
    </View>
  );
};

const StarsCtn = () => {
  return (
    <View
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <IconStar size={12} />
      <IconStar size={12} />
      <IconStar size={12} />
      <IconStar size={12} />
      <IconStarLine size={12} />
    </View>
  );
};

const st = StyleSheet.create({
  item_ctn: {
    display: "flex",
    padding: 5,
    width: (ww - 60) / 2,
    gap: 4,
  },
  item_img: {
    width: (ww - 60) / 2 - 10,
    height: (ww - 60) / 2 - 10,
    borderRadius: 12,
  },
  item_bottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
