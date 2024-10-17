import { View, Pressable } from "react-native";
import React, {
  useContext,
  useState,
  PropsWithChildren,
  Dispatch,
} from "react";
import {
  Avatar,
  Avatars,
  Input,
  regex_email,
} from "../../../components/Inputs";
import Text from "../../../components/Text";
import {
  IconArrowRight,
  IconCross,
  IconExit,
  IconStallLine,
  IconUserLine,
} from "../../../components/Icons";
import { v, wh } from "../../../components/stylesVar";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { PrimaryBtn } from "../../../components/Btns";
import Context from "../../../components/Context";
import { editUserData } from "../../../api/general";
import { deleteLocalData } from "../../../helpers/localStorage";
import { InfoCommerce } from "../../Commerce/Register/RegisterCommerce";
import Scroll from "../../../components/Scroll";
import { st } from "./style";
import { UserType } from "../../../types/user";

const Profile = () => {
  const { userData, setUserData } = useContext(Context);
  const [page, setPage] = useState(1);
  return (
    <Scroll nav={page === 1 ? 4 : undefined}>
      {page === 1 && <Info {...{ setPage, userData, setUserData }} />}
      {page === 2 && <UserProfile {...{ setPage, userData, setUserData }} />}
      {page === 3 && (
        <InfoCommerce {...{ setPage, userData, setUserData, code: "" }} />
      )}
    </Scroll>
  );
};

export default Profile;

const Container = ({ children }: PropsWithChildren) => (
  <Animated.View
    style={{ flex: 1, gap: 14, minHeight: wh - 40 }}
    entering={FadeIn}
    exiting={FadeOut}
  >
    {children}
  </Animated.View>
);
const guest = {
  _id: undefined,
  commerce: undefined,
  name: "",
  email: "",
  avatar: 1,
  card_id: "",
};
const Info = ({
  setPage,
  userData,
  setUserData,
}: {
  setPage: Dispatch<number>;
  userData: UserType;
  setUserData: Dispatch<UserType>;
}) => {
  const goEditProfile = () => {
    setPage(2);
  };
  const goEditCommerce = () => {
    setPage(3);
  };

  const exit = async () => {
    await deleteLocalData("@userToken");
    setUserData(guest);
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

const Options = ({
  text,
  Icon,
  action,
}: {
  text: string;
  Icon: React.FunctionComponent<{ color?: string; size?: number }>;
  action: () => void;
}) => {
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

const UserProfile = ({
  setPage,
  userData,
  setUserData,
}: {
  setPage: Dispatch<number>;
  setUserData: Dispatch<UserType | ((prev: UserType) => UserType)>;
  userData: UserType;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [inputs, setInputs] = useState({
    avatar: userData.avatar,
    email: userData.email,
    name: userData.name,
  });
  const goBack = () => {
    setPage(1);
  };

  const updtAvatar = (num: number) => {
    setInputs({ ...inputs, avatar: num });
  };

  const validateData = () => {
    setError(undefined);
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
      setUserData((prev: UserType) => ({
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
export const ErrorText = ({ text }: { text: string }) => {
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
