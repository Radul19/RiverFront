import { View, ScrollView, Pressable, StyleSheet, Image } from "react-native";
import React, { useContext, useEffect, useState, Dispatch } from "react";
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
import Text from "../../../components/Text";
import { v, wh } from "../../../components/stylesVar";
import {
  IconArrowRight,
  IconCross,
  IconInstagram,
  IconLoad,
  IconMessenger,
  IconPlusBox,
  IconTelegram,
  IconWhatsapp,
} from "../../../components/Icons";
import { HeaderBtn } from "../../../components/DisplayItems";
import { PrimaryBtn } from "../../../components/Btns";
import {
  CodeInput,
  Input,
  regex_email,
  regex_phone,
  regex_textnum,
} from "../../../components/Inputs";
import moment from "moment";
import Context from "../../../components/Context";
import { codeExist, registerCommerce } from "../../../api/general";
import Scroll from "../../../components/Scroll";
import { ScreensType } from "../../../types/screens";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import st from './style'
import { CommerceType, ScheduleType, UserType } from "../../../types/user";

let commerceInfo: CommerceType = {
  _id: '',
  name: '',
  phone: '',
  description: '',
  owner_id: '',
  logo: '',
  logo_id: '',
  email: '',
  address: '',
  rif: '',
  reviews: [],
  socials: {},
  schedules: [],
  categories: [],
  favorites: [],
  createdAt: '',
  updatedAt: '',

};

type Props = NativeStackScreenProps<ScreensType, 'RegisterCommerce'>;
const RegisterCommerce = ({ navigation, route }: Props) => {
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

type CodeProps = {
  setPage: Dispatch<number>, code: string, setCode: Dispatch<string>
}
const CodePage = ({ setPage, code, setCode }: CodeProps) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [load, setLoad] = useState(false);
  const confirm = async () => {
    setPage(2)
    // setLoad(true);
    // setError(undefined);
    // const { status, data } = await codeExist(code);
    // setLoad(false);
    // if (status === 200 && data) setPage(2);
    // else setError(data.msg);
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
              <Text style={{ fontSize: 20, color: v.four}} ff="Medium">
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
          <Text >No tengo ningun codigo</Text>
        </Pressable>
      </View>
    </Scroll>
  );
};

const IMG_ERROR_MSG =
  "Ha ocurrido un error al intentar seleccionar la imagen, intente nuevamente";

type InfoCommerceType = {
  setPage: Dispatch<number>,
  info?: CommerceType,
  edit?: boolean,
  code: string,
  userData: UserType,
  setUserData: Dispatch<UserType>,
}
export const InfoCommerce = ({
  setPage,
  info = commerceInfo,
  edit = false,
  code,
  userData,
  setUserData,
}: InfoCommerceType) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const { schedules: sch, ...allInfo } = info;
  // const [shape, setShape] = useState(1);
  const [inputs, setInputs] = useState(allInfo);
  const [schedules, setSchedules] = useState<ScheduleType[]>(sch);
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
    setError(undefined);
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
      } else {
        setError(data.msg);
      }
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
      if (error === IMG_ERROR_MSG) setError(undefined);
    } catch (error) {
      setError(IMG_ERROR_MSG);
    }
  };

  const goToInv = () => {
    setUserData(({ ...userData, commerce: '' }));
  };

  return (
    <>
      {modal ? (
        <SuccessPage {...{ setPage, goToInv }} />
      ) : (
        <Scroll>
          <HeaderBtn text="Info Comercial" onPress={goBack} />
          <Text  {...{ subtitle }}>Datos de identidad</Text>
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
          <Text  {...{ subtitle }}>Logo</Text>
          <Pressable style={st.logo_ctn} onPress={pickImage}>
            {inputs.logo ? (
              <Image source={{ uri: inputs.logo }} style={st.logo} />
            ) : (
              <Text {...{ ff: "Medium", fs: 32 }}>+</Text>
            )}
          </Pressable>
          <View style={st.subtitle_ctn}>
            <Text  {...{ subtitle }}>Informacion Adicional</Text>
            <Text style={{ fontSize: 12, color: v.third }}>{"(Opcional)"}</Text>
          </View>
          <Input set={setInputs} name="email" placeholder="Correo Comercial" />
          <Input set={setInputs} name="address" placeholder="Direccion" />
          <Input set={setInputs} name="rif" placeholder="Rif" />

          <View style={st.subtitle_ctn}>
            <Text  {...{ subtitle }}>Redes</Text>
            <Text style={{ fontSize: 12, color: v.third }}>{"(Opcional)"}</Text>
          </View>
          <Input
            set={setInputs}
            name="telegram"
            placeholder="username"
            Icon={IconTelegram}
          />
          <Input
            set={setInputs}
            name="whatsapp"
            placeholder="4126452311"
            Icon={IconWhatsapp}
          />
          <Input
            set={setInputs}
            name="messenger"
            placeholder="username"
            Icon={IconMessenger}
          />
          <Input
            set={setInputs}
            name="instagram"
            placeholder="username"
            Icon={IconInstagram}
          />

          <View style={st.subtitle_ctn}>
            <Text  {...{ subtitle }}>Horarios</Text>
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
          {schedules.map((item: ScheduleType, index: number) => (
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
const traslateDay = (num: number) => {
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
type PrevType = (value: ScheduleType[]) => ScheduleType[]
type ScheduleItemProps = {
  setSchedules: Dispatch<ScheduleType[] | PrevType>,
  item: ScheduleType
}
export const ScheduleItem = ({ setSchedules, item }: ScheduleItemProps) => {
  const openTimer = (bool: boolean) => {
    DateTimePickerAndroid.open({
      value: bool ? item.since : item.until,
      onChange: (event, selectedDate) => {
        setSchedules((prev: ScheduleType[]) => {
          let aux: ScheduleType[] = [...prev];
          let nameAux = bool ? "since" : 'until'
          let index = aux.findIndex((a) => a._id === item._id);
          aux[index] = { ...aux[index], [nameAux]: selectedDate };
          return aux;
        });
      },
      mode: "time",
      display: "spinner",
      is24Hour: false,
    });
  };

  const plusDay = () => {
    setSchedules((prev: ScheduleType[]) => {
      let aux = [...prev];
      let index = aux.findIndex((a) => a._id === item._id);
      if (aux[index].day >= 7) {
        aux[index].day = 1;
      } else aux[index].day += 1;
      return aux;
    });
  };

  const deleteSelf = () => {
    setSchedules((prev: ScheduleType[]) => {
      let aux = prev.filter((a: ScheduleType) => a._id !== item._id);
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
          padding: 8,
          opacity: pressed ? 0.5 : 1,
          backgroundColor: v.four,
        })}
      >
        <Text style={{ color: v.prime }}>{traslateDay(item.day)}</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          openTimer(true);
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Text>{moment(item.since).format("hh:mma")}</Text>
      </Pressable>
      <Text ff="Bold">Hasta</Text>
      <Pressable
        onPress={() => {
          openTimer(false);
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

const SuccessPage = ({ goToInv }: { goToInv: () => void }) => {
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

const ErrorText = ({ text }: { text: string }) => {
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



// const LogoSelectExperimental = ({ shape, setShape }) => {
//   return (
//     <View style={st.header}>
//       <Text fs={16} ff="Bold">
//         Logo
//       </Text>
//       <View style={{ display: "flex", flexDirection: "row", gap: 12 }}>
//         <Pressable
//           style={shape === 1 ? st.logo_btn_a : st.logo_btn}
//           onPress={() => {
//             setShape(1);
//           }}
//         >
//           <View
//             style={[st.btn_portrait, shape === 1 && { borderColor: v.prime }]}
//           />
//         </Pressable>
//         <Pressable
//           style={shape === 2 ? st.logo_btn_a : st.logo_btn}
//           onPress={() => {
//             setShape(2);
//           }}
//         >
//           <View
//             style={[st.btn_landscape, shape === 2 && { borderColor: v.prime }]}
//           />
//         </Pressable>
//         <Pressable
//           style={shape === 3 ? st.logo_btn_a : st.logo_btn}
//           onPress={() => {
//             setShape(3);
//           }}
//         >
//           <View
//             style={[st.btn_square, shape === 3 && { borderColor: v.prime }]}
//           />
//         </Pressable>
//       </View>
//     </View>
//   );
// };