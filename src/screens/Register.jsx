import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { v } from "../components/stylesVar";
import Text from "../components/Text";
import { Avatars, Input, InputCardId, regex_email, regex_num, regex_textnum } from "../components/Inputs";
import { PrimaryBtn } from "../components/Btns";
import { IconArrowRight, IconCross } from "../components/Icons";
import { HeaderBtn, wh, ww } from "../components/DisplayItems";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { register } from "../api/general";
import Context from "../components/Context";
import { storeLocalData } from "../helpers/localStorage";
import Scroll from "../components/Scroll";

const Register = ({ navigation }) => {
  const [error, setError] = useState(false);
  const { setUserData } = useContext(Context);
  const [modal, setModal] = useState(false);
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

  const validateData = () => {
    setError(false);
    if (inputs.name.length < 3)
      return "El nombre debe tener almenos 3 caracteres";
    if (!regex_email.test(inputs.email)) return "Ingrese un correo válido";
    if (inputs.card_id.length < 9) return "Ingrese una cédula válida";
    let noDots = inputs.card_id.replaceAll(".", "");
    if (!regex_num.test(noDots)) return "La cedula solo debe contener numeros";
    if (inputs.password.length < 6)
      return "La contraseña debe tener almenos 6 caracteres";
    if (inputs.password !== inputs.confirmPass)
      return "Las contraseñas no coinciden";

    return false;
  };

  const confirm = async () => {
    let validation = validateData();
    if (validation) return setError(validation);
    const {confirmPass,...allData} = inputs
    const { status, data } = await register(allData);
    if (status === 200) {
      storeLocalData("@userToken", data.token);
      setUserData(data);
      setModal(true);
    } else {
      // console.log(data.msg);
      setError(data.msg);
    }
  };

  const goBack = () => {
    navigation.goBack();
    // setModal(true);
  };
  const goToProfile = () => {
    navigation.navigate("Profile");
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

  useEffect(() => {
    return () => {
      setModal(false);
    };
  }, []);

  return (
    <>
      {modal && <SuccessModal {...{ goToProfile }} />}
      <Scroll>
        <HeaderBtn text="Registro" onPress={goBack} />
        <Input name="name" placeholder="Nombre" set={setInputs} regex={regex_textnum} />
        <Input name="email" placeholder="Correo" set={setInputs} />
        <InputCardId
          name="card_id"
          placeholder="Cédula de Identidad"
          set={setInputs}
        />
        <Input
          secure={true}
          name="password"
          placeholder="Contraseña"
          set={setInputs}
        />
        <Input
          secure={true}
          name="confirmPass"
          placeholder="Confirmar Contraseña"
          set={setInputs}
        />
        <Text style={st.subtitle}>Selecciona un avatar?</Text>
        <Avatars set={updtAvatar} />
        <View style={{ marginTop: "auto" }} />
        {/* {!keyboardStatus && <PrimaryBtn text="Confirmar" action={confirm} />} */}
        {error && <ErrorText text={error} />}
        <PrimaryBtn text="Confirmar" action={confirm} />
      </Scroll>
    </>
  );
};

export default Register;

const SuccessModal = ({ goToProfile }) => {
  return (
    <Animated.View style={st.scc_modal} entering={FadeIn}>
      <View style={st.sub_ctn}>
        <Text ff="Bold" fs={32} style={st.tc}>
          Cuenta registrada!
        </Text>
        <Text style={st.tc} fs={16}>
          Ahora podrás contactar, comentar y guardar en favoritos los articulos
          o comercios de tu gusto
        </Text>
        <Pressable style={st.btn_ctn} onPress={goToProfile}>
          <Text style={{ fontSize: 20, color: v.prime }} ff="Medium">
            Ver perfil
          </Text>
          <View style={st.btn_login}>
            <IconArrowRight />
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const st = StyleSheet.create({
  ctn: {
    paddingTop: 20,
    paddingBottom: 24,
    display: "flex",
    gap: 14,
    paddingHorizontal: 20,
    minHeight: wh,
  },
  subtitle: {
    fontFamily: "Medium",
    fontSize: 16,
    marginVertical: 12,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scc_modal: {
    width: ww,
    height: wh,
    backgroundColor: v.four,
    position: "absolute",
    display: "flex",
    padding: 20,
    paddingTop: 200,
    alignItems: "center",
    zIndex: 200,
    // justifyContent: "center",
  },
  sub_ctn: {
    displa: "flex",
    gap: 14,
  },
  btn_ctn: ({ pressed }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    opacity: pressed ? 0.5 : 1,
  }),
  btn_login: {
    borderRadius: 100,
    height: 50,
    width: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: v.prime,
  },
  tc: { color: v.prime },
});

const ErrorText = ({ text }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        // height: 18,
      }}
    >
      <IconCross color="#F20000" size={16} />
      <Text style={{ color: "#F20000" }}>{text}</Text>
    </View>
  );
};
