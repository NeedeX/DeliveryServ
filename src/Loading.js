import React, {Component} from 'react';
import {StyleSheet, Text, YellowBox, InteractionManager, StatusBar, ImageBackground, Image} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import AnimatedBar from "react-native-animated-bar";
import LinearGradient from 'react-native-linear-gradient';

YellowBox.ignoreWarnings(['Require cycle:']);


const loagIndex = 0.4; 

class Loading extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      didFinishInitialAnimation: false,
      progress: 0, // прогресс загрузки
      isAuth: false, // флаг, зарегистрирован ли пользователь. 
    };

    this.props.loadOptions();
    console.log("this.props.options = ", this.props.options);
    
    // загрузка общих данных
    this.loadingCustomers(this.props.options.UIDClient, this.props.options.URL);
    this.loadingBanners(this.props.options.UIDClient, this.props.options.URL);
    this.loadingCategories(this.props.options.UIDClient, this.props.options.URL);
    this.loadingProducts(this.props.options.UIDClient, this.props.options.URL);
    this.loadingTegs(this.props.options.UIDClient, this.props.options.URL);
    this.loadingLocation(this.props.options.UIDClient, this.props.options.URL);

    //this.sendNotification(status);
    this.sendNotification(1);
    // проверка зарегистрирован/авторизован ли пользователь
    firebase.auth().onAuthStateChanged(user => {
      if (user) { 
        this.state.isAuth = true;
        // загрузка личных данных
        this.props.loadUser(user); // сохранение данных пользоыателя в redux
        this.loadingUserDB(user.uid); // загрузка данных пользователя из БД
        this.loadingAddresses(user.uid); // загрузка адресов пользователя из БД
        this.loadingFavorites(user.uid); // загрузка избранных товаров пользователя из БД
      }
      else this.state.isAuth = false; // изменение маяка на об авторизации на false (не авторизован) 
    })
  }
  static navigationOptions = {
    header: null,
    headerMode: 'none',
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ didFinishInitialAnimation: true });
        if (this.state.isAuth)
         this.state.didFinishInitialAnimation ? this.goNext('Main', 1500) : null
        else 
          this.state.didFinishInitialAnimation ? this.goNext('Start', 1500) : null
    }); 
  }

  sendNotification(status){
    return fetch(this.props.options.URL + 'NotificationNewOrder.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: status,
        UIDClient: this.props.options.UIDClient,
      })
    })
  
    .then((responseJson) => {
      this.setState(state => { 
        return {  progress: state.progress + loagIndex, }; 
      });
      console.log("status = ", status);
      
    })
    .catch((error) => { 
      console.error(error); 
    });
  }
  // функция перехода на другой экран через определенное время
  // route - на какой экран переход, time - через какое время (миллисекунды)
  goNext(route, time){
    setTimeout(() => {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: route })],
      });
      this.props.navigation.dispatch(resetAction);
    }, time)
  }

  loadingLocation(UIDClient, URL){
    return fetch(URL+'LoadingLocations.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ UIDClient: UIDClient })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.props.loadLocation(responseJson.locations);
        console.log("this.props.locations = ", this.props.locations);
        this.setState(state => { 
          return { progress: state.progress + loagIndex }; 
        });
    })
    .catch((error) => { 
      console.error(error); 
    });
  }

  loadingUserDB(chUIDGoogleUser){
    return fetch(this.props.options.URL + 'LoadingUserDB.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chUIDGoogleUser: chUIDGoogleUser,
        UIDClient: this.props.options.UIDClient,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      
      this.props.editUser(responseJson);
      console.log("this.props.user = ", this.props.user);
      this.setState(state => { 
        return {  progress: state.progress + loagIndex, }; 
      });
    })
    .catch((error) => { 
      console.error(error); 
    });
  }
  loadingAddresses(chUIDGoogleUser){
    return fetch(this.props.options.URL + 'LoadingAddresses.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chUIDGoogleUser: chUIDGoogleUser,
        UIDClient: this.props.options.UIDClient,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //this.props.clearAddresses();
      this.props.loadAddresses(responseJson.addresses);
      //console.log("responseJson.addresses = ", responseJson.addresses);
      console.log("this.props.addresses = ", this.props.addresses);
      this.setState(state => { 
        return {  progress: state.progress + loagIndex, }; 
      });
    })
    .catch((error) => { 
      console.error(error); 
    });
  }
  loadingFavorites(chUIDGoogleUser){
    return fetch(this.props.options.URL+'LoadingFavorites.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chUIDGoogleUser: chUIDGoogleUser,
        UIDClient: this.props.options.UIDClient,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.loadFavorites(responseJson.favorite);
      console.log("this.props.favorite = ", this.props.favorite);
      this.setState(state => { return {  progress: state.progress + loagIndex, }; });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  loadingCustomers(UIDClient, URL){
    return fetch(URL+'LoadingCustomers.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UIDClient: UIDClient,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.props.loadCustomers(responseJson);
        console.log("this.props.customers = ", this.props.customers);
        this.setState(state => {
          return { progress: state.progress + loagIndex, };
        });
    })
    .catch((error) => {
      console.error(error);
    });
  }
  loadingBanners(UIDClient, URL){
    return fetch(URL+'LoadingBanners.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UIDClient: UIDClient,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.props.loadBanners(responseJson.banners);
        this.setState(state => {
          return { progress: state.progress + loagIndex, };
        });
    })
    .catch((error) => {
      console.error(error);
    });
  }
  loadingCategories(UIDClient, URL)
  {
    return fetch(URL+'LoadingCategories.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UIDClient: UIDClient,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
     this.props.loadCategories(responseJson.categories);
        this.setState(state => {
          return {
            progress: state.progress + loagIndex,
          };
        });

    })
    .catch((error) => {
      console.error(error);
    });
    
  }
  loadingProducts(UIDClient, URL)
  {
    return fetch(URL+'LoadingProducts.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UIDClient: UIDClient,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.props.loadProducts(responseJson.products);
        //this.progres(0.1);
        console.log("this.props.products = ", this.props.products);
        
        this.setState(state => {
          return {
            progress: state.progress + loagIndex,
          };
        });
    })
    .catch((error) => {
      console.error(error);
    });
  }
  loadingTegs(UIDClient, URL)
  {
    return fetch(URL+'LoadingTegs.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UIDClient: UIDClient,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.props.loadTegs(responseJson.tegs);
        this.setState(state => {
          return {
            progress: state.progress + loagIndex,
          };
        });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      
      <LinearGradient 
        colors={['#4c669f', '#3b5998', '#192f6a']} 
        style={styles.container}>
        {/**
        <ImageBackground
        style={styles.container}
        source={require('../assets/loadingBg.png')}
        imageStyle={{ resizeMode: 'cover' }} >
         */}
        <StatusBar
          hidden={true}
          backgroundColor={"#fff"}
          barStyle="default"
        />
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logoStyle}
        />
        <AnimatedBar
          progress={this.state.progress}
          height={10}
          borderColor="#DDD"
          barColor="#6A3DA1"
          borderRadius={1}
          borderWidth={0}
          duration={1000}
          style={styles.animatedBarStyle}
        />
      {/**</ImageBackground> */}
      </LinearGradient>

        
   
 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  animatedBarStyle:
  {
    justifyContent: 'center',
  },
  logoStyle:{
    marginTop: 200,
    width: 220, 
    height: 150,
  }
});
export default connect (
  state => ({
    banners: state.BannerReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    user: state.UserReducer,
    addresses: state.AddressReducer,
    favorite: state.FavoriteReducer,
    customers: state.CustomersReducer,
    options: state.OptionReducer,
    locations: state.LocationReducer,
  }),
  dispatch => ({
    loadLocation: (data) => {
      dispatch({ type: 'LOAD_LOCATION', payload: data});
    },
    loadBanners: (bannersData) => {
      dispatch({ type: 'LOAD_BANNERS', payload: bannersData});
    },
    loadCustomers: (index) => {
      dispatch({ type: 'LOAD_CUSTOMERS', payload: index})
    },
    loadCategories: (categoriesData) => {
      dispatch({ type: 'LOAD_CATEGORIES', payload: categoriesData})
    },
    loadProducts: (productsData) => {
      dispatch({ type: 'LOAD_PRODUCTS', payload: productsData})
    },
    loadOptions: (optionssData) => {
      dispatch({ type: 'LOAD_OPTIONS', payload: optionssData})
    },
    loadUser: (userData) => {
      dispatch({ type: 'LOAD_USER', payload: userData})
    },
    editUser: (userData) => {
      dispatch({ type: 'EDIT_USER', payload: userData})
    },
    loadAddresses: (index) => {
      dispatch({ type: 'LOAD_ADDERESSES', payload: index})
    },
    loadFavorites: (index) => {
      dispatch({ type: 'LOAD_FAVORITES', payload: index})
    },
    loadTegs: (index) => {
      dispatch({ type: 'LOAD_TEGS', payload: index})
    },
    clearAddresses: (index) => {
      dispatch({ type: 'CLEAR_ADDRESSES', payload: index});
    },
    clearFavorite: (index) => {
      dispatch( { type: 'CLEAR_FAVORITE', payload:index})
    }
  })
)(Loading);