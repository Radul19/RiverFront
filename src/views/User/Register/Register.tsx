import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { v } from "../../../components/stylesVar";
import Text from "../../../components/Text";
import { Avatars, Input, InputCardId, regex_email, regex_num, regex_textnum } from "../../../components/Inputs";
import { PrimaryBtn } from "../../../components/Btns";
import { IconArrowRight, IconCross } from "../../../components/Icons";
import { HeaderBtn } from "../../../components/DisplayItems";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { register } from "../../../api/general";
import Context from "../../../components/Context";
import { storeLocalData } from "../../../helpers/localStorage";
import Scroll from "../../../components/Scroll";
import { ScreensType } from "../../../types/screens";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { st } from './style'

type Props = NativeStackScreenProps<ScreensType, 'Register'>
const Register = ({ navigation }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);
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

  const updtAvatar = (num: number) => {
    setInputs({ ...inputs, avatar: num });
  };

  const validateData = () => {
    setError(undefined);
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

    return undefined;
  };

  const confirm = async () => {
    let validation = validateData();
    if (validation) return setError(validation);
    const { confirmPass, ...allData } = inputs
    const { status, data } = await register(allData);
    if (status === 200) {
      storeLocalData("@userToken", data.token);
      setUserData(data);
      setModal(true);
    } else {
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
        <Text style={st.subtitle} >Selecciona un avatar?</Text>
        <Avatars set={updtAvatar} />
        <View style={{ marginTop: "auto" }} />
        {error ? <ErrorText text={error} /> : null}
        {/* {!keyboardStatus && <PrimaryBtn text="Confirmar" action={confirm} />} */}
        <PrimaryBtn text="Confirmar" action={confirm} />
      </Scroll>
    </>
  );
};

export default Register;

const SuccessModal = ({ goToProfile }: { goToProfile: () => void }) => {
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

// const st = (prop:any) => StyleSheet.create({
//   // hey do something using => st.(propHere).name
// })

const ErrorText = ({ text }: { text: string }) => {
  return (
    <View style={{ flexDirection: "row", gap: 6, alignItems: "center", }}>
      <IconCross color="#F20000" size={16} />
      <Text style={{ color: "#F20000" }}>{text}</Text>
    </View>
  );
};
