import { StyleSheet, ViewStyle } from "react-native";
import { v, wh, ww } from "../../../components/stylesVar";


const unitSt = {
  height: 50,
  width: 50,
  padding: 4,
  borderWidth: 2,
  borderColor: v.four,
  borderRadius: 6,
  alignItems: "center",
  justifyContent: "center",
} as ViewStyle;

export default StyleSheet.create({
  ctn: {
    display: "flex",
    gap: 14,
    minHeight: wh,
    paddingVertical: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  btn_back: ({ pressed }) => ({
    opacity: pressed ? 0.5 : 1,
    transform: [{ rotate: "180deg" }],
    padding: 8,
  }),
  unitItem_active: ({ pressed }) => ({
    ...unitSt,
    opacity: pressed ? 0.5 : 1,
    backgroundColor: v.four,
  }),
  unitItem: ({ pressed }) => ({
    ...unitSt,
    opacity: pressed ? 0.5 : 1,
    backgroundColor: v.prime,
  }),
  image: ({ pressed }) => ({
    width: (ww - 64) / 3,
    height: (ww - 64) / 3,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: v.third,
    borderRadius: 6,
    overflow: "hidden",
    opacity: pressed ? 0.5 : 1,
  }),
  images_ctn: {
    flexDirection: "row",
    gap: 12,
    // justifyContent:'space-between'
  },
  img: {
    width: "100%",
    height: "100%",
  },
  preview: {
    display: "flex",
    minHeight: wh,
    position: "relative",
  },
  preview_ctn: {
    zIndex: 200,
    marginTop: -24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    backgroundColor: v.prime,
    padding: 20,
    minHeight: wh * 0.65,
  },
});