import { View, StyleSheet, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, Avatars, Input, regex_email } from "../../components/Inputs";
import Text from "../../components/Text";
import {
  IconArrowRight,
  IconCross,
  IconExit,
  IconInstagram,
  IconMessenger,
  IconPlusBox,
  IconStallLine,
  IconTelegram,
  IconUserLine,
  IconWhatsapp,
} from "../../components/Icons";
import { v } from "../../components/stylesVar";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { PrimaryBtn } from "../../components/Btns";
import { wh, ww } from "../../components/DisplayItems";
import Context from "../../components/Context";
import { editMarketData, editUserData } from "../../api/general";
import { deleteLocalData } from "../../helpers/localStorage";
import { ScheduleItem } from "../Commerce/RegisterCommerce";
import Scroll from "../../components/Scroll";
import moment from "moment";

const Profile = () => {
  const { userData, setUserData } = useContext(Context);
  const [page, setPage] = useState(1);
  return (
    <Scroll nav={page === 1 ? 4 : false}>
      {page === 1 && <Info {...{ setPage, userData, setUserData }} />}
      {page === 2 && <UserProfile {...{ setPage, userData, setUserData }} />}
      {page === 3 && <InfoCommerce {...{ setPage, userData, setUserData }} />}
    </Scroll>
  );
};

export default Profile;

const Container = ({ children }) => (
  <Animated.View style={{ flex: 1,gap:14,minHeight:wh-40 }} entering={FadeIn} exiting={FadeOut}>
    {children}
  </Animated.View>
);

const Info = ({ setPage, userData, setUserData }) => {
  const goEditProfile = () => {
    setPage(2);
  };
  const goEditCommerce = () => {
    setPage(3);
  };

  const exit = async () => {
    await deleteLocalData("@userToken");
    setUserData({
      _id: false,
      commerce: false,
    });
  };

  return (
    <Container>
      <View style={st.avatar_ctn}>
        <Avatar num={userData.avatar} size={100} />
        <Text {...{ fs: 16, ff: "Bold" }}>{userData.name}</Text>
        <Text>{userData.email}</Text>
      </View>
      <View style={st.options_ctn}>
        <Options
          Icon={IconUserLine}
          text="Informacion Personal"
          action={goEditProfile}
        />
        {userData.commerce && (
          <Options
            Icon={IconStallLine}
            text="Informacion comercial"
            action={goEditCommerce}
          />
        )}
        <Options Icon={IconExit} text="Cerrar Sesion" action={exit} />
      </View>
    </Container>
  );
};

const Options = ({ text, Icon, action }) => {
  return (
    <Pressable style={st.option_ctn} onPress={action}>
      {({ pressed }) => (
        <>
          <Icon color={!pressed ? v.four : v.prime} />
          <Text
            ff={"Medium"}
            fs={16}
            style={{ color: !pressed ? v.four : v.prime }}
          >
            {text}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const UserProfile = ({ setPage, userData, setUserData }) => {
  const [error, setError] = useState(false);
  const [inputs, setInputs] = useState({
    avatar: userData.avatar,
    email: userData.email,
    name: userData.name,
  });
  const goBack = () => {
    setPage(1);
  };

  const updtAvatar = (num) => {
    setInputs({ ...inputs, avatar: num });
  };

  const validateData = () => {
    setError(false);
    if (inputs.name.length < 3)
      return "El nombre debe tener almenos 3 caracteres";
    if (!regex_email.test(inputs.email)) return "Ingrese un correo válido";
    return false;
  };

  const confirm = async () => {
    let validation = validateData();
    if (validation) return setError(validation);
    const info = {
      user_id: userData._id,
      name: inputs.name,
      email: inputs.email,
      avatar: inputs.avatar,
    };
    const { status, data } = await editUserData(info);
    if (status === 200) {
      setUserData((prev) => ({
        ...prev,
        name: info.name,
        email: info.email,
        avatar: info.avatar,
      }));
      setPage(1);
    } else {
      setError(data.msg);
    }
  };

  return (
    <Container>
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
          Info. Personal
        </Text>
      </View>
      <Text style={{ textAlign: "center" }} ff="Medium" fs={16}>
        Selecciona un avatar
      </Text>
      <Avatars set={updtAvatar} start={userData.avatar} />
      <Input
        name="name"
        placeholder="Nombre"
        set={setInputs}
        initialValue={inputs.name}
      />
      <Input
        name="email"
        placeholder="Correo"
        set={setInputs}
        initialValue={inputs.email}
      />
      <View style={{ marginTop: "auto" }} />
      {error && <ErrorText text={error} />}
      <PrimaryBtn text="Confirmar" action={confirm} />
    </Container>
  );
};


const InfoCommerce = ({ userData, setUserData, setPage }) => {
  const {
    _id,
    owner_id,
    logo_id,
    favorites,
    reviews,
    createdAt,
    updatedAt,
    schedules: sch,
    ...allData
  } = userData.commerce;
  const [error, setError] = useState(false);
  const [inputs, setInputs] = useState(allData);
  const [schedules, setSchedules] = useState(sch);

  const goBack = () => {
    setPage(1);
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
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (inputs.name.length < 3)
      return "El nombre debe tener almenos 3 caracteres";
    if (inputs.description.length < 20)
      return "La descripcion debe tener almenos 20 caracteres";
    if (!inputs.logo) return "Debe seleccionar una imagen como logo";
    if (inputs.email.length > 0 && !emailRegex.test(inputs.email))
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
      const { status, data } = await editMarketData(marketInfo);
      if (status === 200) {
      }
    } else {
      setError(data.msg);
    }
  };

  const pickImage = async () => {
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
  };

  const setSocial = (name, value) => {
    setInputs((prev) => ({
      ...prev,
      socials: { ...inputs.socials, [name]: value },
    }));
  };

  return (
    <Container>
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
        initialValue={inputs.name}
      />
      <Input
        set={setInputs}
        name="phone"
        placeholder="Numero de telefono"
        initialValue={inputs.phone}
      />
      <Input
        set={setInputs}
        name="description"
        placeholder="Description"
        initialValue={inputs.description}
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
      <Input
        set={setInputs}
        name="email"
        placeholder="Correo"
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
      
      <View style={st.subtitle_ctn}>
        <Text {...subtitle}>Redes</Text>
        <Text style={{ fontSize: 12, color: v.third }}>{"(Opcional)"}</Text>
      </View>
      <Input
        custom={setSocial}
        name="telegram"
        placeholder="+584126452311"
        Icon={IconTelegram}
        initialValue={inputs.socials?.telegram}
      />
      <Input
        custom={setSocial}
        name="whatsapp"
        placeholder="+584126452311"
        Icon={IconWhatsapp}
        initialValue={inputs.socials?.whatsapp}
      />
      <Input
        custom={setSocial}
        name="messenger"
        placeholder="+584126452311"
        Icon={IconMessenger}
        initialValue={inputs.socials?.messenger}
      />
      <Input
        custom={setSocial}
        name="instagram"
        placeholder="@instagram"
        Icon={IconInstagram}
        initialValue={inputs.socials?.instagram}
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
      {schedules?.map((item, index) => (
        <ScheduleItem key={item._id} {...{ item, setSchedules }} />
      ))}
      <View style={{ marginTop: 42 }} />
      {error && <ErrorText text={error} />}
      <PrimaryBtn text="Confirmar" action={confirm} />
    </Container>
  );
};

const ErrorText = ({ text }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
      }}
    >
      <IconCross color="#F20000" size={16} />
      <Text style={{ color: "#F20000" }}>{text}</Text>
    </View>
  );
};

const subtitle = {
  ff: "Bold",
  fs: 16,
  //   style:{marginTop:6}
};


const st = StyleSheet.create({
  avatar_ctn: {
    display: "flex",
    gap: 14,
    alignItems: "center",
  },
  options_ctn: {
    display: "flex",
    width: "100%",
    gap: 6,
    paddingVertical: 24,
  },
  option_ctn: ({ pressed }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: pressed ? v.four : v.prime,
    borderRadius: 6,
  }),
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
  subtitle_ctn: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 12,
  },
});