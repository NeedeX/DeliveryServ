import React from 'react';
import {  StyleSheet, TextInput, Text, View, Button, InteractionManager, ActivityIndicator, TouchableHighlight, Image, ScrollView, ImageBackground} from 'react-native';
import { connect } from 'react-redux';
import Header from './components/Header';


class AddAddress extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            chCity: 'Витебск',
            chStreet: '',
            chNumHome: '',
            chHousing: '',
            chEntrance: '', // подъезд
            chFloor: '', // этаж
            chApartment: '',
        }
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
        this.setState({
            didFinishInitialAnimation: true,
        });
        });
    }
    static navigationOptions = ({ navigation  }) => {
        return {
          title: 'Home',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
          header: (props) => <Header title={'Мои адреса'} nav={ navigation } {...props} />,
        };
    };
    focusNextField(id) {
        this.inputs[id].focus();
      }
    generateKey = () => {
        return `${ new Date().getTime() }`;
    }

    addAddressDB()
    {
        val = {
            chCity: this.state.chCity,
            chStreet: this.state.chStreet,
            chNumHome: this.state.chNumHome,
            chHousing: this.state.chHousing,
            chEntrance: this.state.chEntrance,
            chFloor: this.state.chFloor,
            chApartment: this.state.chApartment,
            UIDGoogleUser: this.props.user[0]._user.uid, // пользователя приложения, выданный гуглом
            UIDClient: this.props.options.UIDClient,
        };

        console.log(val);

        fetch('http://mircoffee.by/deliveryserv/app/InsertAddress.php', 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': "gzip, deflate",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
    
                chCity: this.state.chCity,
                chStreet: this.state.chStreet,
                chNumHome: this.state.chNumHome,
                chHousing: this.state.chHousing,
                chEntrance: this.state.chEntrance,
                chFloor: this.state.chFloor,
                chApartment: this.state.chApartment,
                UIDGoogleUser: this.props.user[0]._user.uid,
                UIDClient: this.props.options.UIDClient,
            })
   
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson);
            
            // Отображение ответного сообщения, поступающего с сервера после вставки записей.
            val = {
                    key: this.generateKey(), 
                    idAddress: responseJson,
                    chCity: this.state.chCity,
                    chStreet: this.state.chStreet,
                    chNumHome: this.state.chNumHome,
                    chHousing: this.state.chHousing,
                    chEntrance: this.state.chEntrance,
                    chApartment: this.state.chApartment,
                    chFloor: this.state.chFloor,
                    UIDGoogleUser: this.props.user[0]._user.uid,
                    UIDClient: this.props.options.UIDClient,

                };
                console.log(val);
                
            this.props.addAddress(val);
            console.log(this.props.addresses);
            
            //console.log(this.props.addresses);
            this.props.navigation.navigate('Addresses', {animation: 'SlideFromLeft', animationDuration: 500 });
            //this.props.clearCart();
            /*
            this.props.cart.map(item => (
                this.props.cart.filter(rentChildrenPrint => rentChildrenPrint.iProduct ===  item.iProduct)
            ));
                */
               //this.props.navigation.navigate('CompletedOrder', {animation: 'SlideFromLeft', animationDuration: 500 });
   
            })
            .catch((error) => {
                 console.error(error);
            });
            
            //this.props.clearOrder();
            
            //this.props.onAddOrder(val);
            //console.log(this.props.order);
            // очистка корзины
            //this.props.clearCart();
   
            //this.props.navigation.navigate('CompletedOrder', {animation: 'SlideFromLeft', animationDuration: 500 } );
        
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
            justifyContent: 'center', 
            alignItems: 'center',
        }} />)
    }


    render() {
        var {navigate} = this.props.navigation;
        var {params} = this.props.navigation.state;
        return (
        <View style={styles.container}> 
            <ScrollView>
            {
            this.state.didFinishInitialAnimation === false ?
            <ActivityIndicator size="large" color="#583286" />
            :
            <View>
                <Text style={styles.textTitleStyle}>Добавить новый адрес</Text>
                <View style={styles.viewCardStyle}>
                    <Text style={styles.text}>{this.state.chDeliveryAddressText}</Text>
                        <View style={{ flex: 1 }}>
                            <TextInput style={styles.textInputStyle}
                                underlineColorAndroid = "transparent"
                                placeholder = "Город"
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                blurOnSubmit={ false }
                                clearButtonMode={'while-editing'}
                                onSubmitEditing={() => { this.focusNextField('Улица'); }}
                                ref={ input => { this.inputs['Город'] = input;  }}
                                onChangeText={(chCity) => this.setState({chCity})}
                                value={this.state.chCity}/>
                            {this.divider()}
                            <TextInput style={styles.textInputStyle}
                                underlineColorAndroid = "transparent"
                                placeholder = "Улица"
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                blurOnSubmit={ false }
                                onSubmitEditing={() => {
                                    this.focusNextField('Дом');
                                  }}
                                ref={ input => {
                                    this.inputs['Улица'] = input;
                                  }}
                                onChangeText={(chStreet) => this.setState({chStreet})}
                                value={this.state.chStreet}/>
                            {this.divider()}
                            <TextInput style={styles.textInputStyle}
                                underlineColorAndroid = "transparent"
                                placeholder = "Дом"
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                keyboardType = 'decimal-pad'
                                blurOnSubmit={ false }
                                onSubmitEditing={() => {
                                    this.focusNextField('Корпус');
                                  }}
                                ref={ input => {
                                    this.inputs['Дом'] = input;
                                  }}
                                onChangeText={(chNumHome) => this.setState({chNumHome})}
                                value={this.state.chNumHome}/>
                            {this.divider()}
                            <TextInput style={styles.textInputStyle}
                                underlineColorAndroid = "transparent"
                                placeholder = "Корпус"
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                keyboardType = 'numeric'
                                blurOnSubmit={ false }
                                onSubmitEditing={() => {
                                    this.focusNextField('Подъезд');
                                  }}
                                ref={ input => {
                                    this.inputs['Корпус'] = input;
                                  }}
                                onChangeText={(chHousing) => this.setState({chHousing})}
                                value={this.state.chHousing}/>
                            {this.divider()}
                            <TextInput style={styles.textInputStyle}
                                underlineColorAndroid = "transparent"
                                placeholder = "Подъезд"
                                keyboardType = 'numeric'
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                blurOnSubmit={ false }
                                onSubmitEditing={() => {
                                    this.focusNextField('Этаж');
                                  }}
                                ref={ input => {
                                    this.inputs['Подъезд'] = input;
                                  }}
                                onChangeText={(chEntrance) => this.setState({chEntrance})}
                                value={this.state.chEntrance}/>
                            {this.divider()}
                            <TextInput style={styles.textInputStyle}
                                underlineColorAndroid = "transparent"
                                placeholder = "Этаж"
                                keyboardType = 'numeric'
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                blurOnSubmit={ false }
                                onSubmitEditing={() => {
                                    this.focusNextField('Кв');
                                  }}
                                ref={ input => {
                                    this.inputs['Этаж'] = input;
                                  }}
                                onChangeText={(chFloor) => this.setState({chFloor})}
                                value={this.state.chFloor}/>
                            {this.divider()}
                            <TextInput style={styles.textInputStyle}
                                underlineColorAndroid = "transparent"
                                placeholder = "Кв"
                                
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                blurOnSubmit={ false }
                                ref={ input => {
                                    this.inputs['Кв'] = input;
                                  }}
                                onChangeText={(chApartment) => this.setState({chApartment})}
                                value={this.state.chApartment}/>                 
        
                        </View>
                    </View>
                <View
                style={{
                    flex: 1,
                    
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: 20,
                    paddingTop: 20,
                  }}>
                    <TouchableHighlight  underlayColor='rgba(255,255,255,0.1)'
                      style={{elevation: 3, width: 150,}}
                      onPress={() =>  this.addAddressDB() }>
                      <Text style = {styles.buttonText}>
                         ДОБАВИТЬ
                      </Text>
                    </TouchableHighlight>
                </View>
            </View>
            }
                
                
            </ScrollView>
          

        </View>
        );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textTitleStyle:{
        marginTop: 10,
        fontSize: 14,
        fontFamily: 'Roboto',
        color: '#4E4E4E',
        fontWeight: "600",
        lineHeight: 24,
        
        textAlign: 'center',
    },
    viewCardStyle:{
        flex:1,
        elevation: 2,  
        borderRadius: 10, 
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#fff',
        marginTop: 10,
        width: 300,
    },
    textInputStyle: {
        height: 45, 
        borderWidth: 0, 
        color: '#4E4E4E',
        fontFamily: 'Roboto',
        fontWeight: "400",
        flex: 1, 
        marginLeft: 10, 
        paddingBottom: 0, 
        paddingTop: 0, 
        marginRight: 10,
        marginBottom: 0
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
        width: 150,
        fontFamily: 'OswaldMedium',
        fontSize: 12,
        elevation: 5,
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
    addresses: state.AddressReducer,
    options: state.OptionReducer,
  }),
  dispatch => ({
      
    addAddress: (index) => {
        dispatch({ type: 'ADD_ADDRESS', payload: index})
    },
    /*
    onAddOrder: (orderData) => {
        dispatch({ type: 'ADD_ORDER', payload: orderData});
    },
    clearCart: (orderData) => {
      dispatch({ type: 'CLEAR_CART', payload: orderData});
    },
    clearOrder: (orderData) => {
        dispatch({ type: 'CLEAR_ORDER', payload: orderData});
    }
    /*
    onEditRootCategory: (categoryData) => {
      dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
    },    
    onEditCategory: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },*/
  })
)(AddAddress);


