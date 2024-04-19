import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import React from "react";
import { v, stB } from "./stylesVar";
import NavBar from "./NavBar";
import { wh } from "./DisplayItems";

const Scroll = ({ refreshing, onRefresh, children, nav = false }) => {
  return (
    <View style={{ flex: 1, backgroundColor: v.prime }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={st.ctn}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : null
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
    minHeight:wh
  },
});
