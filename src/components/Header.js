import React, {Component} from 'react';
import {StyleSheet, Text, TouchableHighlight, View, ImageBackground, Image} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

class Header extends Component {
    constructor(props) {
        super(props)

        if( this.props.title !== null )
            title = this.props.title
        else
            title = this.props.categories.find(x => x.iCategory ===  this.props.navigation.state.routes[this.props.navigation.state.routes.length-1].params.iCategories).chName
    
        this.state={ title: title,  }
      }
    render() {
      return (
        <View style={{ backgroundColor: '#eee' }}>
          {/*}  <ImageBackground
                style={{ height: 52,}}
                source={{uri: 'asset:/headerBg.png'}} >*/}
              <LinearGradient 
              colors={["#"+this.props.customers.chColorGR1, "#"+this.props.customers.chColorGR2]} 
              style={{ height: 52,}}>
            <View style={{justifyContent: 'space-between',flexDirection: 'row' }}>
                <TouchableHighlight 
                    underlayColor='rgba(255,255,255,0)'
                    onPress={() =>  this.props.navigation.openDrawer()} >
                    <Image style={styles.iconBtnStyle} source={ require('./assets/iconMenu.png')} />
                </TouchableHighlight>
                <Text style={styles.titleStyle}>{this.state.title  }</Text>
                <TouchableHighlight 
                    underlayColor='rgba(255,255,255,0)'
                    onPress={() =>  this.props.navigation.navigate('Cart')} >
                    <View>
                        
                        {
                          this.props.cart.length > 0 ?
                          <View>
                          <Image style={styles.iconBtnStyle} source={ require('./assets/iconCart.png')} />
                          <Text style={{
                            backgroundColor: '#F77694',
                            width: 16,
                            height: 16,
                            borderRadius: 20,
                            color: '#F2F2F2',
                            fontFamily: 'Roboto',
                            fontSize: 10,
                            fontWeight: '600',
                            zIndex: 100,
                            paddingLeft: this.props.cart.length > 9 ? 2 : 5,
                            paddingTop: 1,
                            marginLeft: 22,
                            marginTop: -28,
                        }}>{this.props.cart.length}</Text>
                          </View>
                          :
                          <Image style={styles.iconBtnStyle} source={ require('./assets/iconCart.png')} />
                          
                        }
                        
                    </View>
                </TouchableHighlight>
            </View>
            </LinearGradient>
        {/**</ImageBackground> */}
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
    titleStyle:{
        fontFamily: 'dosis-bold', 
        color: 'white', 
        fontFamily: 'Oswald',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 20,
        textAlign: 'center',
        color: '#FFFFFF',
        marginTop: 10,
    },
    iconBtnStyle: {
        width: 25,
        height: 25, 
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },

});
export default connect (
    state => ({
      cart: state.CartReducer,
      categories: state.CategoriesReducer,
      customers: state.CustomersReducer,
    }),
    dispatch => ({
      /*
      clearIng: (index) => {
        dispatch({ type: 'CLEAR_ING', payload: index})
      }
      /*
      onEditRootCategory: (categoryData) => {
        dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
      },    
      onEditCategory: (categoryData) => {
        dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
      },*/
    })
  )(Header);
