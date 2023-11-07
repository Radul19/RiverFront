import { View, StyleSheet, ScrollView, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import t from "../components/stylesVar";
import Text from "../components/Text";
import { Avatars, Input } from "../components/Inputs";
import { PrimaryBtn } from "../components/Btns";
const Register = () => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    card_id: "",
    password: "",
    confirmPass: "",
    avatar: 1,
  });

  const updtAvatar = (num) => {
    setInputs({ ...inputs, avatar: num });
  };

  const confirm = () => {
    console.log(inputs);
  };

  const [keyboardStatus, setKeyboardStatus] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      <ScrollView contentContainerStyle={st.ctn}>
        <Text fs={32} ff="Bold">
          Registro
        </Text>
        <Input name="name" placeholder="Nombre" set={setInputs} />
        <Input name="email" placeholder="Correo" set={setInputs} />
        <Input
          name="card_id"
          placeholder="Cédula de Identidad"
          set={setInputs}
        />
        <Input secure={true} name="password" placeholder="Contraseña" set={setInputs} />
        <Input secure={true}
          name="confirmPass"
          placeholder="Confirmar Contraseña"
          set={setInputs}
        />
        <Text style={st.subtitle}>Selecciona un avatar</Text>
        <Avatars set={updtAvatar} />
        <View style={{marginTop:42}} />
        {/* {!keyboardStatus && <PrimaryBtn text="Confirmar" action={confirm} />} */}
        <PrimaryBtn text="Confirmar" action={confirm} />
      </ScrollView>
    </View>
  );
};

export default Register;

const st = StyleSheet.create({
  ctn: {
    paddingTop: 32,
    paddingBottom: 24,
    display: "flex",
    gap: 14,
    paddingHorizontal: 20,
    flex: 1,
  },
  subtitle: {
    fontFamily: "Medium",
    fontSize: 16,
    marginVertical: 12,
  },
});
