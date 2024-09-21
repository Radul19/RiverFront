import { createContext } from 'react';

const Context = createContext<any>(null);
export default Context
// import { createContext } from 'react';

// import { UserType } from "../types/user";
// type ContextT = {
//     userData:UserType,
//     setUserData:React.Dispatch<React.SetStateAction<UserType>>
// }
// const Context = createContext<ContextT>({
//     userData:{
//         _id: undefined,
//         commerce: undefined,
//         name: "",
//         email: "",
//         avatar: 0,
//         card_id: "",
//     },
//     setUserData:()=>{}
// });
// export default Context