import React, {Component} from 'react';
import {StyleSheet, ImageBackground, YellowBox, Alert, Dimensions, TouchableOpacity, InteractionManager, ActivityIndicator, Image, Text, View, StatusBar, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import ButtomCategoryNew from './components/ButtomCategoryNew';
import Header from './components/Header';
const { width } = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
//import firebase from 'react-native-firebase';
//import NotifService from './NotifService';
import appConfig from '../app.json';
YellowBox.ignoreWarnings(['Require cycle:']);
class Main extends Component {
  constructor(props) {
    super(props)
    var {params} = this.props.navigation.state;
    this.state = { 
      didFinishInitialAnimation: false,
      senderId: appConfig.senderID,
      countClosesLocation: 0, /// кол-во открытых заведений в данный момент
    };
    //this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
    /*
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //this.userDB(user);
      }
    })
    */
  }
  componentWillMount(){
    //this.getWork();
  }
  userDB(user) {
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
        UIDGoogleUser: user._user.uid,
        chPhone: user._user.phoneNumber,
        UIDClient: this.props.options.UIDClient,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //this.props.loadUser(user);
    })
    .catch((error) => {
      console.error(error);
    });

  }

  // токен для получения push
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
    //console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }
  onNotif(notif) {
    //console.log(notif);
    //Alert.alert(notif.title, notif.body);
    //if(this.props.user.userDB.iPushNotification === true)
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
    /*
    firebase.auth().onAuthStateChanged(user => {
      //console.log("==>");
      if (user) {
        this.setState({ 
          userEmail: user._user.email,
          userUid: user._user.uid,
        });
        //this.userDB(user);
        //console.log("userEmail = ", this.state.userEmail);
        //console.log("userUid = ", this.state.userUid);
        //console.log("this.props.user = ", this.props.user);

        //// для авторизации по емаил
        if(this.props.user._user.phoneNumber === undefined)
        {
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
    */
   /*
    firebase.messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        // user has a device token
        //console.log("fcmToken = ", fcmToken);
        this.insertRegisterToken(this.props.options.UIDClient, this.props.options.URL, fcmToken);
      } else {
        // user doesn't have a device token yet
        //console.log("user doesn't have a device token yet");
      } 
    });
    */
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
    };
  };
  renderStocks(nav){
    return this.props.banners.map((banners, index) => (
      <TouchableOpacity activeOpacity={0.9} style={{ height: 200, marginLeft: 22, marginRight: 22, }} key={index} onPress={() => nav('StocksView', { bannersId: banners.iStock, title: banners.chName, desc:banners.sDescriptio,  countInBasket: this.state.countInBasket })}>
        <View style={{elevation: 4, height: 180, borderRadius: 20, }}>
        <Image key={banners.iStock} source={{ uri: banners.sImage }} style={styles.img}/> 
        </View>
      </TouchableOpacity>
      )
    );
  }
  getTodayDayName(){
    var weekday=new Array(7);
    var d=new Date();
    weekday[0]="Понедельник";
    weekday[1]="Вторник";
    weekday[2]="Среда";
    weekday[3]="Четверг";
    weekday[4]="Пятница";
    weekday[5]="Суббота";
    weekday[6]="Воскресенье";
    console.log("Сегодня " + weekday[d.getDay()-1]);
    return weekday[d.getDay() - 1];
  }

  closeMessage()
  {
    //console.log("Мы закрыты");
    
    Alert.alert(
      'Уведомление',
      'Мы закрыты',
      [
        //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        /*{
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },*/
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  getWork()
  {
    const dayName = this.getTodayDayName(); // получаем название дня недели
    //console.log("dayName = ", dayName);
    this.props.locations.map((w, i) =>{ // парсим массив
      const worksTime = w.arrOperationMode; /// получаем массив с графиком работы
      workTimeToday = worksTime.filter(work => work.chDay === dayName);
      if(workTimeToday[0].blDayOff === true){ 
        //console.log("Мы закрыты"); 
        //this.closeMessage();

        this.setState({countClosesLocation: ++this.state.countClosesLocation}); 
      }
      else {
        var bStart = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          workTimeToday[0].time.tStartTime[0],
          workTimeToday[0].time.tStartTime[1],
          0); // 
        var bEnd = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          workTimeToday[0].time.tEndTime[0], 
          workTimeToday[0].time.tEndTime[1],
          0); // 

        //миллисекунд в одной минуте
        var msOneMinut=1000*60; 

        // Convert both dates to milliseconds 
        var tStartTime_ms = bStart.getTime(); // время открытия в миллисекндах
        var tEndTime_ms = bEnd.getTime(); // время закрытия 
        var currentTime_ms = new Date(); // текущее врмя в миллисекундах
        var iFirstOrder_ms = this.props.customers.iFirstOrder * msOneMinut; // за сколько можно заказываеть до открытия
        var iLastOrder_ms = this.props.customers.iLastOrder * msOneMinut; // за сколько можно заказываеть до закрытия

        // Рассчитайте разницу в миллисекундах
        var differenceStart_ms = tStartTime_ms - iFirstOrder_ms - currentTime_ms; 
        var differenceEnd_ms = tEndTime_ms - iLastOrder_ms - currentTime_ms; 
        intervalStart = Math.round(differenceStart_ms/msOneMinut);
        intervalEnd = Math.round(differenceEnd_ms/msOneMinut);
        // Convert back to days and return 
        //console.log("intervalStart >> ", intervalStart);
        //console.log("intervalEnd >> ", intervalEnd);
        if(intervalStart >= 0 || intervalEnd < 0) {  
          this.setState({countClosesLocation: ++this.state.countClosesLocation});
        }
      }
      //console.log("countClosesLocation = ", this.state.countClosesLocation);
      
      if(this.state.countClosesLocation === this.props.locations.length) {
        this.closeMessage();
      }
    })
  }
  render() {
    var {navigate} = this.props.navigation;
    //this.getTodayDayName();
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor={"#"+this.props.customers.chColorStatusBar}
          barStyle="default"
        />
        {
          this.state.didFinishInitialAnimation === false ?
          <ActivityIndicator size="large" color="#583286" />
          :
          <ScrollView>
            <LinearGradient 
              colors={["#"+this.props.customers.chColorGR2, "#"+this.props.customers.chColorGR3]} 
              style={{ 
                width: width,
                height: 220,
                borderBottomRightRadius: 250,
                borderBottomLeftRadius: 250,
              }}>
              <View style={ styles.viewStockTitleBtn }>
                <Text style={styles.textStocks} >Акции</Text>
                <TouchableOpacity  onPress={() => this.props.navigation.navigate('Stocks')}>
                  <Text style={ styles.textStocksAll}>все</Text>
                </TouchableOpacity>
              </View>
              <Swiper
                    backgroundColor={['#4285f4', '#0f9d58', '#f4b400', '#db4437']}
                    dots={true}
                    dotsBottom={10}
                    dotsColor="rgba(255, 255, 255, 0.25)"
                    dotsColorActive="rgba(255, 255, 255, 0.99)"
                    >
                    {this.renderStocks(navigate)}
              </Swiper>
            </LinearGradient>
            <Text style={ styles.textMenu}>Меню</Text>
            <View style={ styles.viewGridMenu }>
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
  textMenu: {
    color: '#4E4E4E', 
    fontFamily: 'OswaldSemiBold', 
    fontSize: 20,
    lineHeight: 37, 
    marginLeft: 34,
    marginTop: 12,
  },
  img:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  viewStockTitleBtn: { 
    height: 30, 
    marginBottom: 10,
    width: width, 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  textStocks: {
    color: '#F2F2F2', 
    fontFamily: 'OswaldBold',
    fontSize: 20,
    lineHeight: 37, 
    marginLeft: 32,
  },
  textStocksAll: {
    color: '#F2F2F2', 
    fontFamily: 'Roboto', 
    fontSize: 14,
    lineHeight: 24, 
    marginRight: 36, 
    marginTop: 10, 
    fontWeight: '600',
  },
  viewGridMenu: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    width: width-24,
    marginLeft: 0,
    flexDirection: 'row', 
    flexWrap: 'wrap',
    marginLeft: 12, 
    marginRight: 12,
    
  },
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
    locations: state.LocationReducer,
  }),
  dispatch => ({
    addUserData: (userData) => {
      dispatch({ type: 'EDIT_USER', payload: userData});
    },
    loadUser: (userData) => {
      dispatch({ type: 'LOAD_USER', payload: userData})
    },
    addOptionCounrOpenLoc: (optionData) => {
      dispatch({ type: 'ADD_OPTION', payload: optionData})
    }
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
