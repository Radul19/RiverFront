import { StyleSheet } from "react-native";
import { v, wh, ww } from "../../../components/stylesVar";

export default StyleSheet.create({
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
    zIndex: 100,
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
