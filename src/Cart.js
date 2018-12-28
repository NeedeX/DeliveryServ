import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, InteractionManager, ActivityIndicator, ScrollView,TouchableOpacity, ImageBackground, Dimensions, Image} from 'react-native';
import { connect } from 'react-redux';

import Header from './components/Header';
import BGNoAuth from './components/BGNoAuth';
const { width } = Dimensions.get('window');

class Cart extends Component {
  constructor(props){
    super(props);
    this.state = {
      didFinishInitialAnimation: false,
      ingPrice: 0,
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
  componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.setState({ didFinishInitialAnimation: true, });
        });
  }
  renderIng(ingridientes){
    if(ingridientes && ingridientes.length > 0){
      ingridientes.map(i => (
        this.state.ingPrice = this.state.ingPrice + Number(i.chPriceChange)
      ))
      return ingridientes.map(i => (
        <View style={{flexDirection: 'row', marginLeft: 10, fontSize: 10,}}>
          <Text style={{fontSize: 10,}}>{i.chName}</Text>
          <Text style={{fontSize: 10,}}> +{parseFloat(i.chPriceChange).toFixed(2) +" " + this.props.customers.chCurrency}</Text>
        </View>
      ))
    }
    
  }
  oldPrice(iOldPrice)
    {
        var view = '';
        if(iOldPrice === "" || iOldPrice === undefined){
          view = <Text></Text>
        }
        else{
          view = <Text style={styles.textOldPriceStyle}> { parseFloat(iOldPrice).toFixed(2)+" " + this.props.customers.chCurrency} </Text>
        }
        return view;
    }
  renderCardInCart(){
    console.log("this.props.cart = ", this.props.cart);
    return(
      <View style={{ backgroundColor: '#fff', borderTopStartRadius: 10, borderTopEndRadius: 10,  height: 500, }}>
        <View style={styles.viewTextTitle}>
            <Text style={ styles.textTitle}>Ваши товары</Text>
          </View>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, borderTopEndRadius: 0, borderTopStartRadius: 0, width: width - 40,  elevation: 2, }}>
            <ScrollView style={{paddingBottom: 10,}}>
            {
              this.props.cart.map((i, index) => (
              <View style={{ marginBottom: 5, marginTop: 5,}}>
                <TouchableOpacity  key={index} underlayColor='rgba(255,255,255,0.1)'
                  style={{ borderRadius: 10, elevation: 1,}} 
                  onPress={() => this.props.navigation.navigate('ProductDetailView', { iProduct: i.iProduct, idInCart: i.idInCart, routeGoBack: 'inCart', iCategories: i.iCategories})}
                  >
                  <View style={{flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', flex: 1}}>
                    <View style={{ width: 80, alignItems: 'center', justifyContent:'center', padding:5, marginLeft: 5}}>
                      <Image
                        style={{width: 80, height: 80, zIndex: 0, }}
                        source={ i.chMainImage === "" ? require('../assets/noImage.jpg') : { uri: i.chMainImage }}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start',}}>
                      <Text style={styles.textNameStyle}>{i.chName}</Text>
                      <Text style={styles.texOptionStyle}>{i.optionsName} {parseFloat(Number(i.chPrice) + Number(i.optionsPrice)).toFixed(2) +" " + this.props.customers.chCurrency}</Text>
                      {this.renderIng(i.ing)}
                      <Text style={styles.textPriceStyle}> {parseFloat(Number(i.chPrice) + Number(i.optionsPrice) + Number(this.state.ingPrice)).toFixed(2) +" " + this.props.customers.chCurrency} </Text>
                                {this.oldPrice(i.chOldPrice)}
                    </View>
                    <View style={{justifyContent: 'flex-start', paddingTop: 10, paddingRight: 10,}}>
                      <TouchableOpacity underlayColor='rgba(255,255,255,0.1)'
                        onPress={() => { val = { key: i.key, idInCart: i.idInCart, iProduct: i.iProduct, } 
                        this.props.delCart(val); } }>
                        <Image style={{width: 25, height: 25}} source={require('../assets/iconDelInCart.png')}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              ))
            }
            </ScrollView>
          </View>
        </View>
        )
    }
    divider()
    {
        return(
        <View style={{
            flex: 1,
            borderBottomColor: '#E2E2E2',
            borderBottomWidth: 1,
            marginLeft: 10,
            marginRight: 10,
            justifyContent: 'center', alignItems: 'center',
        }} />)
    }
    render() {
        var {navigate} = this.props.navigation;
        return (
        <View style={styles.container}>
            <ImageBackground
            style={{ flex: 1, width: width, height: 170, marginTop:0, alignItems: 'center', justifyContent: 'flex-start'}}
            imageStyle={{ resizeMode: 'cover' }}
            source={require('../assets/main.png')}>
            {
                this.state.didFinishInitialAnimation === false ?
                <View style={{ alignItems: "center", justifyContent:'center'}}>
                    <View style={ [styles.circleIcone, { marginTop: 84, }] }>
                        <Image source={require('../assets/historyIcon.png')} style={ styles.imageIcon } />
                        <ActivityIndicator size="large" color="#583286" style={{marginTop: 50,}} />
                    </View>
                </View>
                :
                <View>
                {
                    this.props.cart.length >  0 ?
                    <View>
                        {this.renderCardInCart()}
                    </View>
                    :
                    <View style={{ alignItems: "center", justifyContent:'center'}}>
                        <Text style={ styles.textNoItems }>Прошлые заказы</Text>
                        <View style={ [styles.circleIcone, { marginTop: 40, }] }>
                            <Image source={require('../assets/historyIcon.png')} style={ styles.imageIcon } />
                        </View>
                    </View>
                }
                </View>
                
            }
            </ImageBackground>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    circleIcone:
    {
        backgroundColor: '#fff',
        elevation: 2,
        width: 124,
        height: 124,
        borderRadius: 70,
        marginTop: 20,
    },
    imageIcon:{ 
        zIndex: 1,
        width: 70,
        height: 64,
        marginTop: 35,
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 30,
    },
    textNoItems:{
        fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        color: '#FFFFFF',
        marginTop: 20,
    },
    viewTextTitle:{
        backgroundColor: '#fff',
        borderRadius: 10,
        width: width - 40,
        zIndex: 1000,
        
    },
    textTitle:{
        fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        backgroundColor: '#6A3DA1',
        borderRadius: 10,
        color: '#F2F2F2',
        height: 45,
        paddingLeft: 20,
        paddingTop: 10,
    },
    textDate:{
        fontFamily: 'Roboto',
        fontWeight: '400', 
        fontSize: 12,
        color:'#828282',
        textAlign: 'center',
    },
    textNameStyle: { 
      fontSize: 14, 
      fontWeight: "600", 
      color: '#F67695',
      marginLeft: 10,
      fontWeight: "600",
      fontFamily: 'OswaldMedium',
  },
    arrowBottom:
    {
        width: 15,
        height: 15,
        marginTop: 6,
        marginLeft: 0,
        marginRight: 3,
    },
    textPriceItem: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#4E4E4E',
    },
    texOptionStyle:{
      fontFamily: 'Roboto',
      color: '#828282',
      fontSize: 10,
      paddingLeft: 10,
  },
  textOldPriceStyle:{
    fontSize: 12, 
    justifyContent: 'flex-end', 
    color: '#BDBDBD', 
    textDecorationLine: 'line-through', 
    marginTop: 6, 
    marginLeft: 5
  },
  textPriceStyle: {
    marginTop: 3,
    fontSize: 14, 
    justifyContent: 'flex-end', 
    color: '#6A3DA1',
    fontWeight: "600",
    fontFamily: 'OswaldMedium',
  },

});
export default connect (
    state => ({
      cart: state.CartReducer,
      categories: state.CategoriesReducer,
      products: state.ProductsReducer,
      options: state.OptionReducer,
      customers: state.CustomersReducer,
      history: state.HistoryReducer,
      user: state.UserReducer,
    }),
    dispatch => ({
      delCart: (index) => {
        dispatch({ type: 'DELETE_CART', payload: index})
      }
    })
  )(Cart);