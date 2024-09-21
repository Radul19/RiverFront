import {
  View,
  Pressable,
} from "react-native";
import React, { Dispatch, FC, useCallback, useContext, useEffect, useState } from "react";
import Text from "../../../components/Text";
import { v, stB, stl_home } from "../../../components/stylesVar";
import { Avatar, SearchBar } from "../../../components/Inputs";
import { Categories, ItemsCtn, Subtitle } from "../../../components/DisplayItems";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { searchItems } from "../../../api/guest";
import {
  IconArrowDown,
  IconArrowUp,
  IconDollar,
  IconGear,
  IconOptions,
  IconStar,
} from "../../../components/Icons";
import Context from "../../../components/Context";
import Scroll from "../../../components/Scroll";

interface FilterType { name?: string, status?: number }

const Home = () => {
  const [searchBar, setSearchBar] = useState("");
  const [itemsData, setItemsData] = useState([]);
  const [load, setLoad] = useState(false);
  const [filter, setFilter] = useState<FilterType>({
    name: "stars",
    status: 1,
  });
  const [categ, setCateg] = useState<string[]>([]);


  const handleCateg = (name: string) => {
    let indexOf = categ.indexOf(name);
    let aux = [...categ];
    if (!(indexOf === -1)) {
      aux.splice(indexOf, 1);
    } else aux.push(name);
    setCateg(aux);
  };

  const handleFilter = (n: string) => {
    let name: string | undefined = n;
    let val;
    if (filter.name === name) {
      if (filter.status === undefined) val = 1;
      else if (filter.status === 1) val = 2;
      else if (filter.status === 2) (val = undefined), (name = undefined);
      setFilter({ name, status: val });
    } else setFilter({ name, status: 1 });
    // setFilter({...filter,[name]:val})
  };

  const y = useSharedValue(-110);

  const toggleFilter = (val: boolean) => {
    const springTime = { dampingRatio: 1, duration: 1000 };
    y.value = withSpring(val ? 0 : -110, springTime);
  }

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



  const [refreshing, setRefreshing] = useState(false);
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
        <Categories {...{ handleCateg, categ }} />
        <ItemsCtn data={itemsData} load={load} filter={filter} />
      </Animated.View>
    </Scroll>
  );
}

export default Home

const Header = () => {
  const { userData } = useContext(Context);
  return (
    <View style={stB.h_ctn}>
      <View style={{ flexDirection: "row", display: "flex", gap: 12 }}>
        {/* <View style={stB.avatar} /> */}
        <Avatar num={userData.avatar ? userData.avatar : 0} size={42} />
        <View style={{ display: "flex", justifyContent: "center" }}>
          <Text >Bienvenido</Text>
          <Text >
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
type SearchFiltProps = {
  toggleFilter: (val: boolean) => void,
  setSearchBar: Dispatch<string>,
  searchBar: string
}
const SearchFilt = ({ toggleFilter, setSearchBar, searchBar }: SearchFiltProps) => {
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

type FilterCtnProps = {
  filter: FilterType,
  handleFilter: (n: string) => void,
}
const FiltersCtn = ({ filter, handleFilter }: FilterCtnProps) => {
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


type FilterItemProp = FilterCtnProps & {
  Icon: FC<{ size: number, color: string }>,
  text: string,
  name: string,
}
const FilterItem = ({ Icon, text, name, filter, handleFilter }: FilterItemProp) => {
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
