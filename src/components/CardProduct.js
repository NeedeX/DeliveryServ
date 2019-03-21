import React, { Component } from "react";
import { TouchableHighlight, TouchableOpacity, View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { connect } from 'react-redux';
const { width } = Dimensions.get('window');

class CardProduct extends Component {
    constructor(props){
        super(props);
        // this.props.iProduct 
        // this.props.nav 
        const product = this.props.products.filter(item  => +item.iProduct === +this.props.iProduct);
        
        // если у товара есть опции, то смотрим какие. Записываем выбранные по умолчанию в стейт.
        // чтобы если юзер не изменит выбор, добавить установленные по умолчанию в корзину.
        // проверяем есть ли у товара опции. Например: у пиццы размер, у букета, длина стебля 
        if(product[0].options.length > 0) { 
            //  опции у товара есть. Ищем строку, которая помечнена как по-умолчавнию
            const result = product[0].options.filter(option => option.blDefault ===  "true");
            // создаем стейт с выбранными по-умолчанию опциями
            this.state = {
                selectPriceChange: result[0].chPriceChange, // на сколько зменится цена
                selectIdSetsDetail: result[0].idSetsDetail, // id опции
                selectOptionsName: result[0].chName, // название опции
                product: product[0], // елемент отображаемый в карточке
            }
        }
        else {
            // создаем стейт нулевыми опциями
            this.state = {
                selectPriceChange: 0,
                selectIdSetsDetail: 0,
                selectOptionsName: '',
                product: product[0], // елемент отображаемый в карточке
            }
        }
        
    }
    // генерация уникального числа
    generateKey = () => {
        return `${ new Date().getTime() }`;
    }
    btnOptionsSelect(options){
        if(options.length > 0) {
            return options.map((item, index) => (
            item.idSetsDetail === this.state.selectIdSetsDetail ?
                <TouchableOpacity
                style={{elevation: 2, width: 40, marginRight: 30,}}
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
                style={{elevation: 2, width: 40, marginRight: 30,}}
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
        ///console.log(" >>>> ", this.state.product );
        return (
            <TouchableOpacity activeOpacity={1}
            onPress={() => this.props.nav.navigate(
                'ProductDetailView', 
                { iProduct: this.state.product.iProduct, iCategories: this.state.product.iCategories, })}>
                <View style={{
                    elevation: 2,
                    width: width,
                    flexDirection: 'row',
                    marginBottom: 8,
                    flex: 1,
                    backgroundColor: '#fff',
                }}>
                {/** Картинка */}
                <View style={{ 
                    width: width/3 + 16,
                    paddingTop: 24,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingBottom: 8,
                }}>
                    <Image
                        style={{width: width/3, height: width/3, zIndex: 0,}}
                        source={ this.state.product.chMainImage === "" ? require('./assets/noImage.jpg') : { uri: this.state.product.chMainImage }}
                        defaultSource={require('./assets/noImage.jpg')}
                        />
                        <View style={{zIndex: 10, marginTop: this.state.product.tegs.length > 1 ? -50 : -20}}>
                        {
                           this.state.product.tegs.length > 0 ?
                           this.state.product.tegs.map((t, index) =>(
                                <View key={index} style={{backgroundColor:  "#"+this.props.tegs.find(tf => tf.idTag === t.iTag).chColor,
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
                    {/** Информация */}
                    <View style={{
                        flex: 1,
                        backgroundColor: 'white',
                        paddingTop: 18,
                    }}>
                        <Text style={ styles.textName }>
                            {this.state.product.chName}
                        </Text>
                        <Text style={ styles.textDescription }>
                            {this.state.product.chDescription}
                        </Text>
                        {/** кнопки опций */}
                        <View style={{  flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16,}}>
                            {this.btnOptionsSelect(this.state.product.options)}
                        </View>
                        {/** цена и кнопка купить */}
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between',}}>
                            {/** цена */}
                            <View style={{ flexDirection: 'row', marginTop: 3,}}>
                                <Text style={ styles.textPriceStyle }>
                                {parseFloat(Number(this.state.product.chPrice) + Number(this.state.selectPriceChange)).toFixed(2) + " " + this.props.customers.chCurrency} 
                                </Text>
                                {this.oldPrice(this.state.product.chOldPrice)}
                            </View>
                            {/** кнопка */}
                            <View style={{ marginRight: 8, marginBottom: 8,}}>
                                <TouchableHighlight underlayColor='rgba(255,255,255,0)'
                                    style={{elevation: 2}}
                                    onPress={() => {
                                        var val = {};
                                        val = {
                                            key: this.generateKey(),
                                            idInCart: this.generateKey(),
                                            iProduct: this.state.product.iProduct,
                                            iCategories: this.state.product.iCategories,
                                            chMainImage: this.state.product.chMainImage,
                                            chName: this.state.product.chName,
                                            chDescription: this.state.product.chDescription,
                                            chPrice: this.state.product.chPrice,
                                            chOldPrice: this.state.product.chOldPrice,
                                            optionsId: this.state.selectIdSetsDetail,
                                            optionsPrice: this.state.selectPriceChange,
                                            optionsName: this.state.selectOptionsName,
                                            tegsProduct: this.state.product.tegs
                                        }     
                                        this.props.addCart(val)        
                                    }
                                    }>
                                    {this.renderBtnInCart(this.state.product.iProduct)}
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    textName: {
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#4E4E4E',
        marginBottom: 16,
    },
    textDescription: {
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        fontSize: 12,
        color: '#828282',
        marginRight: 16,
        marginBottom: 16,
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
    textPriceStyle: {
        fontSize: 14, 
        justifyContent: 'flex-end', 
        color: '#4E4E4E',
        fontWeight: "600",
        fontFamily: 'Roboto',
        lineHeight: 14,
    },
    textOldPriceStyle:{
        fontSize: 10, 
        justifyContent: 'flex-end', 
        color: '#BDBDBD', 
        textDecorationLine: 'line-through',
        marginTop: -10,
        
    },
    buttonText:{
        borderWidth: 0,
        paddingTop: 9,
        borderColor: '#6A3DA1',
        backgroundColor: '#6A3DA1',
        color: '#fff',
        fontWeight: "500",
        borderRadius: 4,
        textAlign: "center",
        width: 110,
        height: 36,
        fontFamily: 'OswaldMedium',
        fontSize: 12,

    },
});
export default connect (
    state => ({
        cart: state.CartReducer,
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
    })
)(CardProduct);