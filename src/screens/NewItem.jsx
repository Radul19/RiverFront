import { View, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import React, { useState } from "react";
import Text from "../components/Text";
import { ww, wh, Categories, HeaderBtn } from "../components/DisplayItems";
import { v } from "../components/stylesVar";
import { IconArrowRight, IconCross, IconLoad } from "../components/Icons";
import { Input, regex_price, regex_textnum } from "../components/Inputs";
import { PrimaryBtn } from "../components/Btns";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import ItemPage, { Preview } from "./ItemPage";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import Scroll from "../components/Scroll";
import img from "../images/item.png";

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
  images: [],
  // unit: "",
};

const NewItem = ({ navigation }) => {
  const [page, setPage] = useState(1);
  const [inputs, setInputs] = useState(emptyInputs);
  const [categ, setCateg] = useState([]);

  const resetAll = () => {
    setInputs(emptyInputs);
  };

  const goBack = () => {
    setPage(1);
  };

  return (
    <>
      {page === 1 && (
        <Scroll>
          <Form
            {...{ setPage, navigation, inputs, setInputs, categ, setCateg }}
          />
        </Scroll>
      )}
      {page === 2 && (
        <Preview
          item={{
            ...inputs,
            ...leftInfo,
            categories: categ,
          }}
          {...{ navigation, resetAll, goBack }}
        />
      )}
    </>
  );
};

export default NewItem;

const IMG_ERROR_MSG = 'Ha ocurrido un error al intentar seleccionar la imagen, intente nuevamente'

const Form = ({ setPage, navigation, inputs, setInputs, categ, setCateg }) => {
  const [error, setError] = useState(false);
  const [imgLoad, setImgLoad] = useState(false);

  const handleCateg = (name) => {
    let indexOf = categ.indexOf(name);
    let aux = [...categ];
    if (indexOf === -1) {
      if (categ.length < 3) aux.push(name);
      else setError("Los articulos no puede tener mas de 3 categorias");
    } else {
      if (categ.length >= 3) setError(false);
      aux.splice(indexOf, 1);
    }
    setCateg(aux);
  };

  const pickImage = async (index) => {
    setImgLoad(true);
    try {
      // No permissions request is necessary for launching the image library
      let result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        base64:true
      });
  
      if (!result.canceled) {
        let aux = [...inputs.images];
        aux[index] = "data:image/png;base64," + result.assets[0].base64;
        setInputs({ ...inputs, images: aux });
      }
      if(error === IMG_ERROR_MSG) setError(false)
      
    } catch (error) {
      setError(IMG_ERROR_MSG)
    }
    setImgLoad(false);
  };

  const pickOne = () => pickImage(0);
  const pickTwo = () => pickImage(1);
  const pickThree = () => pickImage(2);

  const confirm = () => {
    if(inputs.name.length < 3) return setError('El nombre debe contener almenos 3 caracteres')
    if(inputs.price <= 0 ) return setError('El precio no puede estar vacío ni ser menor que cero (0)')
    if(inputs.description.length < 20) return setError('La descripción debe contener almenos 20 caracteres')
    if(inputs.images.length === 0) return setError('El item debe contener almenos una (1) imagen')
    if(categ.length === 0) return setError('Debe seleccionar almenos una (1) categoría')
    setPage(2);
    // console.log(categ)
  };
  return (
    <>
      <HeaderBtn text="Nuevo Articulo" />
      <Text {...{ fs: 16, ff: "Bold" }}>Informacion Principal</Text>
      <Input
        set={setInputs}
        name="name"
        placeholder="Nombre"
        initialValue={inputs.name}
        regex={regex_textnum}
      />
      <Input
        set={setInputs}
        name="price"
        placeholder="Precio"
        initialValue={inputs.price}
        before="$"
        regex={regex_price}
        maxLength={7}
        keyboardType="phone-pad"
      />
      <Input
        set={setInputs}
        name="description"
        placeholder="Descripcion"
        initialValue={inputs.description}
        multiline={true}
      />
      <Text {...{ fs: 16, ff: "Bold" }}>Imagenes</Text>
      <View style={st.images_ctn}>
        {inputs.images.length >= 0 && (
          <Pressable style={st.image} onPress={pickOne} disabled={imgLoad}>
            {imgLoad && <ImageLoading />}
            <Image source={{ uri: inputs.images[0] }} style={st.img} />
          </Pressable>
        )}
        {inputs.images.length >= 1 && (
          <Pressable style={st.image} onPress={pickTwo}>
            {imgLoad && <ImageLoading />}
            <Image source={{ uri: inputs.images[1] }} style={st.img} />
          </Pressable>
        )}
        {inputs.images.length >= 2 && (
          <Pressable style={st.image} onPress={pickThree}>
            {imgLoad && <ImageLoading />}
            <Image source={{ uri: inputs.images[2] }} style={st.img} />
          </Pressable>
        )}
      </View>
      <Text {...{ fs: 16, ff: "Bold" }}>Categorias</Text>
      <Categories {...{ handleCateg, categ }} />
      {error && <ErrorText text={error} />}
      <View style={{ marginTop: "auto" }}>
        <PrimaryBtn action={confirm} text="Vista Previa" />
      </View>
    </>
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
        <Text ff="Bold" style={{ textAlign: "center", color: v.prime }}>
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
    backgroundColor: v.four,
  }),
  unitItem: ({ pressed }) => ({
    ...unitSt,
    opacity: pressed ? 0.5 : 1,
    backgroundColor: v.prime,
  }),
  image: ({ pressed }) => ({
    width: (ww - 64) / 3,
    height: (ww - 64) / 3,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: v.third,
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
  borderColor: v.four,
  borderRadius: 6,
  alignItems: "center",
  justifyContent: "center",
};
const ImageLoading = () => {
  return (
    <View
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: (ww - 64) / 3,
        height: (ww - 64) / 3,
      }}
    >
      <IconLoad size={14} />
    </View>
  );
};
const ErrorText = ({ text }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        marginBottom: -32,
        // height: 18,
      }}
    >
      <IconCross color="#F20000" size={16} />
      <Text style={{ color: "#F20000" }}>{text}</Text>
    </View>
  );
};
