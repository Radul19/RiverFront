import { View, ScrollView, Pressable, StyleSheet, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutRight,
  // Layout,
  LinearTransition,
} from "react-native-reanimated";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Text from "../../components/Text";
import { v } from "../../components/stylesVar";
import {
  IconArrowRight,
  IconCross,
  IconInstagram,
  IconLoad,
  IconMessenger,
  IconPlusBox,
  IconTelegram,
  IconWhatsapp,
} from "../../components/Icons";
import { HeaderBtn, wh, ww } from "../../components/DisplayItems";
import { PrimaryBtn } from "../../components/Btns";
import {
  CodeInput,
  Input,
  regex_email,
  regex_phone,
  regex_textnum,
} from "../../components/Inputs";
import moment from "moment";
import Context from "../../components/Context";
import { codeExist, registerCommerce } from "../../api/general";
import Scroll from "../../components/Scroll";

let commerceInfo = {
  name: "",
  phone: "",
  description: "",
  email: "",
  rif: "",
  address: "",
  logo: false,
  schedules: [
    // {
    //   since: new Date(1699524011003),
    //   until: new Date(1699560011003),
    //   day: 1,
    //   _id: +moment(),
    // },
  ],
};

const RegisterCommerce = ({ navigation, route }) => {
  // Logic
  const { userData, setUserData } = useContext(Context);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!userData._id) {
      navigation.navigate("Profile");
    }
  }, [route]);

  const [page, setPage] = useState(3);
  const codeVars = {
    setPage,
    code,
    setCode,
  };
  const infoVars = {
    setPage,
    code,
    userData,
    setUserData,
  };
  //

  return (
    <View style={{ flex: 1, backgroundColor: v.prime }}>
      {page === 3 && <CodePage {...codeVars} />}
      {page === 2 && <InfoCommerce {...infoVars} />}
    </View>
  );
};

const CodePage = ({ setPage, code, setCode }) => {
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);
  const confirm = async () => {
    setLoad(true);
    setError(false);
    const { status, data } = await codeExist(code);
    setLoad(false);
    if (status === 200 && data) setPage(2);
    else setError(data.msg);
  };
  return (
    <Scroll nav={3}>
      <View style={{ height: wh - 100, paddingTop: wh * 0.15, gap: 14 }}>
        <Text ff="Bold" fs={32} style={st.tc}>
          Get ready in this adventure!
        </Text>
        <Text style={{ ...st.tc, paddingBottom: 6 }} fs={16}>
          Antes de continuar, necesitamos verificar que eres uno de los
          comercios seleccionados para la fase de prueba
        </Text>

        <CodeInput set={setCode} />
        <View style={{ height: 42 }}>
          {error && <ErrorText text={error} />}
        </View>
        {/* {true && ( */}
        {code.length === 6 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Pressable style={st.btn_ctn} onPress={confirm}>
              <Text style={{ fontSize: 20, color: v.four }} ff="Medium">
                Continuar
              </Text>
              <View style={st.btn_login}>
                {load ? (
                  <IconLoad color={v.prime} />
                ) : (
                  <IconArrowRight color={v.prime} />
                )}
              </View>
            </Pressable>
          </Animated.View>
        )}
        <Pressable style={st.not_code}>
          <Text style>No tengo ningun codigo</Text>
        </Pressable>
      </View>
    </Scroll>
  );
};

const IMG_ERROR_MSG =
  "Ha ocurrido un error al intentar seleccionar la imagen, intente nuevamente";

export const InfoCommerce = ({
  page = false,
  setPage,
  info = commerceInfo,
  edit = false,
  code,
  userData,
  setUserData,
}) => {
  const [error, setError] = useState(false);
  const { schedules: sch, ...allInfo } = info;
  // const [shape, setShape] = useState(1);
  const [inputs, setInputs] = useState(allInfo);
  const [schedules, setSchedules] = useState(sch);
  const [idk, setIdk] = useState(false);
  const [modal, setModal] = useState(false);

  const goBack = () => {
    if (edit) return setPage(1);
    setPage(3);
  };
  const addSchedule = () => {
    let aux = [...schedules];
    aux.push({
      since: new Date(1699524011003),
      until: new Date(1699560011003),
      day: 1,
      _id: +moment(),
    });
    setSchedules(aux);
  };

  const validateData = () => {
    setError(false);
    if (inputs.name.length < 3)
      return "El nombre debe tener almenos 3 caracteres";
    if (inputs.phone.length < 1)
      return "El número telefónico no puede estar vacío";
    if (inputs.description.length < 20)
      return "La descripcion debe tener almenos 20 caracteres";
    if (!inputs.logo) return "Debe seleccionar una imagen como logo";
    if (inputs.email.length > 0 && !regex_email.test(inputs.email))
      return "Ingrese un correo válido";

    return false;
  };

  const confirm = async () => {
    let validation = validateData();
    if (validation) return setError(validation);
    if (!edit) {
      const marketInfo = {
        ...inputs,
        schedules,
        owner_id: userData._id,
        code,
      };
      const { status, data } = await registerCommerce(marketInfo);
      if (status === 200) {
        setIdk(data);
        setModal(true);
      }
    } else {
      setError(data.msg);
    }
  };

  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
      let result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        setInputs({
          ...inputs,
          logo: "data:image/png;base64," + result.assets[0].base64,
        });
      }
      if (error === IMG_ERROR_MSG) setError(false);
    } catch (error) {
      console.log(error);
      setError(IMG_ERROR_MSG);
    }
  };

  const goToInv = () => {
    setUserData((prev) => ({ ...prev, commerce: idk }));
  };

  return (
    <>
      {modal ? (
        <SuccessPage {...{ setPage, goToInv }} />
      ) : (
        <Scroll>
          <HeaderBtn text="Info Comercial" onPress={goBack} />
          <Text {...subtitle}>Datos de identidad</Text>
          <Input
            set={setInputs}
            name="name"
            placeholder="Nombre de empresa"
            regex={regex_textnum}
          />
          <Input
            set={setInputs}
            name="phone"
            placeholder="Numero de telefono"
            regex={regex_phone}
            maxLength={11}
          />
          <Input
            set={setInputs}
            name="description"
            placeholder="Description"
            multiline={true}
          />
          <Text {...subtitle}>Logo</Text>
          <Pressable style={st.logo_ctn} onPress={pickImage}>
            {inputs.logo ? (
              <Image source={{ uri: inputs.logo }} style={st.logo} />
            ) : (
              <Text {...{ ff: "Medium", fs: 32 }}>+</Text>
            )}
          </Pressable>
          <View style={st.subtitle_ctn}>
            <Text {...subtitle}>Informacion Adicional</Text>
            <Text style={{ fontSize: 12, color: v.third }}>{"(Opcional)"}</Text>
          </View>
          <Input set={setInputs} name="email" placeholder="Correo Comercial" />
          <Input set={setInputs} name="address" placeholder="Direccion" />
          <Input set={setInputs} name="rif" placeholder="Rif" />

          <View style={st.subtitle_ctn}>
            <Text {...subtitle}>Redes</Text>
            <Text style={{ fontSize: 12, color: v.third }}>{"(Opcional)"}</Text>
          </View>
          <Input
            set={setInputs}
            name="telegram"
            placeholder="+584126452311"
            Icon={IconTelegram}
          />
          <Input
            set={setInputs}
            name="whatsapp"
            placeholder="+584126452311"
            Icon={IconWhatsapp}
          />
          <Input
            set={setInputs}
            name="messenger"
            placeholder="+584126452311"
            Icon={IconMessenger}
          />
          <Input
            set={setInputs}
            name="instagram"
            placeholder="@instagram"
            Icon={IconInstagram}
          />

          <View style={st.subtitle_ctn}>
            <Text {...subtitle}>Horarios</Text>
            <Text style={{ fontSize: 12, color: v.third }}>{"(Opcional)"}</Text>
            <Pressable
              style={({ pressed }) => ({
                marginLeft: "auto",
                opacity: pressed ? 0.5 : 1,
              })}
              onPress={addSchedule}
            >
              <IconPlusBox />
            </Pressable>
          </View>
          {schedules.map((item, index) => (
            <ScheduleItem key={item._id} {...{ item, setSchedules }} />
          ))}
          <View style={{ height: 42 }}>
            {error && <ErrorText text={error} />}
          </View>
          <PrimaryBtn text="Confirmar" action={confirm} />
        </Scroll>
      )}
    </>
  );
};
const traslateDay = (num) => {
  switch (num) {
    case 1:
      return "Lun";
    case 2:
      return "Mar";
    case 3:
      return "Mie";
    case 4:
      return "Jue";
    case 5:
      return "Vie";
    case 6:
      return "Sab";
    case 7:
      return "Dom";

    default:
      break;
  }
};
export const ScheduleItem = ({ setSchedules, item }) => {
  const openTimer = (name) => {
    DateTimePickerAndroid.open({
      value: item[name],
      onChange: (event, selectedDate) => {
        setSchedules((prev) => {
          let aux = [...prev];
          let index = aux.findIndex((a) => a._id === item._id);
          aux[index] = { ...aux[index], [name]: selectedDate };
          return aux;
        });
      },
      mode: "time",
      display: "spinner",
      is24Hour: false,
    });
  };

  const plusDay = () => {
    setSchedules((prev) => {
      let aux = [...prev];
      let index = aux.findIndex((a) => a._id === item._id);
      if (aux[index].day >= 7) {
        aux[index].day = 1;
      } else aux[index].day += 1;
      return aux;
    });
  };

  const deleteSelf = () => {
    setSchedules((prev) => {
      let aux = prev.filter((a) => a._id !== item._id);
      return aux;
    });
  };
  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutRight}
      layout={LinearTransition}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={plusDay}
        style={({ pressed }) => ({
          borderRadius: 6,
          backgroundColor: v.prime,
          padding: 8,
          opacity: pressed ? 0.5 : 1,
          backgroundColor: v.four,
        })}
      >
        <Text style={{ color: v.prime }}>{traslateDay(item.day)}</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          openTimer("since");
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Text>{moment(item.since).format("hh:mma")}</Text>
      </Pressable>
      <Text ff="Bold">Hasta</Text>
      <Pressable
        onPress={() => {
          openTimer("until");
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Text>{moment(item.until).format("hh:mma")}</Text>
      </Pressable>
      <Pressable
        onPress={deleteSelf}
        style={({ pressed }) => ({
          marginLeft: "auto",
          padding: 6,
          opacity: pressed ? 0.5 : 1,
          // backgroundColor:'#123123'
        })}
      >
        <IconCross size={20} />
      </Pressable>
    </Animated.View>
  );
};

const LogoSelectExperimental = ({ shape, setShape }) => {
  return (
    <View style={st.header}>
      <Text fs={16} ff="Bold">
        Logo
      </Text>
      <View style={{ display: "flex", flexDirection: "row", gap: 12 }}>
        <Pressable
          style={shape === 1 ? st.logo_btn_a : st.logo_btn}
          onPress={() => {
            setShape(1);
          }}
        >
          <View
            style={[st.btn_portrait, shape === 1 && { borderColor: v.prime }]}
          />
        </Pressable>
        <Pressable
          style={shape === 2 ? st.logo_btn_a : st.logo_btn}
          onPress={() => {
            setShape(2);
          }}
        >
          <View
            style={[st.btn_landscape, shape === 2 && { borderColor: v.prime }]}
          />
        </Pressable>
        <Pressable
          style={shape === 3 ? st.logo_btn_a : st.logo_btn}
          onPress={() => {
            setShape(3);
          }}
        >
          <View
            style={[st.btn_square, shape === 3 && { borderColor: v.prime }]}
          />
        </Pressable>
      </View>
    </View>
  );
};

const SuccessPage = ({ goToInv }) => {
  return (
    <Animated.View style={st.scc_modal2} entering={FadeIn}>
      <View style={st.sub_ctn2}>
        <Text ff="Bold" fs={32} style={st.tc2}>
          Tan fácil como eso!
        </Text>
        <Text style={st.tc2} fs={16}>
          Ya estas listo para disfrutar de la experiencia de river como
          comerciante
        </Text>
        <Pressable style={st.btn_ctn2} onPress={goToInv}>
          <Text style={{ fontSize: 20, color: v.prime }} ff="Medium">
            Ir a inventario
          </Text>
          <View style={st.btn_login2}>
            <IconArrowRight />
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
};
export default RegisterCommerce;

const subtitle = {
  ff: "Bold",
  fs: 16,
  //   style:{marginTop:6}
};

const st = StyleSheet.create({
  ctn: {
    padding: 20,
    display: "flex",
    gap: 14,
    paddingTop: wh * 0.15,
    minHeight: wh,
    // alignItems: "center",
  },
  btn_ctn: ({ pressed }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    opacity: pressed ? 0.5 : 1,
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
  tc: {
    color: v.four,
  },
  not_code: {
    marginTop: "auto",
    borderBottomWidth: 1,
    borderColor: v.four,
    alignSelf: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo_ctn: ({ pressed }) => ({
    height: 200,
    width: 200,
    alignSelf: "center",
    // backgroundColor: v.third,
    borderRadius: 12,
    opacity: pressed ? 0.5 : 1,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }),
  logo: {
    width: "100%",
    height: "100%",
  },
  logo_btn: ({ pressed }) => ({
    opacity: pressed ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: v.four,
    width: 36,
    height: 36,
    borderRadius: 6,
  }),
  logo_btn_a: ({ pressed }) => ({
    opacity: pressed ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: v.four,
    backgroundColor: v.four,
    width: 36,
    height: 36,
    borderRadius: 6,
  }),
  btn_landscape: {
    height: 15,
    width: 20,
    borderWidth: 2,
    borderColor: v.four,
  },
  btn_portrait: {
    height: 20,
    width: 15,
    borderWidth: 2,
    borderColor: v.four,
  },
  btn_square: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: v.four,
  },
  subtitle_ctn: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 12,
  },
  scc_modal2: {
    // justifyContent: "center",
    width: ww,
    height: wh,
    backgroundColor: v.four,
    position: "absolute",
    display: "flex",
    padding: 20,
    paddingTop: 200,
    alignItems: "center",
    zIndex: 200,
  },
  sub_ctn2: {
    displa: "flex",
    gap: 14,
  },
  btn_ctn2: ({ pressed }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    opacity: pressed ? 0.5 : 1,
  }),
  btn_login2: {
    borderRadius: 100,
    height: 50,
    width: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: v.prime,
  },
  tc2: {
    color: v.prime,
  },
});

const ErrorText = ({ text }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        height: 18,
      }}
    >
      <IconCross color="#F20000" size={16} />
      <Text style={{ color: "#F20000" }}>{text}</Text>
    </View>
  );
};
