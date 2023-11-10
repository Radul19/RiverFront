import { useFonts } from 'expo-font';
import Home from './src/screens/Home'
import Favorites from './src/screens/Favorites'
import Commerce from './src/screens/Commerce'
import Profile from './src/screens/Profile'
import Login from './src/screens/Login'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './src/screens/Register';
import { useState } from 'react';
import RegisterCommerce from './src/screens/RegisterCommerce';
import ItemPage from './src/screens/ItemPage';
import ShopPage from './src/screens/ShopPage';
import NewItem from './src/screens/NewItem';


const Stack = createNativeStackNavigator();

export default function App() {
  const [userData, setUserData] = useState({
    id:true,
    commerce:true,
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
      <NavigationContainer>
        <Stack.Navigator initialRouteName="NewItem" screenOptions={{
          headerShown: false
        }} >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Favorites" component={Favorites} />
          <Stack.Screen name="ItemPage" component={ItemPage} />
          <Stack.Screen name="ShopPage" component={ShopPage} />
          <Stack.Screen name="NewItem" component={NewItem} />
          <Stack.Screen name="Commerce" component={userData.commerce? Commerce : RegisterCommerce} />
          <Stack.Screen name="Profile" component={userData.id ? Profile : Login} />
          {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
