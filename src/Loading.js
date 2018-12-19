import React, {Component} from 'react';
import {StyleSheet, Text, YellowBox, InteractionManager, StatusBar, ImageBackground, Image} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import AnimatedBar from "react-native-animated-bar";
YellowBox.ignoreWarnings(['Require cycle:']);

const loagIndex = 0.4;
const URL = 'http://mircoffee.by/deliveryserv/app/';
class Loading extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      didFinishInitialAnimation: false,
      progress: 0, // прогресс загрузки
      route: '',
    };

    this.loadingCustomers();
    this.loadingBanners();
    this.loadingCategories();
    this.loadingProducts();
    this.loadOptions();
    this.loadTegs();
    
    this.loadingUser();
    
    
  }
  static navigationOptions = {
    header: null,
    headerMode: 'none',
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        didFinishInitialAnimation: true,
      });
      
      this.state.didFinishInitialAnimation ?
      setTimeout(() => {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: this.state.route })],
        });
        this.props.navigation.dispatch(resetAction);
  
      }, 1500)
      :
      null
    });
  }
  loadingUser()
  {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //this.setState({ user: user.toJSON() });
        this.props.loadUser(user);
        //console.log(user._user);
        //console.log(this.props.user[0]._user.uid);
        //this.loadAddresses(user._user.uid);
        //this.loadingFavorites(user._user.uid);
        this.setState({ route: 'Main'})
      }
      else
      {
        console.log("no user");
        //this.props.navigation.navigate('Phone')
        this.setState({ route: 'Start'})
      }
    })


  }
  loadingCustomers()
  {
    return fetch(URL+'LoadingCustomers.php')
    .then((response) => response.json())
    .then((responseJson) => {

        this.props.loadCustomers(responseJson);
        //console.log("customers = ", this.props.customers);
        
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
  loadingBanners()
  {
    return fetch(URL+'LoadingBanners.php')
    .then((response) => response.json())
    .then((responseJson) => {

        this.props.loadBanners(responseJson.banners);
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
  loadingCategories()
  {
    return fetch(URL+'LoadingCategories.php')
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
  loadingProducts()
  {
    return fetch(URL+'LoadingProducts.php')
    .then((response) => response.json())
    .then((responseJson) => {
        this.props.loadProducts(responseJson.products);
        //this.progres(0.1);
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
  loadOptions()
  {
    return fetch(URL+'LoadingOptions.php')
    .then((response) => response.json())
    .then((responseJson) => {
        this.props.loadOptions(responseJson.options);
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
  loadTegs()
  {
    return fetch(URL+'LoadingTegs.php')
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
      <ImageBackground
        style={styles.container}
        source={require('../assets/loadingBg.png')}
        imageStyle={{ resizeMode: 'cover' }} >
        <StatusBar
          hidden={true}
          backgroundColor="#583286"
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
      </ImageBackground>
   
 
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
  }),
  dispatch => ({
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