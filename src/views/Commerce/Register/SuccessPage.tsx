import { Pressable, View } from "react-native";
import Text from "../../../components/Text";
import st from "./style";
import Animated, { FadeIn } from "react-native-reanimated";
import { v } from "../../../components/stylesVar";
import { IconArrowRight } from "../../../components/Icons";

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
export default SuccessPage;
