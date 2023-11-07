import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Text from "../components/Text";
import t from "../components/stylesVar";
import { Avatar, SearchBar } from "../components/Inputs";
import { Categories, ItemsCtn } from "../components/DisplayItems";
import NavBar from "../components/NavBar";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { searchItems } from "../api/general";
import {
  IconArrowDown,
  IconArrowUp,
  IconDollar,
  IconGear,
  IconOptions,
  IconStar,
} from "../components/Icons";

const resetCateg = {
  home: false,
  clean: false,
  cloth: false,
  food: false,
  tech: false,
  others: false,
  shops: false,
};


export default function Home() {
  const [searchBar, setSearchBar] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [load, setLoad] = useState(false);
  const [filter, setFilter] = useState({
    name: "stars",
    status: 1,
  });
  const [categ, setCateg] = useState(resetCateg);

  const handleCateg = (name) => {
    let value = categ[name];
    setCateg({ ...categ, [name]: !value });
  };

  const handleFilter = (n) => {
    let name = n;
    let val;
    if (filter.name === name) {
      if (filter.status === null) val = 1;
      else if (filter.status === 1) val = 2;
      else if (filter.status === 2) (val = null), (name = null);
      setFilter({ name, status: val });
    } else setFilter({ name, status: 1 });
    // setFilter({...filter,[name]:val})
  };

  const y = useSharedValue(-120);
  const toggleFilter = (val) => {
    const springTime = { dampingRatio: 1, duration: 1000 };
    if (val) y.value = withSpring(0, springTime);
    else y.value = withSpring(-120, springTime);
  };

  const executeSearch = async (text) => {
    setLoad(true);
    let { status, data } = await searchItems(text, categ);
    setLoad(false);
    if (status === 200) {
      setItemsData(data);
    }
  };

  useEffect(() => {
    let tm = setTimeout(() => {
      executeSearch(searchBar, categ);
    }, 700);

    return () => {
      clearTimeout(tm);
    };
  }, [searchBar, categ]);

  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      <ScrollView contentContainerStyle={st.ctn}>
        <Header />
        <SearchFilt {...{ toggleFilter, setSearchBar, searchBar }} />
        <FiltersCtn {...{ filter, handleFilter,y }} />
        <View style={st.down_ctn}>
          <Text style={st.subtitle}>Categorias</Text>
          <Categories {...{ handleCateg, categ }} />
          <ItemsCtn data={itemsData} load={load} filter={filter} />
        </View>
      </ScrollView>
      <NavBar active={0} />
    </View>
  );
}

const Header = () => {
  return (
    <View style={st.h_ctn}>
      <View style={{ flexDirection: "row", display: "flex", gap: 12 }}>
        {/* <View style={st.avatar} /> */}
        <Avatar num={0} size={42} />
        <View style={{ display: "flex", justifyContent: "center" }}>
          <Text style={st.small}>Bienvenido</Text>
          <Text style={st.username}>Invitado</Text>
        </View>
      </View>
      <Pressable style={st.gear}>
        <IconGear />
      </Pressable>
    </View>
  );
};

const SearchFilt = ({ toggleFilter, setSearchBar, searchBar }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    toggleFilter(active);
  }, [active]);

  return (
    <View style={st.sf_ctn}>
      <SearchBar {...{ setSearchBar, searchBar }} />
      <Pressable
        // onPress={toggleFilter}
        onPress={() => {
          setActive(!active);
        }}
        style={({ pressed }) => ({
          ...st.sf_btn,
          backgroundColor: active ? t.four : t.prime,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <IconOptions color={!active ? t.four : t.prime} />
      </Pressable>
    </View>
  );
};

const FiltersCtn = ({ filter, handleFilter,y }) => {
  return (
   <>
    <View style={st.filter_ctn}>
      <Animated.View
        style={{
          ...st.filter_animate,
          transform: [{ translateY: 0 }],
        }}
      >
        <FilterItem
          name="price"
          text="Precio"
          Icon={IconDollar}
          {...{ filter, handleFilter }}
        />
        <FilterItem
          name="stars"
          text="Valoracion"
          Icon={IconStar}
          {...{ filter, handleFilter }}
        />
      </Animated.View>
    </View>
    
    <Animated.View style={[st.invisible, { marginTop: y }]} />
   </>
  );
};

const FilterItem = ({ Icon, text, name, filter, handleFilter }) => {
  let selected = filter.name === name && filter.status !== null;
  return (
    <Pressable
      onPress={() => {
        handleFilter(name);
      }}
      style={({ pressed }) => ({
        ...st.filter_item,
        opacity: pressed ? 0.5 : 1,
        backgroundColor: selected ? t.four : t.prime,
      })}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Icon size={20} color={selected ? t.prime : t.four} />
        <Text style={{ fontSize: 14, color: selected ? t.prime : t.four }}>
          {text}
        </Text>
      </View>
      {selected && filter.status === 2 && (
        <IconArrowUp color={selected ? t.prime : t.four} />
      )}
      {selected && filter.status === 1 && (
        <IconArrowDown color={selected ? t.prime : t.four} />
      )}
    </Pressable>
  );
};

const st = StyleSheet.create({
  ctn: {
    // padding: 20,
    paddingTop: 32,
    display: "flex",
    gap: 14,
  },
  subtitle: { fontFamily: "Bold", fontSize: 20, paddingHorizontal: 20 },
  invisible: {
    height: 1,
    width: "100%",
    marginTop: -120,
  },
  down_ctn: {
    backgroundColor: t.prime,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    paddingTop: 6,
    paddingBottom: 64,
  },
  h_ctn: {
    // backgroundColor: "#888888",
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    backgroundColor: t.third,
    borderRadius: 100,
  },
  gear: ({ pressed }) => ({
    padding: 9,
    opacity: pressed ? 0.5 : 1,
  }),
  small: {
    fontSize: 14,
  },
  username: {
    fontSize: 16,
    fontFamily: "Bold",
  },
  sf_ctn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  sf_btn: {
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  filter_ctn: {
    position: "relative",
    width: "100%",
    paddingHorizontal: 20,
    height: 90,
    overflow: "hidden",
  },
  filter_animate: {
    width: "100%",
    position: "absolute",
    marginHorizontal: 20,
    overflow: "hidden",
    zIndex: -100,
  },
  filter_item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomColor: t.four,
    borderBottomWidth: 1,
  },
});
