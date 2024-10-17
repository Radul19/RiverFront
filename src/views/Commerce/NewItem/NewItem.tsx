import { View, ScrollView, Pressable, Image } from "react-native";
import React, { Dispatch, useContext, useEffect, useState } from "react";
import Text from "../../../components/Text";
import { Categories, HeaderBtn } from "../../../components/DisplayItems";
import { v, ww } from "../../../components/stylesVar";
import { IconCross, IconLoad } from "../../../components/Icons";
import { Input, regex_price, regex_textnum } from "../../../components/Inputs";
import { PrimaryBtn } from "../../../components/Btns";
import { ItemInfo } from "../../User/Item/ItemPage";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import Scroll from "../../../components/Scroll";
import img from "../../../images/item.png";
import Context from "../../../components/Context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { ImageDisplay } from "../../../components/ItemComponents";
import { NavType, ScreensType } from "../../../types/screens";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageType, ItemType } from "../../../types/item";
import st from "./style";
import { createItem, updateItem } from "../../../api/general";
import { NewItemContext } from "./NewItemC";
// import img from "../images/item.png";

const leftInfo = {
  favorites: [],
  reviews: [],
  createdAt: "",
  updatedAt: "",
};

const emptyInputs = {
  name: "",
  price: "",
  description: "",
  images: [],
  // unit: "",
};

type InputsType = {
  _id?: string;
  name: string;
  price: string;
  description: string;
  images: ImageType[];
};

type Props = NativeStackScreenProps<ScreensType, "NewItem">;
const NewItem = ({ navigation, route }: Props) => {
  const [page, setPage] = useState(1);
  // const [inputs, setInputs] = useState<InputsType>(route.params.item ? route.params.item : emptyInputs);
  const [inputs, setInputs] = useState<InputsType | undefined>(undefined);
  const [categ, setCateg] = useState<string[]>([]);

  useEffect(() => {
    if (route.params && route.params.item) {
      setInputs(route.params.item);
      setCateg(route.params.item.categories);
    } else {
      setInputs(emptyInputs);
    }
  }, []);

  const resetAll = () => {
    setInputs(undefined);
  };
  const goToCommerce = () => {
    navigation.navigate("Commerce");
  };

  const contextValues = {
    setPage,
    navigation,
    inputs,
    setInputs,
    categ,
    setCateg,
    resetAll,
  };

  if (inputs === undefined) return <View></View>;

  return (
    <NewItemContext.Provider value={contextValues}>
      {page === 1 && (
        <Scroll>
          <Form />
        </Scroll>
      )}
      {page === 2 && <Preview {...{ goToCommerce }} />}
    </NewItemContext.Provider>
  );
};

export default NewItem;

const IMG_ERROR_MSG =
  "Ha ocurrido un error al intentar seleccionar la imagen, intente nuevamente";

type FormProps = {};

export const Form = () => {
  const { setPage, inputs, setInputs, categ, setCateg } =
    useContext(NewItemContext);
  if (inputs === undefined) return <View></View>;
  const [error, setError] = useState<string | undefined>(undefined);
  const [imgLoad, setImgLoad] = useState(false);

  const handleCateg = (name: string) => {
    let indexOf = categ.indexOf(name);
    let aux = [...categ];
    if (indexOf === -1) {
      if (categ.length < 3) aux.push(name);
      else setError("Los articulos no puede tener mas de 3 categorias");
    } else {
      if (categ.length >= 3) setError(undefined);
      aux.splice(indexOf, 1);
    }
    setCateg(aux);
  };

  const pickImage = async (index: number) => {
    setImgLoad(true);
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
        let aux = [...inputs.images];
        aux[index] = {
          secure_url: "data:image/png;base64," + result.assets[0].base64,
          public_id: "_",
        };
        setInputs({ ...inputs, images: aux });
      }
      if (error === IMG_ERROR_MSG) setError(undefined);
    } catch (error) {
      setError(IMG_ERROR_MSG);
    }
    setImgLoad(false);
  };

  const pickOne = () => pickImage(0);
  const pickTwo = () => pickImage(1);
  const pickThree = () => pickImage(2);

  const confirm = async () => {
    if (inputs.name.length < 3)
      return setError("El nombre debe contener almenos 3 caracteres");
    if (inputs.price.length <= 0 || parseInt(inputs.price) === 0)
      return setError(
        "El precio no puede estar vacío ni ser menor que cero (0)"
      );
    if (inputs.description.length < 20)
      return setError("La descripción debe contener almenos 20 caracteres");
    if (inputs.images.length === 0)
      return setError("El item debe contener almenos una (1) imagen");
    if (categ.length === 0)
      return setError("Debe seleccionar almenos una (1) categoría");
    setPage(2);
  };

  const removeImage = (index: number) => {
    let aux = [...inputs.images];
    aux.splice(index, 1);
    setInputs({ ...inputs, images: [...aux] });
  };

  const removeOne = () => removeImage(0);
  const removeTwo = () => removeImage(1);
  const removeThree = () => removeImage(2);

  return (
    <>
      <HeaderBtn text={inputs._id ? "Editar Articulo" : "Nuevo Articulo"} />
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
          <Pressable
            style={st.image}
            onPress={pickOne}
            disabled={imgLoad}
            onLongPress={removeOne}
          >
            {imgLoad && <ImageLoading />}
            <Image
              source={{ uri: inputs.images[0]?.secure_url }}
              style={st.img}
            />
          </Pressable>
        )}
        {inputs.images.length >= 1 && (
          <Pressable style={st.image} onPress={pickTwo} onLongPress={removeTwo}>
            {imgLoad && <ImageLoading />}
            <Image
              source={{ uri: inputs.images[1]?.secure_url }}
              style={st.img}
            />
          </Pressable>
        )}
        {inputs.images.length >= 2 && (
          <Pressable
            style={st.image}
            onPress={pickThree}
            onLongPress={removeThree}
          >
            {imgLoad && <ImageLoading />}
            <Image
              source={{ uri: inputs.images[2]?.secure_url }}
              style={st.img}
            />
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
const ErrorText = ({ text }: { text?: string }) => {
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

const item2 = {
  name: "Test 01",
  price: "12.99",
  description:
    "Antes de ingresar a los círculos encontramos la Selva, el Coliseo y la Colina donde Dante se encuentra perdido en el medio del camino de nuestra vida: detrás de la colina se encuentra la ciudad de Jerusalén, debajo de la cual se imagina cavada la inmensa vorágine del Infierno. Entra entonces por la Puerta del Infierno y penetra así en el Ante-infierno. Superando el río Aqueronte en la barca de Caronte entra en el verdadero Infierno. Este infierno es un lugar infinito, cuantas más personas entren a este lugar, más crece y así hasta el fin de los tiempos sin ningún límite",
  categories: ["home", "clean"],
  images: [img, img, img],
  _id: "_",
  owner_id: "_",
  favorites: [],
  reviews: [],
  createdAt: "",
  updatedAt: "",
};

type PrevType = {
  item: ItemType;
  navigation: NavType;
  resetAll: () => void;
  goBack: () => void;
  edit?: boolean;
};
export const Preview = ({ goToCommerce }: { goToCommerce: () => void }) => {
  const { userData } = useContext(Context);
  const { categ, resetAll, setPage, inputs } = useContext(NewItemContext);
  if (inputs === undefined) return <View></View>;

  const goBack = () => setPage(1);

  const confirmPreview = async () => {
    const { status, data } = await createItem({
      ...inputs,
      commerce: userData.commerce._id,
      categories: categ,
      _id: undefined,
    });
    if (status === 200) {
      resetAll();
      goToCommerce();
      // navigation.navigate("Commerce");
    } else {
      goBack();
    }
  };
  const confirmEdit = async () => {
    const { status, data } = await updateItem({
      ...inputs,
      categories: categ,
      commerce: userData.commerce._id,
    });
    if (status === 200) {
      resetAll();
      goToCommerce();
    } else {
      goBack();
    }
  };

  return (
    <Animated.View
      entering={FadeIn}
      style={{ flex: 1, backgroundColor: v.prime }}
      exiting={FadeOut}
    >
      <ScrollView contentContainerStyle={st.preview}>
        <ImageDisplay images={inputs.images} goBack={goBack} />
        <View style={st.preview_ctn}>
          <ItemInfo
            {...{
              item: {
                ...inputs,
                ...leftInfo,
                commerce: userData.commerce._id,
                categories: categ,
                _id: inputs._id ?? "",
              },
            }}
          />
        </View>
      </ScrollView>
      <View
        style={{
          padding: 20,
          position: "absolute",
          zIndex: 500,
          width: "100%",
          bottom: 0,
        }}
      >
        <PrimaryBtn
          text="Confirmar"
          action={!inputs._id ? confirmPreview : confirmEdit}
        />
      </View>
    </Animated.View>
  );
};
