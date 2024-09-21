import { View, StyleSheet, ScrollView, Pressable, ViewStyle, TextStyle } from "react-native";
import React, { useState, useContext } from "react";
import Text from "../../../components/Text";
import NavBar from "../../../components/NavBar";
import { Input } from "../../../components/Inputs";
import { IconArrowRight, IconCross, IconLoad } from "../../../components/Icons";
import { v, ww } from "../../../components/stylesVar";
import Context from "../../../components/Context";
import { login } from "../../../api/guest";
import { storeLocalData } from "../../../helpers/localStorage";
import Scroll from "../../../components/Scroll";
import { ScreensType } from "../../../types/screens";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<ScreensType, 'Login'>
const Login = ({ navigation }: Props) => {
  const [load, setLoad] = useState(false);
  const { userData, setUserData } = useContext(Context);
  const [error, setError] = useState<string | undefined>(undefined);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const goToRegister = () => {
    console.log(userData);
    // navigation.navigate("Register");
  };

  const loginPress = async () => {
    setError(undefined);
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
    <Scroll nav={4}>
      <View style={st.ctn}>
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
        <Pressable style={st.btn_ctn} onPress={loginPress} disabled={load}>
          <Text style={{ fontSize: 20 }} ff="Medium">
            Iniciar Sesion
          </Text>
          <View style={st.btn_login}>
            {load ? (
              <IconLoad color="#eee" />
            ) : (
              <IconArrowRight color={v.prime} />
            )}
          </View>
        </Pressable>
        <Pressable style={st.register_btn} onPress={goToRegister}>
          <Text style={st.register}>Registrarse</Text>
        </Pressable>
      </View>
    </Scroll>
  );
};

const ErrorText = ({ text }: { text?: string }) => {
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

export default Login;

const st = StyleSheet.create({
  ctn: {
    paddingTop: ww * 0.3,
    paddingBottom: 44,
    display: "flex",
    gap: 14,
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
    backgroundColor: v.four,
  },
  register_btn: ({ pressed }) => ({
    borderBottomColor: v.four,
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
