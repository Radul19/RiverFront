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
import { getItem, toggleFavorite, updateReview } from "../../api/general";
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
import { ErrorText } from "./Profile";

const reviewsX = [
  { stars: 4 },
  { stars: 5 },
  { stars: 2 },
  { stars: 3 },
  { stars: 4 },
  { stars: 5 },
  { stars: 4 },
  { stars: 3 },
  { stars: 5 },
  { stars: 5 },
  { stars: 5 },
  { stars: 2 },
];

const percentsReview = (reviews) => {
  let test = [0, 0, 0, 0, 0];
  let len = reviews.length;
  reviews.forEach((r) => {
    test[r.stars - 1] += 1;
  });
  test = test.map((num) => parseFloat(((num / len) * 100).toFixed(2)));
  // return test.reverse();
  return test;
};

const findReview = (item, user_id) => {
  let bool = false;
  item.reviews.find((rev) => {
    if (rev.user_id._id === user_id) bool = true;
  });
  return bool;
};

const ItemPage = ({ navigation, route }) => {
  const { userData } = useContext(Context);
  const [isReady, setIsReady] = useState(false);
  const [heart, setHeart] = useState(false);
  const [item, setItem] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [modal, setModal] = useState(false);

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

  useEffect(() => {
    // let t1 = performance.now()
    if (route.params && route.params.item) {
      setItem(route.params.item)
    }else if(route.params && route.params.id) {
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
    
    // let t2 = performance.now()
    // console.log(`test ${t2-t1} ml`)
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
          {!reviewOpen ? (
            <ItemInfo {...{ item, toggleReview }} />
          ) : (
            <ItemReviews {...{ item, toggleReview,toggleModal }} user_id={userData._id} />
          )}
        </View>
      </ScrollView>
      {!modal && (
        <>
          {!reviewOpen ? (
            <ContactBtn />
          ) : (
            <CommentBtn
              {...{ toggleModal }}
              isCommented={findReview(item, userData._id)}
            />
          )}
        </>
      )}
      {modal && (
        <Modal_Review
          toggle={toggleModal}
          user_id={userData._id}
          item={item}
          setItem={setItem}
        />
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
      <ReviewsBtn {...{ toggleReview, reviews: item.reviews }} />
      <Text ff="Bold" fs={32}>
        ${Number.parseFloat(item.price).toFixed(2)}
      </Text>
      <Pressable
        onPress={toggleInfo}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Text numberOfLines={!openInfo ? 5 : 0} filter={true} >{item.description}</Text>
      </Pressable>
      <Text ff="Bold" fs={16}>
        Categorias
      </Text>
      <Categories all={false} categ={item.categories} handleCateg={() => {}} />
    </Animated.View>
  );
};
const avgStars = (reviews) => {
  if (reviews.length <= 0) return 0;
  let aux = 0;
  reviews.forEach((elm) => {
    aux = aux + elm.stars;
  });
  aux = aux / reviews.length;
  return (Math.floor(aux * 10) / 10).toFixed(1);
};

const ItemReviews = ({ toggleReview, item, user_id ,toggleModal}) => {
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
          <Text {...{ fs: 42, ff: "Bold" }}>{avgStars(item.reviews)}</Text>
          <StarsCtn stars={avgStars(item.reviews)} size={20} />
          <Text style={{ marginTop: 4 }}>({item.reviews.length})</Text>
        </View>
        <View style={st.chart_lines}>
          {percentsReview(item.reviews).map((percent, index) => (
            <ReviewLine key={index} num={index + 1} percent={percent} />
          ))}
        </View>
      </View>
      <View  style={{height:2,width:'100%',backgroundColor:v.second,borderRadius:12}} /> 
      <View style={st.reviews_ctn}>
        {item.reviews.map((rev, index) => {
          if (rev.user._id === user_id)
            return <ReviewCard key={rev._id} review={rev} {...{ toggleModal }} />;
        })}
        {item.reviews.map((rev, index) => {
          if (rev.user._id !== user_id)
            return <ReviewCard key={rev._id} review={rev} />;
        })}
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
    flexDirection: "column-reverse",
  },
  reviews_ctn: { display: "flex", gap: 24, marginTop: 12 },
  modal_blackscreen: {
    width: "100%",
    height: "100%",
    backgroundColor: "#191919BF",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex:100
  },
  modal_ctn: {
    width: ww * 0.9,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: v.prime,
    borderRadius: 12,
    gap: 24,
  },
});

const findRev = (reviews,user_id)=>{
  let val = ''
  let bool = false
  reviews.forEach(rev => {
    if(rev.user._id === user_id) {
      val = rev.text
      bool = true
    }
  });
  return [val ,bool]
}

const Modal_Review = ({ toggle, user_id, item, setItem }) => {
  const [stars, setStars] = useState(4);
  const [input, setInput] = useState(findRev(item.reviews,user_id)[0]);
  const [error, setError] = useState(false);
  const sendReview = async () => {
    setError(false);
    // if (input.length <= 0) return setError("La reseña no puede estar vacía");
    // Send to back here (user_id,input,stars,isEdit,item._id)
    const { status, data } = await updateReview(
      user_id,
      input,
      stars,
      findRev(item.reviews,user_id)[1],
      item._id
    );
    if (status === 200) {
      toggle();
      setItem(data);
    } else {
      setError(data.msg);
    }
  };
  const handleInput = (_, value) => {
    setInput(value);
  };

  return (
    <Animated.View
      entering={FadeIn}
      style={st.modal_blackscreen}
      exiting={FadeOut}
    >
      <View style={st.modal_ctn}>
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
          custom={handleInput}
          multiline={true}
        />
        {error && <ErrorText text={error} />}
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
