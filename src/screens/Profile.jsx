import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { Avatar, Avatars, Input } from "../components/Inputs";
import Text from "../components/Text";
import NavBar from "../components/NavBar";
import {
  IconArrowRight,
  IconExit,
  IconStallLine,
  IconUserLine,
} from "../components/Icons";
import t from "../components/stylesVar";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideInRight,
} from "react-native-reanimated";
import { PrimaryBtn } from "../components/Btns";
import { wh } from "../components/DisplayItems";
import { InfoCommerce } from "./RegisterCommerce";

const Profile = () => {
  const [page, setPage] = useState(1);
  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      {page === 1 && <Info {...{ setPage }} />}
      {page === 2 && <UserProfile {...{ setPage }} />}
      {page === 3 && <InfoCommerce {...{ setPage }} back={1} />}
      {page === 1 && <NavBar active={3} />}
    </View>
  );
};

export default Profile;

const Info = ({ setPage }) => {
  const goEditProfile = () => {
    setPage(2);
  };
  const goEditCommerce = () => {
    setPage(3)
  };
  return (
    <ScrollView contentContainerStyle={st.ctn}>
      <View style={st.avatar_ctn}>
        <Avatar num={1} size={100} />
        <Text {...{ fs: 16, ff: "Bold" }}>User_Name</Text>
        <Text>gmail@gmail.com</Text>
      </View>
      <View style={st.options_ctn}>
        <Options
          Icon={IconUserLine}
          text="Informacion Personal"
          action={goEditProfile}
        />
        <Options
          Icon={IconStallLine}
          text="Informacion comercial"
          action={goEditCommerce}
        />
        <Options Icon={IconExit} text="Cerrar Sesion" />
      </View>
    </ScrollView>
  );
};

const Options = ({ text, Icon, action }) => {
  return (
    <Pressable style={st.option_ctn} onPress={action}>
      {({ pressed }) => (
        <>
          <Icon color={!pressed ? t.four : t.prime} />
          <Text
            ff={"Medium"}
            fs={16}
            style={{ color: !pressed ? t.four : t.prime }}
          >
            {text}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const UserProfile = ({ setPage }) => {
  const [inputs, setInputs] = useState({
    avatars: 1,
    email: "",
    name: "",
  });
  const goBack = () => {
    setPage(1);
  };

  const updtAvatar = (num) => {
    setInputs({ ...inputs, avatar: num });
  };

  const confirm = ()=>{
    // console.log(inputs)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setPage(1);
        resolve("yay");
      }, 2000);
    });
  }

  return (
    <Animated.View entering={FadeIn} style={{flex:1}} exiting={FadeOut} >
      <ScrollView contentContainerStyle={st.ctn}>
        <View style={st.header}>
          <Pressable
            onPress={goBack}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              transform: [{ rotate: "180deg" }],
              padding: 8,
            })}
          >
            <IconArrowRight />
          </Pressable>
          <Text fs={32} ff="Bold">
            Info. Personal
          </Text>
        </View>
        <Text style={{textAlign:'center'}} ff="Medium" fs={16} >Selecciona un avatar</Text>
        <Avatars set={updtAvatar} start={1} />
        <Input name="name" placeholder="Nombre" set={setInputs} initialValue={'User_nameHere'} />
        <Input name="email" placeholder="Correo" set={setInputs} initialValue={'gmail@gmail.com'} />
        <View style={{marginTop:'auto'}} />
        <PrimaryBtn text='Confirmar' action={confirm} />
      </ScrollView>
    </Animated.View>
  );
};

const st = StyleSheet.create({
  ctn: {
    padding: 20,
    display: "flex",
    gap: 14,
    minHeight:wh,
    // flex:1,
    // alignItems: "center",
  },
  avatar_ctn: {
    display: "flex",
    gap: 14,
    alignItems: "center",
  },
  options_ctn: {
    display: "flex",
    width: "100%",
    gap: 6,
    paddingVertical: 24,
  },
  option_ctn: ({ pressed }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: pressed ? t.four : t.prime,
    borderRadius: 6,
  }),
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
