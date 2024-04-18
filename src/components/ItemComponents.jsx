import { useEffect, useState } from "react";
import { View, StyleSheet, Image, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StarsCtn, ww, wh } from "./DisplayItems";
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
  Icon_BubbleChat,
} from "./Icons";
import { Avatar } from "./Inputs";
import { v } from "./stylesVar";
import Text from "./Text";

export const ContactBtn = ({ openBtn, width, toggle }) => {
  return (
    <Animated.View style={[st.wide_ctn, { width }]}>
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

export const CommentBtn = ({toggleModal}) => {
  return (
    <TouchableOpacity style={st.commentBtn_ctn} onPress={toggleModal} >
      <View style={st.commentBtn}>
        <View style={{ marginLeft: -24, transform: [{ scaleX: -1 }] }}>
          <Icon_BubbleChat />
        </View>
        <Text style={{ color: "#eee" }}>Comentar</Text>
      </View>
    </TouchableOpacity>
  );
};

const reviewsX = [{ stars: 4 }, { stars: 5 }, { stars: 2 }, { stars: 3 }];
const avgStars = (reviews) => {
  if (reviews.length <= 0) return 0;
  let aux = 0;
  reviews.forEach((elm) => {
    aux = aux + elm.stars;
  });
  aux = aux / reviews.length;
  return Math.floor(aux * 10) / 10;
};

export const ReviewsBtn = ({ reviews = reviewsX, toggleReview }) => {
  return (
    <Pressable style={st.reviews_btn} onPress={toggleReview}>
      <StarsCtn stars={avgStars(reviews)} size={20} />
      <Text ff="Bold">{avgStars(reviews)}</Text>
      <Text style={{ color: v.third }}>{`(${reviews.length} reseñas)`}</Text>
    </Pressable>
  );
};

// IMAGE LOGIC


// const ximages = [img, img, img];
export const ImageDisplay = ({
  images = [],
  goBack = false,
  stall = false,
}) => {
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
      const mid = (ww / 3) * -1;
      const whole = ww * -1;
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

  const Dot = ({ pos, index }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      width: pos.value === index ? 14 : 10,
      height: pos.value === index ? 14 : 10,
      opacity: pos.value === index ? 1 : 0.5,
    }));
    return <Animated.View style={[st.dot, animatedStyle]}></Animated.View>;
  };

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
        <Animated.View style={[st.carousel_ctn, animatedStyle]}>
          {images.map((i, index) => (
            <Image
              style={st.img_carousel}
              key={index}
              source={{ uri: i.image ? i.image : i }}
            />
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

export const ItemTitle = ({ sendFavorite = () => {}, item, id = false }) => {
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

export const ReviewLine = ({ num, percent }) => {
  return (
    <View
      style={{
        position: "relative",
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "90%",
      }}
    >
      <Text style={{ width: 10, textAlign: "center" }} ff="Bold">
        {num}
      </Text>
      <View
        style={{
          width: "100%",
          height: 8,
          backgroundColor: "#191919",
          borderRadius: 12,
        }}
      />
    </View>
  );
};

export const ReviewCard = () => {
  return (
    <View style={{ display: "flex", flexDirection: "row", gap: 12 }}>
      <Avatar num={2} />
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Text ff="Bold">Username</Text>
        <Text>Excelente Servicio</Text>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  btn_ctn: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
    backgroundColor: v.four,
    borderRadius: 12,
    width: 320,
    height: 52,
    paddingRight: 38,
  },
  wide_ctn: {
    position: "absolute",
    borderRadius: 12,
    right: 20,
    bottom: 20,
    alignSelf: "flex-end",
    width: 52,
    height: 52,
    overflow: "hidden",
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
  commentBtn_ctn: {
    position: "absolute",
    width: "100%",
    bottom: 20,
    alignSelf: "flex-end",
    overflow: "hidden",
    paddingHorizontal: 20,
    display: "flex",
  },
  commentBtn: {
    backgroundColor: "#191919",
    borderRadius: 12,
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },
  reviews_btn: ({ pressed }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    opacity: pressed ? 0.5 : 1,
  }),
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
  top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    padding: 14,
  },
  carousel_ctn: {
    height: ww,
    width: ww,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
  },
  img_carousel: { height: ww, width: ww },
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
});
