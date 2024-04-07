import { View, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import Text from "../components/Text";
import img from "../images/item.png";
import React, { useContext, useEffect, useState } from "react";
import { Categories, StarsCtn, wh, ww } from "../components/DisplayItems";
import { v } from "../components/stylesVar";
import {
  IconArrowRight,
  IconBag,
  IconBubble,
  IconCross,
  IconHeart,
  IconHeartLine,
  IconInstagram,
  IconMessenger,
  IconStallLine,
  IconTelegram,
  IconWhatsapp,
} from "../components/Icons";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { PrimaryBtn } from "../components/Btns";
import { createItem, getItem, toggleFavorite } from "../api/general";
import Context from "../components/Context";
import { useNavigation } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const ItemPage = ({ navigation, route }) => {
  const { userData } = useContext(Context);
  const [isReady, setIsReady] = useState(false);
  const [heart, setHeart] = useState(false);
  const [openBtn, setOpenBtn] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [item, setItem] = useState(false);

  const width = useSharedValue(52);

  const toggle = () => {
    setOpenBtn(!openBtn);
  };

  const toggleInfo = () => {
    setOpenInfo(!openInfo);
  };

  const goBack = () => {
    navigation.goBack();
  };
  const sendFavorite = async (state) => {
    if (userData) {
      const info = {
        user_id: userData._id,
        item_id: item._id,
        state,
      };
      await toggleFavorite(info);
    }
  };

  useEffect(() => {
    if (openBtn) {
      width.value = withTiming(320);
    } else {
      width.value = withTiming(52);
    }
  }, [openBtn]);

  useEffect(() => {
    if (route.params) {
      (async () => {
        const { status, data } = await getItem(route.params.id);
        if (status === 200) {
          setItem(data);
          if (data.favorites.includes(userData._id)) {
            setHeart(true);
          }
          setIsReady(true);
        }
      })();
    }
    return () => {
      setItem(false);
    };
  }, []);

  // if (true) {
  //   return <Playground />;
  // }
  if (!item) {
    return <Wireframe />;
  }

  return (
    <Animated.View
      entering={FadeIn}
      style={{ flex: 1, backgroundColor: v.prime }}
      exiting={FadeOut}
    >
      <ScrollView contentContainerStyle={st.ctn}>
        <ImageDisplay images={item.images} goBack={goBack} stall={true} />
        <View style={st.content_ctn}>
          <ItemTitle
            item={item}
            sendFavorite={sendFavorite}
            id={userData._id}
          />
          <ReviewsBtn reviews={item.reviews} />
          <Text ff="Bold" fs={32}>
            ${Number.parseFloat(item.price).toFixed(2)}
          </Text>
          <Pressable
            onPress={toggleInfo}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Text numberOfLines={!openInfo ? 5 : 0}>{item.description}</Text>
          </Pressable>
          <Text ff="Bold" fs={16}>
            Categorias
          </Text>
          <Categories
            all={false}
            categ={item.categories}
            handleCateg={() => {}}
          />
        </View>
      </ScrollView>
      <ContactBtn {...{ openBtn, width, toggle }} />
    </Animated.View>
  );
};

export default ItemPage;

const ContactBtn = ({ openBtn, width, toggle }) => {
  return (
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
  );
};
// const ximages = [img, img, img];
const mid = (ww / 3) * -1;
const whole = ww * -1;
const ImageDisplay = ({ images=[], goBack = false, stall = false }) => {
  const pos = useSharedValue(0);
  const position = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      let start = pos.value === 0;
      let end = pos.value === images.length - 1;
      if (start && e.translationX <= 0) {
        position.value = e.translationX;
      } else if (pos.value > 0 && !end) {
        position.value = -ww * pos.value + e.translationX;
      } else if (end && e.translationX >= 0) {
        position.value = -ww * pos.value + e.translationX;
      }
    })
    .onEnd((e) => {
      let start = whole * pos.value;
      let right = start + mid;
      let left = start - mid;

      if (position.value < right) {
        position.value = withTiming(-ww * (pos.value + 1), { duration: 300 });
        pos.value = pos.value + 1;
      } else if (position.value > left) {
        position.value = withTiming(-ww * (pos.value - 1), { duration: 300 });
        pos.value = pos.value - 1;
      } else position.value = withTiming(-ww * pos.value, { duration: 300 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  return (
    <View style={st.img_ctn}>
      {goBack && (
        <Pressable style={st.back_btn} onPress={goBack}>
          <IconArrowRight size={20} />
        </Pressable>
      )}
      {stall && (
        <Pressable style={st.shop_btn}>
          <IconStallLine size={20} />
        </Pressable>
      )}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[st.testy, animatedStyle]}>
          {images.map((i, index) => (
            <Image style={st.testx} key={index} source={{uri:i.image?i.image:i}} />
            // <Image style={st.testx} key={index} source={i} />
          ))}
        </Animated.View>
      </GestureDetector>
      <View style={st.dots_ctn}>
        {images.map((i, index) => (
          <Dot pos={pos} index={index} key={index} />
        ))}
      </View>
    </View>
  );
};

const ItemTitle = ({ sendFavorite = () => {}, item, id = false }) => {
  return (
    <View style={st.top}>
      <Text ff="Medium" fs={20} style={{ width: "80%" }}>
        {item.name}
      </Text>
      <HeartBtn
        sendFavorite={id ? sendFavorite : false}
        initial={id ? item.favorites.includes(id) : false}
      />
    </View>
  );
};

const reviewsX = [{ stars: 4 }, { stars: 5 }, { stars: 2 }, { stars: 3 }]
const avgStars = ()=>{
  let aux = 0
  reviewsX.forEach(element => {
    aux = aux + element.stars
  });
  return aux
}

const ReviewsBtn = ({reviews}) => {
  return (
    <Pressable style={st.reviews_btn}>
      <StarsCtn stars={4} size={20} />
      <Text ff="Bold">{avgStars()}</Text>
      <Text style={{ color: v.third }}>{`(${reviewsX.length} reseñas)`}</Text>
    </Pressable>
  );
};

const HeartBtn = ({ initial, sendFavorite = false }) => {
  const [heart, setHeart] = useState(initial);
  const [isReady, setIsReady] = useState(false);
  const toggleHeart = () => {
    setHeart(!heart);
  };

  useEffect(() => {
    if (isReady && sendFavorite) {
      const tm = setTimeout(() => {
        (async () => {
          await sendFavorite(heart);
        })();
      }, 1000);
      return () => {
        clearTimeout(tm);
      };
    } else {
      setIsReady(true);
    }
  }, [heart]);

  return (
    <Pressable
      style={({ pressed }) => ({
        padding: 8,
        opacity: pressed ? 0.5 : 1,
      })}
      onPress={toggleHeart}
    >
      {heart ? <IconHeart /> : <IconHeartLine />}
    </Pressable>
  );
};

const Wireframe = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={[st.img_ctn, { backgroundColor: "#c9c9c9" }]}></View>
      <View style={[st.content_ctn, { gap: 24 }]}>
        <View style={[st.wire, { width: "100%" }]} />
        <View style={[st.wire, { width: "80%" }]} />
        <View style={[st.wire, { width: "60%" }]} />
        <View style={[st.wire, { width: "100%", height: 64 }]} />
      </View>
    </View>
  );
};


const item2 = {
  name:'Test 01',
  price: 12.99,
  description: "Antes de ingresar a los círculos encontramos la Selva, el Coliseo y la Colina donde Dante se encuentra perdido en el medio del camino de nuestra vida: detrás de la colina se encuentra la ciudad de Jerusalén, debajo de la cual se imagina cavada la inmensa vorágine del Infierno. Entra entonces por la Puerta del Infierno y penetra así en el Ante-infierno. Superando el río Aqueronte en la barca de Caronte entra en el verdadero Infierno. Este infierno es un lugar infinito, cuantas más personas entren a este lugar, más crece y así hasta el fin de los tiempos sin ningún límite",
  categories:['home','clean'],
  images: [img,img,img],
  _id: "_",
  owner_id: "_",
  favorites: [],
  reviews: [],
}
export const Preview = ({ item=item2, navigation, resetAll, goBack }) => {
  const {userData} = useContext(Context) 
  const [openInfo, setOpenInfo] = useState(false)

  const toggleInfo = () => {
    setOpenInfo(!openInfo);
  };

  const confirmPreview = async () => {
    // console.log({...item,owner_id:userData.commerce._id})
    const {status,data} = await createItem({...item,owner_id:userData.commerce._id})
    if(status === 200){
      resetAll();
      navigation.navigate("Commerce");
    }else{
      goBack()
    }

    // console.log(item.images.length);
  };

  return (
    <Animated.View
      entering={FadeIn}
      style={{ flex: 1, backgroundColor: v.prime }}
      exiting={FadeOut}
    >
      <ScrollView contentContainerStyle={st.ctn}>
        <ImageDisplay images={item.images} goBack={goBack} stall={false} />
        <View style={st.content_ctn}>
          <ItemTitle item={item} />
          <ReviewsBtn />
          <Text ff="Bold" fs={32}>
            {/* ${Number.parseFloat(item.price).toFixed(2)} */}
            ${Number.parseFloat(item.price).toFixed(2)}
          </Text>
          <Pressable
            onPress={toggleInfo}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Text numberOfLines={!openInfo ? 5 : 0}>{item.description}</Text>
          </Pressable>
          <Text ff="Bold" fs={16}>
            Categorias
          </Text>
          <Categories
            all={false}
            categ={item.categories}
            handleCateg={() => {}}
          />
        </View>
      </ScrollView>
      <View style={{ padding: 20,position:'absolute',zIndex:500,width:'100%',bottom:0 }}>
        <PrimaryBtn text="Confirmar" action={confirmPreview}  />
      </View>
    </Animated.View>
  );
};
const amount = ["blue", "red", "green", "yellow"];

const Dot = ({ pos, index }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    width: pos.value === index ? 14 : 10,
    height: pos.value === index ? 14 : 10,
    opacity: pos.value === index ? 1 : 0.5,
  }));
  return <Animated.View style={[st.dot, animatedStyle]}></Animated.View>;
};

const st = StyleSheet.create({
  ctn: {
    display: "flex",
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
    minHeight: wh * 0.65,
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
    position: "absolute",
    borderRadius: 12,
    // width:'100%',
    right: 20,
    bottom: 20,
    alignSelf: "flex-end",
    width: 52,
    height: 52,
    overflow: "hidden",
  },
  wire: {
    backgroundColor: "#c9c9c9",
    height: 24,
    width: "100%",
    borderRadius: 6,
  },
  testy: {
    height: ww,
    width: ww,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
  },
  testx: { height: ww, width: ww, backgroundColor: "blue" },
  testz: { height: ww, width: ww, backgroundColor: "yellow" },
  testw: { height: ww, width: ww, backgroundColor: "green" },
  dot: { height: 12, width: 12, borderRadius: 12, backgroundColor: "black" },
  dots_ctn: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    width: ww,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    zIndex: 200,
    height: 42,
    bottom: 24,
  },
  // x: {
  //   borderRadius: 12,
  //   // width:'100%',
  //   marginTop: "auto",
  //   alignSelf: "flex-end",
  //   width: 52,
  //   height: 52,
  //   overflow: "hidden",
  // },
});
