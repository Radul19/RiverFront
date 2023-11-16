import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import React, { useState, useContext } from "react";
import Text from "../components/Text";
import NavBar from "../components/NavBar";
import { Input } from "../components/Inputs";
import { IconArrowRight, IconCross, IconLoad } from "../components/Icons";
import t from "../components/stylesVar";
import { ww } from "../components/DisplayItems";
import Context from "../components/Context";
import { login } from "../api/general";
import { storeLocalData } from "../helpers/localStorage";

const Profile = ({ navigation }) => {
  const [load, setLoad] = useState(false);
  const { userData, setUserData } = useContext(Context);
  const [error, setError] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  const loginPress = async () => {
    setError(false);
    setLoad(true);
    const { status, data } = await login(inputs.email, inputs.password);
    setLoad(false);
    if (status === 200) {
      setInputs({
        email: "",
        password: "",
      });
      await storeLocalData("@userToken", data.token);
      setUserData(data);
    } else {
      setError(data.msg);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      <ScrollView contentContainerStyle={st.ctn}>
        <Text style={{ fontSize: 32, marginBottom: 24 }} ff="Bold">
          Here To Get Welcomed!
        </Text>
        <Input name="email" placeholder="Correo" set={setInputs} />
        <Input
          name="password"
          placeholder="Contraseña"
          set={setInputs}
          secure={true}
        />
        {/* <ErrorText text='Something something' /> */}
        {error && <ErrorText text={error} />}
        <Pressable style={st.btn_ctn} onPress={loginPress} disabled={load} >
          <Text style={{ fontSize: 20 }} ff="Medium">
            Iniciar Sesion
          </Text>
          <View style={st.btn_login}>
            {load ? <IconLoad color="#eee" /> : <IconArrowRight color={t.prime} />}
          </View>
        </Pressable>
        <Pressable style={st.register_btn} onPress={goToRegister}>
          <Text style={st.register}>Registrarse</Text>
        </Pressable>
      </ScrollView>
      <NavBar active={3} />
    </View>
  );
};

const ErrorText = ({ text }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        marginBottom: -32,
        height: 18,
      }}
    >
      <IconCross color="#F20000" size={16} />
      <Text style={{ color: "#F20000" }}>{text}</Text>
    </View>
  );
};

export default Profile;

const st = StyleSheet.create({
  ctn: {
    paddingTop: ww * 0.3,
    paddingBottom: 64,
    display: "flex",
    gap: 14,
    paddingHorizontal: 20,
  },
  btn_ctn: ({ pressed }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    opacity: pressed ? 0.5 : 1,
    marginTop: 32,
  }),
  btn_login: {
    borderRadius: 100,
    height: 50,
    width: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.four,
  },
  register_btn: ({ pressed }) => ({
    borderBottomColor: t.four,
    borderBottomWidth: 1,
    alignSelf: "flex-end",
    opacity: pressed ? 0.5 : 1,
    marginTop: 64,
  }),
  register: {
    fontSize: 16,
    fontFamily: "Medium",
  },
});
