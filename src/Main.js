import React, {Component} from 'react';
import {StyleSheet, ImageBackground, Platform, YellowBox, TextInput, Alert, Dimensions, Button, TouchableHighlight,TouchableOpacity, InteractionManager, ActivityIndicator, Image, Text, View, StatusBar, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import ButtomCategoryNew from './components/ButtomCategoryNew';
import Header from './components/Header';
const { width } = Dimensions.get('window');
import firebase from 'react-native-firebase';
import NotifService from './NotifService';
import appConfig from '../app.json';
YellowBox.ignoreWarnings(['Require cycle:']);
class Main extends Component {
  constructor(props) {
    super(props)
    var {params} = this.props.navigation.state;
    this.state = { 
      didFinishInitialAnimation: false,
      senderId: appConfig.senderID
    };
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));

    
  }
  ///https://github.com/yangnana11/react-native-fcm-demo/blob/master/App.android.js
  insertRegisterToken(UIDClient, URL, token){
    return fetch(URL+'InsertRegisterToken.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        UIDClient: UIDClient,
        token: token
       })
    })
    //.then((response) => response.json())
    .then((responseJson) => {
      
    })
    .catch((error) => { 
      console.error(error); 
    });
  }

  onRegister(token) {
    Alert.alert("Registered !", JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
    
  }
  onNotif(notif) {
    console.log(notif);
    //Alert.alert(notif.title, notif.body);
    if(this.props.user.userDB.iPushNotification === true)
      this.notif.localNotif(notif.title, notif.body)
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }
  async componentDidMount()
  {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        didFinishInitialAnimation: true,
      });
    });
    firebase.auth().onAuthStateChanged(user => {
      //console.log("==>");
      if (user) {
        this.setState({ userEmail: user._user.email});
        this.setState({ userUid: user._user.uid});
        //console.log("userEmail = ", this.state.userEmail);
        //console.log("userUid = ", this.state.userUid);
        console.log("this.props.user = ", this.props.user);

        //// для авторизации по емаил
        if(this.props.user._user.phoneNumber === undefined)
        {
          //console.log("UIDGoogleUser = ", user.uid);
          //console.log("chPhone = ", user.phoneNumber);
          //console.log("chUID = ", this.props.options.UIDClient);
        
          return fetch(this.props.options.URL+'InsertUser.php',{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Accept-Encoding': "gzip, deflate",
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              UIDGoogleUser: user.uid,
              chPhone: "",
              UIDClient: this.props.options.UIDClient,
            })
          })
          .then((response) => response.json())
          .then((responseJson) => {
            this.props.loadUser(user);
          })
          .catch((error) => {
            console.error(error);
          });
        }
        //// для авторизации по емаил .................. конец
        //this.checkUser();
      }
    })
    firebase.messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        // user has a device token
        //console.log("fcmToken = ", fcmToken);
        this.insertRegisterToken(this.props.options.UIDClient, this.props.options.URL, fcmToken);
      } else {
        // user doesn't have a device token yet
        console.log("user doesn't have a device token yet");
      } 
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
    header: (props) => <Header title={'Меню'} nav={ navigation } {...props} />,
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#000"
      />
    ),
    headerLeft: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#000"
      />
    ),
    };
  };
  renderStocks(nav){
    return this.props.banners.map((banners, index) => (
      <TouchableOpacity activeOpacity={0.9} style={{flex: 1, }} key={index} onPress={() => nav('StocksView', { bannersId: banners.iStock, title: banners.chName, desc:banners.sDescriptio,  countInBasket: this.state.countInBasket })}>
        <View style={{elevation: 2,height: 145,
        borderRadius: 20,}}>
        <Image key={banners.iStock} source={{ uri: banners.sImage }} style={styles.img}/> 
        </View>
      </TouchableOpacity>
      )
    );
  }
  render() {
    var {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="#583286"
          barStyle="default"
        />
        {
          this.state.didFinishInitialAnimation === false ?
          <ActivityIndicator size="large" color="#583286" />
          :
          <ScrollView>
            <ImageBackground
              style={{ flex: 1, width: width, height: 190}}
              imageStyle={{ resizeMode: 'stretch' }}
              source={require('../assets/main.png')}
            >
            <View style={ styles.viewStockTitleBtn }>
              <Text style={{color: '#F2F2F2', fontFamily: 'OswaldSemiBold', fontSize: 20,
                lineHeight: 37, marginLeft: 40,}}>Акции</Text>
                <TouchableOpacity  onPress={() => this.props.navigation.navigate('Stocks')}>
                <Text style={{color: '#F2F2F2', fontFamily: 'Roboto', fontSize: 14,
                lineHeight: 24, marginRight: 40, marginTop: 10, fontWeight: '600'}}>все
                </Text>
                </TouchableOpacity>
            </View>

              <Swiper
                  height={200}
                  autoplay={true}
                  removeClippedSubviews={false}
                  style={styles.wrapper}
                  paginationStyle={{ bottom: 15, left: 0, right: 0, }}
                  activeDot={<View style={{backgroundColor: '#fff', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                  dot={<View style={{backgroundColor: 'rgba(0,0,0,.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                  >
                    {this.renderStocks(navigate)}
              </Swiper>
  
            </ImageBackground>
            <View>
            <Text style={{color: '#4E4E4E', fontFamily: 'OswaldSemiBold', fontSize: 20,
                  lineHeight: 37, marginLeft: 40,}}>Меню</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', 
                   justifyContent: 'space-around', 
                   width: width - 30, marginLeft: 15,
                  flexDirection: 'row', flexWrap: 'wrap'
                }}>
              {
                this.props.categories.map((cat, index) => (
                  <ButtomCategoryNew 
                    key={index}
                    iCategory={cat.iCategory}  
                    chMainImage={cat.chMainImage}
                    chName={cat.chName}
                    nav={this.props.navigation}
                  />
                ))
              }
              </View>
          </ScrollView>
        
        }
        {/*}
        <TextInput style={styles.textField} value={this.state.registerToken} placeholder="Register token" />
        <View style={styles.spacer}></View>
        <TextInput style={styles.textField} value={this.state.senderId} onChangeText={(e) => {this.setState({ senderId: e })}} placeholder="GCM ID" />
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.configure(this.onRegister.bind(this), this.onNotif.bind(this), this.state.senderId) }}><Text>Configure Sender ID</Text></TouchableOpacity>
        {this.state.gcmRegistered && <Text>GCM Configured !</Text>}

        <View style={styles.spacer}></View>
        
        <Text style={styles.title}>Example app react-native-push-notification</Text>
        <View style={styles.spacer}></View>
        <TextInput style={styles.textField} value={this.state.registerToken} placeholder="Register token" />
        <View style={styles.spacer}></View>

        <TouchableOpacity style={styles.button} onPress={() => { this.notif.localNotif() }}><Text>Local Notification (now)</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.scheduleNotif() }}><Text>Schedule Notification in 30s</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelNotif() }}><Text>Cancel last notification (if any)</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.cancelAll() }}><Text>Cancel all notifications</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.checkPermission(this.handlePerm.bind(this)) }}><Text>Check Permission</Text></TouchableOpacity>

        <View style={styles.spacer}></View>
        <TextInput style={styles.textField} value={this.state.senderId} onChangeText={(e) => {this.setState({ senderId: e })}} placeholder="GCM ID" />
        <TouchableOpacity style={styles.button} onPress={() => { this.notif.configure(this.onRegister.bind(this), this.onNotif.bind(this), this.state.senderId) }}><Text>Configure Sender ID</Text></TouchableOpacity>
        {this.state.gcmRegistered && <Text>GCM Configured !</Text>}

        <View style={styles.spacer}></View>
      */}
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

  wrapper: { 
    marginLeft: 20,
    marginRight: 20,
  },
  img:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
        borderRadius: 20,
        
  },
  viewStockTitleBtn: { height: 30, marginBottom: 10,
      width: width, flexDirection: 'row', justifyContent: 'space-between'}
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
    addUserData: (userData) => {
      dispatch({ type: 'EDIT_USER', payload: userData});
    },
    loadUser: (userData) => {
      dispatch({ type: 'LOAD_USER', payload: userData})
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
)(Main);
