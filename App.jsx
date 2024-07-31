import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import MetaAI from './src/MetaAI';
import SplashScreen from './src/SplashScreen';
import WebViewScreen from './src/WebViewScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Main" component={MetaAI} />
            <Stack.Screen name="DeveloperScreen" component={WebViewScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
