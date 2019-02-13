import React from 'react';
import {  StyleSheet, TextInput, Text, View, Dimensions, TouchableHighlight, Image, ScrollView, ImageBackground,InteractionManager, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import AnimatedHideView from 'react-native-animated-hide-view';
import Header from './components/Header';
import { Sae } from 'react-native-textinput-effects';
import moment  from 'moment';

const { width } = Dimensions.get('window');
class Checkout extends React.Component {
    constructor(props){
        super(props);
        var {params} = this.props.navigation.state;
        console.log("order = ", this.props.order);
        
        this.state = {
            chFIO: this.props.user.length !== 0 ? this.props.user.userDB.chFIO : "",    // имя
            chPhone:  this.props.user.length !== 0 ? this.props.user.userDB.chPhone : "",   // телефон

            /// поля ввода адреса
            chCity: this.props.options.CITY,      // город
            chStreet: '', /// улица
            chNumHome: '', // номер дома
            chHousing: '', // корпус
            chEntrance: '', /// подъезд
            chFloor: '', /// этаж
            chApartment: '', /// квартира
            /////////////////////////////
            chDeliveryTime: 'Как можно скорее', // время доставки
            chMethodPay: 'Наличными курьеру', /// метод оплаты 
            chPayGiveChange: 0, // сумма с которой надо дать сдачу
            chMethodConfirm: 'Звонок оператора', /// метод подътверждения
            chComments: '', /// комментарий к заказу
            /////
            addressPickup: 0,
            addressDelivery: 0,
            addressDeliveryInput: 0,
            isViewInputDeliveryTimeVisible: false, /// скрывает показывает выбор времени доставки
            isViewInputAdressVisible: true, /// скрывает-показывает поля ввода адреса
            isViewInputSumma: true, /// скрывает-показывает поля ввода с какой суммы дать сдачу

            didFinishInitialAnimation: false,
            /// минимальная и максимальная дата для заказа
            minDate: moment().format("DD-MM-YYYY"),
            maxDate: moment(Number(this.props.customers.iDaysAhead)*86400000 + new Date().getTime()).format("DD-MM-YYYY"),
            isErrorName: false,
            isErrorPhone: false,
        
        }
        this.inputs = {};
    }

    getNameFromDB() {
        const name = this.props.user.length !== 0 ? this.props.user.userDB.chFIO : "";
        if(name !== "")
        {
            var val = {
                chFIO: name
            };
            this.props.addItemOrder(val)
        }
        console.log("getNameFromDB order = ", this.props.order);
        return name;
    }
    // Lifecycle methods
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({ didFinishInitialAnimation: true, });
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
    onGoFocus() { this.inputs['Имя'].focus(); }
    focusNextField(id) { this.inputs[id].focus(); }
    generateKey = () => { return `${ new Date().getTime() }`; }
    divider(){ return( <View style={ styles.divider } />) }
    validateName(text)
    {
        let reg = /^[A-zА-яЁё]+$/i ;
        if(reg.test(text) === false)
        {
            //console.log("Имя должно состоять только из букв");
            this.setState({chFIO:text})
            this.setState({errorName:"Имя должно состоять только из букв"})
            //return false;
        }
        else {
            this.setState({chFIO:text});
            this.setState({errorName: ''})
        }
        
        var val = {
            chFIO: text
        };
        this.props.addItemOrder(val)
       // console.log("validateName order = ", this.props.order);
    }
    validatePhone(text)
    {
        let reg = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
        if(reg.test(text) === false) {
            this.setState({chPhone: text});
            this.setState({errorPhone:"Не верный номер телефона"})
            this.setState({isErrorPhone: true});
        }
        else {
            this.setState({chPhone: text});
            this.setState({errorPhone: ''})
            this.setState({isErrorPhone: false});
        }
        var val = {
            chPhone: text
        };
        this.props.addItemOrder(val)
        console.log("validatePhone order = ", this.props.order);
    }
    renderSelectDeliveryMetod(){
        return(
            <RadioGroup selectedIndex={2} color='#6A3DA1' onSelect = {(index, value) => this.onSelectDeliveryAddress(index, value)} >
            {
                <RadioButton value={3}>
                    <View style={styles.arrowRightView}>
                        {
                            this.props.order.addressPickup !== 0 ?
                            <Text style={{color:'#4E4E4E'}}>{this.props.order.addressPickup}</Text> :
                            <Text style={{color:'#4E4E4E'}}>Самовывоз</Text>
                        }
                        <Image style={styles.arrowBottom} 
                            source={require('../assets/arrowRight.png')} />
                    </View>
                </RadioButton>
            }
            {
                /// если есть доставка
                this.props.customers.blDelivery == 1 ? 
                    <RadioButton value={1}>
                        <View style={styles.arrowRightView}>
                            {
                                this.props.order.addressDelivery !== 0 ?
                                <Text style={{color:'#4E4E4E'}}>{this.props.order.addressDelivery}</Text> :
                                <Text style={{color:'#4E4E4E'}}>Выбрать адрес</Text>
                            }
                            <Image
                            style={styles.arrowBottom} 
                            source={require('../assets/arrowRight.png')} />
                        </View>
                    </RadioButton>
                    : null
            }
            {
                this.props.customers.blDelivery == 1 ?
                <RadioButton value={2}>
                    <View style={styles.arrowRightView}>
                        <Text style={{color:'#4E4E4E'}}>Ввести адрес вручную</Text>
                        <Image
                        style={styles.arrowBottom} 
                        source={ !this.state.isViewInputAdressVisible ? require('../assets/arrowBottom.png') : require('../assets/arrowTop.png')} 
                        />
                    </View>
                </RadioButton> 
                : null
            }  
            </RadioGroup>
        )
    }
    //
    onSelectDeliveryAddress(index, value){
        console.log("value = ", value);
        if(value === 3) {
            this.setState({ isViewInputAdressVisible: false, }); /// скрываем поля ввода адреса доставки
            this.props.navigation.navigate('Pickups', {routeGoBack: 'Checkout',})
            this.setState({ chTypeDeliveryText: 'Самовывоз'});
            var val = {
                addressDelivery: 0,
                addressDeliveryInput: 0,
                chTypeDeliveryText: 'Самовывоз',
            };
            this.props.addItemOrder(val)
        }
        /// ввод адреса
        if(value === 2) {
            this.setState({ isViewInputAdressVisible: true, });
            this.setState({ chTypeDeliveryText: 'Доставка'});
            var val = {
                addressPickup: 0,
                addressDelivery: 0,
                chTypeDeliveryText: 'Доставка',
            };
            this.props.addItemOrder(val)
        }
        /// выбор адреса доставки
        if(value ===  1) {
            this.setState({ isViewInputAdressVisible: false, });
            this.setState({ chTypeDeliveryText: 'Доставка'});
            this.props.navigation.navigate('Addresses', {routeGoBack: 'Checkout',})
            var val = {
                addressPickup: 0,
                addressDeliveryInput: 0,
                chTypeDeliveryText: 'Доставка',
            };
            this.props.addItemOrder(val)            
        }
    }
    /// выбор времени доставки
    renderDeliveryTime()
    {   
        return(
            <RadioGroup selectedIndex={0} color='#6A3DA1' onSelect = {(index, value) => this.onSelectTimeDelivery(index, value)} >
                {/* как можно скорее */}
                <RadioButton value={1}>
                    <Text style={styles.textStyle}>Как можно скорее</Text>
                </RadioButton>
                {
                    /// если разрешен заказ на потом
                    this.props.customers.blLater == 1 ?
                    <RadioButton value={2}>
                        <View style={styles.arrowRightView}>
                            <Text style={styles.textStyle}>Ко времени</Text>
                            <Image style={styles.arrowBottom}  source={require('../assets/arrowBottom.png')} />
                        </View>
                    </RadioButton>
                    : null
                }
            </RadioGroup>
        )
    }
    onSelectTimeDelivery(index, value){
        console.log("value time = ", value);
        if(value === 1)
        {
            this.setState({isViewInputDeliveryTimeVisible: false});
            this.setState({chDeliveryTime: "Как можно скорее"});
            var val = { chDeliveryTime: "Как можно скорее" }
            this.props.addItemOrder(val);
        }
        if(value === 2)
        {
            var d = new Date(); // текущая дата
            var minutes = d.setMinutes(d.getMinutes() + 30); // прибавляем 30 минут
            var newDate = new Date(minutes); // получаем новую дату
            month = "0" + (newDate.getMonth() + 1); // форматируем номер месяца

            bStart = newDate.getDate()+"." +month+"."+newDate.getFullYear()+" "+ newDate.getHours()+":" + newDate.getMinutes();
            this.setState({chDeliveryTime: bStart});
            this.setState({isViewInputDeliveryTimeVisible: true});

            var val = { chDeliveryTime: bStart }
            this.props.addItemOrder(val);
        }
    }
    onSelectPay(index, value){
        if(value === 1){
            this.setState({isViewInputSumma: true});
            this.setState({chMethodPay: 'Наличными курьеру'});
            
            // isViewInputSumma
        }
        if(value === 3){
            this.setState({isViewInputSumma: false});
            this.setState({chMethodPay: 'Картой курьеру'});
            this.setState({chPayGiveChange: 0})
        }
    }
    onSelectConfirm(index, value){
        if(value === 1){
            this.setState({chMethodConfirm: 'Звонок оператора'})
        }
        if(value === 2){
            this.setState({chMethodConfirm: 'SMS cообщение'})
        }
    }
    nextConfirm(){
        var chAdress = "ул. "+this.state.chStreet+" "+this.state.chNumHome;
        var chHousing = this.state.chHousing !== '' ? "/"+this.state.chHousing+", " : ", ";
        var chEntrance = this.state.chEntrance !== '' ? "под."+this.state.chEntrance+", " : '';
        var chFloor = this.state.chFloor !== '' ? "этаж "+this.state.chFloor+", " : '';
        var chApartment = this.state.chApartment !== '' ? "кв. "+this.state.chApartment : '';
        chAdress = chAdress + chHousing + chEntrance + chFloor + chApartment;

        var val = {
            chFIO: this.state.chFIO,    // имя
            chPhone:  this.state.chPhone,   // телефон

               
            addressDeliveryInput: this.props.order.addressPickup !== 0 || this.props.order.addressDelivery !== 0 ? 0 : chAdress,
            chCity: this.props.options.CITY,      // город
            /*
            /// поля ввода адреса
            chCity: this.props.options.CITY,      // город
            chStreet: this.state.chStreet, /// улица
            chNumHome: this.state.chNumHome, // номер дома
            chHousing: this.state.chHousing, // корпус
            chEntrance: this.state.chEntrance, /// подъезд
            chFloor: this.state.chFloor, /// этаж
            chApartment: this.state.chApartment, /// квартира*/
            /////////////////////////////
            chDeliveryTime: this.state.chDeliveryTime, // время доставки
            chMethodPay: this.state.chMethodPay, /// метод оплаты 
            chPayGiveChange: this.state.chPayGiveChange, // сумма с которой надо дать сдачу
            chMethodConfirm: this.state.chMethodConfirm, /// метод подътверждения
            chComments: this.state.chComments, /// комментарий к заказу
        }
        this.props.addItemOrder(val) 
              
        console.log("this.props.order = ", this.props.order);
        
        this.props.navigation.navigate('CheckoutConfirm');
    }
    render() 
    {
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
                            value={this.state.chFIO}
                            // TextInput props
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            blurOnSubmit={ false }
                            onSubmitEditing={() => { this.focusNextField('Телефон'); }}
                            ref={ input => { this.inputs['Имя'] = input; }}
                            style={styles.textInputStyleNew}
                            onChangeText={(chFIO) => this.validateName(chFIO)}
                        />
                        <AnimatedHideView
                            visible={this.state.isErrorName}
                            style={{ padding: 0, marginTop: -10,}}
                            duration={200}
                            unmountOnHide={true} >
                            <Text style={{ marginLeft: 10, color: 'red',}}>{this.state.errorName}</Text>
                        </AnimatedHideView>
                        
                        {this.divider()}
                        <Sae
                            label={'Телефон'}
                            style={styles.textInputStyleNew}
                            value={this.state.chPhone}
                            keyboardType={'phone-pad'}
                            // TextInput props
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            blurOnSubmit={ false }
                            onChangeText={ (chPhone) =>  this.validatePhone(chPhone)}
                        />
                        <AnimatedHideView
                        visible={this.state.isErrorPhone}
                        style={{ padding: 0, marginTop: -10,}}
                        duration={200}
                        unmountOnHide={true}
                        >
                            <Text style={{ marginLeft: 10, color: 'red'}}>{this.state.errorPhone}</Text>
                        </AnimatedHideView>
                    </View>
                    
                </View>
                <Text style={styles.textTitleStyle}>2. Адрес </Text>
                <View style={styles.viewCardStyle}>
                    {/*Адрес доставки*/}
                    { this.renderSelectDeliveryMetod() }
                    <AnimatedHideView
                        visible={this.state.isViewInputAdressVisible}
                        style={{ padding: 0, }}
                        duration={200}
                        unmountOnHide={true}
                        >
                        <View style={{ flex: 1, marginTop: -15,}}>
                            <Sae
                                label={'Город'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                value={this.state.chCity}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onSubmitEditing={() => { this.focusNextField('Улица'); }}
                                ref={ input => { this.inputs['Город'] = input; }}
                                onChangeText={ (chCity) => {
                                    this.setState({chCity: chCity});
                                    //var val = { chCity: "г. "+chCity };
                                    //this.props.addItemOrder(val);
                                }}
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
                                onChangeText={ (chStreet) => 
                                {
                                    this.setState({chStreet: chStreet});
                                    //var val = { chStreet: "ул. "+chStreet };
                                    //this.props.addItemOrder(val);
                                }
                            }
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
                                onChangeText={ (chNumHome) => 
                                {
                                    this.setState({chNumHome: chNumHome}) ;
                                    //var val = { chNumHome: chNumHome };
                                    //this.props.addItemOrder(val);
                                }
                            } /> 
                            {this.divider()}
                            <Sae
                                label={'Корпус'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onSubmitEditing={() => { this.focusNextField('Подъезд'); }}
                                ref={ input => { this.inputs['Корпус'] = input; }}
                                onChangeText={ (chHousing) => 
                                {
                                    this.setState({chHousing: chHousing});
                                    //var val = { chHousing: "'\'" + chHousing };
                                    //this.props.addItemOrder(val);
                                }
                            } /> 
                            {this.divider()}
                            <Sae
                                label={'Подъезд'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onSubmitEditing={() => { this.focusNextField('Этаж'); }}
                                ref={ input => { this.inputs['Подъезд'] = input; }}
                                onChangeText={ (chEntrance) => 
                                {
                                    this.setState({chEntrance: chEntrance});
                                    //var val = { chEntrance: ", подъезд " + chEntrance };
                                    //this.props.addItemOrder(val);
                                }
                            } /> 
                            {this.divider()}
                            <Sae
                                label={'Этаж'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onSubmitEditing={() => { this.focusNextField('Квартира'); }}
                                ref={ input => { this.inputs['Этаж'] = input; }}
                                onChangeText={ (chFloor) => 
                                {
                                    this.setState({chFloor: chFloor}) ;
                                    //var val = { chFloor: ", этаж " + chFloor };
                                    //this.props.addItemOrder(val);
                                }
                            }/> 
                            {this.divider()}
                            <Sae
                                label={'Квартира'}
                                style={styles.textInputStyleNew}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                blurOnSubmit={ false }
                                onChangeText={ (chApartment) =>  
                                {
                                    this.setState({chApartment: chApartment});
                                    //var val = { chApartment: ", кв." + chApartment };
                                    //this.props.addItemOrder(val);
                                }
                            }/>               
                        </View>
                    </AnimatedHideView> 
                </View>
                <Text style={styles.textTitleStyle}>3. Время доставки </Text>
                <View style={styles.viewCardStyle}>
                    {/* время доставки*/}
                    {
                        this.renderDeliveryTime()
                    }
                    <AnimatedHideView visible={this.state.isViewInputDeliveryTimeVisible} unmountOnHide={true} style={{ padding: 0, }} duration={200}>
                        <View>
                        <DatePicker
                            style={{width: 180,}}
                            date={this.state.chDeliveryTime}
                            androidMode="spinner"
                            mode="datetime"
                            placeholder="Выберите время"
                            format="DD.MM.YYYY H:mm"
                            minDate={this.state.minDate}
                            maxDate={this.state.maxDate}
                            showIcon={false}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0 },
                                dateInput: { marginLeft: 10, borderRadius: 5, marginBottom: 10,}
                            }}
                            onDateChange={(date) => 
                            {
                                this.setState({chDeliveryTime: date})
                                var val = { chDeliveryTime: date };
                                this.props.addItemOrder(val);
                            }
                        }
                        />
                        </View>
                    </AnimatedHideView>
                
                </View>
                <Text style={styles.textTitleStyle}>4. Способ оплаты </Text>
                <View style={styles.viewCardStyle}>
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
                        visible={this.state.isViewInputSumma}
                        style={{ padding: 0, }}
                        unmountOnHide={true}
                        duration={200} >
                            {this.divider()}
                            <TextInput style={styles.textInputStyle}
                                underlineColorAndroid = "transparent"
                                placeholder = "Укажите с какой суммы потребуется сдача"
                                placeholderTextColor = "#828282"
                                autoCapitalize = "none"
                                onChangeText={(chPayGiveChange) => this.setState({chPayGiveChange})}
                                value={this.state.chPayGiveChange}/> 
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
                    {this.divider()}
                    <TextInput style={{ color: '#4E4E4E', paddingLeft: 10,}}
                        multiline = {true}
                        underlineColorAndroid = "transparent"
                        placeholder = "Комментарий к заказу"
                        placeholderTextColor = "#828282"
                        autoCapitalize = "none"
                        onChangeText={(chComments) => this.setState({chComments})}
                        value={this.state.chComments}/>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 20, paddingTop: 20, }}>
                        <TouchableHighlight  underlayColor='rgba(255,255,255,0.1)'
                        style={{elevation: 3, width: 150,}}
                        onPress={() =>  this.nextConfirm() }>
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

    textInputStyle: {
        height: 45, 
        borderWidth: 0, 
        flex: 1, 
        marginLeft: 10, 
        paddingBottom: 0, 
        paddingTop: 0, 
        marginRight: 10,
        marginBottom: 0,
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
    viewCardStyleNoTime: //ok
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
    viewCardStyleNoTimeNoSelectTime: //ok
    {
        flex:1,
        elevation: 3,  
        borderRadius: 10, 
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#fff',
        height: 40,
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
        height: 80,
    },
    viewCardStyleDeliveryNoAdressAndPickup: // ok
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
    viewCardStyleDeliveryOnlyPickup: // ok
    {
        flex:1,
        elevation: 3,  
        borderRadius: 10, 
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#fff',
        height: 40,
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
        width: width-80,

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
    divider: {
        flex: 1,
        borderBottomColor: '#E2E2E2',
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center', 
        alignItems: 'center',
    }
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
    customers: state.CustomersReducer,
    locations: state.LocationReducer,
  }),
  dispatch => ({
    addCart: (index) => {
        dispatch({ type: 'ADD_CART', payload: index})
    },
    addItemOrder: (orderData) => {
        dispatch({ type: 'ADD_ITEM', payload: orderData});
    },
    clearCart: (orderData) => {
      dispatch({ type: 'CLEAR_CART', payload: orderData});
    },
    delOption: (index) => {
        dispatch({ type: 'DEL_OPTION', payload: index});
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