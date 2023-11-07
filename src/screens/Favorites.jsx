import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import t from "../components/stylesVar";
import Text from "../components/Text";
import NavBar from "../components/NavBar";
import { SearchBar } from "../components/Inputs";
import { ItemsCtn } from "../components/DisplayItems";

const Favorites = () => {

  const [show, setShow] = useState(true)

  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      <ScrollView contentContainerStyle={st.ctn}>
        <View style={st.view}>
          <Btns {...{show, setShow}} />
          <SearchBar />
        </View>
        <ItemsCtn />
      </ScrollView>
      <NavBar active={1} />
    </View>
  );
};

export default Favorites;

const Btns = ({show, setShow}) => {
  return (
    <View style={st.btns_ctn}>
      <Pressable onPress={()=>{setShow(true)}} style={({ pressed }) => ({
        ...btnSt,
        borderTopLeftRadius:12,
        borderBottomLeftRadius:12,
        backgroundColor:show?t.four:t.prime,
        opacity:pressed?0.5:1
  })}>
        <Text ff="Bold" style={{color:show?t.prime:t.four}} >Articulos</Text>
      </Pressable>

      <Pressable onPress={()=>{setShow(false)}} style={({ pressed }) => ({
        ...btnSt,
        borderTopRightRadius:12,
        borderBottomRightRadius:12,
        backgroundColor:!show?t.four:t.prime,
        opacity:pressed?0.5:1
  })}>
        <Text ff="Bold" style={{color:!show?t.prime:t.four}} >Vendedores</Text>
      </Pressable>
    </View>
  );
};

const st = StyleSheet.create({
  ctn: { paddingTop: 48,paddingBottom: 64, display: "flex", gap: 14 },
  view: { paddingHorizontal: 20, display: "flex", gap: 14 },
  btns_ctn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});

const btnSt = {
  borderWidth:2,
  borderColor:t.four,
  paddingVertical: 6,
  width: 125,
  display: "flex",
  justifyContent: "center",
  alignItems:'center',
}