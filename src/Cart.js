import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, InteractionManager, ActivityIndicator, ScrollView,TouchableOpacity, ImageBackground, Dimensions, Image} from 'react-native';
import { connect } from 'react-redux';
import Header from './components/Header';
import BGNoAuth from './components/BGNoAuth';
//const { width } = Dimensions.get('window');
//const { height } = Dimensions.get('window');
const {height, width} = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
class Cart extends Component {
  constructor(props){
    super(props);
    this.state = {
      didFinishInitialAnimation: false,
      ingPrice: 0,
      deliveryPrice: 0,
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
  ingPrice(ingridientes)
  {
    if(ingridientes && ingridientes.length > 0){
      price = 0;
      ingridientes.map(i => (
        price = price + Number(i.chPriceChange)
      ))
      return price;
    }
    else
    {
      return 0;
    }
  }
  renderIng(ingridientes){
    if(ingridientes && ingridientes.length > 0){
      /*
      ingridientes.map(i => (
        this.state.ingPrice = this.state.ingPrice + Number(i.chPriceChange)
      ))
        */
      return ingridientes.map((i, index) => (
        <View key={index} style={{flexDirection: 'row', marginLeft: 0, fontSize: 10,}}>
          <Text style={styles.texOptionStyle}>{i.chName}</Text>
          <Text style={styles.texOptionStyle}> +{parseFloat(i.chPriceChange).toFixed(2) +" " + this.props.customers.chCurrency}</Text>
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
  allPriceCart(priceDelivery) {
    var allPriceCart = 0;
     
    this.props.cart.map(item =>(
        item.ing ?
        allPriceCart = allPriceCart + this.priceIng(item.ing, item.chPrice, item.optionsPrice)
        :
        allPriceCart = allPriceCart + Number(item.chPrice) + Number(item.optionsPrice)
      )
    )
    
    //var delivery = allPriceCart <  Number(this.props.customers.iOrderFreeDelivery) ? allPriceCart +  Number(priceDelivery) : allPriceCart + 0;
    this.state.allPriceCart = allPriceCart;
    return parseFloat(allPriceCart).toFixed(2);
  }
  renderCardInCart(){
    //console.log("this.props.cart = ", this.props.cart);
    //console.log("this.props.categories = ", this.props.categories);

    //console.log(">> ", this.props.categories.find(x => x.iCategory ===  this.props.cart[0].iCategories).chName);
    
    return(
      <View style={{ backgroundColor: '#fff', borderTopStartRadius: 10, borderTopEndRadius: 10, height: height - 150 }}>
        <View style={styles.viewTextTitle}>
          <Text style={ [styles.textTitle, {color: "#"+this.props.customers.chColorTextBtn, backgroundColor: "#"+this.props.customers.chColorBtn}]}>Ваши товары</Text>
        </View>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, borderTopEndRadius: 0, borderTopStartRadius: 0, width: width - 40,  elevation: 2, }}>
            <ScrollView >
            {
              this.props.cart.map((i, index) => (
              <View key={index} style={{ marginBottom: 5, marginTop: 5,}}>
                <TouchableOpacity underlayColor='rgba(255,255,255,0.1)'
                  onPress={() => this.props.navigation.navigate('ProductDetailView', { iProduct: i.iProduct, idInCart: i.idInCart, routeGoBack: 'inCart', iCategories: i.iCategories})}
                  >
                  <View style={{flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', flex: 1}}>
                    <View style={{ width: 80, alignItems: 'center', justifyContent:'center', padding:5, marginLeft: 5}}>
                      <Image
                        style={{width: 80, height: 80, zIndex: 0, }}
                        source={ i.chMainImage === "" ? require('../assets/noImage.jpg') : { uri: i.chMainImage }}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start', }}>
                      <Text style={styles.textNameStyle}>{i.chName}</Text>
                      <Text style={styles.texOptionStyle}>
                        {this.props.categories.find(x => x.iCategory ===  i.iCategories).chName} {i.optionsName !== "" ? " "+i.optionsName+" ":"" } 
                        {parseFloat(Number(i.chPrice) + Number(i.optionsPrice)).toFixed(2) +" " + this.props.customers.chCurrency}
                      </Text>
                      
                      {this.renderIng(i.ing)}
                      <View style={{flexDirection: "row", marginTop: 8, marginLeft: 3,}}>
                      <Text style={[styles.textPriceStyle, {color: "#"+this.props.customers.chColorBtn}]}> 
                      {parseFloat(Number(i.chPrice) + Number(i.optionsPrice) + Number(this.ingPrice(i.ing))).toFixed(2) +" " + this.props.customers.chCurrency} 
                      </Text>
                      <Text style={[styles.textPriceStyle, {color: "#"+this.props.customers.chColorBtn}]}> 
                      {i.counter}
                      </Text>
                                {this.oldPrice(i.chOldPrice)}
                      </View>
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
                {
                  this.props.cart.length !== index+1 ?
                  this.divider() : null
                }
              </View>
              ))
            }
              <View style={{ alignItems: 'center', marginBottom: 10,}}>
              <Image style={{ width: width-60,}} 
                source={require('../assets/lineDotted.png')} />
              </View>
              
              <View style={styles.viewStringPrice}>
                <Text style={{fontSize: 14, fontFamily: 'Roboto', color: '#828282',}}>Стоимость товаров:</Text>
                <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end", }}>
                  <Text style={{}}>
                    {this.allPriceCart(0) + " " + this.props.customers.chCurrency}
                  </Text>
                </View>
              </View>
              {/*===============   */}
              <View style={styles.viewStringPrice}>
                <View style={{flexDirection: 'column',}}>
                  <Text style={{fontSize: 14, fontFamily: 'Roboto', color: '#828282',}} >Доставка: </Text>
                  <Text style={{
                            fontFamily: 'Roboto',
                            fontSize: 10,
                            lineHeight: 12,
                            color: '#BDBDBD',
                          }}>
                          (при заказе от {this.props.customers.iOrderFreeDelivery} {this.props.customers.chCurrency}. доставка бесплатно) 
                          </Text>
                        </View>
                    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
                      <Text style={{fontSize: 14, fontFamily: 'Roboto',}}>
       
                      {this.allPriceCart(0) > Number(this.props.customers.iOrderFreeDelivery) ? "Бесплатно" : parseFloat(this.props.customers.iPriceOfDelivery).toFixed(2) + " " + this.props.customers.chCurrency}
                      </Text> 
                    </View>
                  </View>
                  <View style={ styles.viewTotalPrice}>
                    <Text style={{color: "#"+this.props.customers.chColorBtn, fontWeight: '600', fontSize: 16, fontFamily: 'Roboto'}}>К оплате: </Text>
                        <View 
                          style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "flex-end", 
                          }}>
                          <Text style={{color: "#"+this.props.customers.chColorBtn, fontWeight: '600', fontSize: 16, fontFamily: 'Roboto'}}>
                    {this.allPriceCart(0) > Number(this.props.customers.iOrderFreeDelivery) ?  
                      this.allPriceCart(0)
                      : 
                      parseFloat(Number(this.allPriceCart(0)) + Number(this.props.customers.iPriceOfDelivery)).toFixed(2)} 
                    {" " +this.props.customers.chCurrency}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={ styles.btnConfirm}
                      onPress={() => this.props.navigation.navigate('Checkout')}
                      >
                      <Text style = {[styles.buttonText, {color: "#"+this.props.customers.chColorTextBtn, backgroundColor: "#"+this.props.customers.chColorBtn}]}>
                        ОФОРМИТЬ ЗАКАЗ
                      </Text>
                  </TouchableOpacity>
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
            borderBottomWidth: 0.5,
            marginLeft: 10,
            marginRight: 10,
            justifyContent: 'center', 
            alignItems: 'center',
        }} />)
    }
    render() {
        var {navigate} = this.props.navigation;
        return (
        <View style={styles.container}>
            {/*}
            <ImageBackground
            style={{ flex: 1, width: width, height: 170, marginTop:0, alignItems: 'center', justifyContent: 'flex-start'}}
            imageStyle={{ resizeMode: 'cover' }}
            source={require('../assets/main.png')}> */}
            <LinearGradient 
              colors={["#"+this.props.customers.chColorGR2, "#"+this.props.customers.chColorGR3]} 
              style={{ 
                width: width+20,
                height: 200,
                borderBottomRightRadius: 350,
                borderBottomLeftRadius: 350,
              }}>

          </LinearGradient>
          <View style={{ marginTop: -160,}}>
            {
                this.state.didFinishInitialAnimation === false ?
                <View style={{ alignItems: "center", justifyContent:'center',}}>
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
                    <View style={{ alignItems: "center", justifyContent:'center',}}>
                        <Text style={ styles.textNoItems }>Корзина пуста</Text>
                        <View style={ [styles.circleIcone, { marginTop: 40, }] }>
                            <Image source={require('../assets/historyIcon.png')} style={ styles.imageIcon } />
                        </View>
                    </View>
                }
                </View>
            }
            </View>
            {/* </ImageBackground> */}
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
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
  viewTotalPrice: { 
    flex: 1,  flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 15,  marginRight: 15,  marginBottom: 10,
  },
  viewStringPrice:{
    flex: 1,  flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'flex-start', 
    marginLeft: 15,  marginRight: 15,  marginBottom: 10,
  },
  btnConfirm: {
    marginTop: 10, 
    alignItems: 'center',
    marginBottom: 45,
    justifyContent: 'center', 
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
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
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
        borderRadius: 10,
        
        height: 45,
        paddingLeft: 20,
        paddingTop: 10,
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
  textNameStyle: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: '#F67695',
    marginLeft: 10,
    fontWeight: "600",
    fontFamily: 'OswaldMedium',
    
  },
  textPriceStyle: {
    marginTop: 3,
    fontSize: 14, 
    marginLeft: 5,
    fontWeight: "600",
    fontFamily: 'OswaldMedium',
    marginTop: 10,
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