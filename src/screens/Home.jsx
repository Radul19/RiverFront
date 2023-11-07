import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Text from "../components/Text";
import t from "../components/stylesVar";
import { SearchBar } from "../components/Inputs";
import { ItemsCtn, ww } from "../components/DisplayItems";
import NavBar from "../components/NavBar";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { searchItems} from '../api/general'
import {
  IconArrowDown,
  IconArrowUp,
  IconCPU,
  IconDollar,
  IconDrop,
  IconGear,
  IconHamburguer,
  IconHome,
  IconJacket,
  IconOptions,
  IconStar,
  IconFolders,
  IconDots,
  IconStall,
} from "../components/Icons";

const resetCateg = {
  all: true,
  home: false,
  clean: false,
  cloth: false,
  food: false,
  tech: false,
  others: false,
};

export default function Home() {
  const [searchBar, setSearchBar] = useState('')
  const [itemsData, setItemsData] = useState([])
  const [load , setload  ] = useState(false)
  const [filter, setFilter] = useState({
    name: null,
    status: null,
  });
  const [categ, setCateg] = useState(resetCateg);

  const handleCateg = (name) => {
    if (name === "all") return setCateg(resetCateg);
    let value = categ[name];
    setCateg({ ...categ, [name]: !value, all: false });
  };


  const handleFilter = (name) => {
    let val;
    if (filter.name === name) {
      if (filter.status === null) val = 1;
      else if (filter.status === 1) val = 2;
      else if (filter.status === 2) val = null;
      setFilter({ name, status: val });
    } else setFilter({ name, status: 1 });
    // setFilter({...filter,[name]:val})
  };
  
  const y = useSharedValue(-160);
  const toggleFilter = (val) => {
    if (val) {
      y.value = withSpring(0, { dampingRatio: 1, duration: 1000 });
    } else {
      y.value = withSpring(-160, { dampingRatio: 1, duration: 1000 });
    }
  };

  const executeSearch = async (text)=>{
    setload(true)
    let {status,data} = await searchItems(text,categ)
    setload(false)
    if(status === 200){
      setItemsData(data)
    }
  }

  useEffect(() => {
    let tm = setTimeout(() => {
      executeSearch(searchBar,filter,categ)
    }, 700);

    return ()=>{
      clearTimeout(tm)
    }
  
  }, [searchBar,filter,categ])
  

  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      <ScrollView contentContainerStyle={st.ctn}>
        <Header />
        <SearchFilt {...{ toggleFilter,setSearchBar,searchBar }} />
        <FiltersCtn {...{ filter, handleFilter }} />
        <Animated.View style={[st.invisible, { marginTop: y }]} />
        <View style={st.down_ctn}>
          <Text style={st.subtitle}>Categorias</Text>
          <Categories {...{ handleCateg, categ }} />
          <ItemsCtn data={itemsData} load={load} />
        </View>
      </ScrollView>
      <NavBar active={0} />
    </View>
  );
}
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
});

const Header = () => {
  return (
    <View style={hd.ctn}>
      <View style={{ flexDirection: "row", display: "flex", gap: 12 }}>
        <View style={hd.avatar} />
        <View style={{ display: "flex", justifyContent: "center" }}>
          <Text style={hd.small}>Bienvenido</Text>
          <Text style={hd.username}>Invitado</Text>
        </View>
      </View>
      <Pressable style={hd.gear}>
        <IconGear />
      </Pressable>
    </View>
  );
};
const hd = StyleSheet.create({
  ctn: {
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
});

const SearchFilt = ({ toggleFilter,setSearchBar,searchBar }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    toggleFilter(active);
  }, [active]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 20,
      }}
    >
      <SearchBar {...{setSearchBar,searchBar}} />
      <Pressable
        // onPress={toggleFilter}
        onPress={() => {
          setActive(!active);
        }}
        style={({ pressed }) => ({
          borderRadius: 6,
          backgroundColor: active ? t.four : t.prime,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <IconOptions color={!active ? t.four : t.prime} />
      </Pressable>
    </View>
  );
};

const Categories = ({ handleCateg, categ }) => {
  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={{
        display: "flex",
        flexDirection: "row",
        gap: 12,
        paddingLeft: 20,
        paddingBottom: 12,
      }}
    >
      <Category
        {...{ handleCateg, categ }}
        name="all"
        text="Todas"
        Icon={IconFolders}
      />
      <Category
        {...{ handleCateg, categ }}
        name="home"
        text="Hogar"
        Icon={IconHome}
      />
      <Category
        {...{ handleCateg, categ }}
        name="clean"
        text="Limpieza"
        Icon={IconDrop}
      />
      <Category
        {...{ handleCateg, categ }}
        name="cloth"
        text="Ropa"
        Icon={IconJacket}
      />
      <Category
        {...{ handleCateg, categ }}
        name="food"
        text="Comida"
        Icon={IconHamburguer}
      />
      <Category
        {...{ handleCateg, categ }}
        name="tech"
        text="Tecnologia"
        Icon={IconCPU}
      />
      <Category
        {...{ handleCateg, categ }}
        name="others"
        text="Otros"
        Icon={IconDots}
      />
    </ScrollView>
  );
};

const Category = ({ Icon, text = "", handleCateg, categ, name }) => {
  return (
    <Pressable
      onPress={() => {
        handleCateg(name);
      }}
      style={({ pressed }) => ({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 60,
        opacity: pressed ? 0.5 : 1,
        // backgroundColor:'#888'
      })}
    >
      <View
        style={{
          height: 50,
          width: 50,
          backgroundColor: categ[name] ? t.four : t.prime,
          borderWidth: 2,
          borderColor: t.four,
          borderRadius: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <Icon color={!categ[name] ? t.four : t.prime} />
      </View>
      <Text style={{ fontFamily: "Bold", fontSize: 14 }}>{text}</Text>
    </Pressable>
  );
};

const FiltersCtn = ({ filter, handleFilter }) => {
  return (
    <View
      style={{
        position: "relative",
        width: "100%",
        paddingHorizontal: 20,
        height: 135,
        overflow: "hidden",
        // backgroundColor:'#123123'
      }}
    >
      <Animated.View
        style={{
          width: "100%",
          position: "absolute",
          marginHorizontal: 20,
          overflow: "hidden",
          zIndex: -100,
          transform: [{ translateY: 0 }],
          // backgroundColor: t.four,
          // borderRadius: 12,
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
        <FilterItem
          name="stall"
          text="Comercios"
          Icon={IconStall}
          {...{ filter, handleFilter }}
        />
      </Animated.View>
    </View>
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 12,
        opacity: pressed ? 0.5 : 1,
        backgroundColor: selected ? t.four : t.prime,
        borderBottomColor: t.four,
        borderBottomWidth: 1,
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
