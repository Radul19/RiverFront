import { View, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import Text from "../components/Text";
import img from "../images/item.png";
import React, { useEffect, useState } from "react";
import { Categories, StarsCtn, wh, ww } from "../components/DisplayItems";
import t from "../components/stylesVar";
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
import Animated, { FadeIn, FadeOut, useSharedValue, withTiming } from "react-native-reanimated";
import { PrimaryBtn } from "../components/Btns";

const ItemPage = ({preview,navigation}) => {
  const [openBtn, setOpenBtn] = useState(false);
  const [openInfo, setOpenInfo] = useState(false)

  const width = useSharedValue(52);

  const toggle = () => {
    setOpenBtn(!openBtn);

    // width.value = '100%'
  };

  const toggleInfo = ()=>{
    setOpenInfo(!openInfo)
  }

  const confirmPreview = ()=>{
    navigation.navigate("Commerce")
  }

  useEffect(() => {
    if (openBtn) {
      width.value = withTiming(320);
    } else {
      width.value = withTiming(52);
    }
  }, [openBtn]);

  return (
    <Animated.View entering={FadeIn} style={{ flex: 1,backgroundColor: t.prime }} exiting={FadeOut}>
      <ScrollView contentContainerStyle={st.ctn}>
        <View style={st.img_ctn}>
          <Pressable style={st.back_btn} >
            <IconArrowRight size={20} />
          </Pressable>
          {!preview && (
          <Pressable style={st.shop_btn} >
            <IconStallLine size={20} />
          </Pressable>
          )}
          <Image source={img} style={st.img} />
        </View>
        <View style={st.content_ctn}>
          <View style={st.top}>
            <Text ff="Medium" fs={20} style={{ width: "80%" }}>
              Sandalias con nombre raro y largo para hacer pruebas
            </Text>
            <Pressable style={{ padding: 8 }}>
              <IconHeartLine />
            </Pressable>
          </View>
          <Pressable style={st.reviews_btn}>
            <StarsCtn stars={4} size={20} />
            <Text ff="Bold">4.0</Text>
            <Text style={{ color: t.third }}>{"(29 reseñas)"}</Text>
          </Pressable>
          <Text ff="Bold" fs={32}>
            $29.99
          </Text>
          <Pressable onPress={toggleInfo} style={({pressed})=>({opacity:pressed?0.5:1})} >
          <Text numberOfLines={!openInfo?5:0}>
            Lorem ipsum dolor sit amet consectetur. Dictum eget elementum metus
            eu aliquam libero elit odio facilisis. Leo elit id volutpat cursus
            leo ultrices scelerisque lobortis massa. Aliquet pulvinar... Lorem
            ipsum dolor sit amet consectetur. Dictum eget elementum metus eu
            aliquam libero elit odio facilisis. Leo elit id volutpat cursus leo
            ultrices scelerisque lobortis massa. Aliquet pulvinar...
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
          {!preview &&(
          <Animated.View style={[st.x, { width }]}>
            <View style={st.btn_ctn}>
              <Pressable style={st.icon}>
                <IconTelegram color={t.prime} />
              </Pressable>
              <Pressable style={st.icon}>
                <IconWhatsapp color={t.prime} />
              </Pressable>
              <Pressable style={st.icon}>
                <IconMessenger color={t.prime} />
              </Pressable>
              <Pressable style={st.icon}>
                <IconInstagram color={t.prime} />
              </Pressable>
              <Pressable style={st.icon}>
                <IconBubble color={t.prime} />
              </Pressable>

              <Pressable style={st.contact_btn} onPress={toggle}>
                {openBtn ? (
                  <IconCross color={t.prime} />
                ) : (
                  <IconBag color={t.prime} />
                )}
              </Pressable>
            </View>
          </Animated.View>
          )}
          {preview && (
            <>
            <View style={{marginTop:'auto'}} ></View>
            <PrimaryBtn text='Confirmar vista previa' action={confirmPreview} />
            </>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default ItemPage;

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
    position:'relative',
  },
  back_btn:({pressed})=>({
    position:'absolute',
    transform:[{rotate:'180deg'}],
    padding:8,
    borderRadius:12,
    backgroundColor:t.prime,
    top:20,
    left:20,
    zIndex:300,
    opacity:pressed?0.5:1,
  }),
  shop_btn:({pressed})=>({
    position:'absolute',
    padding:8,
    borderRadius:12,
    backgroundColor:t.prime,
    top:20,
    right:20,
    zIndex:300,
    opacity:pressed?0.5:1,
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
    backgroundColor: t.prime,
    display: "flex",
    gap: 12,
    padding: 20,
    height: wh - 24,
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
    backgroundColor: t.four,
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
    padding:14,
    backgroundColor: t.four,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    opacity:pressed?0.5:1,
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
    marginTop: "auto",
    alignSelf: "flex-end",
    width: 52,
    height: 52,
    overflow: "hidden",
  },
});
