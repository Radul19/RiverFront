import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import t from "../components/stylesVar";
import Text from "../components/Text";
import NavBar from "../components/NavBar";
import { SearchBar } from "../components/Inputs";
import { ItemsCtn } from "../components/DisplayItems";
import { searchFavorites, searchItems } from "../api/general";
import Context from "../components/Context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const Favorites = () => {
  const { userData } = useContext(Context);
  const [show, setShow] = useState(true);
  const [load, setLoad] = useState(false);
  const [itemsData, setItemsData] = useState({
    items: [],
    markets: [],
  });
  const [searchBar, setSearchBar] = useState("");

  const executeSearch = async () => {
    setLoad(true);
    const info = {
      text: searchBar,
      user_id: userData._id,
    };
    let { status, data } = await searchFavorites(info);
    setLoad(false);
    if (status === 200) {
      setItemsData(data);
    }
  };

  useEffect(() => {
    let tm = setTimeout(() => {
      executeSearch();
    }, 700);

    return () => {
      clearTimeout(tm);
    };
  }, [searchBar]);

  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      <ScrollView contentContainerStyle={st.ctn}>
        <View style={st.view}>
          <Btns {...{ show, setShow }} />
          <SearchBar {...{ setSearchBar, searchBar }} />
        </View>
        {show ? (
          <ItemsCtn data={itemsData.items} load={load} />
        ) : (
          <ItemsCtn data={itemsData.markets} load={load} />
        )}
      </ScrollView>
      <NavBar active={1} />
    </View>
  );
};

export default Favorites;

const Btns = ({ show, setShow }) => {
  return (
    <View style={st.btns_ctn}>
      <Pressable
        onPress={() => {
          setShow(true);
        }}
        style={({ pressed }) => ({
          ...st.btn,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          backgroundColor: show ? t.four : t.prime,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Text ff="Bold" style={{ color: show ? t.prime : t.four }}>
          Articulos
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          setShow(false);
        }}
        style={({ pressed }) => ({
          ...st.btn,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          backgroundColor: !show ? t.four : t.prime,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Text ff="Bold" style={{ color: !show ? t.prime : t.four }}>
          Vendedores
        </Text>
      </Pressable>
    </View>
  );
};


const st = StyleSheet.create({
  ctn: { paddingTop: 32, paddingBottom: 64, display: "flex", gap: 14 },
  view: { paddingHorizontal: 20, display: "flex", gap: 14 },
  btns_ctn: {
    paddingBottom: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  btn: {
    borderWidth: 2,
    borderColor: t.four,
    paddingVertical: 6,
    width: 125,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
