import React from 'react';
import { StyleSheet, Dimensions, TouchableHighlight, Text, View, ImageBackground, TouchableOpacity, Image, ScrollView} from 'react-native';
import { connect } from 'react-redux';

class CardAddress extends React.Component {
    divider()
    {
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
    del(idAddress)
    {
        return fetch('http://mircoffee.by/deliveryserv/app/DelAddress.php',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': "gzip, deflate",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idAddress: idAddress,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //this.props.clearAddresses();
            /*
            responseJson.addresses.map( (addresses) => {
                this.props.loadAddresses(addresses);
            });
            */
           
            val = {
                idAddress: idAddress,
            }
            this.props.delAddress(val);
        })
        .catch((error) => {
        console.error(error);
        });
        
    }
    addSelectAddresses(id, route)
    {
        console.log(route);
        
        if(route === 'Checkout')
        {
            var val = {
                addressSelect: "",
            }
            this.props.addOption(val);
            var val = {
                addressSelect: id,
            }
            
            this.props.addOption(val);
            
            if(this.props.options.addressSelect === id)
                this.props.nav.navigate('Checkout');
            else
            {
                this.props.addOption(val);
                this.props.nav.navigate('Checkout');
            
            }
        }  
    }
    render() {
        return(
            <TouchableOpacity activeOpacity={0.9}
            onPress={() =>  this.addSelectAddresses(this.props.idAddress, this.props.routeGoBack) }>
            <View style={{
                backgroundColor: '#fff',
                elevation: 3,
                borderRadius: 10,
                margin: 10,
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
                    onPress={() => this.del(this.props.idAddress)}
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
                        <Text style={ styles.textStyle }>
                        {this.props.chEntrance !== "" ?"подъезд: "+this.props.chEntrance+",": ""}
                        {this.props.chFloor !== "" ?" этаж: "+this.props.chFloor:""}
                        </Text>
                        
                        {this.divider()}
                    </View>
                    
                    :
                    <View />
                }
                
                <Text style={ styles.textStyle }>
                г.{this.props.chCity}</Text>
                
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
    }),
    dispatch => ({
      delAddress: (index) => {
        dispatch({ type: 'DELETE_ADDRESS', payload: index})
      },
      addOption: (index) => {
        dispatch({ type: 'ADD_OPTION', payload: index});
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