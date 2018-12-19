import React, { Component } from "react";
import { TouchableHighlight, TouchableOpacity, View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { connect } from 'react-redux';
const { width } = Dimensions.get('window');

class CardProduct extends Component {
    constructor(props){
        super(props);
        this.itemWidth = (Dimensions.get('window').width);
        // уставнока опции по-умолчанию и цены, на сколько изменится от выбора опции 
        if(this.props.optionsProduct.length > 0)
        {
            const result = this.props.optionsProduct.filter(offers => offers.blDefault ===  "true");

            this.state = {
                selectPriceChange: result[0].chPriceChange,
                selectIdSetsDetail: result[0].idSetsDetail,
                selectOptionsName: result[0].chName,
            }
        }
        else
        {
            this.state = {
                selectPriceChange: 0,
                selectIdSetsDetail: 0,
                selectOptionsName: '',
            }
        }
    }


    // render зачеркнутой цены
    oldPrice(iOldPrice){
        var view = '';
        if(iOldPrice === ""){
          view = <Text></Text>
        }
        else{
          view = <Text style={styles.textOldPriceStyle}> {parseFloat(iOldPrice).toFixed(2) + " " + this.props.customers.chCurrency} </Text>
        }
        return view;
    }
    generateKey = () => {
        return `${ new Date().getTime() }`;
    }

    btnOptionsSelect(options){

        if(options.length > 0)
        {
            return options.map((item, index) => (
            item.idSetsDetail === this.state.selectIdSetsDetail ?
                <TouchableOpacity
                style={{elevation: 3, width: 40, marginRight: 30, marginTop: 15,marginBottom: 15,}}
                key={index}
                    onPress={() => {
                        this.setState({
                            selectPriceChange: item.chPriceChange,
                            selectIdSetsDetail: item.idSetsDetail,
                            selectOptionsName: item.chName,
                        })
                    }
                }>
                    <Text style = {styles.btnWeightSelect}>
                        {item.chName}
                    </Text>
                </TouchableOpacity>
            :

                <TouchableOpacity
                style={{elevation: 3, width: 40, marginRight: 30, marginTop: 15,marginBottom: 15,}}
                key={index}
                    onPress={() => {
                        this.setState({
                            selectPriceChange: item.chPriceChange,
                            selectIdSetsDetail: item.idSetsDetail,
                            selectOptionsName: item.chName,
                        })
                    }
                }>
                    <Text style = {styles.btnWeight}>
                        {item.chName}
                    </Text>
                </TouchableOpacity>
            )
          );
        }
        
    }
    renderBtnInCart(idProduct){
        const result = this.props.cart.filter(cart => cart.iProduct === idProduct);
        if(result.length > 0)
        {
          return (
            <Text style = {styles.buttonText}>ДОБАВИТЬ ЕЩЁ</Text>
          )
        }
        else{
          return(<Text style = {styles.buttonText}>В КОРЗИНУ</Text>)
        }
        
      }
    render() {
        //const resultTemp = this.props.offers.filter(offers => offers.iProduct ===  this.props.iProduct);
        //const result = resultTemp.filter(offers => offers.iDefault ===  '1');
        return (
            <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.props.nav.navigate('ProductDetailView', { iProduct: this.props.iProduct, iCategories: this.props.iCategories,})}
            style={{ width: this.itemWidth, backgroundColor:'#F3F3F3'
            }}>
                <View style={{ elevation: 1, backgroundColor: '#fff', 
                borderRadius: 3, marginBottom: 10, 
                flexDirection: 'row',
                padding: 5,}}>
                    <View style={{ flex: 0.5, }}>
                        <Image
                        style={{width: 100, height: 100, zIndex: 0}}
                        source={ this.props.chMainImage === "" ? require('./assets/noImage.jpg') : { uri: this.props.chMainImage }}
                        defaultSource={require('./assets/noImageAvailable.png')}
                        />
                        <View style={{zIndex: 10, marginTop: this.props.tegsProduct.length > 1 ? -50 : -20}}>
                        {
                            this.props.tegsProduct.length > 0 ?
                            this.props.tegsProduct.map((t, index) =>(
                                <View key={index} style={{backgroundColor:  "#"+this.props.tegs.find(tf => tf.idTag === t.iTag).chColor,
                                width: 58, height: 19, marginLeft: -5, borderBottomEndRadius: 5,
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
                    <View style={{ flexDirection: 'column', flex: 1, }}>
                        <View style={{ flex: 1, }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={styles.textNameStyle}>{this.props.chName}</Text>
                                
                            </View>
                            <Text style={styles.textDescrStyle}>{this.props.chDescription}</Text>
                             { /*<Text style={styles.textWeightStyle}>Вес: {this.state.selectWeight}</Text> */ }
                            <View style={{
                                flexDirection: 'row',
                            }}>
                                {this.btnOptionsSelect(this.props.optionsProduct)}
                            </View>
                            
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'flex-end'}}>
                            <View style={{ flex: 1,  flexDirection: 'row', alignItems: 'flex-start',
                             justifyContent: 'flex-start',
                            }}>
                                <Text style={styles.textPriceStyle}> 
                                    {parseFloat(Number(this.props.chPrice) + Number(this.state.selectPriceChange)).toFixed(2) + " " + this.props.customers.chCurrency} 
                                </Text>
                                {this.oldPrice(this.props.chOldPrice)}
                                <View style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end" }}>
                                
                                <TouchableHighlight underlayColor='rgba(255,255,255,0)'
                                    style={{elevation: 3}}
                                        onPress={() => {
                                            var val = {};
                                            val = {
                                                key: this.generateKey(),
                                                idInCart: this.generateKey(),
                                                iProduct: this.props.iProduct,
                                                iCategories: this.props.iCategories,
                                                chMainImage: this.props.chMainImage,
                                                chName: this.props.chName,
                                                chDescription: this.props.chDescription,
                                                chPrice: this.props.chPrice,
                                                chOldPrice: this.props.chOldPrice,

                                                optionsId: this.state.selectIdSetsDetail,
                                                optionsPrice: this.state.selectPriceChange,
                                                optionsName: this.state.selectOptionsName,
                                                tegsProduct: this.props.tegsProduct
                                                //iPrice: this.state.selectPrice,
                                                //iOldPrice: this.state.selectOldPrice,
                                            }
                                            //console.log(val);
                                            
                                            this.props.addCart(val)        
                                        }
                                    }>
                                        {this.renderBtnInCart(this.props.iProduct)}
                                    </TouchableHighlight>


                                </View>
                               
                            
                            
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

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
    btnWeightSelect:{
        borderWidth: 0,
        borderColor: '#F891A9',
        backgroundColor: '#F891A9',
        color: '#fff',
        borderRadius: 20,
        textAlign: "center",
        width: 48,
        height: 24,
        fontFamily: 'Roboto',
        fontSize: 10,
        lineHeight: 12,
        paddingTop: 7,
    },
    btnWeight:{
        borderWidth: 1,
        borderColor: '#F891A9',
        backgroundColor: '#FFF',
        color: '#828282',
        borderRadius: 20,
        textAlign: "center",
        width: 48,
        height: 24,
        fontFamily: 'Roboto',
        fontSize: 10,
        paddingTop: 5,  
    },
    buttonText:{
        borderWidth: 0,
        padding: 7,
        borderColor: '#6A3DA1',
        backgroundColor: '#6A3DA1',
        color: '#fff',
        fontWeight: "600",
        borderRadius: 4,
        textAlign: "center",
        width: 110,
        fontFamily: 'OswaldMedium',
        fontSize: 11,
    },
    textNameStyle: { 
        flex: 1, 
        fontSize: 14, 
        fontWeight: "600", 
        color: '#4E4E4E',
        fontFamily: 'Roboto',
        fontWeight: '600',
        lineHeight: 24
    },
    textDescrStyle:{
        fontSize: 12, 
        flex: 1,  
        paddingRight: 10,
        fontFamily: 'Roboto',
        color: '#828282',
        lineHeight: 14,
        paddingBottom: 3,
  

        
    },
    textWeightStyle:{
        fontFamily: 'Roboto',
        color: '#828282',
        fontSize: 10,
 
    },
    textOldPriceStyle:{
        fontSize: 10, 
        justifyContent: 'flex-end', 
        color: '#BDBDBD', 
        textDecorationLine: 'line-through', 
        marginTop: 6, 
        
    },
    textPriceStyle: {
        marginTop: 3,
        fontSize: 14, 
        justifyContent: 'flex-end', 
        color: '#4E4E4E',
        fontWeight: "600",
        fontFamily: 'Roboto',
        lineHeight: 24
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
  )(CardProduct);