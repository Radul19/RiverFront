import { View, StyleSheet, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { v } from "../components/stylesVar";
import Text from "../components/Text";
import { SearchBar } from "../components/Inputs";
import { ItemsCtn } from "../components/DisplayItems";
import { searchFavorites, searchItems } from "../api/general";
import Context from "../components/Context";
import Scroll from "../components/Scroll";

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
    <Scroll nav={2}>
      <Btns {...{ show, setShow }} />
      <SearchBar {...{ setSearchBar, searchBar }} />
      {show ? (
        <ItemsCtn data={itemsData.items} load={load} />
      ) : (
        <ItemsCtn data={itemsData.markets} load={load} />
      )}
    </Scroll>
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
          backgroundColor: show ? v.four : v.prime,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Text ff="Bold" style={{ color: show ? v.prime : v.four }}>
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
          backgroundColor: !show ? v.four : v.prime,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Text ff="Bold" style={{ color: !show ? v.prime : v.four }}>
          Vendedores
        </Text>
      </Pressable>
    </View>
  );
};

const st = StyleSheet.create({
  btns_ctn: {
    paddingBottom: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  btn: {
    borderWidth: 2,
    borderColor: v.four,
    paddingVertical: 6,
    width: 125,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
