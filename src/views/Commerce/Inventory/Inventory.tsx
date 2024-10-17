import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Subtitle, ItemsCtn, MyItem } from "../../../components/DisplayItems";
import {
  IconBag,
  IconEdit,
  IconGear,
  IconLoad,
  IconPlusBox,
  IconTrash,
} from "../../../components/Icons";
import { SearchBar } from "../../../components/Inputs";
import { searchItems } from "../../../api/guest";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Scroll from "../../../components/Scroll";
import Context from "../../../components/Context";
import { ScreensType } from "../../../types/screens";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ItemType } from "../../../types/item";
import st from "./style";
import { deleteItem } from "../../../api/general";

type Props = NativeStackScreenProps<ScreensType, "Inventory">;
const Commerce = ({ navigation, route }: Props) => {
  const { userData } = useContext(Context);
  const [load, setLoad] = useState(false);
  const [itemsData, setItemsData] = useState<ItemType[]>([]);
  const [searchBar, setSearchBar] = useState("");

  const [selectList, setSelectList] = useState<string[]>([]);

  const executeSearch = async () => {
    setLoad(true);
    let { status, data } = await searchItems(
      searchBar,
      [],
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
  }, [searchBar,route.params]);

  const goCreateItem = () => {
    setSelectList([]);
    navigation.navigate("NewItem", { item: undefined });
  };
  const goDeleteItem = async () => {
    setLoad(true);
    const { status, data } = await deleteItem(selectList);
    setLoad(false);
    if (status === 200) {
      await executeSearch();
      setSelectList([]);
    } else {
      throw new Error(data.msg);
    }
  };
  const goEditItem = () => {
    setSelectList([]);
    let aux = itemsData.find((elm) => elm._id === selectList[0]);
    if (aux !== undefined) {
      navigation.navigate("NewItem", { item: aux });
      // const { name, description, categories, price, images, _id } = aux;
      // navigation.navigate("EditItem", {
      //   name,
      //   description,
      //   categories,
      //   price,
      //   images,
      //   _id,
      // });
    }
  };

  const addSelected = (item_id: string) => {
    setSelectList((prev) => [...prev, item_id]);
  };
  const removeSelected = (item_id: string) => {
    let aux = [...selectList];
    const i = aux.indexOf(item_id);
    aux.splice(i, 1);
    setSelectList(aux);
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    executeSearch();
  }, []);

  return (
    <Scroll {...{ refreshing, onRefresh }} nav={3}>
      <View style={st.header}>
        <Subtitle>Inventario</Subtitle>
        {selectList.length === 0 && <ViewIconPlus {...{ goCreateItem }} />}
        {selectList.length === 1 && (
          <View style={{ display: "flex", flexDirection: "row" }}>
            <ViewIconEdit {...{ goEditItem }} />
            {load ? (
              <View style={{ width: 24 }}>
                <IconLoad size={20} />
              </View>
            ) : (
              <ViewIconDelete {...{ goDeleteItem }} />
            )}
          </View>
        )}
        {selectList.length >= 2 && (
          <>
            {load ? (
              <View style={{ width: 24 }}>
                <IconLoad size={20} />
              </View>
            ) : (
              <ViewIconDelete {...{ goDeleteItem }} />
            )}
          </>
        )}
      </View>
      <SearchBar {...{ setSearchBar, searchBar }} />
      {/* <MyItemsCtn
        data={itemsData}
        add={addSelected}
        remove={removeSelected}
        selectList={selectList}
      /> */}
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
type AddRemove = (item_id: string) => void;
type MyItemCtnProps = {
  data: ItemType[];
  add: AddRemove;
  remove: AddRemove;
  selectList: string[];
};
const MyItemsCtn = ({ data, add, remove, selectList = [] }: MyItemCtnProps) => {
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
type VoidFunc = () => void;
const ViewIconPlus = ({ goCreateItem }: { goCreateItem: VoidFunc }) => {
  return (
    <Pressable style={st.plus_btn} onPress={goCreateItem}>
      <IconPlusBox />
    </Pressable>
  );
};
const ViewIconEdit = ({ goEditItem }: { goEditItem: VoidFunc }) => {
  return (
    <Pressable style={st.plus_btn} onPress={goEditItem}>
      <IconEdit />
    </Pressable>
  );
};
const ViewIconDelete = ({ goDeleteItem }: { goDeleteItem: VoidFunc }) => {
  return (
    <Pressable style={st.plus_btn} onPress={goDeleteItem}>
      <IconTrash />
    </Pressable>
  );
};
