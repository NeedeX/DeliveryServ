import React from 'react';
import { ListView, 
  TouchableHighlight, StatusBar,
  StyleSheet, Dimensions, Text, View, Button, TouchableOpacity, Image, ScrollView, ImageBackground, InteractionManager, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import Card from './components/CardProductInCart';
import EmptyCart from './components/EmptyCart';
import Header from './components/Header';

const { width } = Dimensions.get('window');
class Cart extends React.Component {
  constructor(props){
    super(props);
    var {params} = this.props.navigation.state;
    this.state = { 
      didFinishInitialAnimation: false,
    }
  }
  static navigationOptions = ({ navigation  }) => {
    return {
      title: 'Home',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
      },
      header: (props) => <Header title={'Корзина'} nav={ navigation } {...props} />,
    };
  };
  // Lifecycle methods
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        didFinishInitialAnimation: true,
      });
    });
  }
  generateKey = () => {
    return `${ new Date().getTime() }`;
  }
    oldPrice = (iOldPrice) =>{
        var view = '';
        if(iOldPrice == 0){
          view = <Text></Text>
        }
        else{
          view = <Text style={{ fontSize:15, justifyContent: 'flex-end', color: '#ccc', textDecorationLine: 'line-through'}}> {parseFloat(iOldPrice).toFixed(2)+ " " + this.props.options.chCurrencyCode}  </Text>
        }
        return view;
    }
    priceIng(ing, chPrice, optionsPrice)
    {
      var priceIng = 0;
      if(ing.length > 0){ 
        ing.map(i => (
          priceIng = priceIng + Number(i.chPriceChange)
        )) 
      }
      priceIng = Number(priceIng) + Number(chPrice) + Number(optionsPrice);
      return priceIng; 
    }
    allPriceCart() {
      var allPriceCart = 0;
      
      this.props.cart.map(item =>(
        item.ing ?
        allPriceCart = allPriceCart + this.priceIng(item.ing, item.chPrice, item.optionsPrice)
        :
        allPriceCart = allPriceCart + Number(item.chPrice) + Number(item.optionsPrice)
        )
      )
      this.state.allPriceCart = allPriceCart;
      
      return parseFloat(allPriceCart).toFixed(2)+" " + this.props.options.chCurrencyCode;
    }
    render() {
      //console.log("cart.js"); 
      console.log(this.props.cart);   
      var {navigate} = this.props.navigation;
      var {params} = this.props.navigation.state;
      return (
          <ImageBackground
              style={{ flex: 1, width: width, height: 170, }}
              imageStyle={{ resizeMode: 'stretch' }}
              source={require('../assets/main.png')}
          >
            {
              this.state.didFinishInitialAnimation === false ?
              <ActivityIndicator size="large" color="#583286" />
                :
              this.props.cart.length >  0 ? 
              <View style={{ 
                width: 320,
                margin: 20,

                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderRadius: 10,
                elevation: 3,
                backgroundColor: '#fff',
                marginBottom: 50,
              }}>
                <Text style={styles.titleStyle}>Ваши товары</Text>
                <ScrollView>
                {
                      this.props.cart.map((item, index) => (
                  
                        <Card
                            key={this.generateKey()}
                            iProduct={item.iProduct}
                            idInCart={item.idInCart}   
                            iCategories={item.iCategories}                    
                            chName={item.chName}
                            chMainImage={item.chMainImage}
                            chPrice={item.chPrice}
                            chOldPrice={item.chOldPrice}
                            optionsId={item.optionsId}
                            optionsName={item.optionsName}
                            optionsPrice={item.optionsPrice}
                            ing={item.ing}
                            tegsProduct={item.tegsProduct}
                            nav={this.props.navigation}
                            index={index}
                            
                        />
                      )
                    )
                  }
                  <View style={{ marginTop: 10,}}/>
                  <View style={styles.viewStringPrice}>
                    <Text style={{fontSize: 14, fontFamily: 'Roboto', color: '#828282',}}>Стоимость товаров:</Text>
                    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end", }}>
                      <Text style={{}}>
                            {this.allPriceCart()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.viewStringPrice}>
                        <View style={{flexDirection: 'column',}}>
                          <Text style={{fontSize: 14, fontFamily: 'Roboto', color: '#828282',}} >Доставка: </Text>
                          <Text style={{
                            fontFamily: 'Roboto',
                            fontSize: 10,
                            lineHeight: 12,
                            color: '#BDBDBD',
                          }}>(при заказе от 20 руб. доставка бесплатно) </Text>
                        </View>
                    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
                      <Text style={{fontSize: 14, fontFamily: 'Roboto',}}> 0 </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1,  flexDirection: 'row', alignItems: 'flex-start',
                                  justifyContent: 'flex-start',
                                  marginLeft: 15,  marginRight: 15,  marginBottom: 10,
                                }}>
                        <Text style={{color: '#6A3DA1', fontWeight: '600', fontSize: 16, fontFamily: 'Roboto'}}>К оплате: </Text>
                        <View 
                          style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "flex-end", 
                          }}>
                          <Text style={{color: '#6A3DA1', fontWeight: '600', fontSize: 16, fontFamily: 'Roboto'}}>
                            {this.allPriceCart()}
                          </Text>
                        </View>
                  </View>
                  <TouchableOpacity style={{
                      marginTop: 10, 
                      alignItems: 'center',
                      marginBottom: 20,
                      justifyContent: 'center', }}
                      /*onPress={() => alert('Checkout')}*/
                      onPress={() => this.props.navigation.navigate('Checkout')}
                      >
                      <Text style = {styles.buttonText}>
                        ОФОРМИТЬ ЗАКАЗ
                      </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

               :

  
               <EmptyCart 
                    nav={this.props.navigation}
                />
                
    
            }
            
    
        </ImageBackground>

        

        );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    
    fontFamily: 'OswaldMedium',
    fontSize: 12,
},
  img:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    opacity:.85,
  },
  viewStringPrice:{
    flex: 1,  flexDirection: 'row', alignItems: 'flex-start',
                                  justifyContent: 'flex-start', 
                                  marginLeft: 15,  marginRight: 15,  marginBottom: 10,
  },
  titleStyle:
  {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: '#6A3DA1',
    borderRadius: 10,
    color: '#F2F2F2',
    height: 40,
    paddingLeft: 20,
    paddingTop: 7,
  }


  
});
  
//export default connect(mapStateToProps)(Home);

export default connect (
  state => ({
    cart: state.CartReducer,
    banners: state.BannerReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    options: state.OptionReducer,
  }),
  dispatch => ({
    addCart: (index) => {
        dispatch({ type: 'ADD_CART', payload: index})
    },
    /*
    onAddCategory: (categoryData) => {
      dispatch({ type: 'ADD_CATEGORY', payload: categoryData});
    },
    onEditRootCategory: (categoryData) => {
      dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
    },    
    onEditCategory: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },*/
  })
)(Cart);