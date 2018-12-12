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
        this.state = {
            chFIO: params.chFIO,
            chPhone: params.chPhone,
            chDeliveryAddress: params.chDeliveryAddress,

            chCity: params.chCity,
            chStreet: params.chStreet,
            chNumHome: params.chNumHome,
            chHousing: params.chHousing,
            chEntrance: params.chEntrance,
            chFloor: params.chFloor,
            chApartment: params.chApartment,
            chTypeDeliveryTime: params.chTypeDeliveryTime, //  время доставки
            chDeliveryTime: params.chDeliveryTime,
            chSumma: params.chSumma, // сумма с которой дать сдачу
            chPay: params.chPay, // метод оплаты
            chConfirm: params.chConfirm, // метод подътверждения
            chComments: params.chComments,
            chDeliveryAddress: params.chDeliveryAddress,
            chPayDescription: params.chPayDescription, // текст метода доставки
            chConfirmText: params.chConfirmText,
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
      return parseFloat(allPriceCart).toFixed(2) +" " + this.props.options.chCurrencyCode;
    }
    validePurchase()
    {
        
        
        var val ={
            UID: this.props.user.length === 0 ? null : this.props.user[0]._user.uid,
            chFIO: this.state.chFIO,
                chPhone: this.state.chPhone,
                chCity: this.state.chCity,
                chStreet: this.state.chStreet,
                chNumHome: this.state.chNumHome,
                chHousing: this.state.chHousing,
                chEntrance: this.state.chEntrance,
                chFloor: this.state.chFloor,
                chApartment: this.state.chApartment,
                chDeliveryAddress: this.state.chDeliveryAddress,
                chTypeDeliveryTime: this.state.chTypeDeliveryTime, //  время доставки
                chDeliveryTime: this.state.chDeliveryTime,
                chSumma: this.state.chSumma,
                chPay: this.state.chPay, // метод оплаты
                chPayDescription: this.state.chPayDescription, // текст метода доставки
                chConfirm: this.state.chConfirm, // метод подътверждения
                chConfirmText: this.state.chConfirmText,
                chComments: this.state.chComments,
                allPriceCart: this.state.allPriceCart,
                cart: this.props.cart,
        }
        console.log(val);
        
        
        //console.log(this.state);
        fetch('http://mircoffee.by/deliveryserv/app/InsertOrder.php', 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': "gzip, deflate",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UID: this.props.user.length === 0 ? null : this.props.user[0]._user.uid,
                chFIO: this.state.chFIO,
                chPhone: this.state.chPhone,
                chCity: this.state.chCity,
                chStreet: this.state.chStreet,
                chNumHome: this.state.chNumHome,
                chHousing: this.state.chHousing,
                chEntrance: this.state.chEntrance,
                chFloor: this.state.chFloor,
                chApartment: this.state.chApartment,
                chDeliveryAddress: this.state.chDeliveryAddress,
                chTypeDeliveryTime: this.state.chTypeDeliveryTime, //  время доставки
                chDeliveryTime: this.state.chDeliveryTime,
                chSumma: this.state.chSumma,
                chPay: this.state.chPay, // метод оплаты
                chPayDescription: this.state.chPayDescription, // текст метода доставки
                chConfirm: this.state.chConfirm, // метод подътверждения
                chConfirmText: this.state.chConfirmText,
                chComments: this.state.chComments,
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
                    chFIO: this.state.chFIO,
                    chPhone: this.state.chPhone,
                    chCity: this.state.chCity,
                    chStreet: this.state.chStreet,
                    chNumHome: this.state.chNumHome,
                    chHousing: this.state.chHousing,
                    chEntrance: this.state.chEntrance,
                    chFloor: this.state.chFloor,
                    chApartment: this.state.chApartment,
                    chDeliveryAddress: this.state.chDeliveryAddress,
                    chTypeDeliveryTime: this.state.chTypeDeliveryTime, //  время доставки
                    chDeliveryTime: this.state.chDeliveryTime,
                    chSumma: this.state.chSumma,
                    chPay: this.state.chPay, // метод оплаты
                    chPayDescription: this.state.chPayDescription, // текст метода доставки
                    chConfirm: this.state.chConfirm, // метод подътверждения
                    chConfirmText: this.state.chConfirmText,
                    chComments: this.state.chComments,
                    cart: this.props.cart,
            };
            //this.props.onAddOrder(val);
            //console.log(this.props.order);
            this.props.clearCart();
            /*
            this.props.cart.map(item => (
                this.props.cart.filter(rentChildrenPrint => rentChildrenPrint.iProduct ===  item.iProduct)
            ));
                */
            
            this.props.navigation.navigate('CompletedOrder', {animation: 'SlideFromLeft', animationDuration: 500 });
   
        })
        .catch((error) => {
             console.error(error);
        });
    }

    render() {
        if(this.state.index === 0)
        {
            this.props.navigation.navigate('Addresses', {animation: 'SlideFromLeft', animationDuration: 500 });
        }
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
            <View style={styles.viewStyleWrap}>
                <Text style={styles.titleStyle}>Ваши заказ</Text>
                <ScrollView >
                    <Text style={styles.textTitleStyle}> 1. Контактная информация </Text>
                    <Text style={styles.textTitleStyle2}>Имя</Text>
                        <Text style={styles.textStyleValue}>{params.chFIO}</Text>
                        <Text style={styles.textTitleStyle2}>Телефон</Text>
                        <Text style={styles.textStyleValue}>{params.chPhone}</Text>
                        <Text style={styles.textTitleStyle2}>Адрес</Text>
                        <Text style={styles.textStyleValue}>{params.chCity}, ул.{params.chStreet}, {params.chNumHome}{params.chHousing === '' ? '' : '/'}{params.chHousing}, подъезд {params.chEntrance}, кв.{params.chApartment}</Text>
                        <View
                            style={{  borderBottomColor: '#E4E4E4',
                                borderBottomWidth: 1, marginTop: 3, marginBottom: 3, }} />
                        <Text style={styles.textTitleStyle}>
                            2. Детали
                        </Text>
                        <Text style={styles.textTitleStyle2}>Время доставки</Text>
                        <Text style={styles.textStyleValue}>{params.chDeliveryTime === '' ? 'Как можно скорее' : params.chDeliveryTime}</Text>
                        <Text style={styles.textTitleStyle2}>Способ оплаты</Text>
                        <Text style={styles.textStyleValue}>{params.chPayDescription}</Text>
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
        width: 320,
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
    banners: state.BannerReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    order: state.OrderReducer,
    user: state.UserReducer,
    options: state.OptionReducer,
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