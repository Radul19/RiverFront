import { View, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import React, { useState } from "react";
import Text from "../components/Text";
import { ww, wh, Categories } from "../components/DisplayItems";
import t from "../components/stylesVar";
import { IconArrowRight } from "../components/Icons";
import { Input } from "../components/Inputs";
import { PrimaryBtn } from "../components/Btns";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import ItemPage from "./ItemPage";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";

const leftInfo = {
  _id: "_",
  owner_id: "_",
  favorites: [],
  reviews: [],
};

const emptyInputs = {
  name: "",
  price: "",
  description: "",
  // unit: "",
  images: [],
}

const NewItem = ({ navigation }) => {
  const [page, setPage] = useState(1);
  const [inputs, setInputs] = useState(emptyInputs);
  const [categ, setCateg] = useState([]);

  const resetAll = ()=>{
    setPage(1)
    setInputs(emptyInputs)
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      {page === 1 && <Form {...{ setPage, navigation, inputs, setInputs,categ, setCateg }} />}
      {page === 2 && <ItemPage preview={{
        ...inputs,
        ...leftInfo,
        categories:categ
      }} {...{ navigation,resetAll }} />}
    </View>
  );
};

export default NewItem;

const Form = ({ setPage, navigation, inputs, setInputs,categ, setCateg }) => {
  const goBack = () => navigation.goBack();

  
  const handleCateg = (name) => {
    let indexOf = categ.indexOf(name);
    let aux = [...categ];
    if (!(indexOf === -1)) {
      aux.splice(indexOf, 1);
    } else aux.push(name);
    setCateg(aux);
  };

  const pickImage = async (index) => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      let aux = [...inputs.images];
      aux[index] = result.assets[0].uri;
      setInputs({ ...inputs, images: aux });
    }
  };

  const pickOne = () => pickImage(0);
  const pickTwo = () => pickImage(1);
  const pickThree = () => pickImage(3);

  const confirm = () => {
    setPage(2);
  };
  return (
    <Animated.View entering={FadeIn} style={{ flex: 1 }} exiting={FadeOut}>
      <ScrollView contentContainerStyle={st.ctn}>
        <View style={st.header}>
          <Pressable onPress={goBack} style={st.btn_back}>
            <IconArrowRight />
          </Pressable>
          <Text fs={32} ff="Bold">
            Nuevo Articulo
          </Text>
        </View>
        <View style={{ gap: 14, paddingHorizontal: 20 }}>
          <Text fs={16} ff="Bold">
            Informacion principal
          </Text>
          <Input set={setInputs} name="name" placeholder="Nombre" />
          <Input set={setInputs} name="price" placeholder="$ Precio" />
          <Input
            set={setInputs}
            name="description"
            placeholder="$ Descripcion"
          />
          <Text fs={16} ff="Bold">
            Imagenes
          </Text>
          <View style={st.images_ctn}>
            {inputs.images.length >= 0 && (
              <Pressable style={st.image} onPress={pickOne}>
                <Image source={{ uri: inputs.images[0] }} style={st.img} />
              </Pressable>
            )}
            {inputs.images.length >= 1 && (
              <Pressable style={st.image} onPress={pickTwo}>
                <Image source={{ uri: inputs.images[1] }} style={st.img} />
              </Pressable>
            )}
            {inputs.images.length >= 2 && (
              <Pressable style={st.image} onPress={pickThree}>
                <Image source={{ uri: inputs.images[2] }} style={st.img} />
              </Pressable>
            )}
          </View>
          <Text fs={16} ff="Bold">
            Categorias
          </Text>
        </View>
        <View>
          <Categories {...{ handleCateg, categ }} />
        </View>
        {/* <View style={{ gap: 14, paddingHorizontal: 20 }}>
          <Text fs={16} ff="Bold">
            Unidades
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <UnitsItem set={setInputs} active={inputs.unit} text="1 unit" />
            <UnitsItem set={setInputs} active={inputs.unit} text="1 Kg" />
            <UnitsItem set={setInputs} active={inputs.unit} text="1 Mts" />
            <UnitsItem set={setInputs} active={inputs.unit} text="12 units" />
            <UnitsItem set={setInputs} active={inputs.unit} text="+" />
          </View>
        </View> */}
        <View style={{ paddingHorizontal: 20, marginTop: "auto" }}>
          <PrimaryBtn action={confirm} text="Vista Previa" />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const UnitsItem = ({ text, active, set }) => {
  const update = () => {
    set((prev) => ({ ...prev, unit: text }));
  };
  return (
    <Pressable
      style={text === active ? st.unitItem_active : st.unitItem}
      onPress={update}
    >
      {text === active ? (
        <Text ff="Bold" style={{ textAlign: "center", color: t.prime }}>
          {text}
        </Text>
      ) : (
        <Text ff="Bold" style={{ textAlign: "center" }}>
          {text}
        </Text>
      )}
    </Pressable>
  );
};

const st = StyleSheet.create({
  ctn: {
    display: "flex",
    gap: 14,
    minHeight: wh,
    paddingVertical: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  btn_back: ({ pressed }) => ({
    opacity: pressed ? 0.5 : 1,
    transform: [{ rotate: "180deg" }],
    padding: 8,
  }),
  unitItem_active: ({ pressed }) => ({
    ...unitSt,
    opacity: pressed ? 0.5 : 1,
    backgroundColor: t.four,
  }),
  unitItem: ({ pressed }) => ({
    ...unitSt,
    opacity: pressed ? 0.5 : 1,
    backgroundColor: t.prime,
  }),
  image: ({ pressed }) => ({
    width: (ww - 64) / 3,
    height: (ww - 64) / 3,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: t.third,
    borderRadius: 6,
    overflow: "hidden",
    opacity: pressed ? 0.5 : 1,
  }),
  images_ctn: {
    flexDirection: "row",
    gap: 12,
    // justifyContent:'space-between'
  },
  img: {
    width: "100%",
    height: "100%",
  },
});

const unitSt = {
  height: 50,
  width: 50,
  padding: 4,
  borderWidth: 2,
  borderColor: t.four,
  borderRadius: 6,
  alignItems: "center",
  justifyContent: "center",
};
