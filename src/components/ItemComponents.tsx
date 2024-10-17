import moment from "moment/moment";
import { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StarsCtn } from "./DisplayItems";
import {
  IconArrowRight,
  IconBag,
  IconBubble,
  IconCross,
  IconHeart,
  IconHeartLine,
  IconInstagram,
  IconMessenger,
  IconPhone,
  IconStallLine,
  IconTelegram,
  IconUser,
  IconWhatsapp,
  Icon_BubbleChat,
} from "./Icons";
import { Avatar } from "./Inputs";
import { v, ww, wh } from "./stylesVar";
import Text from "./Text";
import "moment/locale/es";
import { ImageType, ItemType, ReviewType } from "../types/item";
import { CommerceType, SocialType, UserType } from "../types/user";
import Context from "./Context";
import {
  sendWhatsApp,
  sendSMS,
  openIg,
  openMessenger,
  openTelegram,
} from "../helpers/msgW";

export const ContactBtn = ({
  market = false,
  socials,
  phone,
}: {
  market?: boolean;
  socials?: SocialType;
  phone?: string;
}) => {
  const [open, setOpen] = useState(false);

  const width = useSharedValue(52);

  const toggle = () => {
    if (!open) width.value = withTiming(320);
    else width.value = withTiming(52);

    setOpen(!open);
  };
  const toWhatsapp = () => {
    // sendWhatsApp("+5804146382366", "");
    if (socials?.whatsapp) sendWhatsApp(socials.whatsapp, "");
  };
  const toSMS = () => {
    // sendSMS("Hello!", "+5804146767043");
    if (phone) sendSMS("", phone);
  };
  const toInstagram = () => {
    // openIg("belibae_");
    if (socials?.instagram) openIg(socials.instagram);
  };
  const toMessenger = () => {
    // openMessenger("albelisg.garcia");
    if (socials?.messenger) openMessenger(socials.messenger);
  };
  const toTelegram = () => {
    if (socials?.telegram) openTelegram(socials.telegram, "");
    // openTelegram("OceonKey", "hello");
  };

  return (
    <Animated.View style={[st.wide_ctn, { width }]}>
      <View style={st.btn_ctn}>
        {socials?.telegram && (
          <Pressable style={st.icon} onPress={toTelegram}>
            <IconTelegram color={v.prime} />
          </Pressable>
        )}
        {socials?.instagram && (
          <Pressable style={st.icon} onPress={toInstagram}>
            <IconInstagram color={v.prime} />
          </Pressable>
        )}
        {socials?.whatsapp && (
          <Pressable style={st.icon} onPress={toWhatsapp}>
            <IconWhatsapp color={v.prime} />
          </Pressable>
        )}
        {socials?.messenger && (
          <Pressable style={st.icon} onPress={toMessenger}>
            <IconMessenger color={v.prime} />
          </Pressable>
        )}

        {phone && (
          <Pressable style={st.icon} onPress={toSMS}>
            <IconBubble color={v.prime} />
          </Pressable>
        )}

        {market ? (
          <Pressable style={st.contact_btn} onPress={toggle}>
            {open ? (
              <IconCross color={v.prime} />
            ) : (
              <IconPhone color={v.prime} />
            )}
          </Pressable>
        ) : (
          <Pressable style={st.contact_btn} onPress={toggle}>
            {open ? <IconCross color={v.prime} /> : <IconBag color={v.prime} />}
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

export const CommentBtn = ({
  toggleModal,
  isCommented,
}: {
  toggleModal: () => void;
  isCommented: boolean;
}) => {
  if (isCommented) return null;
  return (
    <TouchableOpacity style={st.commentBtn_ctn} onPress={toggleModal}>
      <View style={st.commentBtn}>
        <View style={{ marginLeft: -24, transform: [{ scaleX: -1 }] }}>
          <Icon_BubbleChat />
        </View>
        <Text style={{ color: "#eee" }}>Comentar</Text>
      </View>
    </TouchableOpacity>
  );
};

export const ReviewsBtn = ({
  reviews = reviewsX,
  toggleReview,
}: {
  reviews: Array<any>;
  toggleReview?: () => void;
}) => {
  return (
    <Pressable style={st.reviews_btn} onPress={toggleReview}>
      <StarsCtn stars={avgStars(reviews)} size={20} />
      <Text ff="Bold">{avgStars(reviews)}</Text>
      <Text style={{ color: v.third }}>{`(${reviews.length} reseñas)`}</Text>
    </Pressable>
  );
};

// IMAGE LOGIC
export const ImageDisplay = ({
  images = [],
  goBack = undefined,
}: // stall,
{
  images: ImageType[];
  goBack?: () => void;
  // stall?: string;
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

  const Dot = ({ pos, index }: { pos: SharedValue<number>; index: number }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      width: pos.value === index ? 14 : 10,
      height: pos.value === index ? 14 : 10,
      opacity: pos.value === index ? 1 : 0.5,
    }));
    return <Animated.View style={[st.dot, animatedStyle]}></Animated.View>;
  };

  const goShopPage = () => {
    // nav.navigate("ShopPage", { id: stall });
  };

  return (
    <View style={st.img_ctn}>
      {goBack && (
        <Pressable style={st.back_btn} onPress={goBack}>
          <IconArrowRight size={20} />
        </Pressable>
      )}
      {/* {stall && (
        <Pressable style={st.shop_btn} onPress={goShopPage}>
          <IconStallLine size={20} />
        </Pressable>
      )} */}
      {images.length > 1 ? (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[st.carousel_ctn, animatedStyle]}>
            {images.map((i, index) => (
              <Image
                style={st.img_carousel}
                key={index}
                source={{ uri: i?.secure_url ?? i }}
              />
            ))}
          </Animated.View>
        </GestureDetector>
      ) : (
        <Image
          style={st.img_carousel}
          source={{ uri: images[0]?.secure_url ?? images[0] }}
        />
      )}
      {images.length > 1 && (
        <View style={st.dots_ctn}>
          {images.map((i, index) => (
            <Dot pos={pos} index={index} key={index} />
          ))}
        </View>
      )}
    </View>
  );
};

export const ItemTitle = ({
  sendFavorite,
  item,
}: {
  sendFavorite?: (status: boolean) => Promise<void>;
  item: ItemType | CommerceType;
}) => {
  const { userData } = useContext(Context);
  return (
    <View style={st.top}>
      <Text ff="Medium" fs={20} style={{ width: "80%" }} filter={true}>
        {item.name}
      </Text>
      {userData._id && (
        // {true &&  (
        <HeartBtn
          sendFavorite={sendFavorite}
          initial={item.favorites.includes(userData._id)}
        />
      )}
    </View>
  );
};
const HeartBtn = ({
  initial,
  sendFavorite,
}: {
  initial: boolean;
  sendFavorite?: (state: boolean) => Promise<void>;
}) => {
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

export const ReviewLine = ({
  num,
  percent,
}: {
  num: number;
  percent: number;
}) => {
  return (
    <View style={st.rev_line}>
      <Text style={{ width: 10, textAlign: "center" }} ff="Bold">
        {num}
      </Text>
      <View style={st.line}>
        <View
          style={{ ...st.line, backgroundColor: v.four, width: `${percent}%` }}
        />
      </View>
    </View>
  );
};

const reviewsX = [{ stars: 4 }, { stars: 5 }, { stars: 2 }, { stars: 3 }];
/** TODO REVIEWS TYPES */
const avgStars = (reviews: Array<any>) => {
  if (reviews.length <= 0) return 0;
  let aux = 0;
  reviews.forEach((elm) => {
    aux = aux + elm.stars;
  });
  aux = aux / reviews.length;
  return Math.floor(aux * 10) / 10;
};

export const ReviewCard = ({
  review,
  toggleModal = undefined,
}: {
  review: ReviewType;
  toggleModal?: () => void;
}) => {
  const Content = () => {
    return (
      <>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Avatar num={review.user.avatar} size={48} />
          <View
            style={{
              display: "flex",
              flex: 1,
              padding: 4,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
              <Text {...{ fs: 16, ff: "Bold" }}>{review.user.name}</Text>
              {toggleModal && <IconUser size={16} color="#3978FF" />}
              {/* <Text {...{ fs: 16, ff: "Bold" }}>{review.user_id.name}</Text> */}
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <StarsCtn size={16} stars={review.stars} />
                <Text ff="Bold">{review.stars.toFixed(1)}</Text>
              </View>
              <Text>{moment(review.updatedAt).fromNow()}</Text>
            </View>
          </View>
        </View>
        <Text fs={16} filter={true}>
          {review.text}
        </Text>
      </>
    );
  };

  if (toggleModal) {
    return (
      <Pressable
        style={({ pressed }) => ({
          display: "flex",
          gap: 6,
          opacity: pressed ? 0.5 : 1,
        })}
        onLongPress={toggleModal}
      >
        <Content />
      </Pressable>
    );
  } else
    return (
      <View style={{ display: "flex", gap: 6 }}>
        <Content />
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
    right: 16,
    bottom: 16,
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
  icon: ({ pressed }) => ({
    padding: 14,
    opacity: pressed ? 0.5 : 1,
  }),
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
  rev_line: {
    position: "relative",
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "90%",
  },
  line: {
    width: "100%",
    height: 8,
    backgroundColor: v.second,
    borderRadius: 12,
  },
});
