import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Context from "./src/components/Context";
import Home from "./src/views/User/Home/Home";
import Splash from "./src/views/Splash";
import Favorites from "./src/views/User/Favorites/Favorites";
import ItemPage from "./src/views/User/Item/ItemPage";
import Login from "./src/views/User/Login/Login";
import Profile from "./src/views/User/Profile/Profile";
import Register from "./src/views/User/Register/Register";
import { UserType } from "./src/types/user";
import RegisterCommerce from "./src/views/Commerce/Register/RegisterCommerce";
import Commerce from "./src/views/Commerce/Inventory/Inventory";
import NewItem from "./src/views/Commerce/NewItem/NewItem";
import ShopPage from "./src/views/User/ShopPage/ShopPage";
// import EditItem from "./src/views/Commerce/EditItem/EditItem";
import { ScreensType } from "./src/types/screens";
import { View, Text } from "react-native";

// const Stack = createNativeStackNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<ScreensType>();

export default function App() {
  const [userData, setUserData] = useState<UserType>({
    _id: undefined,
    commerce: undefined,
    name: "",
    email: "",
    avatar: 0,
    card_id: "",
  });
  const [fontsLoaded] = useFonts({
    Bold: require("./assets/fonts/DMSans-Bold.ttf"),
    Medium: require("./assets/fonts/DMSans-Medium.ttf"),
    Regular: require("./assets/fonts/DMSans-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Context.Provider value={{ userData, setUserData }}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Splash"
              // initialRouteName="ShopPage"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Splash" component={Splash} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Favorites" component={Favorites} />
              <Stack.Screen name="ItemPage" component={ItemPage} />
              <Stack.Screen name="ShopPage" component={ShopPage} />
              <Stack.Screen name="NewItem" component={NewItem} />

              {/* TODO: THIS MESS */}
              <Stack.Screen
                //@ts-ignore
                name="Commerce"
                //@ts-ignore
                component={userData.commerce ? Commerce : RegisterCommerce}
                // component={RegisterCommerce}
              />
              <Stack.Screen
                //@ts-ignore
                name="Profile"
                //@ts-ignore
                component={userData._id ? Profile : Login}
              />
              {/* <Stack.Screen name="EditItem" component={EditItem} /> */}
              {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </Context.Provider>
      </GestureHandlerRootView>
    );
  }
}
