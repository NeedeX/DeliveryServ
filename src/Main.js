import React, {Component} from 'react';
import {StyleSheet, ImageBackground, Platform,Alert, Dimensions, Button, TouchableHighlight,TouchableOpacity, InteractionManager, ActivityIndicator, Image, Text, View, StatusBar, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import ButtomCategoryNew from './components/ButtomCategoryNew';
import Header from './components/Header';
const { width } = Dimensions.get('window');
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';


class Main extends Component {
  constructor(props) {
    super(props)
    var {params} = this.props.navigation.state;
    this.state = { 
      didFinishInitialAnimation: false,
    };
    // Build a channel
  }
  ///https://github.com/yangnana11/react-native-fcm-demo/blob/master/App.android.js

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
        //this.checkUser();
      }
    })

    this.checkPermission();
    this.createNotificationListeners();

  }
  //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }
  componentWillUnmount() {
    this.getToken();
    this.notificationListener();
    this.notificationOpenedListener();
  }
  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    console.log("enabled = ", enabled);
    
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken', value);
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
            console.log("fcmToken = ", fcmToken);
        }
    }
  }
  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    Срабатывает, когда определенное уведомление было получено на переднем плане
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        console.log("notificationListener = ", notification);
        const { title, body } = notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    Если ваше приложение работает в фоновом режиме, вы можете прослушивать щелчок / нажатие / открытие уведомления следующим образом:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        console.log("notificationOpenedListener = ", notification);
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });
    ///http://mircoffee.by/deliveryserv/app/test.php?Action=M&t=test_title&m=test_mes&r=d5SCDcSX3rI:APA91bEKrx-tS7YePaAgfuBR6LNhjC23LMenCzWlR-a-6_YqxL6VuhXxVcoZRVs9zUkex-65WVBy4aQeQF72IYk4gV66mXMGd_-QowzU9AMIbc7kXhHYfQjBD76x-lw2HT9n49D8UmKd
  ////////////////////http://qaru.site/questions/24250/firebase-onmessagereceived-not-called-when-app-in-background/176765#176765
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    Если ваше приложение закрыто, вы можете проверить, было ли оно открыто с помощью уведомления / нажатия / открытия следующим образом:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        console.log("notificationOpen = ", notificationOpen);
        
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      //const { title, body } = message._data.body;
      this.showAlert( message._data.title,  message._data.body);
      console.log("=> ", message);
      //console.log(JSON.stringify(message));
    });
  }
  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
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
