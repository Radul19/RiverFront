import { StyleSheet } from 'react-native'
import { v, wh, ww } from '../../../components/stylesVar';

export const st = StyleSheet.create({
  ctn: {
    paddingTop: 20,
    paddingBottom: 24,

    gap: 14,
    paddingHorizontal: 20,
    minHeight: wh,
  },
  subtitle: {
    fontFamily: "Medium",
    fontSize: 16,
    marginVertical: 12,
  },
  header: {

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scc_modal: {
    width: ww,
    height: wh,
    backgroundColor: v.four,
    position: "absolute",

    padding: 20,
    paddingTop: 200,
    alignItems: "center",
    zIndex: 200,
    // justifyContent: "center",
  },
  sub_ctn: {

    gap: 14,
  },
  btn_ctn: ({ pressed }) => ({

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    opacity: pressed ? 0.5 : 1,
  }),
  btn_login: {
    borderRadius: 100,
    height: 50,
    width: 50,

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: v.prime,
  },
  tc: { color: v.prime },
});
