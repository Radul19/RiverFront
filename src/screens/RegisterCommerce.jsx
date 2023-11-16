import { View, ScrollView, Pressable, StyleSheet, Image } from "react-native";
import Text from "../components/Text";
import React, { useContext, useEffect, useState } from "react";
import t from "../components/stylesVar";
import {
  IconArrowRight,
  IconCross,
  IconInstagram,
  IconLoad,
  IconMessenger,
  IconPlusBox,
  IconTelegram,
  IconWhatsapp,
} from "../components/Icons";
import { wh, ww } from "../components/DisplayItems";
import { PrimaryBtn } from "../components/Btns";
import { CodeInput, Input } from "../components/Inputs";
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutRight,
  Layout,
} from "react-native-reanimated";
import NavBar from "../components/NavBar";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment/moment";
import Context from "../components/Context";
import { codeExist, registerCommerce } from "../api/general";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";

let commerceInfo = {
  name: "",
  phone: "",
  description: "",
  email: "",
  rif: "",
  address: "",
  logo: false,
  schedules: [
    {
      since: new Date(1699524011003),
      until: new Date(1699560011003),
      day: 1,
      _id: +moment(),
    },
  ],
};

const RegisterCommerce = ({ navigation, route }) => {
  const { userData } = useContext(Context);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!userData._id) {
      navigation.navigate("Profile");
    }
  }, [route]);

  const [page, setPage] = useState(3);
  const goToInv = () => {
    // console.log("yay");
    navigation.navigate("Commerce");
  };
  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      {page === 3 && <CodePage {...{ setPage, code, setCode }} />}
      {page === 2 && <InfoCommerce {...{ setPage }} />}
      {/* {page === 1 && <SuccessPage {...{ page,setPage, goToInv }} />} */}
      {page === 3 && <NavBar active={2} />}
    </View>
  );
};

const CodePage = ({ setPage, code, setCode }) => {
  const [load, setLoad] = useState(false);
  const confirm = async () => {
    setLoad(true);
    const { status, data } = await codeExist(code);
    setLoad(false);
    console.log(status);
    console.log(data);
    if (status === 200 && data) setPage(2);
  };
  return (
    <ScrollView contentContainerStyle={st.ctn}>
      <Text ff="Bold" fs={32} style={st.tc}>
        Get ready in this adventure!
      </Text>
      <Text style={st.tc} fs={16}>
        Antes de continuar, necesitamos verificar que eres uno de los comercios
        seleccionados para la fase de prueba
      </Text>

      <CodeInput set={setCode} />
      {/* {code.length === 6 && ( */}
      {true && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Pressable style={st.btn_ctn} onPress={confirm}>
            <Text style={{ fontSize: 20, color: t.four }} ff="Medium">
              Continuar
            </Text>
            <View style={st.btn_login}>
              {load ? (
                <IconLoad color={t.prime} />
              ) : (
                <IconArrowRight color={t.prime} />
              )}
            </View>
          </Pressable>
        </Animated.View>
      )}
      <Pressable style={st.not_code}>
        <Text style>No tengo ningun codigo</Text>
      </Pressable>
    </ScrollView>
  );
};

export const InfoCommerce = ({
  page = false,
  setPage,
  info = commerceInfo,
  edit = false
}) => {
  const { setUserData } = useContext(Context);
  const { schedules: sch, ...allInfo } = info;
  // const [shape, setShape] = useState(1);
  const [inputs, setInputs] = useState(allInfo);
  const [schedules, setSchedules] = useState(sch);
  const [idk, setIdk] = useState(false);
  const [modal, setModal] = useState(false)

  const goBack = () => {
    if(edit) return setPage(1)
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

  const confirm = async () => {
    if(!edit){
      const marketInfo = {
        ...inputs,
        schedules,
      };
      const { status, data } = await registerCommerce(marketInfo);
      if (status === 200) {
        setIdk(data);
        setModal(true);
      }
    }else{
      
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setInputs({ ...inputs, logo: result.assets[0].uri });
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
        <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
          <ScrollView contentContainerStyle={[st.ctn, { paddingTop: 20 }]}>
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
                Info. Comercial
              </Text>
            </View>
            <Text {...subtitle}>Datos de identidad</Text>
            <Input
              set={setInputs}
              name="name"
              placeholder="Nombre de empresa"
            />
            <Input
              set={setInputs}
              name="phone"
              placeholder="Numero de telefono"
            />
            <Input
              set={setInputs}
              name="description"
              placeholder="Description"
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
              <Text style={{ fontSize: 12, color: t.third }}>
                {"(Opcional)"}
              </Text>
            </View>
            <Input set={setInputs} name="email" placeholder="Correo" />
            <Input set={setInputs} name="address" placeholder="Direccion" />
            <Input set={setInputs} name="rif" placeholder="Rif" />
            <View style={st.subtitle_ctn}>
              <Text {...subtitle}>Horarios</Text>
              <Text style={{ fontSize: 12, color: t.third }}>
                {"(Opcional)"}
              </Text>
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
            <View style={st.subtitle_ctn}>
              <Text {...subtitle}>Redes</Text>
              <Text style={{ fontSize: 12, color: t.third }}>
                {"(Opcional)"}
              </Text>
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
            <View style={{ marginTop: 42 }} />
            <PrimaryBtn text="Confirmar" action={confirm} />
          </ScrollView>
        </Animated.View>
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
const ScheduleItem = ({ setSchedules, item }) => {
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
      layout={Layout}
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
          backgroundColor: t.prime,
          padding: 8,
          opacity: pressed ? 0.5 : 1,
          backgroundColor: t.four,
        })}
      >
        <Text style={{ color: t.prime }}>{traslateDay(item.day)}</Text>
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
            style={[st.btn_portrait, shape === 1 && { borderColor: t.prime }]}
          />
        </Pressable>
        <Pressable
          style={shape === 2 ? st.logo_btn_a : st.logo_btn}
          onPress={() => {
            setShape(2);
          }}
        >
          <View
            style={[st.btn_landscape, shape === 2 && { borderColor: t.prime }]}
          />
        </Pressable>
        <Pressable
          style={shape === 3 ? st.logo_btn_a : st.logo_btn}
          onPress={() => {
            setShape(3);
          }}
        >
          <View
            style={[st.btn_square, shape === 3 && { borderColor: t.prime }]}
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
          <Text style={{ fontSize: 20, color: t.prime }} ff="Medium">
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
    backgroundColor: t.four,
  },
  tc: {
    color: t.four,
  },
  not_code: {
    marginTop: "auto",
    borderBottomWidth: 1,
    borderColor: t.four,
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
    // backgroundColor: t.third,
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
    borderColor: t.four,
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
    borderColor: t.four,
    backgroundColor: t.four,
    width: 36,
    height: 36,
    borderRadius: 6,
  }),
  btn_landscape: {
    height: 15,
    width: 20,
    borderWidth: 2,
    borderColor: t.four,
  },
  btn_portrait: {
    height: 20,
    width: 15,
    borderWidth: 2,
    borderColor: t.four,
  },
  btn_square: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: t.four,
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
    backgroundColor: t.four,
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
    backgroundColor: t.prime,
  },
  tc2: {
    color: t.prime,
  },
});
