import { View, TextInput, StyleSheet, Image, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import Text from "./Text";

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

export const Input = ({
  placeholder = "",
  name = "",
  set,
  secure = false,
  initialValue = "",
  Icon = false
}) => {
  const [value, setValue] = useState(initialValue);
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
      {Icon && <Icon />}
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
export const Avatars = ({ set, start = 1 }) => {
  const [active, setActive] = useState(start);
  useEffect(() => {
    set(active);
    // let tm = setTimeout(() => {
    // }, 700);

    // return () => {
    //   clearTimeout(tm)
    // }
  }, [active]);

  return (
    <View style={st.avatars_ctn}>
      {arrAv.map((num, index) => (
        <Pressable
          key={index}
          onPress={() => {
            setActive(num);
          }}
          style={({ pressed }) => ({
            ...st.avatar_btn,
            opacity: pressed ? 0.5 : 1,
            borderColor: active === num ? "#888" : t.prime,
          })}
        >
          <Avatar num={num} />
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

export const CodeInput = ({ set=()=>{} }) => {
  const [input, setInput] = useState("");
  const ref = useRef(null);

  const focus = () => {
    ref.current.focus();
  };

  const changeText = (text) => {
    if (text.match(/^[0-9]*$/)) {
      setInput(text);
    }
  };

  useEffect(() => {
      set(input);
  }, [input]);

  return (
    <>
      <TextInput
        ref={ref}
        style={st.code_input}
        maxLength={6}
        onChangeText={changeText}
        value={input}
        keyboardType="number-pad"
      />
      <View style={st.code_ctn}>
        <CodeText focus={focus} text={input[0]} />
        <CodeText focus={focus} text={input[1]} />
        <CodeText focus={focus} text={input[2]} />
        <CodeText focus={focus} text={input[3]} />
        <CodeText focus={focus} text={input[4]} />
        <CodeText focus={focus} text={input[5]} />
      </View>
    </>
  );
};

const CodeText = ({ text = false, focus }) => {
  return (
    <>
      {text ? (
        <Pressable
          style={[st.code_box, { backgroundColor: t.four }]}
          onPress={focus}
        >
          <Text style={{ color: t.prime }} fs={16} ff="Bold">
            {text}
          </Text>
        </Pressable>
      ) : (
        <Pressable style={st.code_box} onPress={focus}></Pressable>
      )}
    </>
  );
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
    display:'flex',
    flexDirection:'row',
    gap:12,
    alignItems:'center',
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
  code_ctn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    flexDirection: "row",
  },
  code_box: {
    borderWidth: 3,
    borderColor: t.four,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding:12,
    height: 42,
    width: 42,
  },
  code_input: {
    position:'absolute',
    opacity:0,
    top:-1000,
    // display: "none",
  },
  cc: {
    color: t.four,
  },
});
