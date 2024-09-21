import { StyleSheet } from "react-native";
import { wh } from "../../../components/stylesVar";

export default StyleSheet.create({
  ctn: {
    display: "flex",
    gap: 14,
    minHeight: wh,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plus_btn: ({ pressed }) => ({
    padding: 6,
    opacity: pressed ? 0.5 : 1,
  }),
  my_items_ctn: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingHorizontal: 8,
    justifyContent: "space-between",
    gap: 12,
  },
});
