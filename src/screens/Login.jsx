import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import Text from "../components/Text";
import NavBar from "../components/NavBar";
import { Input } from "../components/Inputs";
import { IconArrowRight } from "../components/Icons";
import t from "../components/stylesVar";
import { ww } from "../components/DisplayItems";

const Profile = ({navigation}) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const goToRegister = ()=>{
    navigation.navigate("Register")
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      <ScrollView contentContainerStyle={st.ctn}>
        <Text style={{ fontSize: 32,marginBottom:24 }} ff="Bold">
          Here To Get Welcomed!
        </Text>
        <Input name="email" placeholder="Correo" set={setInputs} />
        <Input name="password" placeholder="Contraseña" set={setInputs} />
        <Pressable style={st.btn_ctn}>
          <Text style={{ fontSize: 20 }} ff="Medium">
            Iniciar Sesion
          </Text>
          <View style={st.btn_login}>
            <IconArrowRight color={t.prime} />
          </View>
        </Pressable>
        <Pressable style={st.register_btn} onPress={goToRegister}  >
          <Text style={st.register}>Registrarse</Text>
        </Pressable>
      </ScrollView>
      <NavBar active={3} />
    </View>
  );
};

export default Profile;

const st = StyleSheet.create({
  ctn: {
    paddingTop: ww*0.2,
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
    marginTop:24,
    opacity: pressed ? 0.5 : 1,
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
    marginTop:64,
  }),
  register: {
    fontSize: 16,
    fontFamily: "Medium",
  },
});
