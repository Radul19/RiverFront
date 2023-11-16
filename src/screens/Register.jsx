import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import t from "../components/stylesVar";
import Text from "../components/Text";
import { Avatars, Input } from "../components/Inputs";
import { PrimaryBtn } from "../components/Btns";
import { IconArrowRight } from "../components/Icons";
import { wh, ww } from "../components/DisplayItems";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { register } from "../api/general";
import Context from '../components/Context'
import { storeLocalData } from "../helpers/localStorage";

const Register = ({ navigation }) => {
  const {setUserData} = useContext(Context)
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

  const confirm = async () => {
    if (inputs.password === inputs.confirmPass) {
      console.log(inputs);
      const info = {
        name: inputs.name,
        email: inputs.name,
        card_id: inputs.card_id,
        password: inputs.password,
        avatar: inputs.avatar,
      };
      const {status,data} = await register(info)
      if(status===200){
        storeLocalData('@userToken',data.token)
        setUserData(data)
        setModal(true);
      }
    }

    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     setModal(true);
    //     resolve("yay");
    //   }, 2000);
    // });
  };

  const goBack = () => {
    navigation.goBack();
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
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      {modal && <SuccessModal {...{ goToProfile }} />}
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
            Registro
          </Text>
        </View>
        <Input name="name" placeholder="Nombre" set={setInputs} />
        <Input name="email" placeholder="Correo" set={setInputs} />
        <Input
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
        <Text style={st.subtitle}>Selecciona un avatar</Text>
        <Avatars set={updtAvatar} />
        <View style={{ marginTop: "auto" }} />
        {/* {!keyboardStatus && <PrimaryBtn text="Confirmar" action={confirm} />} */}
        <PrimaryBtn text="Confirmar" action={confirm} />
      </ScrollView>
    </View>
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
          <Text style={{ fontSize: 20, color: t.prime }} ff="Medium">
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
    backgroundColor: t.four,
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
    backgroundColor: t.prime,
  },
  tc: { color: t.prime },
});
