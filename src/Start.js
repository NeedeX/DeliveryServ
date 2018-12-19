import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ImageBackground, StyleSheet, Image, StatusBar, TouchableHighlight, Text, View} from 'react-native';

class Start extends Component {
    constructor(props) {
        super(props)
        this.state = {
      
        };
    
    }

    // опции нагатора
    static navigationOptions = {
        // убрать певхний бар
        header: null, 
    };

    componentDidMount() {

    }

    render() {
        var {navigate} = this.props.navigation;
        return (
          <ImageBackground
          style={styles.container}
          source={require('../assets/loadingBg.png')}
          imageStyle={{ resizeMode: 'cover' }} >
            <StatusBar
                hidden={true}
                backgroundColor="#583286"
                barStyle="light-content"
            />
            <Image 
                source={require('../assets/logo.png')} 
                style={styles.ImageStyle}
            />
            <TouchableHighlight underlayColor='rgba(255,255,255,0.1)'
                style={{elevation: 5,marginTop: 50,}}
                onPress={() => this.props.navigation.navigate('Phone', {animation: 'SlideFromLeft', animationDuration: 500 })}>
                    <Text style = {styles.buttonText}> РЕГИСТРАЦИЯ </Text>
            </TouchableHighlight>
            <View style={{flexDirection: 'row', marginTop: 20,}}> 
              <Text style={{color: '#F2F2F2'}}>Уже есть аккаунт?</Text>
              <TouchableHighlight underlayColor='rgba(255,255,255,0.1)'
                 
                  onPress={() => this.props.navigation.navigate('Phone', {animation: 'SlideFromLeft', animationDuration: 500 })}>
                      <Text style={{color: '#F2F2F2'}}> Войти </Text>
              </TouchableHighlight>
            </View>
            <TouchableHighlight underlayColor='rgba(255,255,255,0.1)'
                style={{marginTop: 130,}}
                onPress={() => this.props.navigation.navigate('Main', {animation: 'SlideFromLeft', animationDuration: 500 })}>
                    <Text style={{color: '#F2F2F2'}}> ПРОПУСТИТЬ </Text>
            </TouchableHighlight>
        </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center',
  },
  animatedBarStyle:
  {
    justifyContent: 'center',
    
  },
  ImageStyle:{
    marginTop: 150,
    width: 220, 
    height: 150,
  },
  buttonText:{
    borderWidth: 0,
    padding: 10,
    borderColor: '#6A3DA1',
    backgroundColor: '#6A3DA1',
    color: '#fff',
    fontWeight: "600",
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
    width: 180,
    fontFamily: 'OswaldMedium',
    fontSize: 12,
},

});


export default connect (
  state => ({
    banners: state.BannerReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    offers: state.CommercialOfferReducer,
  }),
  /*
  dispatch => ({
    loadBanners: (bannersData) => {
      dispatch({ type: 'LOAD_BANNERS', payload: bannersData});
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
    loadOffers: (offersData) => {
      dispatch({ type: 'LOAD_OFFERS', payload: offersData})
    }
  })*/
)(Start);
