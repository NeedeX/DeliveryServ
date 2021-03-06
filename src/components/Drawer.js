import React from 'react';
import {StyleSheet, View, Dimensions, Image, Text, Linking, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
//import Dialog, { DialogTitle, DialogContent,  DialogButton, } from 'react-native-popup-dialog';
//const bg  = require('../components/assets/drawerBg.png');
//import RNRestart from 'react-native-restart'
const { width, height } = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
class Drawer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        authState: 0,
        dialogSelectPhone: false,
        phone: '',
        email: '',
    }  

  }
  componentDidMount()
    {
      
        firebase.auth().onAuthStateChanged(user => {
            //console.log("==>");
            if (user) {
                this.setState({ 
                  authState: 1, 
                  phone: user._user.phoneNumber,
                  email: user._user.email,
                });
               
                //this.loadingFavorites(user.uid);
                //console.log("user => ", user);
            }
            else
                this.setState({ authState: 0 });
        });
        

    }
  toggleDrawer = () => {
    this.props.navigator.toggleDrawer({
      side: 'left'
    });
  };
  signOut = () => {
    
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //this.loadingFavorites(user.uid);
        //console.log("user => ", user);
        this.props.clearHistory();
        this.props.clearFavorites();
        //this.props.navigation.navigate('Main');
        //RNRestart.Restart();
      }
    });
    
  }
  phoneOpen(chPhone){
    Linking.openURL('tel:'+chPhone)
 
    ///Linking.openURL(chPhone).catch((err) => console.error('An error occurred', err));
  }
  //********** */ обработчики диалогового окна 
  showDialogSort = () => { this.setState({ dialogSelectPhone: true }); };

  renderDialogSort()
    {
    
      return (
        <Dialog
          onTouchOutside={() => { this.setState({ dialogSelectPhone: false }); }}
          width={0.9}
          visible={this.state.dialogSelectPhone}
          dialogTitle={
            <DialogTitle
              title="Выберите телефон"
              hasTitleBar={false}
              align='left'
              textStyle={{ color: '#F2F2F2', padding: 0, marginLeft: 10,}}
              style={{ backgroundColor: '#6A3DA1', padding: 10, margin: 0, borderRadius: 6,}}
            />
          }
          actions={[
            <DialogButton
              text="Отмена"
              textStyle={{ color: 'rgba(0, 0, 0, 0.38)', 
              fontFamily: 'Roboto',
              fontSize: 14,
              lineHeight: 16,
            }}
              onPress={() => { this.setState({ dialogSelectPhone: false }); }}
              key="button-1"
            />,
          ]}
        >
          <DialogContent>
            <View>
              {
                
                this.props.locations.length > 0 ?
    
                this.props.locations.map((i, index) => (
                  i.arrPhones.map((p, index) => (
 
                    <Text key={index} onPress={ ()=>{  
                      this.phoneOpen(p.chPhone)
                      //Linking.openURL(p.chPhone) 
                      }}>
                      {p.chPhone}
                    </Text>
                  ))
                ))
                :
                null
              }
            </View>
          </DialogContent>
        </Dialog>
      )
    }
    
  render() {
    return ( 
      
        <LinearGradient 
            //colors={['#4c669f', '#192f6a']} 
            colors={[
              this.props.customers.chColorGR1 !== undefined ? "#"+this.props.customers.chColorGR1 : '#eee', 
              this.props.customers.chColorGR3 !== undefined ? "#"+this.props.customers.chColorGR3 : '#eee', 
            ]} 
            style={{ flex: 1, height: height}} >
            {/*<ImageBackground  
        source={bg} 
        style={{ flex: 1, width: 318,}} 
        imageStyle={{ resizeMode: 'stretch' }}>
      */}
        <View style={{flexDirection: 'row', paddingTop: 20, paddingLeft: 20,}}>
          <View style={{ width: 50, height: 50,}}>
            <Image source={ require('./assets/iconAvatar.png')} 
            style={{  width: 45, height: 45, }}/>
          </View>
          {
            this.state.authState === 1 ?
              <View style={{ height: 50, paddingLeft: 20,}}>
              {
                this.props.user.userDB !== undefined ?
                <View>
                  {
                    this.props.user.userDB.chFIO !== '' ?
                    <TouchableOpacity  onPress={() => this.props.navigation.navigate('Settings')}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 20 }}>{this.props.user.userDB.chFIO}</Text>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}>{this.state.phone !== null ? this.state.phone : this.state.email}</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity  onPress={() => this.props.navigation.navigate('Settings')}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 17,
                      marginTop: 12, marginLeft: -15,
                    }}>{this.state.phone !== null ? this.state.phone : this.state.email}</Text>
                    </TouchableOpacity>
                  }
                </View>
                :
                <TouchableOpacity  onPress={() => this.props.navigation.navigate('Settings')}>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 17,
                      marginTop: 12, marginLeft: -15,}}>{this.state.phone !== null ? this.state.phone : this.state.email}</Text>
                </TouchableOpacity>
              }
              </View>
            :
            <View style={{ height: 50, paddingLeft: 20, paddingTop: 10,}}>
              <TouchableOpacity  onPress={() => this.props.navigation.navigate('Phone')}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 20 }}>Войти</Text>
              </TouchableOpacity>
            </View>
          }
          
        </View>
        
        <View
            style={{
              borderBottomColor: 'rgba(255, 255, 255, 0.12)',
              borderBottomWidth: 1,
              alignSelf:'stretch',
              width: 300,
              marginTop: 20,
              marginBottom: 20,
            }}
          />
  
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('Main');
          this.props.navigation.closeDrawer();
          }}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconMenuDrawer.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Меню</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('Cart');
          this.props.navigation.closeDrawer();
        }}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconCart.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Корзина</Text>
            {
              this.props.cart.length > 0 ?
              <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 12,
          marginLeft: 20, backgroundColor: '#F77694', width: 17, height: 17,
          paddingLeft: 5, marginTop: 2,
          borderRadius: 10,}}>{this.props.cart.length}</Text>
          : null
            }
            
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { 
          this.props.navigation.navigate('Favorites');
          this.props.navigation.closeDrawer();
          }}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconFavorites.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Избранное</Text>
          </View>
        </TouchableOpacity>
   
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('History');
          this.props.navigation.closeDrawer();
        }}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconHistory.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>История заказов</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('Stocks');
          this.props.navigation.closeDrawer();
          }}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconStocks.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Акции</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('DeliveryAndPays');
          this.props.navigation.closeDrawer();
          }}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconDelivery.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Доставка и оплата</Text>
          </View>
        </TouchableOpacity>
        <View
            style={{
              borderBottomColor: 'rgba(255, 255, 255, 0.12)',
              borderBottomWidth: 1,
              alignSelf:'stretch',
              width: 250,
              marginLeft: 20,
              marginBottom: 20,
            }}
          />
        {
          //this.renderDialogSort()
        }

        {
          this.props.customers.chPhoneForOperator !== '' ?
          <TouchableOpacity onPress={() => {
            this.phoneOpen(this.props.customers.chPhoneForOperator);
            this.props.navigation.closeDrawer();
          }}>
            <View style={{ flexDirection: 'row', marginBottom: 20, }}>
              <Image source={require('./assets/iconOperator.png')} 
              style={ styles.iconsMenu }/>
              <Text style={styles.textMenu}>Связь с оператором</Text>
            </View>
          </TouchableOpacity>
          :
          null
        }
        
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('Stocks');
          this.props.navigation.closeDrawer();
        }}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconAbout.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>О приложении</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('Login');
          this.props.navigation.closeDrawer();
          }}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconAbout.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Войти по e-mail</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>  {this.signOut();this.props.navigation.closeDrawer();}}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconAbout.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Выйти</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>{ this.props.navigation.navigate('Test'); this.props.navigation.closeDrawer();}}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconAbout.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Test</Text>
          </View>
        </TouchableOpacity>
        {/*</ImageBackground> */}
        </LinearGradient>
        


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageAvatarStyle: {
    width: 48, 
    height: 48,
  },
  textInputStyle: {
    fontSize: 20, 
    color: '#fff',
    marginLeft: 20, 
    marginTop: 8,
    fontFamily: 'Roboto',
  },
  iconsMenu: { width: 20, height: 20, marginLeft: 20, marginRight: 20,},
  textMenu: { color: 'rgba(255, 255, 255, 0.87)', fontSize: 14,}
  
});

export default connect (
  state => ({
    cart: state.CartReducer,
    banners: state.BannerReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    order: state.OrderReducer,
    user: state.UserReducer,
    locations: state.LocationReducer,
    customers: state.CustomersReducer,
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
    clearHistory: (data) => {
      dispatch({ type: 'CLEAR_HISTORY', payload: data});
    },
    clearFavorites: (data) => {
      dispatch({ type: 'CLEAR_FAVORITE', payload: data});
    },
    /*
    onEditRootCategory: (categoryData) => {
      dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
    },    
    onEditCategory: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },*/
  })
)(Drawer);