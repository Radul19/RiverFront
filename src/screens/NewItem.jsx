import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import Text from "../components/Text";
import { ww, wh, Categories } from "../components/DisplayItems";
import t from "../components/stylesVar";
import { IconArrowRight } from "../components/Icons";
import { Input } from "../components/Inputs";
import { PrimaryBtn } from "../components/Btns";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import ItemPage from "./ItemPage";

const NewItem = ({navigation}) => {
  const [page, setPage] = useState(1)
  return (
    <View style={{ flex: 1, backgroundColor: t.prime }}>
      {page === 1 && <Form {...{setPage}} />}
      {page === 2 && <ItemPage preview={true} {...{navigation}} />}
    </View>
  );
};

export default NewItem;

const Form = ({setPage}) => {
  const goBack = () => {};

  const [inputs, setInputs] = useState({
    name: "",
    price: "",
    description: "",
    categories: [],
    unit: "",
  });

  const confirm = () => {
    setPage(2)
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
          <View>
            <Text>img</Text>
          </View>
          <Text fs={16} ff="Bold">
            Categorias
          </Text>
        </View>
        <View>
          <Categories
            categ={{
              home: false,
              clean: false,
              cloth: false,
              food: false,
              tech: false,
              others: false,
              shops: false,
            }}
          />
        </View>
        <View style={{ gap: 14, paddingHorizontal: 20 }}>
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
        </View>
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
