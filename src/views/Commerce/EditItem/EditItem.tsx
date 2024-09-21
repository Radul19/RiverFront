// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import React, { useEffect, useState } from "react";
// import { View } from "react-native";
// import Scroll from "../../../components/Scroll";
// import { ImageType } from "../../../types/item";
// import { ScreensType } from "../../../types/screens";
// import { Form, Preview } from "../NewItem/NewItem";

// const emptyInputs = {
//   name: "",
//   price: "",
//   description: "",
//   images: [],
// };

// const leftInfo = {
//   owner_id: "_",
//   favorites: [],
//   reviews: [],
//   createdAt: '',
//   updatedAt: ''
// };

// type InputsType = ({
//   _id?:string,
//   name: string,
//   price: string,
//   description: string,
//   images: ImageType[]
// } | undefined)

// type Props = NativeStackScreenProps<ScreensType, 'EditItem'>;
// const EditItem = ({ navigation, route }: Props) => {
//   const [page, setPage] = useState(1);
//   const [categ, setCateg] = useState<string[]>([]);
//   const [inputs, setInputs] = useState<InputsType>(undefined);

//   useEffect(() => {
//     if (route.params && route.params._id) {
//       const { name, price, description, images, categories,_id } = route.params;
//       setInputs({ name, price, description, images,_id });
//       setCateg(categories);
//     }
//   }, []);

//   const resetAll = () => {
//     setInputs(undefined);
//   };

//   const goBack = () => {
//     setPage(1);
//   };

//   if (inputs === undefined) return <View />;

//   return (
//     <>
//       {page === 1 && (
//         <Scroll>
//           <Form
//             {...{ setPage, navigation, inputs, setInputs, categ, setCateg }}
//           />
//         </Scroll>
//       )}
//       {page === 2 && (
//         <Preview
//           item={{
//             ...inputs,
//             ...leftInfo,
//             _id: route.params._id ?? "",
//             categories: categ,
//           }}
//           {...{ navigation, resetAll, goBack, edit: true }}
//         />
//       )}
//     </>
//   );
// };

// export default EditItem;
