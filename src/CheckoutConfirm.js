import React from 'react';
import {  StyleSheet, Dimensions, Text, View, Button,InteractionManager,ActivityIndicator, TouchableOpacity, Image, ScrollView, ImageBackground} from 'react-native';
import { connect } from 'react-redux';
import Header from './components/Header';
import Card from './components/CardProductInConfirm';

const { width } = Dimensions.get('window');
class CheckoutConfirm extends React.Component {
    constructor(props){
        super(props);
        var {params} = this.props.navigation.state;
        console.log("this.props.order = ", this.props.order);
        this.state = {
            UIDClient: this.props.options.UIDClient,
            allPriceCart: 0,
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
          header: (props) => <Header title={'Оформить заказ'} nav={ navigation } {...props} />,
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
      //console.log(this.state.allPriceCart);
      return parseFloat(allPriceCart).toFixed(2) +" " + this.props.customers.chCurrency;
    }
    validePurchase(){
        var address = '';

        var val ={
            UIDClient: this.state.UIDClient,
            UIDGoogleUser: this.props.user.length === 0 ? null : this.props.user.uid, // UID пользователя приложения
            chFIO: this.props.order.chFIO,
            chPhone: this.props.order.chPhone,
            chCity: this.props.order.chCity,
            addressDeliveryInput: this.props.order.addressDeliveryInput,
            addressPickup: this.props.order.addressPickup,
            addressDelivery: this.props.order.addressDelivery,
            chTypeDeliveryText: this.props.order.chTypeDeliveryText,
            chDeliveryTime: this.props.order.chDeliveryTime, // время доставки
            chMethodPay:this.props.order.chMethodPay, /// метод оплаты 
            chPayGiveChange: this.props.order.chPayGiveChange, // сумма с которой надо дать сдачу
            chMethodConfirm: this.props.order.chMethodConfirm, /// метод подътверждения
            chComments: this.props.order.chComments, /// комментарий к заказу
            allPriceCart: this.state.allPriceCart,
            cart: this.props.cart,
        }
        console.log("val =", val);
        

        
        fetch('http://mircoffee.by/deliveryserv/app/InsertOrder.php', 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': "gzip, deflate",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UIDClient: this.state.UIDClient,
                UIDGoogleUser: this.props.user.length === 0 ? null : this.props.user._user.uid, // UID пользователя приложения
                chFIO: this.props.order.chFIO,
                chPhone: this.props.order.chPhone,
                chCity: this.props.order.chCity,
                addressDeliveryInput: this.props.order.addressDeliveryInput,
                addressPickup: this.props.order.addressPickup,
                addressDelivery: this.props.order.addressDelivery,
                chTypeDeliveryText: this.props.order.chTypeDeliveryText,
                chDeliveryTime: this.props.order.chDeliveryTime, // время доставки
                chMethodPay:this.props.order.chMethodPay, /// метод оплаты 
                chPayGiveChange: this.props.order.chPayGiveChange, // сумма с которой надо дать сдачу
                chMethodConfirm: this.props.order.chMethodConfirm, /// метод подътверждения
                chComments: this.props.order.chComments, /// комментарий к заказу
                allPriceCart: this.state.allPriceCart,
                cart: this.props.cart,
            })
   
        })
        .then((response) => response.json())
        .then((responseJson) => {
            // Отображение ответного сообщения, поступающего с сервера после вставки записей.
            val = {
                key: this.generateKey(), 
                idOrder: responseJson.toString(),
                UIDClient: this.state.UIDClient,
                UIDGoogleUser: this.props.user.length === 0 ? null : this.props.user._user.uid, // UID пользователя приложения
                chFIO: this.props.order.chFIO,
                chPhone: this.props.order.chPhone,
                chCity: this.props.order.chCity,
                addressDeliveryInput: this.props.order.addressDeliveryInput,
                addressPickup: this.props.order.addressPickup,
                addressDelivery: this.props.order.addressDelivery,
                chTypeDeliveryText: this.props.order.chTypeDeliveryText,
                chDeliveryTime: this.props.order.chDeliveryTime, // время доставки
                chMethodPay:this.props.order.chMethodPay, /// метод оплаты 
                chPayGiveChange: this.props.order.chPayGiveChange, // сумма с которой надо дать сдачу
                chMethodConfirm: this.props.order.chMethodConfirm, /// метод подътверждения
                chComments: this.props.order.chComments, /// комментарий к заказу
                allPriceCart: this.state.allPriceCart,
                cart: this.props.cart,
            };

            /*this.props.onAddOrder(val);
            console.log(this.props.order);
            */
           console.log("===>> ", val)
            this.props.clearCart();  
   
            this.props.navigation.navigate('CompletedOrder', {animation: 'SlideFromLeft', animationDuration: 500 });
   
        })
        .catch((error) => { console.error(error); });

    }
    selectedAddresOrPickup(){
        if(this.props.options.addressPickup !== undefined){
            const newLoc = this.props.locations.filter((el) => el.idLocations === this.props.options.addressPickup );
            console.log("newLoc = ", newLoc);
            
            this.setState({chTypeDeliveryText: ""})
        }
    }
    render() {
        if(this.state.index === 0)
        {
            this.props.navigation.navigate('Addresses', {animation: 'SlideFromLeft', animationDuration: 500 });
        }
        //console.log("options = ", this.props.options);
        
        var {navigate} = this.props.navigation;
        var {params} = this.props.navigation.state;
        return (
            <ImageBackground
            style={{ flex: 1, width: width, height: 170, marginTop:0, alignItems: 'center', justifyContent: 'flex-start'}}
            imageStyle={{ resizeMode: 'cover' }}
            source={require('../assets/main.png')}
            >
        {
            this.state.didFinishInitialAnimation === false ?
            <ActivityIndicator size="large" color="#583286" />
            :
            <View style={styles.viewStyleWrap}>
                <Text style={styles.titleStyle}>Ваши заказ</Text>
                <ScrollView >
                    <Text style={styles.textTitleStyle}> 1. Контактная информация </Text>
                    <Text style={styles.textTitleStyle2}>Имя</Text>
                        <Text style={styles.textStyleValue}>{this.props.order.chFIO}</Text>
                        <Text style={styles.textTitleStyle2}>Телефон</Text>
                        <Text style={styles.textStyleValue}>{this.props.order.chPhone}</Text>
                        <Text style={styles.textTitleStyle2}>{this.props.order.addressPickup !== 0  ? "Самовывоз" : "Доставка  "}</Text>
                        {
                            this.props.order.addressPickup !== 0 ?
                            <Text style={styles.textStyleValue}>{this.props.order.addressPickup}11</Text>
                            : null
                        }
                        {
                            this.props.order.addressDelivery !== 0 ?
                            <Text style={styles.textStyleValue}>{this.props.order.addressDelivery}22</Text>
                            : null
                        }
                        {
                            this.props.order.addressDeliveryInput !== 0 ?
                            <Text style={styles.textStyleValue}>{this.props.order.addressDeliveryInput}33</Text>
                            : null
                        }
                        <View
                            style={{  borderBottomColor: '#E4E4E4',
                                borderBottomWidth: 1, marginTop: 3, marginBottom: 3, }} />
                        <Text style={styles.textTitleStyle}>
                            2. Детали
                        </Text>
                        <Text style={styles.textTitleStyle2}>Время доставки</Text>
                        <Text style={styles.textStyleValue}>{this.props.order.chDeliveryTime}</Text>
                        
                        {/* <Text style={styles.textStyleValue}>{params.chDeliveryTime === '' ? 'Как можно скорее' : params.chDeliveryTime}</Text> */}

                        <Text style={styles.textTitleStyle2}>Способ оплаты</Text>
                        <View style={{ flexDirection: 'row'}}>
                            <Text style={styles.textStyleValue}>{this.props.order.chMethodPay}</Text>
                            <Text style={ [styles.textTitleStyle2, { marginTop: -2,}]}>{this.props.order.chPayGiveChange !== '' ? "(сдача с: "+this.props.order.chPayGiveChange+" "+this.props.customers.chCurrency+")" : null}</Text>
                        </View>
                        <Text style={styles.textTitleStyle2}>Способ подътверждения</Text>
                        <Text style={styles.textStyleValue}>{this.props.order.chMethodConfirm}</Text>
                        <Text style={styles.textTitleStyle2}>Комментарий к заказу</Text>
                        <Text style={styles.textStyleValue}>{this.props.order.chComments}</Text>

                        <View style={{ borderBottomColor: '#E4E4E4', borderBottomWidth: 1,
                                marginTop: 3, marginBottom: 3, }} />
                        {
                            this.props.cart.map((item, index) => (
                        
                            <Card
                            key={index}
                            id={item.id}
                            idInCart={item.idInCart}                       
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
                    <View style={{ flex: 1,  flexDirection: 'row', alignItems: 'flex-start',
                                    justifyContent: 'flex-start', margin: 15, marginBottom: 10, }}>
                        <Text style={{fontSize: 14, fontFamily: 'Roboto', color: '#828282',}}>Стоимость товаров:</Text>
                        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end", }}>
                            <Text style={{}}>
                              {this.allPriceCart()}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 1,  flexDirection: 'row', alignItems: 'flex-start',
                                    justifyContent: 'flex-start', 
                                    marginLeft: 15,  marginRight: 15,  marginBottom: 10,
                                  }}>
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
                        <View style={{ flex: 1,  flexDirection: 'row', alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                          
                        </View>
                        <TouchableOpacity
                            style={{
                                elevation: 3,
                                marginTop: 10, 
                                alignItems: 'center',
                                marginBottom: 10,
                                justifyContent: 'center',
                               
                                paddingTop: 20,
                                paddingBottom: 20,
                            }}
                            onPress={() => this.validePurchase()}>
                        <Text style = {styles.buttonText}>
                            ЗАКАЗАТЬ
                        </Text>
                        </TouchableOpacity>
                </ScrollView>
            </View>
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
    viewStyleWrap:{
        width: width-50,
        margin: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#fff',
        marginBottom: 50,
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
    },
    textTitleStyle:{
        marginLeft: 10,
        fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'left',
        color: '#4E4E4E',
    },
    textTitleStyle2:
    {
        marginLeft: 10,
        marginTop: 5,
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 24,
        textAlign: 'left',
        color: '#828282'
    },
    textStyleValue:
    {
        marginTop: -3,
        marginLeft: 10,
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'left',
        color: '#4E4E4E'
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
        width: 140,
        fontFamily: 'OswaldMedium',
        fontSize: 12,
    },

});
  
//export default connect(mapStateToProps)(Home);

export default connect (
  state => ({
    cart: state.CartReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    order: state.OrderReducer,
    user: state.UserReducer,
    options: state.OptionReducer,
    customers: state.CustomersReducer,
    locations: state.LocationReducer,
  }),
  dispatch => ({
    addCart: (index) => {
        dispatch({ type: 'ADD_CART', payload: index})
    },
    onAddOrder: (orderData) => {
        dispatch({ type: 'ADD_ORDER', payload: orderData});
    },
    clearCart: (orderData) => {
      dispatch({ type: 'CLEAR_CART', payload: orderData});
    },
    /*
    onEditRootCategory: (categoryData) => {
      dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
    },    
    onEditCategory: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },*/
  })
)(CheckoutConfirm);