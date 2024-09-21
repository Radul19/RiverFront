import { View, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import Text from "../../../components/Text";
import img from "../../../images/item.png";
import st from "../Item/style";
import React, { useContext, useEffect, useState } from "react";
import {
  Categories,
  ItemsCtn,
  StarsCtn,
} from "../../../components/DisplayItems";
import { v, ww, wh } from "../../../components/stylesVar";
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
} from "../../../components/Icons";
import Animated, {
  useSharedValue,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { SearchBar } from "../../../components/Inputs";
import { getMarket, searchItems } from "../../../api/guest";
import {
  CommentBtn,
  ContactBtn,
  ImageDisplay,
  ItemTitle,
  ReviewsBtn,
} from "../../../components/ItemComponents";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreensType } from "../../../types/screens";
import { ItemReviews, Modal_Review, Wireframe } from "../Item/ItemPage";
import Context from "../../../components/Context";
import { ItemType, ReviewType } from "../../../types/item";
import { CommerceType } from "../../../types/user";
import { toggleMarketFavorite } from "../../../api/general";

const shop = {
  __v: 0,
  _id: "6610ecc7b708f619350648fd",
  categories: ["service", "others"],
  createdAt: "2024-04-06T06:33:43.215Z",
  description: "Description of something else idk what to say",
  favorites: ["661063ab145f8b0afaf3655d", "661063ab145f8b0afaf3655d"],
  images: [
    {
      _id: "66eb3807b5ef1a213108dbe1",
      public_id: "cixcmzbwzrsmahnjeuxx",
      secure_url:
        "https://res.cloudinary.com/dhp2q7rls/image/upload/v1712385223/cixcmzbwzrsmahnjeuxx.jpg",
    },
    {
      _id: "66eb3807b5ef1a213108dbe2",
      public_id: "tbmzikwg66c19sejsx7j",
      secure_url:
        "https://res.cloudinary.com/dhp2q7rls/image/upload/v1712385223/tbmzikwg66c19sejsx7j.jpg",
    },
  ],
  name: "Item 01",
  owner_id: "6610741e6990c28694b205f2",
  price: "39.99",
  reviews: [],
  updatedAt: "2024-09-17T07:20:00.014Z",
};

type Props = NativeStackScreenProps<ScreensType, "ShopPage">;
const ShopPage = ({ navigation, route }: Props) => {
  const { userData } = useContext(Context);
  const [openBtn, setOpenBtn] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [load, setLoad] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [shop, setShop] = useState<CommerceType | undefined>(undefined);

  const width = useSharedValue(52);

  const toggle = () => {
    setOpenBtn(!openBtn);
    // width.value = '100%'
  };

  const toggleModal = () => {
    setModal(!modal)
  };

  useEffect(() => {
    if (openBtn) {
      width.value = withTiming(320);
    } else {
      width.value = withTiming(52);
    }
  }, [openBtn]);

  const executeSearch = async (text: string) => {
    setLoad(true);
    let { status, data } = await searchItems(text,[],shop?._id ?? route.params.id);
    setLoad(false);
    if (status === 200) {
      setItemsData(data);
    }
  };

  const sendFavorite = async (state:boolean) => {
    if (userData) {
      const info = {
        user_id: userData._id,
        market_id: shop?._id,
        state,
      };
      await toggleMarketFavorite(info);
    }
  };
  const toggleReview = () => {
    setReviewOpen(!reviewOpen);
  };

  useEffect(() => {
    let tm = setTimeout(() => {
      executeSearch(searchBar);
    }, 400);

    return () => {
      clearTimeout(tm);
    };
  }, [searchBar]);

  useEffect(() => {
    if (route.params && route.params.shop) {
      setShop(route.params.shop);
    } else if (route.params && route.params.id) {
      (async () => {
        const { status, data } = await getMarket(route.params.id);
        if (status === 200) {
          setShop(data.shop);
          setItemsData(data.items);
        }
      })();
    }

    return () => {
      setShop(undefined);
    };
  }, []);

  const goBack = () => {
    navigation.goBack();
  };
  if (!shop) {
    return <Wireframe />;
  }

  return (
    <Animated.View
      entering={FadeIn}
      style={{ flex: 1, backgroundColor: v.prime }}
      exiting={FadeOut}
    >
      <ScrollView contentContainerStyle={st.ctn}>
        <ImageDisplay goBack={goBack} images={[{secure_url:shop.logo,public_id:shop.logo_id}]} />
        <View style={st.content_ctn}>
          {!reviewOpen ? (
            <ShopInfo
              {...{
                item: shop,
                toggleReview,
                sendFavorite,
                searchBar,
                setSearchBar,itemsData,load
              }}
            />
          ) : (
            <ItemReviews
              {...{ item: shop, toggleReview, toggleModal }}
              user_id={userData._id}
            />
          )}
        </View>
      </ScrollView>
      {!modal && (
        <>
          {!reviewOpen ? (
            <ContactBtn market={false} />
          ) : (
            <CommentBtn
              {...{ toggleModal }}
              // isCommented={false}
              isCommented={findReview(shop, userData._id)}
            />
          )}
        </>
      )}
      {modal && (
        <Modal_Review
          toggle={toggleModal}
          user_id={userData._id}
          item={shop}
          setItem={setShop}
          market_id={shop._id}
        />
      )}
    </Animated.View>
  );
};

export default ShopPage;

type FindReviewProps = { (item: ItemType|CommerceType, user_id: string): boolean };
const findReview: FindReviewProps = (item, user_id) => {
  let bool = false;
  item.reviews.find((rev) => {
    if (typeof rev.user === "object" && rev.user?._id === user_id) bool = true;
  });
  return bool;
};

export const ShopInfo = ({
  item,
  sendFavorite,
  toggleReview,
  searchBar,
  setSearchBar,
  itemsData,
  load
}: {
  load:boolean
  item: any;
  sendFavorite: any;
  toggleReview: any;
  searchBar: any;
  setSearchBar: any;
  itemsData:any;
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
      <ReviewsBtn {...{ toggleReview, reviews: item.reviews }} />
      <Pressable
        onPress={toggleInfo}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Text numberOfLines={!openInfo ? 5 : 0} filter={true}>
          {item.description}
        </Text>
      </Pressable>
      <Text ff="Bold" fs={16}>
        Categorias
      </Text>
      <Categories all={false} categ={item.categories} handleCateg={() => {}} />
      <SearchBar {...{ searchBar, setSearchBar }} />
      <ItemsCtn data={itemsData} load={load} />
    </Animated.View>
  );
};

// const st = StyleSheet.create({
//   ctn: {
//     display: "flex",
//     // gap: 14,
//     minHeight: wh,
//   },
//   img_ctn: {
//     width: ww,
//     height: ww,
//     overflow: "hidden",
//     position: "relative",
//   },
//   back_btn: ({ pressed }) => ({
//     position: "absolute",
//     transform: [{ rotate: "180deg" }],
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: v.prime,
//     top: 20,
//     left: 20,
//     zIndex: 300,
//     opacity: pressed ? 0.5 : 1,
//   }),
//   shop_btn: ({ pressed }) => ({
//     position: "absolute",
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: v.prime,
//     top: 20,
//     right: 20,
//     zIndex: 300,
//     opacity: pressed ? 0.5 : 1,
//   }),

//   img: {
//     width: "100%",
//     height: "100%",
//   },
//   content_ctn: {
//     zIndex: 200,
//     marginTop: -24,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     flex: 1,
//     backgroundColor: v.prime,
//     display: "flex",
//     gap: 12,
//     padding: 20,
//     minHeight: wh - 24,
//     paddingBottom: 92,
//   },
//   top: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   reviews_btn: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   btn_ctn: {
//     display: "flex",
//     flexDirection: "row",
//     alignSelf: "flex-end",
//     // justifyContent: "center",
//     backgroundColor: v.four,
//     borderRadius: 12,
//     // width: 52,
//     width: 320,
//     height: 52,
//     paddingRight: 38,
//   },
//   contact_btn: ({ pressed }) => ({
//     position: "absolute",
//     alignSelf: "center",
//     right: 0,
//     padding: 14,
//     backgroundColor: v.four,
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     opacity: pressed ? 0.5 : 1,
//   }),
//   abs_ctn: {
//     display: "flex",
//     flexDirection: "row",
//     position: "absolute",
//   },

//   icon: {
//     padding: 14,
//     // position:'absolute',
//   },
//   x: {
//     borderRadius: 12,
//     // width:'100%',
//     // marginTop: "auto",
//     alignSelf: "flex-end",
//     width: 52,
//     height: 52,
//     overflow: "hidden",
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//   },
// });
