import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import Text from "../../../components/Text";
import React, { Dispatch, useContext, useEffect, useState } from "react";
import {
  Categories,
  HeaderBtn,
  StarsCtn,
} from "../../../components/DisplayItems";
import { v } from "../../../components/stylesVar";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { toggleFavorite, updateReview } from "../../../api/general";
import { getItem } from "../../../api/guest";
import Context from "../../../components/Context";
import {
  CommentBtn,
  ContactBtn,
  ImageDisplay,
  ItemTitle,
  ReviewCard,
  ReviewLine,
  ReviewsBtn,
} from "../../../components/ItemComponents";
import { IconCross, IconStar, IconStarLine } from "../../../components/Icons";
import { Input } from "../../../components/Inputs";
import { PrimaryBtn } from "../../../components/Btns";
import { ErrorText } from "../Profile/Profile";
import { ItemType, ReviewType } from "../../../types/item";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreensType } from "../../../types/screens";
import st from "./style";
import { CommerceType } from "../../../types/user";
import { useNavigation } from "@react-navigation/native";

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

const percentsReview = (reviews: ReviewType[]) => {
  let test = [0, 0, 0, 0, 0];
  let len = reviews.length;
  reviews.forEach((r) => {
    test[r.stars - 1] += 1;
  });
  test = test.map((num) => parseFloat(((num / len) * 100).toFixed(2)));
  // return test.reverse();
  return test;
};

type FindReviewProps = { (item: ItemType, user_id: string): boolean };
const findReview: FindReviewProps = (item, user_id) => {
  let bool = false;
  item.reviews.find((rev) => {
    if (typeof rev.user === "object" && rev.user?._id === user_id) bool = true;
  });
  return bool;
};

type Props = NativeStackScreenProps<ScreensType, "ItemPage">;
const ItemPage = ({ navigation, route }: Props) => {
  const { userData } = useContext(Context);
  // const [heart, setHeart] = useState(false);
  const [item, setItem] = useState<ItemType | undefined>(undefined);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };
  const sendFavorite = async (state: boolean) => {
    if (userData) {
      const info = {
        user_id: userData._id,
        item_id: item?._id,
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
      setItem(route.params.item);
    } else if (route.params && route.params.id) {
      (async () => {
        const { status, data } = await getItem(route.params.id);
        if (status === 200) {
          setItem(data);
          // if (data.favorites.includes(userData._id)) {
          //   setHeart(true);
          // }
        }
      })();
    }

    // let t2 = performance.now()
    // console.log(`test ${t2-t1} ml`)
    return () => {
      setItem(undefined);
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
        <ImageDisplay images={item.images} goBack={goBack} />
        {/* <ImageDisplay images={item.images} goBack={goBack} stall={item.commerce} /> */}
        <View style={st.content_ctn}>
          {!reviewOpen ? (
            <ItemInfo {...{ item, toggleReview, sendFavorite }} />
          ) : (
            <ItemReviews
              {...{ item, toggleReview, toggleModal }}
              user_id={userData._id}
            />
          )}
        </View>
      </ScrollView>

      {/** BTNS */}
      {modal ? (
        <Modal_Review
          toggle={toggleModal}
          user_id={userData._id}
          item={item}
          setItem={setItem}
        />
      ) : (
        <>
          {!reviewOpen ? (
            <ContactBtn
              socials={
                typeof item.commerce === "object"
                  ? item.commerce.socials
                  : undefined
              }
              phone={
                typeof item.commerce === "object"
                  ? item.commerce.phone : undefined
              }/>
          ) : (
            <CommentBtn
              {...{ toggleModal }}
              isCommented={findReview(item, userData._id)}
            />
          )}
        </>
      )}
    </Animated.View>
  );
};

export default ItemPage;

export const ItemInfo = ({
  item,
  toggleReview,
  sendFavorite,
}: {
  item: ItemType;
  toggleReview?: () => void;
  sendFavorite?: (state: boolean) => Promise<void>;
}) => {
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
      <ItemTitle item={item} sendFavorite={sendFavorite} />
      <OwnerDisplay commerce={item.commerce} />
      <ReviewsBtn {...{ toggleReview, reviews: item.reviews }} />
      <Text ff="Bold" fs={32}>
        ${Number.parseFloat(item.price).toFixed(2)}
      </Text>
      <Pressable
        onPress={toggleInfo}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Text numberOfLines={!openInfo ? 5 : 0} filter={true}>
          {item.description}
        </Text>
      </Pressable>
      <Categories all={false} categ={item.categories} handleCateg={() => {}} />
    </Animated.View>
  );
};
const avgStars = (reviews: ReviewType[]) => {
  if (reviews.length <= 0) return 0;
  let aux = 0;
  reviews.forEach((elm) => {
    aux = aux + elm.stars;
  });
  aux = aux / reviews.length;
  return parseInt((Math.floor(aux * 10) / 10).toFixed(1));
};

type ItemRevProps = {
  toggleReview: () => void;
  item: ItemType | CommerceType;
  user_id: string;
  toggleModal: () => void;
};
export const ItemReviews = ({
  toggleReview,
  item,
  user_id,
  toggleModal,
}: ItemRevProps) => {
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
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: v.second,
          borderRadius: 12,
        }}
      />
      <View style={st.reviews_ctn}>
        {item.reviews.map((rev, index) => {
          if (typeof rev.user === "object" && rev.user._id === user_id)
            return (
              <ReviewCard key={rev._id} review={rev} {...{ toggleModal }} />
            );
        })}
        {item.reviews.map((rev, index) => {
          if (typeof rev.user === "object" && rev.user._id !== user_id)
            return <ReviewCard key={rev._id} review={rev} />;
        })}
      </View>
    </Animated.View>
  );
};

export const Wireframe = () => {
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

// type FindRevType = (reviews: ReviewType[], user_id: string) => [string, boolean]
const findRev = (reviews: ReviewType[], user_id: string) => {
  let val = "";
  let bool = false;
  reviews.forEach((rev) => {
    if (typeof rev.user === "object" && rev.user._id === user_id) {
      val = rev.text;
      bool = true;
    }
  });
  return { val, bool };
};
type ModalRevProps = {
  toggle: () => void;
  user_id: string;
  item: ItemType | CommerceType;
  setItem: Dispatch<ItemType> | Dispatch<CommerceType>;
  market_id?: string;
};
export const Modal_Review = ({
  toggle,
  user_id,
  item,
  setItem,
  market_id,
}: ModalRevProps) => {
  const [stars, setStars] = useState(4);
  const [input, setInput] = useState(findRev(item.reviews, user_id).val);
  const [error, setError] = useState<string | undefined>(undefined);
  const sendReview = async () => {
    setError(undefined);
    if (input.length <= 0) return setError("La reseña no puede estar vacía");
    // Send to back here (user_id,input,stars,isEdit,item._id)
    const { status, data } = await updateReview(
      user_id,
      input,
      stars,
      findRev(item.reviews, user_id).bool,
      item._id,
      market_id
    );
    if (status === 200) {
      toggle();
      setItem(data);
    } else {
      setError(data.msg);
    }
  };
  const handleInput = (name: string, value: string) => {
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
          multiline={false}
        />
        {error && <ErrorText text={error} />}
        <PrimaryBtn text="Enviar Reseña" action={sendReview} />
      </View>
    </Animated.View>
  );
};

const starArr = [1, 2, 3, 4, 5];

type StarRevProps = {
  stars: number;
  value: number;
  setStars: Dispatch<number>;
};
const StarRev = ({ stars, value, setStars }: StarRevProps) => {
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

const OwnerDisplay = ({
  commerce,
}: {
  commerce: string | { logo: string; name: string; _id: string };
}) => {
  if (typeof commerce === "string") return null;

  const nav = useNavigation();
  const goShopPage = () => {
    nav.navigate("ShopPage", { id: commerce._id });
  };
  if (typeof commerce === "object")
    return (
      <Pressable
        onPress={goShopPage}
        style={({ pressed }) => ({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: -12,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Image
          src={commerce.logo}
          style={{ height: 20, width: 20, borderRadius: 100 }}
        />
        <Text fs={12} style={{ color: "#404040" }}>
          {commerce.name}
        </Text>
      </Pressable>
    );
};
