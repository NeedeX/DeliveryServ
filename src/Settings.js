import React, {Component} from 'react';
import {StatusBar, ActivityIndicator, Dimensions, TextInput, Image, ScrollView, TouchableOpacity, InteractionManager, ImageBackground, StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { Switch } from 'react-native-switch';
import Header from './components/Header';
const { width } = Dimensions.get('window');
class Settings extends Component {
    constructor(props) {
        super(props)
        var {params} = this.props.navigation.state;
        this.state = { 
          didFinishInitialAnimation: false,
          switchPushNotification: this.props.user.userDB.iPushNotification,

          name: this.props.user.userDB.chFIO !== "" ? this.props.user.userDB.chFIO : 'Имя', 
        };
    }
    static navigationOptions = ({ navigation  }) => {
        return {
            title: 'Home',
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            },
            header: (props) => <Header title={'Личный кабинет'} nav={ navigation } {...props} />,
        };
    };
    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                didFinishInitialAnimation: true,
            });
        });
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ userEmail: user._user.email});
                this.setState({ userUid: user._user.uid});
                //console.log("userEmail = ", this.state.userEmail);
                //console.log("userUid = ", this.state.userUid);
            }
        })
    }
    switchPushNotificationInDB(value){
        var val = value === true ? 1 : 0;
        fetch(this.props.options.URL + 'SwitchPushNotification.php', 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': "gzip, deflate",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chUIDGoogleUser: this.props.user.userDB.chUIDGoogleUser,
                iPushNotification: val,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("responseJson = ",responseJson);
            if(responseJson === 1)
                this.props.editPushNotification(value);
        })
        .catch((error) => {
            console.error(error);
        });
    }
    switchPushNotification(value){
        //console.log("value = ", value);
        this.state.switchPushNotification =  value;
        this.switchPushNotificationInDB(value);
        console.log("user = ", this.props.user);
    }
    divider(){
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
    chamgeName(val){
        console.log("name = ", val);
        
    }
    onEndEditingName(){
        console.log("onEndEditingName = ", onEndEditingName);
        
    }
    render() {
    return (
        <View style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="#583286"
          barStyle="default"
        />
        <ScrollView>
            <ImageBackground
              style={{ flex: 1, width: width, height: 190}}
              imageStyle={{ resizeMode: 'stretch' }}
              source={require('../assets/main.png')}
            >
                <View style={{ alignItems: "center", justifyContent:'center',}}>
                    <View style={ [styles.circleIcone, { marginTop: 84, }] }>
                        <Image source={require('../assets/iconSetting.png')} style={ styles.imageIcon } />
                    </View>
                </View>
            </ImageBackground>
            {
                this.state.didFinishInitialAnimation === false ?
                <ActivityIndicator size="large" color="#583286" style={{marginTop: 50,}} />
                :
                <View>
                    <View style={{ marginTop: 10}}>
                        <Text style={styles.cardTitleStyle}>Аккаунт</Text> 
                    </View>
                    <View style={styles.viewCardStyle}>
                        <TextInput
                            placeholder={'Имя'}
                            
                            style={styles.cardTextInputStyle}
                            editable = {true}
                            maxLength = {40}
                            onEndEditing={(name) => this.onEndEditingName(name)}
                            onChangeText={(name) => this.chamgeName(name)}
                        />
                        {this.divider()}
                        <Text style={styles.cardTextStyle}>Телефон</Text>
                        {this.divider()}
                        <Text style={styles.cardTextStyle}>Дата рождения</Text>
                    </View>
                    <View style={{ marginTop: 10}}>
                        <Text style={styles.cardTitleStyle}>Настройки</Text> 
                    </View>
                    <TouchableOpacity  onPress={() => this.props.navigation.navigate('Addresses')}>
                        <View style={ [styles.viewCardStyle, { flexDirection: 'row' }] }>
                        <Image source={require('../assets/geo.png')} style={{ width: 14, height: 20, marginLeft: 10, marginBottom: 8, marginTop: 8}} />
                        <Text style={styles.cardTextStyle}>Мои адреса</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <View style={{ marginTop: 10}}>
                        <Text style={styles.cardTitleStyle}>Уведомления</Text> 
                    </View>
                    <View style={styles.viewCardStyle}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.cardTextStyle}>Push сообщения </Text>
                           
                            <View style={{marginTop: 10, marginRight: 10,}}>
                                <Switch
                            
                                    value={this.state.switchPushNotification}
                                    onValueChange={(val) => this.switchPushNotification(val)}
                                    disabled={false}

                                    circleSize={25}
                                    barHeight={15}
                                    useNativeDriver={true}
                                    circleBorderWidth={0}
                                    backgroundActive={'#b49ed0'}
                                    backgroundInactive={'#b49ed0'}
                                    circleActiveColor={'#6A3DA1'}
                                    circleInActiveColor={'gray'}
                                    changeValueImmediately={true}
                                    //renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
                                    changeValueImmediately={false} // if rendering inside circle, change state immediately or wait for animation to complete
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                                    outerCircleStyle={{}} // style for outer animated circle
                                    renderActiveText={false}
                                    renderInActiveText={false}
                                    switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                                    switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                                    switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                                />
                            </View>
                        </View>

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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEEEEE',
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
        width: 73,
        height: 73,
        marginTop: 28,
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 26,
    },
    viewCardStyle:{
        flex:1,
        elevation: 2,  
        borderRadius: 10, 
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#fff',
        marginBottom: 5,
    },
    cardTitleStyle:{
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#4E4E4E',
        marginLeft: 30,
        marginBottom: 3,
    },
    cardTextStyle:{
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 12,
        color: '#4E4E4E',
        margin: 10,
    },
    cardTextInputStyle:{
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 12,
        color: '#4E4E4E',
        marginLeft: 10,

        padding: 2,
    }
});

export default connect (
    state => ({
      cart: state.CartReducer,
      banners: state.BannerReducer,
      categories: state.CategoriesReducer,
      products: state.ProductsReducer,
      user: state.UserReducer,
      options: state.OptionReducer,
      favorite: state.FavoriteReducer,
      addresses: state.AddressReducer,
      tegs: state.TegsReducer,
      customers: state.CustomersReducer,
    }),
    dispatch => ({
        editPushNotification: (data) => {
            dispatch({ type: 'EDIT_PUSH', payload: data});
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
  )(Settings);