import React from 'react';
import {StyleSheet, View, ImageBackground, Image, Text, Linking, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import Dialog, { DialogTitle, DialogContent,  DialogButton, } from 'react-native-popup-dialog';
const bg  = require('../components/assets/drawerBg.png');

class Drawer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        authState: 0,
        dialogSelectPhone: false,
    }  

  }
  componentDidMount()
    {
        firebase.auth().onAuthStateChanged(user => {
            //console.log("==>");
            if (user) {
                this.setState({ authState: 1 });
               
                //this.loadingFavorites(user.uid);
                //console.log(user.uid);
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
        //console.log(user.uid);
        this.props.clearHistory();
        this.props.clearFavorites();
        this.props.navigation.navigate('Main')
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
      
      <ImageBackground  
        source={bg} 
        style={{ flex: 1, width: 318,}} 
        imageStyle={{ resizeMode: 'stretch' }}>
        <View style={{flexDirection: 'row', paddingTop: 20, paddingLeft: 20,}}>
        
          <View style={{ width: 50, height: 50,}}>
            <Image source={ require('./assets/iconAvatar.png')} 
            style={{  width: 45, height: 45, }}/>
          </View>
          {
           
            this.state.authState === 1 ?
            <View>
              { 
                /*по email */
                this.props.user._user.phoneNumber === null ? 
                <View>
                  {
                    this.props.user._user.displayName === null ?
                    <View>
                      <TouchableOpacity  onPress={() => this.props.navigation.navigate('Settings')}>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 16, marginTop: 14, marginLeft: 10,}}>{this.props.user._user.email}</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <View style={{ height: 50, paddingLeft: 20,}}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 20 }}>{this.props.user.displayName}</Text>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}>{this.props.user._user.email}</Text>
                    </View>
                  }
                </View>
                
                : /* по телефону */
                <View>
                  {
                    this.props.user._user.displayName === null ?
                    <TouchableOpacity  onPress={() => this.props.navigation.navigate('Settings')}>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 16, marginTop: 14, marginLeft: 10,}}>{this.props.user._user.phoneNumber}</Text>
                    </TouchableOpacity>
                    :
                    <View style={{ height: 50, paddingLeft: 20,}}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 20 }}>{this.props.user.displayName}</Text>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}>{this.props.user.phoneNumber}</Text>
                    </View>
                  }
                </View>
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
  
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconMenuDrawer.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Меню</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')}>
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
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Favorites')}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconFavorites.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Избранное</Text>
          </View>
        </TouchableOpacity>
   
        <TouchableOpacity onPress={() => this.props.navigation.navigate('History')}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconHistory.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>История заказов</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Stocks')}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconStocks.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Акции</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('DeliveryAndPays')}>
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
        {this.renderDialogSort()}
        <TouchableOpacity onPress={() => this.showDialogSort()}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconOperator.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Связь с оператором</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Stocks')}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconAbout.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>О приложении</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconAbout.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Войти по e-mail</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>  this.signOut() }>
          <View style={{ flexDirection: 'row', marginBottom: 20, }}>
            <Image source={require('./assets/iconAbout.png')} 
            style={ styles.iconsMenu }/>
            <Text style={styles.textMenu}>Выйти</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>


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