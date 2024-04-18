import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Subtitle,ItemsCtn, wh } from "../../components/DisplayItems";
import { IconPlusBox } from "../../components/Icons";
import { SearchBar } from "../../components/Inputs";
import { searchItems } from "../../api/general";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Scroll from "../../components/Scroll";
import Context from "../../components/Context";

const Commerce = ({ navigation }) => {
  const {userData} = useContext(Context)
  const [load, setLoad] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [searchBar, setSearchBar] = useState("");

  const executeSearch = async () => {
    setLoad(true);
    let { status, data } = await searchItems(searchBar,false,userData.commerce._id);
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

  const goCreateItem = () => {
    navigation.navigate("NewItem");
  };

  return (
    <Scroll nav={3}>
      <View style={st.header}>
        <Subtitle >Inventario</Subtitle>
        <Pressable style={st.plus_btn} onPress={goCreateItem}>
          <IconPlusBox />
        </Pressable>
      </View>
      <SearchBar {...{ setSearchBar, searchBar }} />
      <ItemsCtn data={itemsData} load={load} />
    </Scroll>
  );
};

export default Commerce;

const st = StyleSheet.create({
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
});
