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
  IconService,
  IconSport,
  IconStall,
  IconStar,
  IconStarLine,
} from "./Icons";
import { applyFilter, getStars } from "../helpers/searchfilter";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export const ww = Dimensions.get("window").width;
export const wh = Dimensions.get("window").height;

export const ItemsCtn = ({ data, load, filter = false }) => {
  return (
    <>
      {/* {load && <Text style={{ paddingHorizontal: 20 }}>Loading...</Text>} */}
      {load && <IconLoad />}
      <Animated.View entering={FadeIn} exiting={FadeOut}
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
      </Animated.View>
    </>
  );
};

export const Item = ({ item }) => {
  const nav = useNavigation()
  const goTo = ()=> {
    nav.navigate("ItemPage",{id:item._id})
  }

  return (
    <Pressable style={st.item_ctn} onPress={goTo} >
      {/* <Image source={img} style={st.item_img} /> */}
      <Image source={{uri:item.images[0].image}} style={st.item_img} />

      <Text numberOfLines={1}>{item.name}</Text>
      <View style={st.item_bottom}>
        <Text ff="Bold" style={{ fontSize: 16 }}>
          {/* ${item.price.toFixed(2)} */}
          {item.price}
        </Text>
        <StarsCtn stars={getStars(item)} />
      </View>
    </Pressable>
  );
};

export const StarsCtn = ({ stars,size=12 }) => {
  return (
    <View
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      {stars >= 1 ? <IconStar size={size} /> : <IconStarLine size={size} />}
      {stars >= 2 ? <IconStar size={size} /> : <IconStarLine size={size} />}
      {stars >= 3 ? <IconStar size={size} /> : <IconStarLine size={size} />}
      {stars >= 4 ? <IconStar size={size} /> : <IconStarLine size={size} />}
      {stars >= 5 ? <IconStar size={size} /> : <IconStarLine size={size} />}
    </View>
  );
};

const categArray = [
  { name: "home", text: "Hogar", icon: IconHome },
  { name: "clean", text: "Limpieza", icon: IconDrop },
  { name: "cloth", text: "Ropa", icon: IconJacket },
  { name: "food", text: "Comida", icon: IconHamburguer },
  { name: "tech", text: "Tecnologia", icon: IconCPU },
  { name: "sports", text: "Deportes", icon: IconSport },
  { name: "service", text: "Servicios", icon: IconService },
  // { name: "shops", text: "Tiendas", icon: IconStall },
  { name: "others", text: "Otros", icon: IconDots },
];

export const Categories = ({ handleCateg, categ, shop = true,all=true }) => {
  return (
    <ScrollView horizontal={true} contentContainerStyle={st.categ_ctn}>
      {categArray.map((item, index) => {
        if (!shop && item === 'Tiendas') return null;
        if(all){
          return <Category {...{ handleCateg, categ }} {...item} key={index} />;
        }else{
          if(categ.includes(item.text)) return <Category {...{ handleCateg, categ }} {...item} key={index} />;
        }
      })}
    </ScrollView>
  );
};

const Category = ({ icon: Icon, text = "", handleCateg, categ, name }) => {
  return (
    <Pressable
      onPress={() => {
        handleCateg(text);
      }}
      style={({ pressed }) => ({
        ...st.categ_box,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <View
        style={{
          ...st.categ_circle,
          backgroundColor: categ.includes(text) ? t.four : t.prime,
        }}
      >
        <Icon color={!categ.includes(text) ? t.four : t.prime} />
      </View>
      <Text style={{ fontFamily: "Bold", fontSize: 14 }}>{text}</Text>
    </Pressable>
  );
};

const st = StyleSheet.create({
  item_ctn: ({pressed})=>({
    display: "flex",
    padding: 5,
    width: (ww - 60) / 2,
    gap: 4,
    opacity:pressed?0.5:1
  }),
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
    minWidth:ww,
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
