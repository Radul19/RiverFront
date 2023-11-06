import { useFonts } from 'expo-font';
import Home from './src/screens/Home'
import Favorites from './src/screens/Favorites'
import Commerce from './src/screens/Commerce'
import Profile from './src/screens/Profile'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function App() {
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
        <Stack.Navigator initialRouteName="Home" screenOptions={{
          headerShown: false
        }} >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Favorites" component={Favorites} />
          <Stack.Screen name="Commerce" component={Commerce} />
          <Stack.Screen name="Profile" component={Profile} />
          {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
