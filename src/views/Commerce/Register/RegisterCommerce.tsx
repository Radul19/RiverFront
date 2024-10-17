import { View, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState, Dispatch } from "react";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Text from "../../../components/Text";
import { v } from "../../../components/stylesVar";
import {
  IconArrowRight,
  IconCross,
  IconDelivery,
  IconInstagram,
  IconMessenger,
  IconPlusBox,
  IconSwitchOff,
  IconSwitchOn,
  IconTelegram,
  IconWhatsapp,
} from "../../../components/Icons";
import { Categories, HeaderBtn } from "../../../components/DisplayItems";
import { PrimaryBtn } from "../../../components/Btns";
import {
  Input,
  regex_email,
  regex_phone,
  regex_textnum,
} from "../../../components/Inputs";
import moment from "moment";
import Context from "../../../components/Context";
import { editMarketData, registerCommerce } from "../../../api/general";
import Scroll from "../../../components/Scroll";
import { ScreensType } from "../../../types/screens";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import st from "./style";
import { CommerceType, ScheduleType, UserType } from "../../../types/user";
import CodePage from "./CodePage";
import SuccessPage from "./SuccessPage";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

let commerceInfo: CommerceType = {
  _id: "",
  name: "",
  phone: "",
  description: "",
  owner_id: "",
  logo: "",
  logo_id: "",
  email: "",
  address: "",
  rif: "",
  delivery: false,
  reviews: [],
  socials: {
    telegram: undefined,
    whatsapp: undefined,
    messenger: undefined,
    instagram: undefined,
  },
  schedules: [],
  categories: [],
  favorites: [],
  createdAt: "",
  updatedAt: "",
};

type Props = NativeStackScreenProps<ScreensType, "RegisterCommerce">;
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
    <Scroll nav={page === 3 ? 3 : undefined}>
      {page === 3 && <CodePage {...codeVars} />}
      {page === 2 && <InfoCommerce {...infoVars} />}
    </Scroll>
  );
};
export default RegisterCommerce;

export const InfoCommerce = ({
  setPage,
  code,
  userData,
  setUserData,
}: {
  setPage: Dispatch<number>;
  code: string;
  userData: UserType;
  setUserData: Dispatch<UserType | ((value: UserType) => UserType)>;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [inputs, setInputs] = useState(userData.commerce ?? commerceInfo);
  const [holder, setHolder] = useState<CommerceType | undefined>(undefined);
  const [modal, setModal] = useState(false);

  const goBack = () => {
    if (userData.commerce) return setPage(1);
    setPage(3);
  };
  const addSchedule = () => {
    let aux = [...inputs.schedules];
    aux.push({
      since: new Date(1699524011003),
      until: new Date(1699560011003),
      day: 1,
      _id: +moment(),
    });
    // setSchedules(aux);
    setInputs({ ...inputs, schedules: aux });
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
    if (!userData.commerce) {
      const marketInfo = {
        ...inputs,
        owner_id: userData._id,
        code,
      };
      const { status, data } = await registerCommerce(marketInfo);
      if (status === 200) {
        setHolder(data);
        setModal(true);
      } else {
        setError(data.msg);
      }
    } else {
      const marketInfo = {
        ...inputs,
        owner_id: userData._id,
        market_id: userData.commerce._id,
      };
      const { status, data } = await editMarketData(marketInfo);
      if (status === 200) {
        setUserData((prev) => ({ ...prev, commerce: data }));
        goBack();
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
    setUserData({ ...userData, commerce: holder });
  };

  const handleCateg = (name: string) => {
    let indexOf = inputs.categories.indexOf(name);
    let aux = [...inputs.categories];
    if (indexOf === -1) {
      aux.push(name);
    } else {
      aux.splice(indexOf, 1);
    }
    setInputs((prev) => ({ ...prev, categories: aux }));
  };

  return (
    <>
      {modal ? (
        <SuccessPage {...{ setPage, goToInv }} />
      ) : (
        <>
          <HeaderBtn text="Info Comercial" onPress={goBack} />
          <Subtitle text="Datos de Identidad" />
          <Input
            set={setInputs}
            name="name"
            placeholder="Nombre de empresa"
            regex={regex_textnum}
            initialValue={inputs.name}
          />
          <Input
            set={setInputs}
            name="phone"
            placeholder="Numero de telefono"
            regex={regex_phone}
            maxLength={11}
            initialValue={inputs.phone}
          />
          <Input
            set={setInputs}
            name="description"
            placeholder="Description"
            multiline={true}
            initialValue={inputs.description}
          />
          <Text ff="Bold">Logo</Text>
          <Pressable style={st.logo_ctn} onPress={pickImage}>
            {inputs.logo ? (
              <Image source={{ uri: inputs.logo }} style={st.logo} />
            ) : (
              <Text {...{ ff: "Medium", fs: 32 }}>+</Text>
            )}
          </Pressable>
          <Subtitle text="Información adicional" optional />
          <Input
            set={setInputs}
            name="email"
            placeholder="Correo Comercial"
            initialValue={inputs.email}
          />
          <Input
            set={setInputs}
            name="address"
            placeholder="Direccion"
            initialValue={inputs.address}
          />
          <Input
            set={setInputs}
            name="rif"
            placeholder="Rif"
            initialValue={inputs.rif}
          />

          <Subtitle text="Redes" optional />
          <Input
            set={setInputs}
            name="socials.telegram"
            placeholder="username"
            Icon={IconTelegram}
            initialValue={inputs.socials.telegram}
          />
          <Input
            set={setInputs}
            name="socials.whatsapp"
            placeholder="4126452311"
            Icon={IconWhatsapp}
            initialValue={inputs.socials.whatsapp}
          />
          <Input
            set={setInputs}
            name="socials.messenger"
            placeholder="username"
            Icon={IconMessenger}
            initialValue={inputs.socials.messenger}
          />
          <Input
            set={setInputs}
            name="socials.instagram"
            placeholder="username"
            Icon={IconInstagram}
            initialValue={inputs.socials.instagram}
          />

          <Subtitle text="Categorias" />
          <Categories {...{ handleCateg, categ: inputs.categories }} />
          <View style={{ marginTop: -24 }} />
          <View style={st.subtitle_ctn}>
            <Text ff="Bold">Horarios</Text>
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
          {inputs.schedules.map((item: ScheduleType, index: number) => (
            <ScheduleItem key={item._id} {...{ item, setInputs }} />
          ))}
          <Subtitle text="Extras" optional />
          <SwitchBtn
            Icon={IconDelivery}
            text="Delivery"
            name="delivery"
            set={setInputs}
            value={inputs.delivery}
          />
          <View style={{ height: 42 }}>
            {error && <ErrorText text={error} />}
          </View>
          <PrimaryBtn text="Confirmar" action={confirm} />
        </>
      )}
    </>
  );
};

export const ScheduleItem = ({
  setInputs,
  item,
}: {
  setInputs: Dispatch<CommerceType | ((value: CommerceType) => CommerceType)>;
  item: ScheduleType;
}) => {
  const openTimer = (bool: boolean) => {
    DateTimePickerAndroid.open({
      value: bool ? new Date(item.since) : new Date(item.until),
      onChange: (event, selectedDate) => {
        setInputs((prev) => {
          let aux = [...prev.schedules];
          let nameAux = bool ? "since" : "until";
          let index = aux.findIndex((a) => a._id === item._id);
          aux[index] = { ...aux[index], [nameAux]: selectedDate };
          return { ...prev, schedules: aux };
        });
      },
      mode: "time",
      display: "spinner",
      is24Hour: false,
    });
  };

  const plusDay = () => {
    setInputs((prev) => {
      let aux = [...prev.schedules];
      let index = aux.findIndex((a) => a._id === item._id);
      if (aux[index].day >= 7) {
        aux[index].day = 1;
      } else aux[index].day += 1;
      return { ...prev, schedules: aux };
    });
  };

  const deleteSelf = () => {
    setInputs((prev) => {
      let aux = prev.schedules;
      aux = aux.filter((a: ScheduleType) => a._id !== item._id);
      return { ...prev, schedules: aux };
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
          // width:48,
          // alignItems:'center',
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
        <Text>{timeFormat(item.since)}</Text>
      </Pressable>
      <Text ff="Bold">Hasta</Text>
      <Pressable
        onPress={() => {
          openTimer(false);
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <Text>{timeFormat(item.until)}</Text>
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
const timeFormat = (hour:Date)=> moment(hour).format("hh:mma")

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
const IMG_ERROR_MSG =
  "Ha ocurrido un error al intentar seleccionar la imagen, intente nuevamente";

const Subtitle = ({
  optional = false,
  text,
}: {
  optional?: boolean;
  text: string;
}) => {
  return (
    <View style={st.subtitle_ctn}>
      <Text ff="Bold">{text}</Text>
      {optional ? (
        <Text style={{ fontSize: 12, color: v.third }}>(Opcional)</Text>
      ) : null}
    </View>
  );
};

const SwitchBtn = ({
  Icon,
  text,
  name,
  set,
  value,
}: {
  Icon: any;
  text: string;
  name: string;
  set: Dispatch<React.SetStateAction<CommerceType>>;
  value: boolean;
}) => {
  const [active, setActive] = useState(value);
  useEffect(() => {
    set((prev) => ({ ...prev, [name]: active }));
  }, [active]);
  return (
    <Pressable
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        display: "flex",
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
      })}
      // onPress={press}
      onPress={() => {
        setActive(!active);
      }}
    >
      <Icon />
      <Text>{text}</Text>
      {!active ? <IconSwitchOff size={24} /> : <IconSwitchOn size={24} />}
    </Pressable>
  );
};
