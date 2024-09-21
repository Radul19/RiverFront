import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import React, { PropsWithChildren } from "react";
import { v, stB, wh } from "./stylesVar";
import NavBar from "./NavBar";

type Props = PropsWithChildren & {
  refreshing?: boolean,
  onRefresh?: () => void,
  nav?: number
}
const Scroll = ({ refreshing = false, onRefresh, children, nav = undefined }: Props) => {
  return (
    <View style={{ flex: 1, backgroundColor: v.prime }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={st.ctn}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
      {nav && <NavBar active={nav} />}
    </View>
  );
};

export default Scroll;

export const st = StyleSheet.create({
  ctn: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    display: "flex",
    gap: 14,
    minHeight: wh
  },
});
