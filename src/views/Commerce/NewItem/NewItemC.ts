import { createContext, Dispatch } from "react";
import { ImageType } from "../../../types/item";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreensType } from "../../../types/screens";


const emptyInputs = {
    name: "",
    price: "",
    description: "",
    images: [],
    _id:undefined
  };
  

type InputsType = {
  _id?: string;
  name: string;
  price: string;
  description: string;
  images: ImageType[];
};

type ContextT = {
  setPage: Dispatch<number>;
  inputs?: InputsType;
  setInputs: Dispatch<InputsType>;
  categ: string[];
  setCateg: Dispatch<string[]>;
  resetAll: ()=>void,
//   navigation:NativeStackNavigationProp<ScreensType, "NewItem", undefined>,
};

export const NewItemContext = createContext<ContextT>({
  setPage: () => {},
  inputs: undefined,
  setInputs: () => {},
  categ: [],
  setCateg: () => {},
  resetAll: () => {},
//   navigation:
});
