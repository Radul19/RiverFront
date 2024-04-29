import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Scroll from "../../components/Scroll";
import { Form, Preview } from "./NewItem";

const emptyInputs = {
  name: "",
  price: "",
  description: "",
  images: [],
};

const leftInfo = {
  owner_id: "_",
  favorites: [],
  reviews: [],
};

const EditItem = ({ navigation, route }) => {
  const [page, setPage] = useState(1);
  const [categ, setCateg] = useState([]);
  const [inputs, setInputs] = useState(false);

  useEffect(() => {
    if (route.params && route.params._id) {
      const { name, price, description, images, categories } = route.params;
      setInputs({ name, price, description, images });
      setCateg(categories);
    }
  }, []);

  const resetAll = () => {
    setInputs(emptyInputs);
  };

  const goBack = () => {
    setPage(1);
  };

  if (inputs === false) return <View />;

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
            _id: route.params._id,
            categories: categ,
          }}
          {...{ navigation, resetAll, goBack,edit:true }}
        />
      )}
    </>
  );
};

export default EditItem;
