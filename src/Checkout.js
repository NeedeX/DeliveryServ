import React from 'react';
import {  StyleSheet, TextInput, Text, View, Dimensions, TouchableHighlight, Image, ScrollView, ImageBackground,InteractionManager, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import AnimatedHideView from 'react-native-animated-hide-view';
import Header from './components/Header';
import { Sae } from 'react-native-textinput-effects';


const { width } = Dimensions.get('window');
class Checkout extends React.Component {
    constructor(props){
        super(props);
        var {params} = this.props.navigation.state;
        this.state = {
            chFIO: '',
            chPhone:  '',
            chDeliveryAddress: '',
            chCity: 'Витебск',
            chStreet: '',
            chNumHome: '',
            chHousing: '',
            chEntrance: '',
            chFloor: '', // этаж
            chApartment: '',
            chTypeDeliveryTime: 1, // выбор типа времени "как можно скорее или к определенному времени"
            chDeliveryTime: '', //"2016-05-15 12:00",   //  время доставки
            chSumma: '', // сумма с которой дать сдачу
            chPay: 1, // метод оплаты (Наличными курьеру)
            chPayDescription: 'Наличными курьеру',
            chConfirm: 2, // метод подътверждения  1- sms (по умолчанию)
            chConfirmText: 'SMS Сообщение',
            chComments: '',
            
            
            
            isChildVisible: false,
            isChildVisibleSumma: true,
            isViewInputAdressVisible: true,
            selectStyleDeliveryTime: styles.viewCardStyleNoTime,
            selectStyleMetodPay: styles.viewCardStyle,
            selectStyleDeliveryAdress: styles.viewCardStyle,
            selectStyleArrowAddress: styles.arrowRightSelectAddress,
            error: false,

            addressView: 'Выбрать из моих адресов',
            didFinishInitialAnimation: false,
        
        }
        //this.props.options.addressSelect = "";
        this.onSelectDeliveryAddress = this.onSelectDeliveryAddress.bind(this);
        this.onSelectTimeDelivery = this.onSelectTimeDelivery.bind(this);
        
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};


    }
    // Lifecycle methods
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
          header: (props) => <Header title={'Оформить заказ'} nav={ navigation } {...props} />,
        };
      };
    onGoFocus() {
        // when you call getElement method, the instance of native TextInput will returned.
        this.inputs['Имя'].focus();
        
    }

    getSelectAddress()
    {
        if(this.props.options.addressSelect !== undefined )
        {
            let result = this.props.addresses.filter(x => x.idAddress === this.props.options.addressSelect);

            var chHousing = result[0].chHousing ? "/"+result[0].chHousing : ""; // корпус
            var chEntrance = result[0].chEntrance ? ", подъезд "+result[0].chEntrance : ""; // подъезд
            var chFloor = result[0].chFloor ? ", этаж "+result[0].chFloor : ""; // этаж
            var chApartment = result[0].chApartment ? ", кв. "+result[0].chApartment : "" // кв
            var addressText = "г. "+result[0].chCity+", ул."+result[0].chStreet +" "+result[0].chNumHome+chHousing+chEntrance+chFloor+chApartment;
            this.state.chDeliveryAddress = addressText;
            var lengthaddress = addressText.length;

            if(lengthaddress > 37)
            {
                var length = addressText.length - 37;
                addressText = addressText.substr(0, addressText.length - length)+"...";
            }
            
            this.state.addressView = addressText;
            
            this.state.selectStyleArrowAddress = styles.arrowRightSelectAddress;
            if(this.state.isViewInputAdressVisible === true)
            {
                this.state.addressView = "Выбрать из моих адресов";
                this.state.selectStyleArrowAddress = styles.arrowRightNoSelectAddress;
                this.state.chDeliveryAddress = '';
            }
        }
        else
        {
            this.state.addressView = "Выбрать из моих адресов";
            this.state.selectStyleArrowAddress = styles.arrowRightNoSelectAddress;
            this.state.chDeliveryAddress = '';
        }
        return (
            <Text style={{color:'#4E4E4E'}}>{this.state.addressView}</Text>
        )
    }


    focusNextField(id) {
        this.inputs[id].focus();
    }
    generateKey = () => {
        return `${ new Date().getTime() }`;
    }

    onSelectDeliveryAddress(index, value){
        if(value === 2){
            this.setState({ isViewInputAdressVisible: true, });
            this.setState({ selectStyleDeliveryAdress: styles.viewCardStyle, });
            this.state.chDeliveryAddress = '';
        }
        if(value ===  1){
            this.setState({ selectStyleDeliveryAdress: styles.viewCardStyleDeliveryNoAdress, });
            this.setState({ isViewInputAdressVisible: false, });
            this.props.navigation.navigate('Addresses', {routeGoBack: 'Checkout',})                 
        }
        if(value ===  3)
        {
            this.setState({ selectStyleDeliveryAdress: styles.viewCardStyleDeliveryNoAdress, });
            this.setState({ isViewInputAdressVisible: false, });
            this.props.navigation.navigate('Addresses', {routeGoBack: 'Checkout',}) 
        }
        this.setState({ chDeliveryAddress: index,});
    }

    // время доставки
    onSelectTimeDelivery(index, value)
    {
        this.setState({
            chTypeDeliveryTime: value,
        });
        if(value === 2)
        {
            this.setState({ isChildVisible: true, });
            
            this.setState({ selectStyleDeliveryTime: styles.viewCardStyle, });
        }
        else
        {
            this.setState({ isChildVisible: false, });
            this.setState({chDeliveryTime: ''});
            this.setState({ selectStyleDeliveryTime: styles.viewCardStyleNoTime, });
        }
    }
    onSelectPay(index, value){
        this.setState({chPay: value,});
        if(value === 1)
        {
            this.setState({ chPayDescription: 'Наличными курьеру'});
            this.setState({ isChildVisibleSumma: true, });
            this.setState({ selectStyleMetodPay: styles.viewCardStyle, });
        }
        if(value === 2)
        {
            this.setState({ chPayDescription: 'Банковской картой'});
            this.setState({ isChildVisibleSumma: false, });
            this.setState({ selectStyleMetodPay: styles.viewCardStyleNoSumma, });
            this.setState({ chSumma: ''});
        }
        if(value === 3)
        {
            this.setState({ chPayDescription: 'Картой курьеру'});
            this.setState({ isChildVisibleSumma: false, });
            this.setState({ selectStyleMetodPay: styles.viewCardStyleNoSumma, });
            this.setState({ chSumma: ''});
        }
    }
    onSelectConfirm(index, value){
        this.setState({
            //chConfirmText: `Selected index: ${index} , value: ${value}`,
            chConfirm: value,
        });
        if(value === 1)
        {
            this.setState({
                chConfirmText: 'Звонок оператора',
            }); 
        }
        if(value === 2)
        {
            this.setState({
                chConfirmText: 'SMS cообщение',
            }); 
        }

    }
    validePurchase()
    {
/*
        if(this.state.chFIO.length <= 0){
            this.setState({errorName:"Вы не ввели имя"});
            this.focusNextField('Имя');
            this.onGoFocus();
        }
        else
        {
            this.setState({error: false})
            if(this.state.chPhone.length <= 0){
                this.setState({errorPhone:"Вы не ввели номер телефона"})
            }
            else{
                */
                var val = {
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
    
                }
                console.log(val);
                
                
                this.props.navigation.navigate('CheckoutConfirm', 
                {   chFIO: this.state.chFIO,
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
                });
      /*      }
        }*/
            // Отображение ответного сообщения, поступающего с сервера после вставки записей.
            /*
            val = {
                key: this.generateKey(), 
                //idOrder: responseJson.toString(),
                chFIO: this.state.chFIO,
                chPhone: this.state.chPhone,
                    chCity: this.state.chCity,
                    chStreet: this.state.chStreet,
                    chNumHome: this.state.chNumHome,
                    chHousing: this.state.chHousing,
                    chEntrance: this.state.chEntrance,
                    chApartment: this.state.chApartment,
                    chDeliveryAddress: this.state.chDeliveryAddress,
                    chTypeDeliveryTime: this.state.chTypeDeliveryTime, //  время доставки
                    chDeliveryTime: this.state.chDeliveryTime,
                    chSumma: this.state.chSumma,
                    chPay: this.state.chPay, // метод оплаты
                    chPayDescription: this.state.chPayDescription, // текст метода доставки
                    chConfirm: this.state.chConfirm, // метод подътверждения
                    chComments: this.state.chComments,
                    cart: this.props.cart,
            };
            console.log(val);
            */
            //this.props.clearOrder();
            
            //this.props.onAddOrder(val);
            //console.log(this.props.order);
            // очистка корзины
            //this.props.clearCart();
   
            //this.props.navigation.navigate('CompletedOrder', {animation: 'SlideFromLeft', animationDuration: 500 } );
        
    }

    validateName(text)
    {
        let reg = /^[A-zА-яЁё]+$/i ;
        if(reg.test(text) === false)
        {
            //console.log("Имя должно состоять только из букв");
            this.setState({chFIO:text})
            this.setState({errorName:"Имя должно состоять только из букв"})
            return false;
        }
        else {
            this.setState({chFIO:text})
            //console.log("Имя is Correct");
            this.setState({errorName: ''})
        }
    }
    validatePhone(text)
    {
        //console.log(text);
        let reg = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
        if(reg.test(text) === false)
        {
            //console.log("Не верный номер телефона");
            this.setState({chPhone:text})
            this.setState({errorPhone:"Не верный номер телефона"})
            return false;
        }
        else {
            this.setState({chPhone:text})
            //console.log("номер is Correct");
            this.setState({errorPhone: ''})
        }
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
        if(this.state.index === 0)
        {
            this.props.navigation.navigate('Addresses', {animation: 'SlideFromLeft', animationDuration: 500 });
        }
        var {navigate} = this.props.navigation;
        var {params} = this.props.navigation.state;
        
        return (
        <View style={{backgroundColor: '#F3F3F3'}}> 
        {      
            this.state.didFinishInitialAnimation === false ?
            <ActivityIndicator size="large" color="#583286" />
            :
            <ScrollView>
                <Text style={styles.textTitleStyle}>1. Контактная информация</Text>
                <View style={styles.viewCardStyle}>
                    <View style={{ flex: 1 }}>
    
                         <Sae
                            label={'Имя'}
                            autoFocus
                            // TextInput props
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            blurOnSubmit={ false }
                            onSubmitEditing={() => {
                                this.focusNextField('Телефон');
                              }}
                            ref={ input => {
                                this.inputs['Имя'] = input;
                              }}
                            style={styles.textInputStyle}
                            onChangeText={(chFIO) => this.setState({chFIO: chFIO}) }
                        />
                        {this.divider()}
                        <Sae
                            label={'Телефон'}
                            style={styles.textInputStyle}
                            // TextInput props
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            blurOnSubmit={ false }
                            onSubmitEditing={() => {
                                this.focusNextField('Город');
                              }}
                            ref={ input => {
                                this.inputs['Телефон'] = input;
                              }}
                            onChangeText={ (chPhone) => this.validatePhone(chPhone) }
                          
                        />


                        
                    </View>
                    
                </View>
                <Text style={styles.textTitleStyle}>2. Адрес доставки </Text>
                <View style={this.state.selectStyleDeliveryAdress}>
                    
                    {/*Адрес доставки*/}
                    <RadioGroup 
                        selectedIndex={1}
                        color='#6A3DA1'
 
                        onSelect = {(index, value) => this.onSelectDeliveryAddress(index, value)} >
                        <RadioButton value={3}>
                            <View>
                                <Text style={{color:'#4E4E4E'}}>Самовывоз</Text>
                            </View>
                        </RadioButton>
                        <RadioButton value={1}>
                            <View style={styles.arrowRightView}>
                                {this.getSelectAddress()}
                                <Image
                                style={this.state.selectStyleArrowAddress} 
                                source={require('../assets/arrowRight.png')} />
                            </View>
                        </RadioButton>
                        <RadioButton value={2} style={{  marginBottom: 15, }}>
                            <View style={styles.arrowRightView}>
                                <Text style={{color:'#4E4E4E'}}>Ввести адрес вручную</Text>
                                <Image
                                style={styles.arrowBottom} 
                                source={ !this.state.isViewInputAdressVisible ? require('../assets/arrowBottom.png') : require('../assets/arrowTop.png')} 
                                />
                            </View>
                        </RadioButton>

                    </RadioGroup>
                    <AnimatedHideView
                        visible={this.state.isViewInputAdressVisible}
                        style={{ padding: 0, }}
                        duration={200}
                        >
                        <View style={{ flex: 1 }}>
                            <TextInput style={styles.textInputStyle}
                                underlineColorAndroid = "transparent"
                                placeholder = "Город"
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                blurOnSubmit={ false }
                                onSubmitEditing={() => {
                                    this.focusNextField('Улица');
                                  }}
                                ref={ input => {
                                    this.inputs['Город'] = input;
                                  }}
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
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                blurOnSubmit={ false }
                                onSubmitEditing={() => {
                                    this.focusNextField('Квартира');
                                  }}
                                ref={ input => {
                                    this.inputs['Этаж'] = input;
                                  }}
                                onChangeText={(chFloor) => this.setState({chFloor})}
                                value={this.state.chFloor}/>
                            {this.divider()}
                            <TextInput style={styles.textInputStyle}
                                underlineColorAndroid = "transparent"
                                placeholder = "Квартира"
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                blurOnSubmit={ false }
                                onChangeText={(chApartment) => this.setState({chApartment})}
                                value={this.state.chApartment}/>                 
        
                        </View>
                    </AnimatedHideView> 
                </View>
                <Text style={styles.textTitleStyle}>3. Время доставки </Text>
                <View style={this.state.selectStyleDeliveryTime}>
                    {/* время доставки*/}
                    <RadioGroup 
                        selectedIndex={0}
                        color='#6A3DA1'
                        
                        onSelect = {(index, value) => this.onSelectTimeDelivery(index, value)} >
                        {/* как можно скорее */}
                        <RadioButton value={1}>
                            <Text style={styles.textStyle}>Как можно скорее</Text>
                        </RadioButton>
                        {/* указать время */}
                        <RadioButton value={2}>
                            
                            <View style={styles.arrowRightView}>
                                <Text style={styles.textStyle}>Ко времени</Text>
                                <Image
                                style={styles.arrowBottom} 
                                source={require('../assets/arrowBottom.png')} />
                            </View>
                        </RadioButton>

                    </RadioGroup>
                    <AnimatedHideView
                        visible={this.state.isChildVisible}
                        style={{ padding: 0, }}
                        duration={200}
                        >
                        <View>
                        <DatePicker
                            style={{width: 180,}}
                            date={this.state.chDeliveryTime}
                            androidMode="spinner"
                            mode="datetime"
                            placeholder="Выберите время"
                            format="YYYY-MM-DD H:mm"
                            minDate="2018-05-01"
                            maxDate="2020-12-31"
                            showIcon={false}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 10,
                                borderRadius: 5,
                            }
                            // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {this.setState({chDeliveryTime: date})}}
                        />
                        </View>
                    </AnimatedHideView>
                    
                    <Text style={styles.text}>{this.state.timeDeliveryText}</Text>
                </View>
                <Text style={styles.textTitleStyle}>4. Способ оплаты </Text>
                <View style={this.state.selectStyleMetodPay}>
                    
                    <RadioGroup 
                        selectedIndex={1}
                        color='#6A3DA1'
                        
                        onSelect = {(index, value) => this.onSelectPay(index, value)} >
                        
                        {/* <RadioButton value={2}>
                            <Text>Банковской картой</Text>
                        </RadioButton> */}
                        <RadioButton value={3}>
                            <Text style={styles.textStyle}>Картой курьеру</Text>
                        </RadioButton>
                        <RadioButton value={1}>
                            <Text style={styles.textStyle}>Наличными курьеру</Text>
                        </RadioButton>
                    </RadioGroup>
                    <AnimatedHideView
                        visible={this.state.isChildVisibleSumma}
                        style={{ padding: 0, }}
                        duration={200}
                        >

                            {this.divider()}
                            <TextInput style={styles.textInputStyle}
                                    underlineColorAndroid = "transparent"
                                    placeholder = "Укажите с какой суммы потребуется сдача"
                                    placeholderTextColor = "#828282"
                                    autoCapitalize = "none"
                                    onChangeText={(chSumma) => this.setState({chSumma})}
                                    value={this.state.chSumma}/> 
                        
                    </AnimatedHideView>
                </View>
                <Text style={styles.textTitleStyle}>5. Подтверждение заказа</Text>
                <View style={styles.viewCardStyle}>
                    
                    <RadioGroup 
                        selectedIndex={1}
                        color='#6A3DA1'
                        onSelect = {(index, value) => this.onSelectConfirm(index, value)} >
                       <RadioButton value={1}>
                            <Text style={styles.textStyle}>Звонок оператора</Text>
                        </RadioButton>
                        <RadioButton value={2}>
                            <Text style={styles.textStyle}>SMS cообщение</Text>
                        </RadioButton>
                    </RadioGroup>
                    <Text style={styles.text}>{/*this.state.chConfirmText*/}</Text>
                    {this.divider()}
                    <TextInput style={{
                        color: 'red',
                    }}
                        multiline = {true}
                        underlineColorAndroid = "transparent"
                        placeholder = "Комментарий к заказу"
                        placeholderTextColor = "#828282"
                        autoCapitalize = "none"
                        onChangeText={(chComments) => this.setState({chComments})}
                        value={this.state.chComments}/>
                </View>
                <View
                style={{
                    flex: 1,
                    
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: 20,
                    paddingTop: 20,
                  }}>
                  {/*
                    <TouchableHighlight
                      style={{elevation: 3}}
                      onPress={() => this.validePurchase()}>
                  */}


                    <TouchableHighlight  underlayColor='rgba(255,255,255,0.1)'
                      style={{elevation: 3, width: 150,}}
                      onPress={() =>  this.validePurchase() }>
                      <Text style = {styles.buttonText}>
                        ПРОДОЛЖИТЬ
                      </Text>
                    </TouchableHighlight>
                </View>
                
            </ScrollView>
          
            }
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
        paddingLeft: 30,
        lineHeight: 24,
    },
    textStyle: {
        color: '#4E4E4E',
    },
    viewCardStyle:{
        flex:1,
        elevation: 3,  
        borderRadius: 10, 
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#fff'
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
        marginBottom: 0,
        fontSize: 20,
    },
    textInputStyleMultiline:
    {
        height: 60, 
        borderWidth: 0, 
        color: '#4E4E4E',
        fontFamily: 'Roboto',
        fontWeight: "400",
        flex: 1, 
        marginLeft: 10, 
        paddingBottom: 0, 
        paddingTop: 0, 
        marginRight: 10,
        marginBottom: 0,
        textAlignVertical: 'top',
        
        
    },

    viewCardStyleNoSumma: //ok
    {
        flex:1,
        elevation: 3,  
        borderRadius: 10, 
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#fff',
        height: 80,
    },
    viewCardStyleNoTime:
    {
        flex:1,
        elevation: 3,  
        borderRadius: 10, 
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#fff',
        height: 80,
    },
    viewCardStyleDeliveryNoAdress: // ok
    {
        flex:1,
        elevation: 3,  
        borderRadius: 10, 
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#fff',
        height: 120,
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
    },
    arrowRightView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'space-between',
        width: 280,

    },
    arrowRightNoSelectAddress:{
        width: 15,
        height: 15,
        marginTop: 3,
        marginLeft: 90,
    },
    arrowRightSelectAddress: {
        width: 15,
        height: 15,
        marginTop: 3,
        marginLeft: 4,
    },
    arrowBottom:
    {
        width: 15,
        height: 15,
        marginTop: 6,
        marginLeft: 0,
        marginRight: 3,
    },
});
  
export default connect (
  state => ({
    addresses: state.AddressReducer,
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
    clearOrder: (orderData) => {
        dispatch({ type: 'CLEAR_ORDER', payload: orderData});
    },
    /*
    onEditRootCategory: (categoryData) => {
      dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
    },    
    onEditCategory: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },*/
  })
)(Checkout);