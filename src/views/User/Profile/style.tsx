import { StyleSheet } from "react-native";
import { v } from "../../../components/stylesVar";

export const st = StyleSheet.create({
  avatar_ctn: {
    display: "flex",
    gap: 14,
    alignItems: "center",
  },
  options_ctn: {
    display: "flex",
    width: "100%",
    gap: 6,
    paddingVertical: 24,
  },
  option_ctn: ({ pressed }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: pressed ? v.four : v.prime,
    borderRadius: 6,
  }),
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo_ctn: ({ pressed }) => ({
    height: 200,
    width: 200,
    alignSelf: "center",
    // backgroundColor: v.third,
    borderRadius: 12,
    opacity: pressed ? 0.5 : 1,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }),
  logo: {
    width: "100%",
    height: "100%",
  },
  subtitle_ctn: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 12,
  },
});