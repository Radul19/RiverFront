import { View, TextInput, StyleSheet, Image, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { v } from "../components/stylesVar";
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
import card_id_dots from "../helpers/card_id_dots";

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
  Icon = false,
  keyboardType = "default",
  custom = false,
  before = false,
  regex = false,
  maxLength = 999,
  multiline = false,
  timeout= false,
}) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    let tm
    if(timeout){
      tm = setTimeout(() => {
        if (custom) return custom(name, value);
        set((prev) => ({ ...prev, [name]: value }));
      }, 700);
    }else{
      if (custom) return custom(name, value);
        set((prev) => ({ ...prev, [name]: value }));
    }

    return () => {
      clearTimeout(tm);
    };
  }, [value]);
  const update = (t) => {
    if (t.length === 0) setValue(t);
    else if (regex && regex.test(t)) setValue(t);
    else if (!regex) setValue(t);
  };
  return (
    <View style={st.input_ctn}>
      {Icon && <Icon />}
      {before && (
        <Text style={{ position: "absolute", marginLeft: 6 }}>{before}</Text>
      )}
      <TextInput
        keyboardType={keyboardType}
        style={[st.input, { marginLeft: before ? 6 : 0 }]}
        placeholder={placeholder}
        onChangeText={update}
        value={value}
        secureTextEntry={secure}
        maxLength={maxLength}
        multiline={multiline}
      />
    </View>
  );
};

export const InputCardId = ({
  placeholder = "",
  name = "",
  set,
  initialValue = "",
}) => {
  const [value, setValue] = useState(initialValue);
  const onChangeText = (text) => {
    setValue(card_id_dots(text));
  };
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
        onChangeText={onChangeText}
        value={value}
        maxLength={10}
        keyboardType="number-pad"
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
            borderColor: active === num ? "#888" : v.prime,
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
      style={{ width: size, height: size }}
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

export const CodeInput = ({ set = () => {} }) => {
  const [input, setInput] = useState("");
  const ref = useRef(null);

  const focus = () => {
    if (!ref.current.isFocused()) {
      ref.current.focus();
    }
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
      <Pressable style={st.code_ctn} onPress={focus}>
        <CodeText text={input[0]} />
        <CodeText text={input[1]} />
        <CodeText text={input[2]} />
        <CodeText text={input[3]} />
        <CodeText text={input[4]} />
        <CodeText text={input[5]} />
      </Pressable>
    </>
  );
};

const CodeText = ({ text = false }) => {
  return (
    <>
      {text ? (
        <View
          style={[st.code_box, { backgroundColor: v.four }]}
          // onPress={focus}
        >
          <Text style={{ color: v.prime }} fs={16} ff="Bold">
            {text}
          </Text>
        </View>
      ) : (
        <View style={st.code_box} ></View>
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
  },
  sb_input: {
    fontSize: 14,
    fontFamily: "Regular",
    width: "100%",
  },
  input_ctn: {
    borderBottomWidth: 1,
    borderColor: v.four,
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
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
    // borderColor:v.four
  },
  code_ctn: ({ pressed }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    flexDirection: "row",
    paddingVertical: 12,
    opacity: pressed ? 0.5 : 1,
  }),
  code_box: {
    borderWidth: 3,
    borderColor: v.four,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding:12,
    height: 42,
    width: 42,
  },
  code_input: {
    position: "absolute",
    opacity: 0,
    top: -1000,
    // display: "none",
  },
  cc: {
    color: v.four,
  },
});

export const regex_card = /^[0-9.]+$/;
export const regex_num = /^[0-9]+$/;
export const regex_phone = /^[0-9-]+$/;
export const regex_price = /^[0-9]+[.]?[0-9]*$/;
export const regex_text = /^[à-üÀ-Üa-zA-Z ]+$/;
export const regex_textnum = /^[à-üÀ-Üa-zA-Z0-9 ]*$/;
export const regex_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
