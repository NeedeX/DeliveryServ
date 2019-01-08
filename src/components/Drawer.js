import React from 'react';
import {StyleSheet, View, ImageBackground, Image, Text, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
const bg  = require('../components/assets/drawerBg.png');

class Drawer extends React.Component {

  toggleDrawer = () => {
    this.props.navigator.toggleDrawer({
      side: 'left'
    });
  };

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
            1 < 0 ?
            <View style={{ height: 50, paddingLeft: 20,}}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 20 }}>Имя</Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}>+375 (22) 22-222-222</Text>
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
            <Text style={{ color: 'rgba(255, 255, 255, 0.87)', fontSize: 12,
          marginLeft: 20, backgroundColor: '#F77694', width: 17, height: 17,
          paddingLeft: 5, marginTop: 2,
          borderRadius: 10,}}>{this.props.cart.length}</Text>
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
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Stocks')}>
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
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Stocks')}>
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
    }
    /*
    onEditRootCategory: (categoryData) => {
      dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
    },    
    onEditCategory: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },*/
  })
)(Drawer);
