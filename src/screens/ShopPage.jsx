import { View, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import Text from "../components/Text";
import img from "../images/item.png";
import React, { useEffect, useState } from "react";
import {
  Categories,
  ItemsCtn,
  StarsCtn,
  wh,
  ww,
} from "../components/DisplayItems";
import {v} from "../components/stylesVar";
import {
  IconArrowRight,
  IconBag,
  IconBubble,
  IconCross,
  IconHeartLine,
  IconInstagram,
  IconMessenger,
  IconStallLine,
  IconTelegram,
  IconWhatsapp,
} from "../components/Icons";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { SearchBar } from "../components/Inputs";
import { searchItems } from "../api/general";

const ShopPage = () => {
  const [openBtn, setOpenBtn] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [load, setLoad] = useState(false);

  const width = useSharedValue(52);

  const toggle = () => {
    setOpenBtn(!openBtn);

    // width.value = '100%'
  };

  const toggleInfo = () => {
    setOpenInfo(!openInfo);
  };

  useEffect(() => {
    if (openBtn) {
      width.value = withTiming(320);
    } else {
      width.value = withTiming(52);
    }
  }, [openBtn]);

  const executeSearch = async (text) => {
    setLoad(true);
    let { status, data } = await searchItems(text);
    setLoad(false);
    if (status === 200) {
      setItemsData(data);
    }
  };

  useEffect(() => {
    let tm = setTimeout(() => {
      executeSearch(searchBar);
    }, 700);

    return () => {
      clearTimeout(tm);
    };
  }, [searchBar]);

  return (
    <View style={{ flex: 1, backgroundColor: v.prime }}>
      <ScrollView contentContainerStyle={st.ctn}>
        <View style={st.img_ctn}>
          <Pressable style={st.back_btn}>
            <IconArrowRight size={20} />
          </Pressable>
          <Pressable style={st.shop_btn}>
            <IconStallLine size={20} />
          </Pressable>
          <Image source={img} style={st.img} />
        </View>
        <View style={st.content_ctn}>
          <View style={st.top}>
            <Text ff="Medium" fs={20} style={{ width: "80%" }}>
              Amigo de los asa2
            </Text>
            <Pressable style={{ padding: 8 }}>
              <IconHeartLine />
            </Pressable>
          </View>
          <Pressable style={st.reviews_btn}>
            <StarsCtn stars={4} size={20} />
            <Text ff="Bold">4.0</Text>
            <Text style={{ color: v.third }}>{"(29 reseñas)"}</Text>
          </Pressable>
          <Text ff="Bold" fs={32}>
            $29.99
          </Text>
          <Pressable
            onPress={toggleInfo}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Text numberOfLines={!openInfo ? 5 : 0}>
              Lorem ipsum dolor sit amet consectetur. Dictum eget elementum
              metus eu aliquam libero elit odio facilisis. Leo elit id volutpat
              cursus leo ultrices scelerisque lobortis massa. Aliquet
              pulvinar... Lorem ipsum dolor sit amet consectetur. Dictum eget
              elementum metus eu aliquam libero elit odio facilisis. Leo elit id
              volutpat cursus leo ultrices scelerisque lobortis massa. Aliquet
              pulvinar...
            </Text>
          </Pressable>
          <Text ff="Bold" fs={16}>
            Categorias
          </Text>
          <View style={{ marginLeft: -20 }}>
            <Categories
              categ={{
                home: false,
                clean: false,
                cloth: false,
                food: false,
                tech: false,
                others: false,
                shops: false,
              }}
            />
          </View>
          <View style={{ height: 48 }}>
            <SearchBar {...{ searchBar, setSearchBar }} />
          </View>
          <Text ff="Bold" fs={16}>
            Inventario
          </Text>
          <View style={{ marginHorizontal: -20 }}>
            <ItemsCtn data={itemsData} load={load} />
          </View>
        </View>
      </ScrollView>
      <Animated.View style={[st.x, { width }]}>
        <View style={st.btn_ctn}>
          <Pressable style={st.icon}>
            <IconTelegram color={v.prime} />
          </Pressable>
          <Pressable style={st.icon}>
            <IconWhatsapp color={v.prime} />
          </Pressable>
          <Pressable style={st.icon}>
            <IconMessenger color={v.prime} />
          </Pressable>
          <Pressable style={st.icon}>
            <IconInstagram color={v.prime} />
          </Pressable>
          <Pressable style={st.icon}>
            <IconBubble color={v.prime} />
          </Pressable>

          <Pressable style={st.contact_btn} onPress={toggle}>
            {openBtn ? (
              <IconCross color={v.prime} />
            ) : (
              <IconBag color={v.prime} />
            )}
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default ShopPage;

const st = StyleSheet.create({
  ctn: {
    display: "flex",
    // gap: 14,
    minHeight: wh,
  },
  img_ctn: {
    width: ww,
    height: ww,
    overflow: "hidden",
    position: "relative",
  },
  back_btn: ({ pressed }) => ({
    position: "absolute",
    transform: [{ rotate: "180deg" }],
    padding: 8,
    borderRadius: 12,
    backgroundColor: v.prime,
    top: 20,
    left: 20,
    zIndex: 300,
    opacity: pressed ? 0.5 : 1,
  }),
  shop_btn: ({ pressed }) => ({
    position: "absolute",
    padding: 8,
    borderRadius: 12,
    backgroundColor: v.prime,
    top: 20,
    right: 20,
    zIndex: 300,
    opacity: pressed ? 0.5 : 1,
  }),

  img: {
    width: "100%",
    height: "100%",
  },
  content_ctn: {
    zIndex: 200,
    marginTop: -24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    backgroundColor: v.prime,
    display: "flex",
    gap: 12,
    padding: 20,
    minHeight: wh - 24,
    paddingBottom:92,
  },
  top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviews_btn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  btn_ctn: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
    // justifyContent: "center",
    backgroundColor: v.four,
    borderRadius: 12,
    // width: 52,
    width: 320,
    height: 52,
    paddingRight: 38,
  },
  contact_btn: ({ pressed }) => ({
    position: "absolute",
    alignSelf: "center",
    right: 0,
    padding: 14,
    backgroundColor: v.four,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    opacity: pressed ? 0.5 : 1,
  }),
  abs_ctn: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
  },

  icon: {
    padding: 14,
    // position:'absolute',
  },
  x: {
    borderRadius: 12,
    // width:'100%',
    // marginTop: "auto",
    alignSelf: "flex-end",
    width: 52,
    height: 52,
    overflow: "hidden",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
