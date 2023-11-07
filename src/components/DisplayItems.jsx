import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React from "react";
import img from "../images/item.png";
import Text from "./Text";
import {
  IconCPU,
  IconDots,
  IconDrop,
  IconFolders,
  IconHamburguer,
  IconHome,
  IconJacket,
  IconLoad,
  IconStar,
  IconStarLine,
} from "./Icons";
import { applyFilter, getStars } from "../helpers/searchfilter";

export const ww = Dimensions.get("window").width;
export const wh = Dimensions.get("window").height;

export const ItemsCtn = ({ data, load, filter = false }) => {
  return (
    <>
      {/* {load && <Text style={{ paddingHorizontal: 20 }}>Loading...</Text>} */}
      {load && <IconLoad />}
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
        {applyFilter(data, filter).map((item, index) => (
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
  console.log(getStars(item));
  return (
    <View style={st.item_ctn}>
      <Image source={img} style={st.item_img} />
      <Text numberOfLines={1}>{item.name}</Text>
      <View style={st.item_bottom}>
        <Text ff="Bold" style={{ fontSize: 16 }}>
          ${item.price.toFixed(2)}
        </Text>
        <StarsCtn stars={getStars(item)} />
      </View>
    </View>
  );
};

const StarsCtn = ({ stars }) => {
  return (
    <View
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      {stars >= 1 ? <IconStar size={12} /> : <IconStarLine size={12} />}
      {stars >= 2 ? <IconStar size={12} /> : <IconStarLine size={12} />}
      {stars >= 3 ? <IconStar size={12} /> : <IconStarLine size={12} />}
      {stars >= 4 ? <IconStar size={12} /> : <IconStarLine size={12} />}
      {stars >= 5 ? <IconStar size={12} /> : <IconStarLine size={12} />}
    </View>
  );
};

const categArray = [
  { name: "all", text: "Todas", icon: IconFolders },
  { name: "home", text: "Hogar", icon: IconHome },
  { name: "clean", text: "Limpieza", icon: IconDrop },
  { name: "cloth", text: "Ropa", icon: IconJacket },
  { name: "food", text: "Comida", icon: IconHamburguer },
  { name: "tech", text: "Tecnologia", icon: IconCPU },
  { name: "others", text: "Otros", icon: IconDots },
];

export const Categories = ({ handleCateg, categ, all = true }) => {
  return (
    <ScrollView horizontal={true} contentContainerStyle={st.categ_ctn}>
      {categArray.map((item, index) => {
        if (!all && index === 0) return null;
        return <Category {...{ handleCateg, categ }} {...item} key={index} />;
      })}
    </ScrollView>
  );
};

const Category = ({ icon: Icon, text = "", handleCateg, categ, name }) => {
  return (
    <Pressable
      onPress={() => {
        handleCateg(name);
      }}
      style={({ pressed }) => ({
        ...st.categ_box,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <View
        style={{
          ...st.categ_circle,
          backgroundColor: categ[name] ? t.four : t.prime,
        }}
      >
        <Icon color={!categ[name] ? t.four : t.prime} />
      </View>
      <Text style={{ fontFamily: "Bold", fontSize: 14 }}>{text}</Text>
    </Pressable>
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
  categ_ctn: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    paddingLeft: 20,
    paddingBottom: 12,
  },
  categ_box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  categ_circle: {
    height: 50,
    width: 50,
    borderWidth: 2,
    borderColor: t.four,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
});
