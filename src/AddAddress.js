import React from 'react';
import {  StyleSheet, TextInput, Text, View, Button, InteractionManager, ActivityIndicator, TouchableHighlight, Image, ScrollView, ImageBackground} from 'react-native';
import { connect } from 'react-redux';
import Header from './components/Header';
import { Sae } from 'react-native-textinput-effects';

class AddAddress extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            chCity: this.props.options.CITY,
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
            UIDGoogleUser: this.props.user.uid, // пользователя приложения, выданный гуглом
            UIDClient: this.props.options.UIDClient,
        };

        console.log("addAddressDB = ", val);

        
        fetch(this.props.options.URL + 'InsertAddress.php', 
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
                UIDGoogleUser: this.props.user.uid,
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
                    UIDGoogleUser: this.props.user.uid,
                    UIDClient: this.props.options.UIDClient,

                };
            console.log(val);
                
            this.props.addAddress(val);
            console.log(this.props.addresses);
            
            //console.log(this.props.addresses);
            this.props.navigation.navigate('Addresses', {animation: 'SlideFromLeft', animationDuration: 500 });

            })
            .catch((error) => {
                 console.error(error);
            });
            

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
                            <Sae
                                label={'Город'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                value={this.state.chCity}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onSubmitEditing={() => { this.focusNextField('Улица'); }}
                                ref={ input => { this.inputs['Город'] = input; }}
                                onChangeText={ (chCity) => this.setState({chCity: chCity}) }
                            /> 
                            {this.divider()}
                            <Sae
                                label={'Улица'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onSubmitEditing={() => { this.focusNextField('Дом'); }}
                                ref={ input => { this.inputs['Улица'] = input; }}
                                onChangeText={ (chStreet) => this.setState({chStreet: chStreet}) }
                            /> 
                            {this.divider()}
                            <Sae
                                label={'Дом'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onSubmitEditing={() => { this.focusNextField('Корпус'); }}
                                ref={ input => { this.inputs['Дом'] = input; }}
                                onChangeText={ (chNumHome) => this.setState({chNumHome: chNumHome}) }
                            /> 
                            {this.divider()}
                            <Sae
                                label={'Корпус'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onSubmitEditing={() => { this.focusNextField('Подъезд'); }}
                                ref={ input => { this.inputs['Корпус'] = input; }}
                                onChangeText={ (chHousing) => this.setState({chHousing: chHousing}) }
                            /> 
                            {this.divider()}
                            <Sae
                                label={'Подъезд'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onSubmitEditing={() => { this.focusNextField('Этаж'); }}
                                ref={ input => { this.inputs['Подъезд'] = input; }}
                                onChangeText={ (chEntrance) => this.setState({chEntrance: chEntrance}) }
                            /> 
                            {this.divider()}
                            <Sae
                                label={'Этаж'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onSubmitEditing={() => { this.focusNextField('Квартира'); }}
                                ref={ input => { this.inputs['Этаж'] = input; }}
                                onChangeText={ (chFloor) => this.setState({chFloor: chFloor}) }
                            /> 
                            {this.divider()}
                            <Sae
                                label={'Квартира'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onChangeText={ (chApartment) => this.setState({chApartment: chApartment}) }
                            />               
        
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
                      style={{elevation: 1, width: 150,}}
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
        elevation: 2,
    },
    textInputStyleNew: {
        height: 45, 
        borderWidth: 0, 
        flex: 1, 
        marginLeft: 10, 
        paddingBottom: 0, 
        paddingTop: 0, 
        marginRight: 10,
        marginBottom: 0,
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


