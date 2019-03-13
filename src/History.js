import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, InteractionManager, ActivityIndicator, ScrollView,TouchableOpacity, ImageBackground, Dimensions, Image} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import AnimatedHideView from 'react-native-animated-hide-view';
import Header from './components/Header';

import BGNoAuth from './components/BGNoAuth';
const { width } = Dimensions.get('window');


class History extends Component {
    constructor(props){
        super(props);
        this.state = {
            AuthState: 0,
            didFinishInitialAnimation: false,
        }  
        
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.loadingHistory(this.props.user.userDB.chUIDGoogleUser);
            }
          })
    }
    static navigationOptions({ navigation  }) {
        return {
            title: 'Home',
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
            },
            header: (props) => <Header title={'История заказов'} nav={ navigation } {...props} />,
        };
    };
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if (user) 
            { this.setState({ AuthState: 1 }); }
            else 
                this.setState({ AuthState: 0 });
        });
        InteractionManager.runAfterInteractions(() => {
            this.setState({ didFinishInitialAnimation: true, });
        });
    }
    loadingHistory(UIDGoogleUser){
        return fetch(this.props.options.URL + 'LoadingHistory.php',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': "gzip, deflate",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chUID: this.props.options.UIDClient,
                UIDGoogleUser: UIDGoogleUser,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => { 
            this.props.loadHistory(responseJson.history);
            console.log("this.props.history = ", this.props.history);
            
        })
        .catch((error) => {
        console.error(error);
        });
    }
    renderNoAuth(){
        return <BGNoAuth 
            text={'Для просмотра и добавления избранных товаров войдите в личный кабинет '}
            goBack={'Favorites'}
            nav={this.props.navigation} />
    }
    dateOrder(date)
    {
        arrDateTime = date.split(' ');
        arrDate = arrDateTime[0].split('-');
        arrTime = arrDateTime[1].split(':');
        dateInFormat = arrDate[2]+"."+arrDate[1]+"."+arrDate[0];
        timeInFormat = arrTime[0]+":"+arrTime[1];
        return(
            <View>
                <Text style={styles.textDate}>{dateInFormat}</Text>
                <Text style={styles.textDate}>{timeInFormat}</Text>
            </View>
        )
    }
    hideView(idOrder)
    {
        const resultProduct = this.props.history.filter(history => history.idOrder ===  idOrder);
        if(resultProduct[0].isView === true) {
            val = {
                idOrder: idOrder,
                isView: false,
            }
            this.props.editViewHistory(val);
        }
        else {
            val = {
                idOrder: idOrder,
                isView: true,
            }
            this.props.editViewHistory(val);
        }
        
        console.log("this.props.history = ", this.props.history);
    }
    renderCardHistory(){
        return(
            <View style={{
                backgroundColor: '#fff',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                height: 500,
            }}>
                <View style={styles.viewTextTitle}>
                    <Text style={ styles.textTitle}>Прошлые заказы</Text>
                </View>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    borderTopEndRadius: 0,
                    borderTopStartRadius: 0,
                    width: width - 40,
                    elevation: 2, 
                 }}>
                <ScrollView style={{paddingBottom: 10,}}>
            {
                this.props.history.map((item, index) => (
                <View key={index} style={{ marginBottom: 5, marginTop: 5,}}>
                    <TouchableOpacity  key={index} underlayColor='rgba(255,255,255,0.1)'
                      style={{ borderRadius: 10, elevation: 1, backgroundColor: '#F2F2F2', height: 50, }} onPress={() =>  this.hideView(item.idOrder) }>
                        <View style={{flexDirection: 'row', backgroundColor: '#F2F2F2', justifyContent: 'space-between', flex: 1}}>
                            <View style={{ width: 80, alignItems: 'center', justifyContent:'center', }}>
                                {this.dateOrder(item.dDateOrder)}
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', }}>
                                <Text style={styles.textTitleItems}>Заказано товаров: {item.sostav.length} </Text>
                                <Text style={styles.textTitleItems}>Стоимость: {item.chOrderPrice} {this.props.customers.chCurrency} </Text>
                            </View>
                            <View style={{paddingRight: 20, justifyContent: 'center', marginTop: -10,}}>
                                <Image
                                style={styles.arrowBottom} 
                                source={ !item.isView ? require('../assets/arrowBottom.png') : require('../assets/arrowTop.png')} 
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View>
                    <AnimatedHideView
                        visible={item.isView}
                        style={{ padding: 0, }}
                        duration={200}
                        unmountOnHide={true}
                        >
                        {
                            
                            item.sostav.map((i, index)=>(
                                this.renderItemsInSostav(i.chChangePrice,
                                i.chNameProduct, i.chOption, i.chPriceProduct, i.iProduct,
                                i.ingredients, index, item.sostav.length, this.props.navigation)
                            ))
                        }
                        
                    </AnimatedHideView>
                    </View>
                </View>
                ))
            }
            </ScrollView>
            </View>
            </View>
        )
    }
    renderIng(ingredients) {
        if(ingredients.length > 0)
        {
            return (ingredients.map((i, inedx) => (
                <View>
                    <Text style={{ color: '#828282', fontSize: 10,}}>
                    {i.chNameIngridients} + 
                    {parseFloat(Number(i.chChangePrice))} {this.props.customers.chCurrency}
                    </Text>
                </View>
            )))
        }
        else
            return null
    }
    renderItemsInSostav(chChangePrice, chNameProduct, chOption, chPriceProduct, 
        iProduct, ingredients, index, length, nav) { 
        const product = this.props.products.filter(product => product.iProduct ===  iProduct);
        
        return( 
            <TouchableOpacity  key={index} underlayColor='rgba(255,255,255,0.1)'

                      onPress={() => nav.navigate('ProductDetailView', { iProduct: iProduct, iCategories: product[0].iCategories})}
                      >
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center'}}>
                <View style={{
                    padding: 10,
                }}>
                    <Image
                    style={{width: 40, height: 40, zIndex: 0,}}
                    source={ product[0].chMainImage === "" ? require('../assets/noImage.jpg') : { uri: product[0].chMainImage }}
                    defaultSource={require('../assets/noImage.jpg')}
                    />
                </View>
                <View style={{ flex: 1, }}>
                    {
                        ingredients.length === 0 ?
                        <Text style={{textAlign: 'left', color: '#4E4E4E', fontFamily: 'Roboto', fontSize: 12}}>{chNameProduct}</Text>
                        :
                        <Text style={{textAlign: 'left', color: '#4E4E4E', fontFamily: 'Roboto', fontSize: 12}}>{chNameProduct} {parseFloat(Number(chPriceProduct))} {this.props.customers.chCurrency}</Text>
                    }
                    {
                        parseInt(Number(chChangePrice)) !== 0 ?
                        <Text>{chOption}</Text>
                        :
                        null
                    }
                    
                    {this.renderIng(ingredients)}
                </View>
                <View style={{ width: 70, alignItems: "center"}}>
                    <Text style={styles.textPriceItem}>{ parseFloat(Number(chPriceProduct)) +  parseFloat(Number(chChangePrice))} {this.props.customers.chCurrency}</Text>
                </View>
                
            </View>
            
        {
            /*
            length > 1 ?
            this.divider()
            :
            null*/
        }
        {
            index === length-1 ?
            null
            :
            this.divider()
        }
        </View></TouchableOpacity>)
    }
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
    render() {
        var {navigate} = this.props.navigation;
        return (
        <View style={styles.container}>
            <ImageBackground
            style={{ flex: 1, width: width, height: 170, marginTop:0, alignItems: 'center', justifyContent: 'flex-start'}}
            imageStyle={{ resizeMode: 'cover' }}
            source={require('../assets/main.png')}>
            {
                this.state.didFinishInitialAnimation === false ?
                <View style={{ alignItems: "center", justifyContent:'center'}}>
                    <View style={ [styles.circleIcone, { marginTop: 84, }] }>
                        <Image source={require('../assets/historyIcon.png')} style={ styles.imageIcon } />
                        <ActivityIndicator size="large" color="#583286" style={{marginTop: 50,}} />
                    </View>
                </View>
                :
                <View>
                {
                    this.props.history.length >  0 ?
                    <View>
                        {this.renderCardHistory()}
                    </View>
                    :
                    <View style={{ alignItems: "center", justifyContent:'center'}}>
                        <Text style={ styles.textNoItems }>Вы еще ничего не заказывали</Text>
                        <View style={ [styles.circleIcone, { marginTop: 40, }] }>
                            <Image source={require('../assets/historyIcon.png')} style={ styles.imageIcon } />
                        </View>
                    </View>
                }
                </View>
                
            }
            </ImageBackground>
            {
                this.state.AuthState == 0 ?
                this.renderNoAuth(navigate)
                :
                <View />
            }
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
    circleIcone:
    {
        backgroundColor: '#fff',
        elevation: 2,
        width: 124,
        height: 124,
        borderRadius: 70,
        marginTop: 20,
    },
    imageIcon:{ 
        zIndex: 1,
        width: 70,
        height: 64,
        marginTop: 35,
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 30,
    },
    textNoItems:{
        fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        color: '#FFFFFF',
        marginTop: 20,
    },
    viewTextTitle:{
        backgroundColor: '#fff',
        borderRadius: 10,
        width: width - 40,
        zIndex: 1000,
        
    },
    textTitle:{
        fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        backgroundColor: '#6A3DA1',
        borderRadius: 10,
        color: '#F2F2F2',
        height: 45,
        paddingLeft: 20,
        paddingTop: 10,
    },
    textDate:{
        fontFamily: 'Roboto',
        fontWeight: '400', 
        fontSize: 12,
        color:'#828282',
        textAlign: 'center',
    },
    textTitleItems:{
        color: '#4E4E4E',
        fontFamily: 'Roboto',
        lineHeight: 24,
        fontWeight: '500', 
        fontSize: 12,
        paddingLeft: 15,
    },
    arrowBottom:
    {
        width: 15,
        height: 15,
        marginTop: 6,
        marginLeft: 0,
        marginRight: 3,
    },
    textPriceItem: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#4E4E4E',
    }

});
export default connect (
    state => ({
      cart: state.CartReducer,
      categories: state.CategoriesReducer,
      products: state.ProductsReducer,
      options: state.OptionReducer,
      customers: state.CustomersReducer,
      history: state.HistoryReducer,
      user: state.UserReducer,
    }),
    dispatch => ({
      loadHistory: (index) => {
          dispatch({ type: 'LOAD_HISTORY', payload: index})
      },
      editViewHistory: (index) => {
          dispatch({ type: 'EDIT_VIEW_HISTORY', payload: index})
      }
    })
  )(History);