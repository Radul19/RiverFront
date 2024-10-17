import { NavigationProp, NavigationState } from "@react-navigation/native";
import { ImageType, ItemType } from "./item";
import { CommerceType } from "./user";

export type ScreensType = {
    Splash: undefined;
    Home: undefined;
    Profile: undefined;
    ItemPage: { item?: ItemType, id?: string };
    Login: undefined,
    Inventory: undefined,
    NewItem: {item?: ItemType},
    Register: undefined,
    RegisterCommerce: undefined,
    Favorites: undefined,
    Commerce: {search?:boolean} | undefined,
    ShopPage: {shop?:CommerceType,id?:string},
    EditItem: {
        name: string,
        description: string,
        categories: string[],
        price: string,
        images: ImageType[],
        _id?: string,
    },
};

export type NavType = Omit<NavigationProp<ReactNavigation.RootParamList>, 'getState'> & {
  getState(): NavigationState | undefined;
}


declare global {
    namespace ReactNavigation {
      interface RootParamList extends ScreensType {}
    }
  }