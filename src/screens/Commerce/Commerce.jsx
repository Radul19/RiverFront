import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Subtitle, ItemsCtn, wh, MyItem } from "../../components/DisplayItems";
import { IconBag, IconGear, IconPlusBox } from "../../components/Icons";
import { SearchBar } from "../../components/Inputs";
import { searchItems } from "../../api/general";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Scroll from "../../components/Scroll";
import Context from "../../components/Context";

const Commerce = ({ navigation }) => {
  const { userData } = useContext(Context);
  const [load, setLoad] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [searchBar, setSearchBar] = useState("");

  const [selectList, setSelectList] = useState([]);

  const executeSearch = async () => {
    setLoad(true);
    let { status, data } = await searchItems(
      searchBar,
      false,
      userData.commerce._id
    );
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

  const addSelected = (item_id) => {
    setSelectList((prev) => [...prev, item_id]);
  };
  const removeSelected = (item_id) => {
    let aux = [...selectList];
    const i = aux.indexOf(item_id);
    aux.splice(i, 1);
    setSelectList(aux);
  };

  return (
    <Scroll nav={3}>
      <View style={st.header}>
        <Subtitle>Inventario</Subtitle>
        {selectList.length === 0 && <ViewIconPlus {...{ goCreateItem }} />}
        {selectList.length === 1 && <ViewIconEdit {...{ goCreateItem }} />}
        {selectList.length >= 2 && <ViewIconDelete {...{ goCreateItem }} />}
      </View>
      <SearchBar {...{ setSearchBar, searchBar }} />
      {selectList.length <= 0 ? (
        <ItemsCtn data={itemsData} load={load} longPress={addSelected} />
      ) : (
        <MyItemsCtn
          data={itemsData}
          add={addSelected}
          remove={removeSelected}
          selectList={selectList}
        />
      )}
    </Scroll>
  );
};

export default Commerce;

const MyItemsCtn = ({ data, add, remove, selectList = [] }) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={st.my_items_ctn}>
      {data.map((item, index) => (
        <MyItem
          item={item}
          key={item._id}
          imSelected={selectList.includes(item._id)}
          {...{ add, remove }}
        />
      ))}
    </Animated.View>
  );
};

const ViewIconPlus = ({ goCreateItem }) => {
  return (
    <Pressable style={st.plus_btn} onPress={goCreateItem}>
      <IconPlusBox />
    </Pressable>
  );
};
const ViewIconEdit = ({ goCreateItem }) => {
  return (
    <Pressable style={st.plus_btn} onPress={goCreateItem}>
      <IconGear />
    </Pressable>
  );
};
const ViewIconDelete = ({ goCreateItem }) => {
  return (
    <Pressable style={st.plus_btn} onPress={goCreateItem}>
      <IconBag />
    </Pressable>
  );
};

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
  my_items_ctn: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingHorizontal: 8,
    justifyContent: "space-between",
    gap: 12,
  },
});
