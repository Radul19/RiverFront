import { Dimensions, StyleSheet } from "react-native";
;
export const ww = Dimensions.get("window").width;
export const wh = Dimensions.get("window").height;

export const v = {
  prime: "#eeeeee",
  second: "#d4d4d4",
  third: "#3f3f3f",
  four: "#191919",
};

export const stB = StyleSheet.create({
  ctn: {
    paddingTop: 20,
    paddingHorizontal: 12,
    display: "flex",
    gap: 14,
  },
  subtitle: { fontFamily: "Bold", fontSize: 20 },
  h_ctn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});


export const stl_home = StyleSheet.create({
  down_ctn: {
    marginTop: -110,
    backgroundColor: v.prime,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    paddingTop: 6,
    paddingBottom: 64,
  }, gear: ({ pressed }:{pressed:boolean}) => ({
    padding: 9,
    opacity: pressed ? 0.5 : 1,
  }),
  small: {
    fontSize: 14,
  },
  username: {
    fontSize: 16,
    fontFamily: "Bold",
  }, avatar: {
    width: 42,
    height: 42,
    backgroundColor: v.third,
    borderRadius: 100,
  }, sf_ctn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sf_btn: {
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  filter_ctn: {
    position: "relative",
    width: "100%",
    height: 135,
    // height: 90,
    overflow: "hidden",
  },
  filter_item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomColor: v.four,
    borderBottomWidth: 1,
  },
});
