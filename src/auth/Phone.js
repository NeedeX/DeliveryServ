import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image, ImageBackground, StatusBar, StyleSheet, TouchableHighlight} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import Header from '../components/Header';

class PhoneAuth extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+375',
      confirmResult: null,
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
      header: (props) => <Header title={'Регистрация'} nav={ navigation } {...props} />,
    };
  };
  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } 
      else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+375',
          confirmResult: null,
        });
      }
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }

 

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({ message: 'Отправка кода ...' });

    firebase.auth().signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => this.setState({ confirmResult, message: 'Код отправлен!' }))
      .catch(error => this.setState({ message: `Ошибка входа по номеру телефона: ${error.message}` }));
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Код подтвержден!' });
        })
        .catch(error => this.setState({ message: `Ошибка подтверждения кода: ${error.message}` }));
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  }
  
  renderPhoneNumberInput() {
   const { phoneNumber } = this.state;
      
    return (
      
      <View style={{ padding: 25, marginTop: 25,}}>
        <Text style={styles.styleTitle}>Регистрация по номеру телефона</Text>
        <Text style={styles.styleText}>На этот номер телефона будет отравлено SMS с кодом</Text>
        
        <TextInput
          autoFocus
          keyboardType={'phone-pad'}
          style={styles.styleInputNumber}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={'Номер телефона ... '}
          value={phoneNumber}
        />
        <TouchableHighlight  underlayColor='rgba(255,255,255,0.1)'
          style={{justifyContent: 'center', alignItems: 'center', marginTop: 10,}}
          onPress={this.signIn}>
          <Text style={{
            fontFamily: 'OswaldMedium',
            fontSize: 12,
            color: '#FFFFFF',
            borderWidth: 0,
            padding: 10,
            borderColor: '#6A3DA1',
            backgroundColor: '#6A3DA1',
                borderRadius: 5,
                paddingLeft: 10,
                paddingRight: 10,
          }}>
            ОТПРАВИТЬ КОД
          </Text>
        </TouchableHighlight>
      </View>
    
    );
  }
  
  renderMessage() {
    const { message } = this.state;
  
    if (!message.length) return null;
  
    return (
      <Text style={{ padding: 5, backgroundColor: '#fff', color: '#000' }}>{message}</Text>
    );
  }
  
  renderVerificationCodeInput() {
    const { codeInput } = this.state;
  
    return (
      <View style={{ marginTop: 25, padding: 25, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.styleTitle}>Введите код</Text>
        <TextInput
          autoFocus
          style={styles.styleInputNumberKod}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Код'}
          value={codeInput}
        />
        <TouchableHighlight  underlayColor='rgba(255,255,255,0.1)'
          style={{justifyContent: 'center', alignItems: 'center', marginBottom: 20,}}
          onPress={this.signIn}>
          <Text style = {styles.buttonText}>
            ВВЕСТИ КОД
          </Text>
        </TouchableHighlight> 
        <Text style={styles.styleText}>Если Вам течение N времени не пришло сообщение</Text>

        <TouchableHighlight  underlayColor='rgba(255,255,255,0.1)'
          style={{justifyContent: 'center', alignItems: 'center', marginBottom: 20,}}
          onPress={this.signIn}>
          <Text style={{color: '#6A3DA1'}}>
            Отправить код еще раз
          </Text>
        </TouchableHighlight> 

      </View>
    );
  }
  userDB() {
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
        UIDGoogleUser: this.props.user._user.uid,
        chPhone: this.props.user._user.phoneNumber,
        UIDClient: this.props.options.chUIDClient,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {

    })
    .catch((error) => {
      console.error(error);
    });

  }

  render() {
    const { user, confirmResult } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="#583286"
          barStyle="light-content"
        />
        <View>
        {!user && !confirmResult && this.renderPhoneNumberInput()}
        {this.renderMessage()}
        {!user && confirmResult && this.renderVerificationCodeInput()}
        {user && (
          <View style={{ padding: 15, justifyContent: 'center', alignItems: 'center', flex: 1, }} >
          {this.props.loadUser(user)}
          {
            //this.userDB(user)
          }
          {this.props.navigation.navigate('Main')}
          
          {/*
            <Image source={{ uri: successImageUri }} style={{ width: 100, height: 100, marginBottom: 25 }} />
            <Text style={{ fontSize: 25 }}>Выход!</Text>
            <Text>{JSON.stringify(user)}</Text>
            <Button title="Выход" color="red" onPress={this.signOut} />
          */}
          </View>
          )
        }
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  styleTitle:{
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    color: '#4E4E4E', alignItems: 'center', justifyContent: 'center',
  },
  styleText:{
    color: '#828282',
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
  },
  styleInputNumber:
  {
    height: 40, marginTop: 15, marginBottom: 15,
    backgroundColor: 'rgba(51, 51, 51, 0.06)',
    borderRadius: 4,
  },
  styleInputNumberKod:{
    height: 40, marginTop: 15, marginBottom: 15,
    backgroundColor: 'rgba(51, 51, 51, 0.06)',
    borderRadius: 4,
    width: 100,
    textAlign: 'center',
  },
  buttonText:{
    fontFamily: 'OswaldMedium',
    fontSize: 12,
    color: '#FFFFFF',
    borderWidth: 0,
    padding: 10,
    borderColor: '#6A3DA1',
    backgroundColor: '#6A3DA1',
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: "center",
        width: 100,

        
  },
  ImageStyle:{
    marginTop: 10,
    width: 195, 
    height: 107,

  }
});



export default connect (
  state => ({
    cart: state.CartReducer,
    banners: state.BannerReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    options: state.OptionReducer,
    user: state.UserReducer,
  }),
  dispatch => ({
    loadUser: (userData) => {
      dispatch({ type: 'LOAD_USER', payload: userData})
    },
/*
    loadBanners: (bannersData) => {
      dispatch({ type: 'LOAD_BANNERS', payload: bannersData});
    },
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
)(PhoneAuth);

/*

 qqq(){
    firebase.auth()
    .verifyPhoneNumber(phoneNumber)
    .on('state_changed', (phoneAuthSnapshot) => {
      // How you handle these state events is entirely up to your ui flow and whether
      // you need to support both ios and android. In short: not all of them need to
      // be handled - it's entirely up to you, your ui and supported platforms.
  
      // E.g you could handle android specific events only here, and let the rest fall back
      // to the optionalErrorCb or optionalCompleteCb functions
      switch (phoneAuthSnapshot.state) {
        // ------------------------
        //  IOS AND ANDROID EVENTS
        // ------------------------
        case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
          console.log('code sent');
          // on ios this is the final phone auth state event you'd receive
          // so you'd then ask for user input of the code and build a credential from it
          // as demonstrated in the `signInWithPhoneNumber` example above
          break;
        case firebase.auth.PhoneAuthState.ERROR: // or 'error'
          console.log('verification error');
          console.log(phoneAuthSnapshot.error);
          break;
  
        // ---------------------
        // ANDROID ONLY EVENTS
        // ---------------------
        case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
          console.log('auto verify on android timed out');
          // proceed with your manual code input flow, same as you would do in
          // CODE_SENT if you were on IOS
          break;
        case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
          // auto verified means the code has also been automatically confirmed as correct/received
          // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
          console.log('auto verified on android');
          console.log(phoneAuthSnapshot);
          // Example usage if handling here and not in optionalCompleteCb:
          // const { verificationId, code } = phoneAuthSnapshot;
          // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
  
          // Do something with your new credential, e.g.:
          // firebase.auth().signInWithCredential(credential);
          // firebase.auth().currentUser.linkWithCredential(credential);
          // etc ...
          break;
      }
    }, (error) => {
      // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
      // the ERROR case in the above observer then there's no need to handle it here
      console.log(error);
      // verificationId is attached to error if required
      console.log(error.verificationId);
    }, (phoneAuthSnapshot) => {
      // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
      // depending on the platform. If you've already handled those cases in the observer then
      // there's absolutely no need to handle it here.
  
      // Platform specific logic:
      // - if this is on IOS then phoneAuthSnapshot.code will always be null
      // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
      //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
      // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
      //   continue with user input logic.
      console.log(phoneAuthSnapshot);
    });
  // optionally also supports .then & .catch instead of optionalErrorCb &
  // optionalCompleteCb (with the same resulting args)
  }

*/