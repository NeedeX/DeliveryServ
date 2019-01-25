import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
class Login extends React.Component {
    state = { email: '', password: '', errorMessage: null }

    handleLogin = () => {
        const { email, password } = this.state
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => this.props.navigation.navigate('Main'))
          .catch(error => this.setState({ errorMessage: error.message }));
          //this.loadingUser();
    }
    loadingUser() {
      firebase.auth().onAuthStateChanged(user => {
          console.log("user = ", user);
          /*
          this.props.loadUser(user);
          //this.loadingUserDB(user.uid);
          //this.setState({ route: 'Main'})
          this.userDB(user)

            setTimeout(() => {
              const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Main' })],
              });
              this.props.navigation.dispatch(resetAction);
            }, 1500)
          */
      })
    }
    userDB(user)
    {
      //console.log("UIDGoogleUser = ", user.uid);
      //console.log("chPhone = ", user.phoneNumber);
      //console.log("chUID = ", this.props.options.UIDClient);
    
      return fetch(this.props.options.URL+'InsertUser.php',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': "gzip, deflate",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UIDGoogleUser: user.uid,
          chPhone: "",
          UIDClient: this.props.options.UIDClient,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
  
      })
      .catch((error) => {
        console.error(error);
      });
  
    }
    render() {
        return (
        <View style={styles.container}>
            <Text>Login</Text>
            {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
                {this.state.errorMessage}
            </Text>}
            <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            />
            <TextInput
            secureTextEntry
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            />
            <Button title="Войти" onPress={this.handleLogin} />
            <Button
            title="У вас нет учетной записи? Регистрация"
            onPress={() => this.props.navigation.navigate('SignUp')}
            />
        </View>
        )
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})

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
)(Login);