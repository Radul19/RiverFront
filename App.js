import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import Context from './src/components/Context'
import Home from './src/screens/User/Home'
import Favorites from './src/screens/User/Favorites'
import ItemPage from './src/screens/User/ItemPage';
import Login from './src/screens/User/Login'
import Profile from './src/screens/User/Profile'
import Register from './src/screens/User/Register';
import RegisterCommerce from './src/screens/Commerce/RegisterCommerce';
import Commerce from './src/screens/Commerce/Commerce'
import NewItem from './src/screens/Commerce/NewItem';
import ShopPage from './src/screens/ShopPage';
import Splash from './src/screens/Splash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Stack = createNativeStackNavigator();

export default function App() {
  const [userData, setUserData] = useState({
    _id: false,
    commerce: false,
  })
  const [fontsLoaded] = useFonts({
    'Bold': require('./assets/fonts/DMSans-Bold.ttf'),
    'Medium': require('./assets/fonts/DMSans-Medium.ttf'),
    'Regular': require('./assets/fonts/DMSans-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  } else {


    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Context.Provider value={{ userData, setUserData }} >

          <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{
              headerShown: false
            }} >
              <Stack.Screen name="Splash" component={Splash} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Favorites" component={Favorites} />
              <Stack.Screen name="ItemPage" component={ItemPage} />
              <Stack.Screen name="ShopPage" component={ShopPage} />
              <Stack.Screen name="NewItem" component={NewItem} />
              <Stack.Screen name="Commerce" component={userData.commerce ? Commerce : RegisterCommerce} />
              <Stack.Screen name="Profile" component={userData._id ? Profile : Login} />
              {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </Context.Provider>
      </GestureHandlerRootView>
    );
  }
}
