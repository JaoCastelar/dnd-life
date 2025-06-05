import 'react-native-reanimated'; // deve vir primeiro
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DarkTheme } from '@react-navigation/native';

import HomeScreen from './screens/HomeScreen.jsx';
import CreateScreen from './screens/CreateScreen.jsx';
import DetailsScreen from './screens/DetailsScreen.jsx';
import SpellsScreen from './screens/SpellsScreen.jsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Spells" component={SpellsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
