import React from 'react';
import {  StyleSheet, TextInput, Text, View, Alert, Dimensions, TouchableHighlight, Image, ScrollView, ImageBackground,InteractionManager, ActivityIndicator} from 'react-native';
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
            addressPickup: this.props.order.addressPickup,
            addressDelivery: this.props.order.addressDelivery,

            chDeliveryTime: 'Как можно скорее', // время доставки
            chTypeDeliveryText: 'Доставка',
            chMethodPay: 'Наличными', /// метод оплаты 
            chPayGiveChange: '', // сумма с которой надо дать сдачу
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

            position: 0, // позиция прокрутки, для возврата при ошибке
        }
        this.inputs = {};
    }

    getNameFromDB() {
        const name = this.props.user.length !== 0 ? this.props.user.userDB.chFIO : "";
        if(name !== "") {
            var val = { chFIO: name };
            this.props.addItemOrder(val)
        }
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
          headerTitleStyle: { fontWeight: 'bold', textAlign: 'center', },
          header: (props) => <Header title={'Оформить заказ'} nav={ navigation } {...props} />,
        };
    };
    onGoFocus() { this.inputs['Имя'].focus(); }
    focusNextField(id) { this.inputs[id].focus(); }
    generateKey = () => { return `${ new Date().getTime() }`; }
    divider(){ return( <View style={ styles.divider } />) }
    validateName(text) {
        let reg = /^[A-zА-яЁё]+$/i ;
        if(reg.test(text) === false)
        {
            //console.log("Имя должно состоять только из букв");
            this.setState({
                chFIO:text,
                errorName:"Имя должно состоять только из букв",
                isErrorName: true,
            })
            //return false;
        }
        else {
            this.setState({
                chFIO:text,
                errorName: '',
                isErrorName: false,
            });
        }
        /*
        var val = {
            chFIO: text
        };
        this.props.addItemOrder(val)
        */
       // console.log("validateName order = ", this.props.order);
    }
    validatePhone(text)
    {
        let reg = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
        if(reg.test(text) === false) {
            this.setState({
                chPhone: text,
                errorPhone:"Не верный номер телефона",
                isErrorPhone: true
            });
        }
        else {
            this.setState({
                chPhone: text,
                errorPhone: '',
                isErrorPhone: false,
            });
        }
        /*
        var val = { chPhone: text };
        this.props.addItemOrder(val)*/
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
    onSelectDeliveryAddress(index, value) {
        /// Самовывоз
        if(value === 3) {
            this.setState({ 
                isViewInputAdressVisible: false,  /// скрываем поля ввода адреса доставки
                chTypeDeliveryText: 'Самовывоз', // изменяем тип доставки на "Самовывоз"
                isViewInputSumma: false, // скрываем поле ввода суммы для сдачи
                chPayGiveChange: '', // сумма с которой надо дать сдачу
            }); 
            // формируем массив для очистки других выбранных данных, если был самовывоз или выбран адрес из сохр.
            var val = {
                addressDelivery: 0, // сброс выбранного адреса доставки
                addressDeliveryInput: 0, // сброс введенного адреса
                chTypeDeliveryText: 'Самовывоз', 
            };
            this.props.addItemOrder(val); // записываем в редакс
            // переходим на экран выбора адреса самовывоза
            this.props.navigation.navigate('Pickups', {routeGoBack: 'Checkout',});
        }
        /// ввод адреса
        if(value === 2) {
            this.setState({ 
                isViewInputAdressVisible: true, // показываем поля ручного ввода адреса
                chTypeDeliveryText: 'Доставка', // изменяем тип доставки на "Доставка"
            }); 
            // формируем массив для очистки других выбранных данных, если был самовывоз или выбран адрес из сохр.
            var val = {
                addressPickup: 0,
                addressDelivery: 0,
                chTypeDeliveryText: 'Доставка',
            };
            this.props.addItemOrder(val); // записываем в редакс
        }
        /// выбор адреса доставки
        if(value ===  1) {
            this.setState({ 
                isViewInputAdressVisible: false, // скрываем поля ручного ввода адреса
                chTypeDeliveryText: 'Доставка', // изменяем тип доставки на "Доставка"
            });
            // формируем массив для очистки других выбранных данных, если был самовывоз или введен адрес ручками.
            var val = {
                addressPickup: 0,
                addressDeliveryInput: 0,
                chTypeDeliveryText: 'Доставка',
            };
            this.props.addItemOrder(val); // записываем в редакс
            // переходим на экран выбора адреса доставки
            this.props.navigation.navigate('Addresses', {routeGoBack: 'Checkout',}); 
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
        // "Как можно скорее"
        if(value === 1)
        {
            this.setState({
                isViewInputDeliveryTimeVisible: false, // скаываем выбор времени доставки
                chDeliveryTime: "Как можно скорее", // записываем что выбрано "Как можно скорее"
            });
            /*
            var val = { chDeliveryTime: "Как можно скорее" }
            this.props.addItemOrder(val);
            */
        }
        ///  если выбрано к какому времени привести или приготовить заказ
        if(value === 2)
        {
            var d = new Date(); // текущая дата
            var minutes = d.setMinutes(d.getMinutes() + 30); // прибавляем 30 минут
            var newDate = new Date(minutes); // получаем новую дату c 30 минутами
            // форматируем к нужному нам виду значение часов
            var hours = newDate.getHours()<10 ? "0" + newDate.getHours(): newDate.getHours();
            // форматируем к нужному нам виду значение месяца
            var month = (newDate.getMonth() + 1)<10 ? "0" + (newDate.getMonth() + 1): (newDate.getMonth() + 1);// форматируем номер месяца
            // форматируем к нужному нам виду значение минут
            var minute = newDate.getMinutes()<10 ? "0" + newDate.getMinutes(): newDate.getMinutes();
            // форматируем всю строку времени
            var timeDelivery = newDate.getDate()+"." +month+"."+newDate.getFullYear()+" "+ hours +":" + minute;
            // помещаем в state
            this.setState({
                chDeliveryTime: timeDelivery, // записываем время доставки
                isViewInputDeliveryTimeVisible: true, // показываем выбор времени доставки
            });
            /*
            var val = { chDeliveryTime: bStart }
            this.props.addItemOrder(val);
            */
        }
    }
    onSelectPay(index, value){
        // оплата наличными
        if(value === 1) {
            // если выбран самовывоз, скрывать поле ввода суммы, с которой надо дать сдачу, 
            this.setState({
                // даже если выбрана оплата наличными. В кассе всегда должна быть сдача 
                isViewInputSumma: this.props.order.addressPickup === 0 ? true : false,
                // устанавливаем значение, что выбрано оплата "наличными" и в зависимости замовывоз или нет, то нужно ли слово "курьеру" 
                chMethodPay: `Наличными ${this.props.order.addressPickup === 0 ? 'курьеру' : ""}`
            });
            // создаем массив, для сохранения в редаксе
            /* var val = {
                chMethodPay: 'Наличными'+ this.props.order.addressPickup === 0 ? 'курьеру' : "",
                chPayGiveChange: '',
            };
            // записываем в редакс
            this.props.addItemOrder(val);*/
             
        }
        // картой
        if(value === 3) {
            // скрываем поле, с какой суммы надо дать сдачу
            this.setState({isViewInputSumma: false});
            // устанавливаем значение, что выбрано оплата "Картой" и в зависимости замовывоз или нет, то нужно ли слово "курьеру" 
            this.setState({chMethodPay: `Картой ${this.props.order.addressPickup === 0 ? 'курьеру' : ""}`});
            // обнуляем значение с котороо надо дать сдачу
            this.setState({chPayGiveChange: ''})
            /*
            var val = {
                chMethodPay: 'Картой' + this.props.order.addressPickup === 0 ? 'курьеру' : "",
                chPayGiveChange: '',
            };
            this.props.addItemOrder(val);*/
        }
    }
    // обработчик выбора способа подтверждения заказа
    onSelectConfirm(index, value) {
        if(value === 1){ this.setState({chMethodConfirm: 'Звонок оператора'}) }
        if(value === 2){ this.setState({chMethodConfirm: 'SMS cообщение'}) }
    }
    warningMessage(message) {
        Alert.alert(
            'Уведомление',
            message,
            [
                //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                /*{
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },*/
                {   
                    text: 'OK', 
                    //onPress: () => console.log('OK Pressed')
                },
            ],
            {cancelable: false},
        );
    }
    nextConfirm() {
        var countError= 0;
        var chAdress = 0; // будет хранится адрес в одну строку введеный ручками
        if(this.state.chFIO === '' && countError === 0) {
            countError = ++countError;
            //this.warningMessage("Вы не ввели имя")
            this.setState({
                errorName: "Вы не ввели имя",
                isErrorName: true,
            });
            this.scrollView.scrollTo({x: 0, y: this.state.position, animated: true});
            this.focusNextField('fio');
        }
        // проверяем введен ли номер телефона
        if(this.state.chPhone === '' ) {
            countError = ++countError;
            //this.warningMessage("Вы не ввели номер телефона");
            this.setState({
                errorPhone: "Вы не ввели номер телефона",
                isErrorPhone: true
            });
            this.scrollView.scrollTo({x: 0, y: this.state.position, animated: true});
            this.focusNextField('phone');
        }
        //  проверяем введено ли имя, если нет и не было до этого ошибок
        
        // формируем адрес в одну строку введеный ручками
        if( this.props.order.addressPickup === 0 && this.props.order.addressDelivery === 0) {
            // проверяем введена ли улица при заполнении вручную
            if(this.state.chStreet !== '') {
                chAdress = "ул. "+this.state.chStreet+" "+this.state.chNumHome;
                var chHousing = this.state.chHousing !== '' ? "/"+this.state.chHousing+", " : ", ";
                var chEntrance = this.state.chEntrance !== '' ? "под."+this.state.chEntrance+", " : '';
                var chFloor = this.state.chFloor !== '' ? "этаж "+this.state.chFloor+", " : '';
                var chApartment = this.state.chApartment !== '' ? "кв. "+this.state.chApartment : '';
                chAdress = chAdress + chHousing + chEntrance + chFloor + chApartment;
            }
            else { // не введена, обрабанываем ошибку
                // если не было ошибок, то выводим уведомление
                if(countError === 0) {
                    countError = ++countError;
                    this.warningMessage("Вы не выбрали способ доставки");
                }
            }
        }

        
        if(countError === 0){
            var values = {
                chFIO: this.state.chFIO,    // имя
                chPhone:  this.state.chPhone,   // телефон
                chCity: this.state.chCity,      // город
                chTypeDeliveryText: this.state.chTypeDeliveryText, /// текст типа доставки (доставка или самовывоз)
                addressDeliveryInput: chAdress,
                
                addressPickup: this.props.order.addressPickup,
                addressDelivery: this.props.order.addressDelivery,

                chDeliveryTime: this.state.chDeliveryTime, // время доставки
                chMethodPay: this.state.chMethodPay, /// метод оплаты 
                chPayGiveChange: this.state.chPayGiveChange, // сумма с которой надо дать сдачу
                chMethodConfirm: this.state.chMethodConfirm, /// метод подътверждения
                chComments: this.state.chComments, /// комментарий к заказу
            }
            this.props.addItemOrder(values) 
            this.props.navigation.navigate('CheckoutConfirm');
        }
    }
    _onLayout = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
        this.setState(prevState => ({
          position: prevState.position + y
        }));
      };
    render() 
    {
        /*
        if(this.state.index === 0)
        {
            this.props.navigation.navigate('Addresses', {animation: 'SlideFromLeft', animationDuration: 500 });
        }
        */
        //var {navigate} = this.props.navigation;
        //var {params} = this.props.navigation.state;
        ///onSelectPay
        var selIndex = 0; // индекс выбраного по умочанию значения способа оплаты
        if(this.props.order.addressPickup === 0) // проверяем выбрана доставка или самовывоз
        {   // проверяем разрешена ли оплата картой курьру, есди да, то индекс 0, если нет, то индеск 1
            selIndex = this.props.customers.blCardCourier === "1" ? 0 : 1; 
        }
        else 
        {   // проверяем разрешена ли оплата наличными курьру, есди да, то индекс 0, если нет, то индеск 1
            selIndex = this.props.customers.blCashCourier === "1" ? 0: 1; 
        }
        return (
        <View style={{backgroundColor: '#F3F3F3'}}> 
        {      
            this.state.didFinishInitialAnimation === false ?
            <ActivityIndicator size="large" color="#583286" />
            :
            <ScrollView ref={(ref) => this.scrollView = ref}>
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
                            onSubmitEditing={() => { this.focusNextField('phone'); }}
                            ref={ input => { this.inputs['fio'] = input; }}
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
                            ref={ input => { this.inputs['phone'] = input; }}
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
                                //ref={ input => { this.inputs['Этаж'] = input; }}
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
                                /*var val = { chDeliveryTime: date };
                                this.props.addItemOrder(val);*/
                            }
                        }
                        />
                        </View>
                    </AnimatedHideView>
                
                </View>
                <Text style={styles.textTitleStyle}>4. Способ оплаты </Text>
                <View style={styles.viewCardStyle}>
                    <RadioGroup 
                        selectedIndex={selIndex}
                        color='#6A3DA1'
                        onSelect = {(index, value) => this.onSelectPay(index, value)} >

                        { /// карта
                            this.props.order.addressPickup === 0 ? // доставка
                            <RadioButton value={3} disabled={this.props.customers.blCardCourier === "1" ? false : true}>
                                <Text style={styles.textStyle}>Картой курьеру</Text>
                            </RadioButton>
                            :/// самовывоз
                            <RadioButton value={3} disabled={this.props.customers.blCardPickup == "1" ? false : true}>
                                <Text style={styles.textStyle}>Картой</Text>
                            </RadioButton>

                        }
                        {   /// налик
                            this.props.order.addressPickup === 0 ? // доставка
                            <RadioButton value={1} disabled={this.props.customers.blCashCourier === "1" ? false : true}>
                                <Text style={styles.textStyle}>Наличными курьеру</Text>
                            </RadioButton>
                            : /// самовывоз
                            <RadioButton value={1} disabled={this.props.customers.blCashPickup == "1" ? false : true}>
                                <Text style={styles.textStyle}>Наличными</Text>
                            </RadioButton>

                        }
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
                                onChangeText={(chPayGiveChange) => {
                                        this.setState({chPayGiveChange});
                                        /*var val = {
                                            chPayGiveChange: chPayGiveChange,
                                        }
                                        this.props.addItemOrder(val);*/
                                    }
                                }
                                value={this.state.chPayGiveChange}/> 
                    </AnimatedHideView>
                </View>
                <Text style={styles.textTitleStyle}>5. Подтверждение заказа</Text>
                <View style={styles.viewCardStyle}>
                    <RadioGroup 
                        selectedIndex={0}
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