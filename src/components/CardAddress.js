import React from 'react';
import { StyleSheet, Dimensions, TouchableHighlight, Text, View, ImageBackground, TouchableOpacity, Image, ScrollView} from 'react-native';
import { connect } from 'react-redux';

class CardAddress extends React.Component {
    divider() {
        return(
        <View style={{
            flex: 1,
            borderBottomColor: '#E2E2E2',
            borderBottomWidth: 1,
            marginLeft: 10,
            marginRight: 10,
            justifyContent: 'center', 
            alignItems: 'center',
        }} />)
    }
    // удаление адреса из БД
    delAddress(idAddress) {
        return fetch('http://mircoffee.by/deliveryserv/app/DelAddress.php',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': "gzip, deflate",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idAddress: idAddress, })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            val = { idAddress: idAddress, }
            this.props.delAddress(val);
        })
        .catch((error) => {  console.error(error); });
        
    }
    addSelectAddresses(id, routeGoBack) {
        //console.log(id);
        const tempArrLoc = this.props.addresses.find(i => i.idAddress === id);
        if(routeGoBack === 'Checkout')
        {
          
            var val = {
                addressPickup: 0,
                addressDelivery: tempArrLoc.chAddress,
                addressDeliveryInput: 0,
            }
            this.props.addItemOrder(val); // добавляем адрем в редакс
            this.props.nav.navigate(routeGoBack);// переходим обрано откуда пришли
        }
    }
    render() {
        return(
            <TouchableOpacity activeOpacity={0.9}
            onPress={() =>  this.addSelectAddresses(this.props.idAddress, this.props.routeGoBack) }>
            <View style={{ marginBottom: -8, }}>
                <Text style={ styles.textStyle }>
                г.{this.props.chCity}</Text>
            </View>
            
            <View style={{
                backgroundColor: '#fff',
                elevation: 2,
                borderRadius: 10,
                margin: 10,
                marginTop: 0,
            }}>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',

            }}>
                <View style={{
                    justifyContent:'flex-start',
                    flexDirection: 'row',
                }}>
                    <Image source={require('./assets/geo.png')} 
                            style={{
                                width: 14,
                                height: 20,
                                marginLeft: 10,
                                padding: 5,
                                marginTop: 5,
                            }}
                        />
                
                    <Text style={ styles.textStyle }>
                        {"ул." + this.props.chStreet + " " +this.props.chNumHome}{this.props.chHousing != "" ? "/"+this.props.chHousing+"," : ","}{" кв."+this.props.chApartment+","}
                    </Text>
                </View>
                    <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.delAddress(this.props.idAddress)}
                    >
                        <Image source={require('./assets/iconDelInCart.png')} 
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 10,
                                padding: 5,
                                marginTop: 5,
                            }}
                        />
                    </TouchableOpacity>
                </View>
                {this.divider()}
                {
                    this.props.chEntrance !== "" || this.props.chFloor !== "" ?
                    <View>
                        <Text style={ {
                            textAlign: 'left',
                            marginLeft: 10, 
                            height: 30,
                            padding: 5, 
                            color: '#828282', 
                            fontSize: 12,
                        } }>
                        {this.props.chEntrance !== "" ?"подъезд: "+this.props.chEntrance+",": ""}
                        {this.props.chFloor !== "" ?" этаж: "+this.props.chFloor:""}
                        </Text>
                        
                        
                    </View>
                    
                    :
                    <View />
                }
                
                
                
            </View>
        </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    textStyle:{ 
        textAlign: 'left',
        marginLeft: 10, 
        height: 30,
        padding: 5, 
        color: '#4E4E4E', 
        fontSize: 12,
    }
});
export default connect (
    state => ({
      cart: state.CartReducer,
      banners: state.BannerReducer,
      categories: state.CategoriesReducer,
      products: state.ProductsReducer,
      addresses: state.AddressReducer,
      options: state.OptionReducer,
      order: state.OrderReducer,
    }),
    dispatch => ({
        delAddress: (index) => {
            dispatch({ type: 'DELETE_ADDRESS', payload: index})
        },
        addOption: (index) => {
            dispatch({ type: 'ADD_OPTION', payload: index});
        },
        addItemOrder: (orderData) => {
            dispatch({ type: 'ADD_ITEM', payload: orderData});
        },
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
  )(CardAddress);