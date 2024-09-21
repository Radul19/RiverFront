import { View, TextInput, StyleSheet, Image, Pressable, KeyboardTypeOptions } from "react-native";
import React, { useEffect, useRef, useState, Dispatch, FC, HtmlHTMLAttributes } from "react";
import { v, ww } from "./stylesVar";
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

type SBType = {
  setSearchBar: Dispatch<string>,
  searchBar: string
}
export const SearchBar = ({ setSearchBar = () => { }, searchBar }: SBType) => {
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

type InputProps = {
  placeholder?: string,
  name?: string,
  set?: Dispatch<any>,
  secure?: boolean,
  initialValue?: string,
  Icon?: FC,
  keyboardType?: KeyboardTypeOptions,
  custom?: ((x: any, y: any) => void),
  before?: string,
  regex?: RegExp,
  maxLength?: number,
  multiline?: boolean,
  timeout?: boolean,
}
export const Input = ({
  placeholder = "",
  name = "",
  set = () => { },
  secure = false,
  initialValue = "",
  Icon = undefined,
  keyboardType = "default",
  custom = undefined,
  before = undefined,
  regex = undefined,
  maxLength = 999,
  multiline = false,
  timeout = false,
}: InputProps) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    let tm: any
    if (timeout) {
      tm = setTimeout(() => {
        if (custom) return custom(name, value);
        else set((prev: any) => ({ ...prev, [name]: value }));
      }, 700);
    } else {
      if (custom) return custom(name, value);
      else set((prev: any) => ({ ...prev, [name]: value }));
    }

    return () => {
      clearTimeout(tm);
    };
  }, [value]);
  const update = (t: string) => {
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

type InputCardPops = {
  placeholder: string,
  name: string,
  set: Dispatch<any>,
  initialValue?: string,
}
export const InputCardId = ({
  placeholder = "",
  name = "",
  set,
  initialValue = "",
}: InputCardPops) => {
  const [value, setValue] = useState(initialValue);
  const onChangeText = (text: string) => {
    setValue(card_id_dots(text));
  };
  useEffect(() => {
    let tm = setTimeout(() => {
      set((prev: any) => ({ ...prev, [name]: value }));
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

type AvatarsProps = {
  set: Dispatch<number>,
  start?: number
}
export const Avatars = ({ set, start = 1 }: AvatarsProps) => {
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

export const Avatar = ({ num, size = 64 }: { num: number, size?: number }) => {
  return (
    <Image
      style={{ width: size, height: size }}
      source={getAvatar(num)}
    />
  );
};
const getAvatar = (num: number) => {
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

export const CodeInput = ({ set }: { set: Dispatch<string> }) => {
  const [input, setInput] = useState("");
  const ref = useRef<TextInput>(null);

  const focus = () => {
    if (ref.current !== null && !ref.current.isFocused()) {
      ref.current.focus();
    }
  };

  const changeText = (text: string) => {
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

const CodeText = ({ text = undefined }: { text?: string }) => {
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
    width: ww - 128,
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
  code_ctn: ({ pressed }: { pressed: boolean }) => ({
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
