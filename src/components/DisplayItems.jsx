import { View, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import img from "../images/item.png";
import Text from "./Text";
import { IconStar, IconStarLine } from "./Icons";

export const ww = Dimensions.get("window").width;
export const wh = Dimensions.get("window").height;

export const ItemsCtn = ({ data, load }) => {
  return (
    <>
      {load && <Text style={{ paddingHorizontal: 20 }}>Loading...</Text>}
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
        {data.map((item, index) => (
          <Item item={item} key={item._id} />
        ))}
      </View>
      {/* {load ? (
      ) : (
      )} */}
    </>
  );
};

export const Item = ({ item }) => {
  return (
    <View style={st.item_ctn}>
      <Image source={img} style={st.item_img} />
      <Text numberOfLines={1}>{item.name}</Text>
      <View style={st.item_bottom}>
        <Text ff="Bold" style={{ fontSize: 16 }}>
          ${item.price.toFixed(2)}
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
