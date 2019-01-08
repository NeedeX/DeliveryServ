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
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    console.log("notificationOpen = ", notificationOpen);
  
    if (notificationOpen) {
      // Приложение было открыто уведомлением
      // Получить действие, вызванное открытием уведомления
      const action = notificationOpen.action;
      console.log("action = ", action);
      // Получить информацию об открытии уведомления
      const notification: Notification = notificationOpen.notification;
      console.log("notification1 = ", notification);
      
      if (notification!==undefined) {
          alert(notification);
      } else {
        var seen = [];
        alert(JSON.stringify(notification, function(key, val) {
            if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0) {
                    return;
                }
                seen.push(val);
            }
            return val;
        }));
      }
      //firebase.notifications().removeDeliveredNotification(notification.notificationId);
    }
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
          .setDescription('My apps test channel');
    // Создать канал
    firebase.notifications().android.createChannel(channel);
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      // Обработайте ваше уведомление как требуется
      // ANDROID: Удаленные уведомления не содержат идентификатор канала. Вам нужно будет указать это вручную, если вы хотите повторно отобразить уведомление.
    });
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      // Обработайте ваше уведомление как требуется
      console.log("notification2 = ", notification);
      
      notification
          .android.setChannelId('test-channel')
          .android.setSmallIcon('ic_launcher');
      firebase.notifications()
          .displayNotification(notification);
      if (Platform.OS === 'android') {
            //
        const localNotification = new firebase.notifications.Notification({
          sound: 'default',
          show_in_foreground: true,
          show_in_background: true
        })
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        //.setSubtitle(notification.subtitle)
        .setBody(notification.body)
        //.setData(notification.data)
        .android.setChannelId('test-channel') // например идентификатор, который вы выбрали выше
        .android.setSmallIcon('ic_launcher') // создать этот значок в Android Studio
        .android.setColor('#000000') // Вы можете установить цвет здесь
        .android.setPriority(firebase.notifications.Android.Priority.High);
        //
        firebase.notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));
            //
      } 
      //else if (Platform.OS === 'ios') {
            //
            //     const localNotification = new firebase.notifications.Notification()
            //         .setNotificationId(notification.notificationId)
            //         .setTitle(notification.title)
            //         .setSubtitle(notification.subtitle)
            //         .setBody(notification.body)
            //         .setData(notification.data)
            //         .ios.setBadge(notification.ios.badge);
            //
            //     firebase.notifications()
            //         .displayNotification(localNotification)
            //         .catch(err => console.error(err));
            //
            // }     
      
  });
  this.notificationOpenedListener = 
  firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      var seen = [];
      Alert.alert(
        notification.title,
        notification.body,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => firebase.notifications().removeDeliveredNotification(notification.notificationId)},
        ],
        { cancelable: false }
      );
      /*
      alert(JSON.stringify(notification.body, function(key, val) {
          if (val != null && typeof val == "object") {
              if (seen.indexOf(val) >= 0) {
                  return;
              }
              seen.push(val);
          }
          return val;
      }));
      */
      //firebase.notifications().removeDeliveredNotification(notification.notificationId);
      
  });

}

componentWillUnmount() {
  this.notificationDisplayedListener();
  this.notificationListener();
  this.notificationOpenedListener();
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
