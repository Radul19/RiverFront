import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Text from "../components/Text";
import { ItemsCtn, wh } from "../components/DisplayItems";
import { IconPlusBox } from "../components/Icons";
import { SearchBar } from "../components/Inputs";
import { searchItems } from "../api/general";
import NavBar from "../components/NavBar";

const Commerce = () => {
  const [searchBar, setSearchbar] = useState("");
  const [load, setLoad] = useState(false)
  const [itemsData, setItemsData] = useState([])

  const executeSearch = async (text) => {
    setLoad(true);
    let { status, data } = await searchItems(text);
    setLoad(false);
    if (status === 200) {
      setItemsData(data);
    }
  };

  useEffect(() => {
    let tm = setTimeout(() => {
      executeSearch(searchBar);
    }, 700);

    return () => {
      clearTimeout(tm);
    };
  }, [searchBar]);

  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      <ScrollView contentContainerStyle={st.ctn}>
        <View style={st.header}>
          <Text ff="Bold" fs={20}>
            Inventario
          </Text>
          <Pressable style={st.plus_btn}>
            <IconPlusBox />
          </Pressable>
        </View>
        <View style={{paddingHorizontal:20}} >
          <SearchBar {...{ searchBar, setSearchbar }} />
        </View>
        <ItemsCtn data={itemsData} load={load}   />
      </ScrollView>
      <NavBar active={2} />
    </View>
  );
};

export default Commerce;

const st = StyleSheet.create({
  ctn: {
    paddingVertical:16,
    display: "flex",
    gap: 14,
    minHeight: wh,
  },
  header: {
    paddingHorizontal:20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plus_btn: {
    padding: 6,
  },
});
