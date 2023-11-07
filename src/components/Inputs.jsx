import { View, TextInput, StyleSheet, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import t from "../components/stylesVar";
import { IconZoom } from "./Icons";
import guest from "../images/guest.png";
import male1 from "../images/male1.png";
import male2 from "../images/male2.png";
import male3 from "../images/male3.png";
import male4 from "../images/male4.png";
import fem1 from "../images/fem1.png";
import fem2 from "../images/fem2.png";
import fem3 from "../images/fem3.png";
import fem4 from "../images/fem4.png";

export const SearchBar = ({ setSearchBar = () => {}, searchBar }) => {
  return (
    <View style={st.sb_ctn}>
      <IconZoom />
      <TextInput
        style={st.sb_input}
        placeholder="Buscar..."
        onChangeText={setSearchBar}
        value={searchBar}
      />
    </View>
  );
};

export const Input = ({ placeholder = "", name = "", set,secure=false }) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    let tm = setTimeout(() => {
      set((prev) => ({ ...prev, [name]: value }));
    }, 700);

    return () => {
      clearTimeout(tm);
    };
  }, [value]);
  return (
    <View style={st.input_ctn}>
      <TextInput
        style={st.input}
        placeholder={placeholder}
        onChangeText={setValue}
        value={value}
        secureTextEntry={secure}
      />
    </View>
  );
};
const arrAv = [1, 2, 3, 4, 5, 6, 7, 8];
export const Avatars = ({ set}) => {
  const [active, setActive] = useState(1);
  useEffect(() => {
    set(active)
    // let tm = setTimeout(() => {
    // }, 700);
  
    // return () => {
    //   clearTimeout(tm)
    // }
  }, [active])
  
  return (
    <View style={st.avatars_ctn}>
      {arrAv.map((num, index) => (
        <Pressable
        onPress={()=>{setActive(num)}}
          style={({ pressed }) => ({
            ...st.avatar_btn,
            opacity: pressed ? 0.5 : 1,
            borderColor: active === num ? t.four : t.prime,
          })}
        >
          <Avatar num={num} key={index} />
        </Pressable>
      ))}
    </View>
  );
};

export const Avatar = ({ num, size = 64 }) => {
  return (
    <Image
      style={[st.avatar, { width: size, height: size }]}
      source={getAvatar(num)}
    />
  );
};
const getAvatar = (num) => {
  switch (num) {
    case 0:
      return guest;
    case 1:
      return male1;
      break;
    case 2:
      return male2;
      break;
    case 3:
      return male3;
      break;
    case 4:
      return male4;
      break;
    case 5:
      return fem1;
      break;
    case 6:
      return fem2;
      break;
    case 7:
      return fem3;
      break;
    case 8:
      return fem4;
      break;

    default:
      break;
  }
};



const st = StyleSheet.create({
  sb_ctn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#cccccc",
    borderRadius: 6,
    flex: 1,
  },
  sb_input: {
    fontSize: 14,
    fontFamily: "Regular",
    width: "100%",
  },
  input_ctn: {
    borderBottomWidth: 1,
    borderColor: t.four,
    // backgroundColor:'#123123'
  },
  input: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontFamily: "Regular",
  },
  avatars_ctn: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  avatar_btn: {
    // padding: 2,
    borderRadius: 100,
    borderWidth: 1,
    // borderColor:t.four
  },
});
