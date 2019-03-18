import { Easing, Animated } from 'react-native';
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';

import Loading from './Loading';
import Main from './Main';
import Favorites from './Favorites';
import History from './History';
import Stocks from './Stocks';
import StocksView from "./StocksView";
import DeliveryAndPays from './DeliveryAndPays';
import Cart from './Cart';
import Category from './CategoryView'; 
/*

import ProductDetailView from './ProductDetailView';



import Checkout from './Checkout';
import Pickups from './Pickups';
import Addresses from './Addresses';
import AddAddress from './AddAddress';

import CheckoutConfirm from './CheckoutConfirm';
import CompletedOrder from './CompletedOrder';

import Settings from './Settings';

import Test from './Test';




/// auth
import LoadingAuth from './auth/Loading';
import Login from './auth/Login';
import Phone from './auth/Phone';
import SignUp from './auth/SignUp';

*/
// drawer 
import DrawerMenu from './components/Drawer';
import Start from './Start'; // экран выбора "Зарегистриваться" или пропустить. Продолжить без регистрации

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {      
      const { layout, position, scene } = sceneProps

      const thisSceneIndex = scene.index
      const width = layout.initWidth

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      });

      return { transform: [ { translateX } ] }
    },
  }
}


const AppNavigator = createStackNavigator({
  Loading: { screen: Loading },
  Main: { screen: Main },
  Favorites: { screen: Favorites},
  History: { screen: History},
  Stocks: { screen: Stocks},
  StocksView: { screen: StocksView},
  DeliveryAndPays: { screen: DeliveryAndPays},
  Cart: { screen: Cart}, 
  Category: { screen: Category},
  /*

  ProductDetailView: { screen: ProductDetailView},
  

  Checkout: { screen: Checkout},
  Pickups: { screen: Pickups},
  CheckoutConfirm: { screen: CheckoutConfirm},
  CompletedOrder: { screen: CompletedOrder},
  Addresses: { screen: Addresses },
  AddAddress: { screen: AddAddress},
  
  Settings: { screen: Settings},

  Test: { screen: Test},
  /// auth
  LoadingAuth : { screen: Loading },
  Login : { screen: Login },
  Phone : { screen: Phone },
  SignUp : { screen: SignUp },
  
  */
  Start: { screen: Start},
},
{
  initialRouteName: 'Loading',
  
  transitionConfig: transitionConfig,
  //header: null,
  //headerMode: 'none',
  /*
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
      },
    }),*/
  
});


const Drawer = createDrawerNavigator(
  {
    Main: { screen: AppNavigator }
  },
  {
    contentComponent: DrawerMenu,
    drawerWidth: 300
  }
);

const App = createAppContainer(Drawer);
//const App = createAppContainer(AppNavigator);
export default App;