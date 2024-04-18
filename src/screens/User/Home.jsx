import {
  View,
  Pressable,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Text from "../../components/Text";
import { v, stB, stl_home } from "../../components/stylesVar";
import { Avatar, SearchBar } from "../../components/Inputs";
import { Categories, ItemsCtn, Subtitle, ww } from "../../components/DisplayItems";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { searchItems } from "../../api/general";
import {
  IconArrowDown,
  IconArrowUp,
  IconDollar,
  IconGear,
  IconOptions,
  IconStar,
} from "../../components/Icons";
import Context from "../../components/Context";
import Scroll from "../../components/Scroll";


export default function Home() {
  const [searchBar, setSearchBar] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [load, setLoad] = useState(false);
  const [filter, setFilter] = useState({
    name: "stars",
    status: 1,
  });
  const [categ, setCateg] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const handleCateg = (name) => {
    let indexOf = categ.indexOf(name);
    let aux = [...categ];
    if (!(indexOf === -1)) {
      aux.splice(indexOf, 1);
    } else aux.push(name);
    setCateg(aux);
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

  const y = useSharedValue(-110);
  const toggleFilter = (val) => {
    // console.log(y.value)
    // console.log(val)
    const springTime = { dampingRatio: 1, duration: 1000 };
    y.value = withSpring(val ? 0 : -110, springTime);
    // if (val) y.value = withSpring(0, springTime);
    // else y.value = withSpring(-120, springTime);
  };

  const executeSearch = async () => {
    setLoad(true);
    let { status, data } = await searchItems(searchBar, categ);
    setLoad(false);
    if (status === 200) {
      setItemsData(data);
    }
    // console.log(data);
  };

  useEffect(() => {
    let t = setTimeout(() => {
      executeSearch();
    }, 700);

    return () => {
      clearTimeout(t);
    };
  }, [searchBar, categ]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let { status, data } = await searchItems(searchBar, categ);
    setRefreshing(false);
    if (status === 200) {
      setItemsData(data);
    }
  }, []);

  return (
    <Scroll {...{ refreshing, onRefresh }} nav={1}>
      <Header />
      <SearchFilt {...{ toggleFilter, setSearchBar, searchBar }} />
      <FiltersCtn {...{ filter, handleFilter, y }} />
      <Animated.View style={[stl_home.down_ctn, { marginTop: y }]}>
        <Subtitle>Categorias</Subtitle>
        <Categories {...{ handleCateg, categ }} shop={false} />
        <ItemsCtn data={itemsData} load={load} filter={filter} />
      </Animated.View>
    </Scroll>
  );
}

const Header = () => {
  const { userData } = useContext(Context);
  return (
    <View style={stB.h_ctn}>
      <View style={{ flexDirection: "row", display: "flex", gap: 12 }}>
        {/* <View style={stB.avatar} /> */}
        <Avatar num={userData.avatar ? userData.avatar : 0} size={42} />
        <View style={{ display: "flex", justifyContent: "center" }}>
          <Text style={stB.stl_home}>Bienvenido</Text>
          <Text style={stB.stl_home}>
            {userData.name ? userData.name : "Invitado"}
          </Text>
        </View>
      </View>
      <Pressable style={stl_home.gear} onPress={() => console.log(userData)}>
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
    <View style={stl_home.sf_ctn}>
      <SearchBar {...{ setSearchBar, searchBar }} />
      <Pressable
        onPress={() => {
          setActive(!active);
        }}
        style={({ pressed }) => ({
          ...stl_home.sf_btn,
          backgroundColor: active ? v.four : v.prime,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <IconOptions color={!active ? v.four : v.prime} />
      </Pressable>
    </View>
  );
};

const FiltersCtn = ({ filter, handleFilter, y }) => {
  return (
    <>
      <View style={stl_home.filter_ctn}>
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
      </View>
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
        ...stl_home.filter_item,
        opacity: pressed ? 0.5 : 1,
        backgroundColor: selected ? v.four : v.prime,
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
        <Icon size={20} color={selected ? v.prime : v.four} />
        <Text style={{ fontSize: 14, color: selected ? v.prime : v.four }}>
          {text}
        </Text>
      </View>
      {selected && filter.status === 2 && (
        <IconArrowUp color={selected ? v.prime : v.four} />
      )}
      {selected && filter.status === 1 && (
        <IconArrowDown color={selected ? v.prime : v.four} />
      )}
    </Pressable>
  );
};
