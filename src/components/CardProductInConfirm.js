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
import Dash from 'react-native-dash';
const { width } = Dimensions.get('window');

class CardProductInConfirm extends Component {
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
            <View>
                <View style={{backgroundColor: '#fff', 
                borderRadius: 0, 
                height: 120, flexDirection: 'row',  width: 320,
                padding: 10 }}>
                    <View style={{ flex: 0.5, }}>
                        <Image
                        style={{width: 80, height: 80, zIndex: 0}}
                        source={ this.props.chMainImage === "" ? require('./assets/noImage.jpg') : { uri: this.props.chMainImage }}
                        />
                        <View style={{zIndex: 10, marginTop: this.props.tegsProduct.length > 1 ? -50 : -20}}>
                        {
                            this.props.tegsProduct.length > 0 ?
                            this.props.tegsProduct.map(t =>(
                                <View style={{backgroundColor:  "#"+this.props.tegs.find(tf => tf.idTag === t.iTag).chColor,
                                width: 58, height: 19, marginLeft: -10, borderBottomEndRadius: 5,
                                borderTopRightRadius: 5, marginBottom: 5,  
                                }}>
                                    <Text style={{color: '#FFFFFF', textAlign: 'center', fontSize: 10,
                                paddingTop: 2,}}>
                                    
                                    { this.props.tegs.find(tf => tf.idTag === t.iTag).chTag }
                                    </Text>
                                </View>
                            ))
                            :
                            null
                        }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', flex: 1, marginTop: 16,}}>
                        <View style={{ flex: 1, }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between',}}>
                                <Text style={styles.textNameStyle}>{this.props.chName}</Text>
                                <TouchableOpacity underlayColor='rgba(255,255,255,0.1)'
                                style={{marginTop: -20,}}
                                onPress={() => {
                                        var val = {};
                                        val = {
                                            key: this.props.key,
                                            idInCart: this.props.idInCart,
                                            iProduct: this.props.iProduct,
                                        }
                                        this.props.delCart(val);
                                    }
                                }>
                                    <Image style={{width: 25, height: 25}} source={require('./assets/iconDelInCart.png')}/>
                                </TouchableOpacity>
                            </View>
                            { /* <Text style={styles.textDescrStyle}>{this.props.chComposition}</Text> */}
                            <Text style={styles.textWeightStyle}>{this.props.optionsName} {parseFloat(Number(this.props.chPrice) + Number(this.props.optionsPrice)).toFixed(2) +" " + this.props.customers.chCurrency}</Text>
                            
                            <View>
                                {this.renderIng(this.props.ing)}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginLeft: 7,}}>
                            
                                <Text style={styles.textPriceStyle}> {parseFloat(Number(this.props.chPrice) + Number(this.props.optionsPrice) + Number(this.state.ingPrice)).toFixed(2) +" " + this.props.customers.chCurrency} </Text>
                                {this.oldPrice(this.props.chOldPrice)}
                                
                            </View>
                        </View>
                        <View style={{ paddingLeft: 5, flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'flex-end'}}>
                            
                            <View style={{ flex: 1,  flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>


                            </View>
                        </View>
                    </View>
                    
                </View>

                {
                    this.props.index === this.props.cart.length - 1  ?
                    <Image style={{
                        width: 295,
                        marginLeft: (width - 40 - 290)/2,
                    }} source={require('./assets/lineDotted.png')} />
                    :
                    <View style={{
                        borderBottomColor: '#E2E2E2',
                        borderBottomWidth: 0.5,
                        width: 295,
                        marginLeft: (width - 40 - 290)/2,

                    }}/>
                }
   
                
                
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
  )(CardProductInConfirm);