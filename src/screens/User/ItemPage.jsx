import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Text from "../../components/Text";
import React, { useContext, useEffect, useState } from "react";
import {
  Categories,
  HeaderBtn,
  StarsCtn,
  wh,
  ww,
} from "../../components/DisplayItems";
import { v } from "../../components/stylesVar";
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getItem, toggleFavorite } from "../../api/general";
import Context from "../../components/Context";
import {
  CommentBtn,
  ContactBtn,
  ImageDisplay,
  ItemTitle,
  ReviewCard,
  ReviewLine,
  ReviewsBtn,
} from "../../components/ItemComponents";
import { IconCross, IconStar, IconStarLine } from "../../components/Icons";
import { Input } from "../../components/Inputs";
import { PrimaryBtn } from "../../components/Btns";

const ItemPage = ({ navigation, route }) => {
  const { userData } = useContext(Context);
  const [isReady, setIsReady] = useState(false);
  const [heart, setHeart] = useState(false);
  const [openBtn, setOpenBtn] = useState(false);
  const [item, setItem] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const width = useSharedValue(52);

  const toggle = () => {
    // setModal(!modal);
    if (!openBtn) {
      width.value = withTiming(320);
    } else {
      width.value = withTiming(52);
    }
    setOpenBtn(!openBtn);
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

  const toggleReview = () => {
    setReviewOpen((prev) => !prev);
  };
  const toggleModal = () => {
    setModal(!modal);
  };

  // useEffect(() => {
  //   if (openBtn) {
  //     width.value = withTiming(320);
  //   } else {
  //     width.value = withTiming(52);
  //   }
  // }, [openBtn]);

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
      {modal && <Modal_Review toggle={toggleModal} />}
      <ScrollView contentContainerStyle={st.ctn} style={{ zIndex: -1 }}>
        <ImageDisplay images={item.images} goBack={goBack} stall={true} />
        <View style={st.content_ctn}>
          {!reviewOpen ? (
            <ItemInfo {...{ item, toggleReview }} />
          ) : (
            <ItemReviews {...{ item, toggleReview }} />
          )}
        </View>
      </ScrollView>
      {!modal && (
        <>
          {!reviewOpen ? (
            <ContactBtn {...{ openBtn, width, toggle }} />
          ) : (
            <CommentBtn {...{ toggleModal }} />
          )}
        </>
      )}
    </Animated.View>
  );
};

export default ItemPage;

export const ItemInfo = ({ item, toggleReview = () => {} }) => {
  const [openInfo, setOpenInfo] = useState(false);

  const toggleInfo = () => {
    setOpenInfo(!openInfo);
  };

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={st.content_ctn_inside}
    >
      <ItemTitle item={item} />
      <ReviewsBtn {...{ toggleReview }} />
      <Text ff="Bold" fs={32}>
        {Number.parseFloat(item.price).toFixed(2)}
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
      <Categories all={false} categ={item.categories} handleCateg={() => {}} />
    </Animated.View>
  );
};

const ItemReviews = ({ toggleReview }) => {
  const back = () => {
    toggleReview();
  };
  return (
    <Animated.View
      entering={FadeIn}
      style={st.content_ctn_inside}
      exiting={FadeOut}
    >
      <HeaderBtn text="Reseñas" onPress={back} />
      <View style={st.chart_ctn}>
        <View style={st.chart_review}>
          <Text {...{ fs: 42, ff: "Bold" }}>4.8</Text>
          <StarsCtn stars={4} size={20} />
        </View>
        <View style={st.chart_lines}>
          <ReviewLine num={5} />
          <ReviewLine num={4} />
          <ReviewLine num={3} />
          <ReviewLine num={2} />
          <ReviewLine num={1} />
        </View>
      </View>
      <View style={st.reviews_ctn}>
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
      </View>
    </Animated.View>
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

const st = StyleSheet.create({
  ctn: {
    display: "flex",
    minHeight: wh,
    position: "relative",
    zIndex: 20,
  },
  img_ctn: {
    width: ww,
    height: ww,
    overflow: "hidden",
    position: "relative",
  },
  content_ctn: {
    zIndex: 200,
    marginTop: -24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    backgroundColor: v.prime,
    padding: 20,
    minHeight: wh * 0.65,
  },
  content_ctn_inside: {
    display: "flex",
    gap: 12,
    paddingBottom: 72,
  },
  wire: {
    backgroundColor: "#c9c9c9",
    height: 24,
    width: "100%",
    borderRadius: 6,
  },
  chart_ctn: {
    display: "flex",
    flexDirection: "row",
    height: 100,
  },
  chart_review: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
  },
  chart_lines: {
    display: "flex",
    width: "70%",
    paddingLeft: 24,
    justifyContent: "space-between",
  },
  reviews_ctn: { display: "flex", gap: 24, marginTop: 24 },
});

const Modal_Review = ({ toggle }) => {
  const [stars, setStars] = useState(4);
  const [input, setInput] = useState("");

  const sendReview = () => {};

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#191919BF",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      exiting={FadeOut}
    >
      <View
        style={{
          width: ww * 0.9,
          padding: 16,
          paddingBottom: 24,
          backgroundColor: v.prime,
          borderRadius: 12,
          gap: 24,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text fs={24} ff="Bold">
            Reseña
          </Text>
          <TouchableOpacity onPress={toggle}>
            <IconCross />
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {starArr.map((value, index) => (
            <StarRev key={value} {...{ value, stars, setStars }} />
          ))}
        </View>
        <Input
          placeholder="Comentario aqui..."
          initialValue={input}
          custom={setInput}
          multiline={true}
        />
        <PrimaryBtn text="Enviar Reseña" action={sendReview} />
      </View>
    </Animated.View>
  );
};

const starArr = [1, 2, 3, 4, 5];

const StarRev = ({ stars, value, setStars }) => {
  const press = () => setStars(value);
  return (
    <Pressable
      onPress={press}
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
    >
      {stars >= value ? <IconStar size={32} /> : <IconStarLine size={32} />}
    </Pressable>
  );
};
