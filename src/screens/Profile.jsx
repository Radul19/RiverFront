import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import { Avatar, Avatars, Input } from "../components/Inputs";
import Text from "../components/Text";
import NavBar from "../components/NavBar";
import {
  IconArrowRight,
  IconCross,
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
import Context from "../components/Context";
import { editUserData } from "../api/general";
import { deleteLocalData } from "../helpers/localStorage";

const Profile = () => {
  const { userData, setUserData } = useContext(Context);
  const [page, setPage] = useState(1);
  return (
    <Animated.View
      style={{ flex: 1, backgroundColor: t.prime }}
      entering={FadeIn}
      exiting={FadeOut}
    >
      {page === 1 && <Info {...{ setPage, userData, setUserData }} />}
      {page === 2 && <UserProfile {...{ setPage, userData, setUserData }} />}
      {page === 3 && <InfoCommerce {...{ setPage }} edit={true} />}
      {page === 1 && <NavBar active={3} />}
    </Animated.View>
  );
};

export default Profile;

const Info = ({ setPage, userData, setUserData }) => {
  const goEditProfile = () => {
    setPage(2);
  };
  const goEditCommerce = () => {
    setPage(3);
  };

  const exit = async () => {
    await deleteLocalData("@userToken");
    setUserData({
      _id: false,
      commerce: false,
    });
  };

  return (
    <ScrollView contentContainerStyle={st.ctn}>
      <View style={st.avatar_ctn}>
        <Avatar num={userData.avatar} size={100} />
        <Text {...{ fs: 16, ff: "Bold" }}>{userData.name}</Text>
        <Text>{userData.email}</Text>
      </View>
      <View style={st.options_ctn}>
        <Options
          Icon={IconUserLine}
          text="Informacion Personal"
          action={goEditProfile}
        />
        {userData.commerce && (
          <Options
            Icon={IconStallLine}
            text="Informacion comercial"
            action={goEditCommerce}
          />
        )}
        <Options Icon={IconExit} text="Cerrar Sesion" action={exit} />
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

const UserProfile = ({ setPage, userData, setUserData }) => {
  const [error, setError] = useState(false);
  const [inputs, setInputs] = useState({
    avatar: userData.avatar,
    email: userData.email,
    name: userData.name,
  });
  const goBack = () => {
    setPage(1);
  };

  const updtAvatar = (num) => {
    setInputs({ ...inputs, avatar: num });
  };

  const confirm = async () => {
    const info = {
      user_id: userData._id,
      name: inputs.name,
      email: inputs.email,
      avatar: inputs.avatar,
    };
    const { status, data } = await editUserData(info);
    if (status === 200) {
      setUserData((prev) => ({
        ...prev,
        name: info.name,
        email: info.email,
        avatar: info.avatar,
      }));
      setPage(1);
    } else {
      setError(data.msg);
    }
    // console.log(inputs)
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     setPage(1);
    //     resolve("yay");
    //   }, 2000);
    // });
  };

  return (
    <Animated.View entering={FadeIn} style={{ flex: 1 }} exiting={FadeOut}>
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
        <Text style={{ textAlign: "center" }} ff="Medium" fs={16}>
          Selecciona un avatar
        </Text>
        <Avatars set={updtAvatar} start={userData.avatar} />
        <Input
          name="name"
          placeholder="Nombre"
          set={setInputs}
          initialValue={inputs.name}
        />
        <Input
          name="email"
          placeholder="Correo"
          set={setInputs}
          initialValue={inputs.email}
        />
        <View style={{ marginTop: "auto" }} />
        {error && <ErrorText text={error} />}
        <PrimaryBtn text="Confirmar" action={confirm} />
      </ScrollView>
    </Animated.View>
  );
};

const st = StyleSheet.create({
  ctn: {
    padding: 20,
    display: "flex",
    gap: 14,
    minHeight: wh,
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

const ErrorText = ({ text }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
      }}
    >
      <IconCross color="#F20000" size={16} />
      <Text style={{ color: "#F20000" }}>{text}</Text>
    </View>
  );
};
