import { View, ScrollView, Pressable } from "react-native";
import Text from "../../../components/Text";
import st from "../Item/style";
import React, { Dispatch, useContext, useEffect, useState } from "react";
import { Categories, ItemsCtn } from "../../../components/DisplayItems";
import { v } from "../../../components/stylesVar";
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
import { ItemType } from "../../../types/item";
import { CommerceType, ScheduleType } from "../../../types/user";
import { toggleMarketFavorite } from "../../../api/general";
import moment from "moment";

type Props = NativeStackScreenProps<ScreensType, "ShopPage">;
const ShopPage = ({ navigation, route }: Props) => {
  const { userData } = useContext(Context);
  const [searchBar, setSearchBar] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [load, setLoad] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [shop, setShop] = useState<CommerceType | undefined>(undefined);


  const toggleModal = () => {
    setModal(!modal);
  };


  const executeSearch = async (text: string) => {
    setLoad(true);
    let { status, data } = await searchItems(
      text,
      [],
      shop?._id ?? route.params.id
    );
    setLoad(false);
    if (status === 200) {
      setItemsData(data);
    }
  };

  const sendFavorite = async (state: boolean) => {
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
        <ImageDisplay
          goBack={goBack}
          images={[{ secure_url: shop.logo, public_id: shop.logo_id }]}
        />
        <View style={st.content_ctn}>
          {!reviewOpen ? (
            <ShopInfo
              {...{
                commerce: shop,
                toggleReview,
                sendFavorite,
                searchBar,
                setSearchBar,
                itemsData,
                load,
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

type FindReviewProps = {
  (item: ItemType | CommerceType, user_id: string): boolean;
};
const findReview: FindReviewProps = (item, user_id) => {
  let bool = false;
  item.reviews.find((rev) => {
    if (typeof rev.user === "object" && rev.user?._id === user_id) bool = true;
  });
  return bool;
};

export const ShopInfo = ({
  commerce,
  sendFavorite,
  toggleReview,
  searchBar,
  setSearchBar,
  itemsData,
  load,
}: {
  load: boolean;
  commerce: CommerceType;
  sendFavorite: any;
  toggleReview: any;
  searchBar: string;
  setSearchBar: any;
  itemsData: ItemType[];
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
      <ItemTitle item={commerce} sendFavorite={sendFavorite} />
      <ReviewsBtn {...{ toggleReview, reviews: commerce.reviews }} />
      <Pressable
        onPress={toggleInfo}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Text numberOfLines={!openInfo ? 5 : 0} filter={true}>
          {commerce.description}
        </Text>
      </Pressable>
      <Categories
        all={false}
        categ={commerce.categories}
        handleCateg={() => {}}
        delivery={true}
        // delivery={commerce.delivery}
      />
      <ScheduleView schedules={commerce.schedules} />

      <SearchBar {...{ searchBar, setSearchBar }} />
      <View style={{ marginHorizontal: -12 }}>
        <ItemsCtn data={itemsData} load={load} />
      </View>
    </Animated.View>
  );
};

const ScheduleView = ({ schedules }: { schedules: ScheduleType[] }) => {
  const [day, setDay] = useState<number|undefined>(moment(new Date()).day());
  return (
    <>
      {schedules.length > 0 ? (
        <>
          <Text ff="Bold" fs={16}>
            Horarios
          </Text>
          <View style={{ gap: 12, display: "flex", flexDirection: "row" }}>
            {schedules.map((sch) => (
              <ScheduleDay {...{ day, sch, setDay }} key={sch._id} />
            ))}
          </View>
          <View style={{ gap: 12,marginBottom:12}}>
          {schedules.map((sch) => {
              if (day === sch.day) return <Schedule sch={sch} key={sch._id} />;
            })}
          </View>
        </>
      ) : null}
    </>
  );
};

const Schedule = ({ sch }: { sch: ScheduleType }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
      }}
    >
      <Text ff="Bold" fs={12}>
        De
      </Text>
      <View>
        <Text fs={12}>{moment(sch.since).format("hh:mma")}</Text>
      </View>
      <Text ff="Bold" fs={12}>
        Hasta
      </Text>
      <View>
        <Text fs={12}>{moment(sch.until).format("hh:mma")}</Text>
      </View>
    </View>
  );
};

const ScheduleDay = ({
  sch,
  day,
  setDay,
}: {
  sch: ScheduleType;
  day?: number;
  setDay: Dispatch<number|undefined>;
}) => {
  return (
    <Pressable
      onPress={() => {
        if(day === sch.day) setDay(undefined)
        else setDay(sch.day);
      }}
      style={({ pressed }) => ({
        borderRadius: 6,
        padding: 8,
        backgroundColor: day === sch.day ? v.four : v.prime,
        borderWidth: 1,
        borderColor: v.four,
        opacity: pressed ? 0.5 : 1,
        // maxWidth:40
      })}
    >
      <Text style={{ color: day !== sch.day ? v.four : v.prime }} fs={12}>
        {traslateDay(sch.day)}
      </Text>
    </Pressable>
  );
};

const traslateDay = (num: number) => {
  switch (num) {
    case 1:
      return "Lun";
    case 2:
      return "Mar";
    case 3:
      return "Mie";
    case 4:
      return "Jue";
    case 5:
      return "Vie";
    case 6:
      return "Sab";
    case 7:
      return "Dom";

    default:
      break;
  }
};
