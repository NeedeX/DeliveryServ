import React, { Component } from "react";
import {
    TouchableHighlight,
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
} from "react-native";
import { connect } from 'react-redux';
const { width } = Dimensions.get('window');

class CardProductInCart extends Component {
    constructor(props){
        super(props);
        this.itemWidth = (Dimensions.get('window').width);
        this.state = {
            ingPrice: 0,
        }
        if(this.props.ing && this.props.ing.length > 0)
        {
            this.props.ing.map(i => (
                this.state.ingPrice = this.state.ingPrice + Number(i.chPriceChange)
            ))
        }        
    }
    oldPrice(iOldPrice)
    {
        var view = '';
        if(iOldPrice === "" || iOldPrice === undefined){
          view = <Text></Text>
        }
        else{
          view = <Text style={styles.textOldPriceStyle}> { parseFloat(iOldPrice).toFixed(2)+" " + this.props.customers.chCurrency} </Text>
        }
        return view;
    }
    renderIng(ingridientes){
        if(this.props.ing &&  ingridientes.length > 0)
        {
            return ingridientes.map(i => (
                <View style={{flexDirection: 'row', marginLeft: 10, fontSize: 10,}}>
                    <Text style={{fontSize: 10,}}>{i.chName}</Text>
                    <Text style={{fontSize: 10,}}> +{parseFloat(i.chPriceChange).toFixed(2) +" " + this.props.customers.chCurrency}</Text>

                </View>
            ))
        }
    }
    render() {
       
        return (
            <View style={{ marginBottom: 5, marginTop: 5,}}>
                <TouchableOpacity  key={this.props.index} underlayColor='rgba(255,255,255,0.1)'
                  style={{ borderRadius: 10, elevation: 1,}} 
                  onPress={() => this.props.navigation.navigate('ProductDetailView', { iProduct: this.props.iProduct, idInCart: this.props.idInCart, routeGoBack: 'inCart', iCategories: this.props.iCategories})}
                  >
                  <View style={{flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', flex: 1}}>
                    <View style={{ width: 80, alignItems: 'center', justifyContent:'center', padding:5, marginLeft: 5}}>
                      <Image
                        style={{width: 80, height: 80, zIndex: 0, }}
                        source={ this.props.chMainImage === "" ? require('./assets/noImage.jpg') : { uri: this.props.chMainImage }}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start',}}>
                      <Text style={styles.textNameStyle}>{this.props.chName}</Text>
                      <Text style={styles.texOptionStyle}>{this.props.optionsName} {parseFloat(Number(this.props.chPrice) + Number(this.props.optionsPrice)).toFixed(2) +" " + this.props.customers.chCurrency}</Text>
                      {this.renderIng(this.props.ing)}
                      <Text style={styles.textPriceStyle}> {parseFloat(Number(this.props.chPrice) + Number(this.props.optionsPrice) + Number(this.state.ingPrice)).toFixed(2) +" " + this.props.customers.chCurrency} </Text>
                                {this.oldPrice(this.props.chOldPrice)}
                    </View>
                    <View style={{justifyContent: 'flex-start', paddingTop: 10, paddingRight: 10,}}>
                      <TouchableOpacity underlayColor='rgba(255,255,255,0.1)'
                        onPress={() => { val = { key: this.props.key, idInCart: this.props.idInCart, iProduct: this.props.iProduct, } 
                        this.props.delCart(val); } }>
                        <Image style={{width: 25, height: 25}} source={require('./assets/iconDelInCart.png')}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
        );
    }
}

const styles = StyleSheet.create({

    textStyle:
    {
      backgroundColor: '#000',
      color: '#fff',
      justifyContent: 'center',
      textAlign: 'center',
    },
    textOldPriceStyle:{
        fontSize: 14, 
        justifyContent: 'flex-end', 
        color: '#BDBDBD', 
        textDecorationLine: 'line-through', 
        marginTop: 6, 
        marginLeft: 5
    },
    textDescrStyle:{
        fontSize: 10, 
        flex: 1,  
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: 'Roboto',
        color: '#828282',
    },
    textWeightStyle:{
        fontFamily: 'Roboto',
        color: '#828282',
        fontSize: 10,
        paddingLeft: 10,
    },
    textOldPriceStyle:{
        fontSize: 14, 
        justifyContent: 'flex-end', 
        color: '#BDBDBD', 
        textDecorationLine: 'line-through', 
        marginTop: 6, 
        marginLeft: 5
    },
    textPriceStyle: {
        marginTop: 3,
        fontSize: 14, 
        justifyContent: 'flex-end', 
        color: '#6A3DA1',
        fontWeight: "600",
        fontFamily: 'OswaldMedium',
    },
    textNameStyle: { 
        flex: 1, 
        fontSize: 14, 
        fontWeight: "600", 
        color: '#F67695',
        marginLeft: 10,
        fontWeight: "600",
        fontFamily: 'OswaldMedium',
    }
  
  
});
export default connect (
    state => ({
      cart: state.CartReducer,
      banners: state.BannerReducer,
      categories: state.CategoriesReducer,
      products: state.ProductsReducer,
      options: state.OptionReducer,
      tegs: state.TegsReducer,
      customers: state.CustomersReducer,
    }),
    dispatch => ({
      addCart: (index) => {
          dispatch({ type: 'ADD_CART', payload: index})
      },
      delCart: (index) => {
        dispatch({ type: 'DELETE_CART', payload: index})
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
  )(CardProductInCart);