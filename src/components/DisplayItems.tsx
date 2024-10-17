import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React, { FC, PropsWithChildren } from "react";
// import img from "../images/item.png";
import Text from "./Text";
import {
  IconArrowRight,
  IconCheck,
  IconCircleLine,
  IconCPU,
  IconDots,
  IconDrop,
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
import { v, stB, ww } from "./stylesVar";
import { ItemType } from "../types/item";
import { NavType } from "../types/screens"
import { CommerceType } from "../types/user";


type ItemsCtnProps = {
  data: ItemType[],
  load?: boolean,
  markets?: boolean,
  filter?: { name?: string, status?: number },
  longPress?: (_id: string) => void
}

export const ItemsCtn = ({ data, load, filter, longPress,markets }: ItemsCtnProps) => {
  const nav = useNavigation();
  return (
    <>
      {/* {load && <Text style={{ paddingHorizontal: 20 }}>Loading...</Text>} */}
      {load && <IconLoad />}
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          paddingHorizontal: 8,
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {applyFilter(data, filter).map((item: any) => {
          if(markets || !item.price){
            return  <Market market={item} key={item._id} {...{ longPress, nav }} />
          }else return <Item item={item} key={item._id} {...{ longPress, nav }} />
        })}
      </Animated.View>
    </>
  );
};

type ItemProps = { item: ItemType, nav: NavType, longPress?: (_id: string) => void }
type MarketProps = Omit<ItemProps,'item'>&{
  market:CommerceType
}
export const Item = ({ item, nav, longPress }: ItemProps) => {
  const goTo = () => {
    nav.navigate("ItemPage", { item: item });
  };

  const onLongPress = () => {
    if (longPress) longPress(item._id);
  };

  return (
    <Pressable style={st.item_ctn} onPress={goTo} onLongPress={onLongPress}>
      <Image source={{ uri: item.images[0].secure_url }} style={st.item_img} />

      <Text numberOfLines={1}>{item.name}</Text>
      <View style={st.item_bottom}>
        <Text ff="Bold" style={{ fontSize: 16 }}>
          {Number.parseFloat(item.price).toFixed(2)}
        </Text>
        <StarsCtn stars={getStars(item)} />
      </View>
    </Pressable>
  );
};
export const Market = ({ market, nav, longPress }: MarketProps) => {
  const goTo = () => {
    nav.navigate("ShopPage", { id: market._id });
  };

  const onLongPress = () => {
    if (longPress) longPress(market._id);
  };

  return (
    <Pressable style={st.item_ctn} onPress={goTo} onLongPress={onLongPress}>
      <Image source={{ uri: market.logo }} style={st.item_img} />

      <Text numberOfLines={1}>{market.name}</Text>
      <View style={st.item_bottom}>
        {/* <Text ff="Bold" style={{ fontSize: 16 }}></Text> */}
        <StarsCtn stars={getStars(market)} />
      </View>
    </Pressable>
  );
};

type MyItemProps = { item: ItemType, add: (_id: string) => void, remove: (_id: string) => void, imSelected: boolean }
export const MyItem = ({ item, add, remove, imSelected }: MyItemProps) => {
  const press = () => {
    if (!imSelected) add(item._id);
    else remove(item._id);
  };

  return (
    <Pressable style={st.item_selection} onPress={press}>
      <Image source={{ uri: item.images[0].secure_url }} style={st.item_img} />
      <View style={st.abs_check}>
        {imSelected ? <IconCheck /> : <IconCircleLine />}
      </View>
      <Text numberOfLines={1}>{item.name}</Text>
      <View style={st.item_bottom}>
        <Text ff="Bold" style={{ fontSize: 16 }}>
          {Number.parseFloat(item.price).toFixed(2)}
        </Text>
        <StarsCtn stars={getStars(item)} />
      </View>
    </Pressable>
  );
};

export const StarsCtn = ({ stars, size = 12 }: { stars: number, size?: number }) => {
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
  { name: "market", text: "Tiendas", icon: IconStall },
  { name: "others", text: "Otros", icon: IconDots },
];

type CategoriesProps = {
  handleCateg: (categ: string) => void,
  categ: string[],
  all?: boolean
}
export const Categories = ({
  handleCateg = () => { },
  categ,
  all = true,
}: CategoriesProps) => {
  return (
    <View
      style={{ position: "relative", height: 80, width: ww, marginLeft: -12 }}
    >
      <ScrollView horizontal={true} contentContainerStyle={st.categ_ctn}>
        {categArray.map((item, index) => {
          // if (!shop && item === "Tiendas") return null;
          if (all) {
            return (
              <Category {...{ handleCateg, categ }} {...item} key={index} />
            );
          } else {
            if (categ.includes(item.name))
              return (
                <Category {...{ handleCateg, categ }} {...item} key={index} />
              );
          }
        })}
      </ScrollView>
    </View>
  );
};

type Category = {
  icon: FC<{ size?: number, color?: string }>,
  text: string,
  handleCateg: (name: string) => void,
  categ: string[],
  name: string
}
const Category = ({ icon: Icon, text = "", handleCateg, categ, name }: Category) => {
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
          backgroundColor: categ.includes(name) ? v.four : v.prime,
        }}
      >
        <Icon color={!categ.includes(name) ? v.four : v.prime} />
      </View>
      <Text style={{ fontFamily: "Bold", fontSize: 12 }}>{text}</Text>
    </Pressable>
  );
};

const st = StyleSheet.create({
  item_ctn: ({ pressed }) => ({
    display: "flex",
    padding: 5,
    width: (ww - 60) / 2,
    gap: 4,
    opacity: pressed ? 0.5 : 1,
    borderWidth: 1,
    borderColor: "#eee",
  }),
  item_selection: ({ pressed }) => ({
    display: "flex",
    padding: 5,
    width: (ww - 60) / 2,
    gap: 4,
    opacity: pressed ? 0.5 : 1,
    borderWidth: 1,
    borderColor: "#191919",
    borderStyle: "dashed",
    borderRadius: 12,
  }),
  abs_check: {
    position: "absolute",
    backgroundColor: "#eee",
    top: -12,
    alignSelf: "center",
    borderRadius: 100,
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
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    gap: 12,
    paddingLeft: 12,
    paddingBottom: 12,
    // width: ww,
    // height:299,
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
    borderColor: v.four,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
});

export const Subtitle = ({ children }: PropsWithChildren) => (
  <Text style={stB.subtitle}>{children}</Text>
);

export const HeaderBtn = ({ onPress, text }: { onPress?: () => void, text: string }) => {
  const nav = useNavigation();
  const goBack = () => {
    if (onPress) {
      onPress();
    } else nav.goBack();
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={goBack}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
          transform: [{ rotate: "180deg" }],
          padding: 8,
        })}
      >
        <IconArrowRight />
      </Pressable>
      <Text fs={32} ff="Bold">
        {text}
      </Text>
    </View>
  );
};
