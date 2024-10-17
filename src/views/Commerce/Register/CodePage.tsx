import { Dispatch, useState } from "react";
import Scroll from "../../../components/Scroll";
import { Pressable, View } from "react-native";
import Text from "../../../components/Text";
import st from "./style";
import { CodeInput } from "../../../components/Inputs";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { v, wh } from "../../../components/stylesVar";
import { IconArrowRight, IconCross, IconLoad } from "../../../components/Icons";

type CodeProps = {
  setPage: Dispatch<number>;
  code: string;
  setCode: Dispatch<string>;
};
const CodePage = ({ setPage, code, setCode }: CodeProps) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [load, setLoad] = useState(false);
  const confirm = async () => {
    setPage(2);
    // setLoad(true);
    // setError(undefined);
    // const { status, data } = await codeExist(code);
    // setLoad(false);
    // if (status === 200 && data) setPage(2);
    // else setError(data.msg);
  };
  return (
    // <Scroll nav={3}>
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
          {/* <Text>No tengo ningun codigo</Text> */}
        </Pressable>
      </View>
    // </Scroll>
  );
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

export default CodePage