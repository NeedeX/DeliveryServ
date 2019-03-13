import React from 'react';
import { StyleSheet, Dimensions, TouchableHighlight, InteractionManager, ActivityIndicator, Text, View, ImageBackground, TouchableOpacity, Image, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import BGNoAuth from './components/BGNoAuth';
import Header from './components/Header';
const { width, height} = Dimensions.get('window');

class Favorites extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            AuthState: 0,
            countFav: 0,
            didFinishInitialAnimation: false,
        }  
    }
    static navigationOptions = ({ navigation  }) => {
        return {
          title: 'Home',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
          header: (props) => <Header title={'Избранное'} nav={ navigation } {...props} />,
        };
      };
    componentDidMount()
    {
        
        firebase.auth().onAuthStateChanged(user => {
            //console.log("==>");
            if (user) {
                this.setState({ AuthState: 1 });
               
                //this.loadingFavorites(user.uid);
                //console.log(user.uid);
            }
            else
                this.setState({ AuthState: 0 });
        });
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                didFinishInitialAnimation: true,
            });
        });

    }
    loadingFavorites(uid)
    {
        return fetch('http://mircoffee.by/deliveryserv/app/LoadingFavorites.php',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': "gzip, deflate",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chUID: uid,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.props.clearFavorites();
            responseJson.favorites.map( (favorites) => {
                this.props.loadFavorites(favorites);
            });
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
    // render зачеркнутой цены
    oldPrice(iOldPrice){
        var view = '';
        if(iOldPrice === ""){
          view = <Text></Text>
        }
        else{
          view = <Text style={styles.textOldPriceStyle}> { parseFloat(iOldPrice).toFixed(2) + " " + this.props.customers.chCurrency}  </Text>
        }
        return view;
    }
    renderViewListFavorites(){
        return <View style={{ marginTop: 0, }}>
            <View style={{
                  backgroundColor: '#fff',
                  borderTopStartRadius: 10,
                  borderTopEndRadius: 10,
                  height: height - 150,
                  width: width - 48,
                }}>
                  <View style={styles.viewTextTitle}>
                      <Text style={ styles.textTitle}>Ваши избранные товары</Text>
                  </View>
                  <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    borderTopEndRadius: 0,
                    borderTopStartRadius: 0,
                    width: width - 48,
                    elevation: 3, 
                 }}>
                <ScrollView >
                    <View style={{ width: width - 48, marginBottom: 20,}}>
                    {
                      this.props.favorites.map((item, index) => (
                        this.renderCard(item.idProduct, item.idFavorite, index)
                        ))
                      }
                    </View>
                </ScrollView>
                  
                  </View>
                  
                </View>
                
            </View>
    }
    delToFavorite(idFavorite)
    { 
        fetch('http://mircoffee.by/deliveryserv/app/DelFavorites.php', 
        {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Accept-Encoding': "gzip, deflate",
            'Content-Type': 'application/json',
            },
                body: JSON.stringify({
                    idFavorite: idFavorite,
                })
    
            })
            .then((response) => response.json())
            .then((responseJson) => {
                // Отображение ответного сообщения, поступающего с сервера после вставки записей.
                //console.log(responseJson);
                val = {
                    idFavorite: idFavorite,
                };
                this.props.delFavorite(val);
            })
            .catch((error) => { console.error(error); });
    }
    renderDivider(index)
    {
        if(this.props.favorites.length > 1)
        {
            if(index !== this.props.favorites.length-1)
            {
                return(
                <View style={{ borderBottomColor: '#E2E2E2', borderBottomWidth: 1,
                    width: width - 70, 
                }}/>
                )
            }
        }
    }
 
    renderCard(idProduct, idFavorite, index)
    {
        var resultProduct = this.props.products.filter(products => products.iProduct === idProduct);
        
        if(resultProduct.length > 0)
        {
            return (
            <TouchableOpacity key={index}
            activeOpacity={1}
            onPress={() => this.props.navigation.navigate('ProductDetailView', { iCategories: resultProduct[0].iCategories, iProduct: resultProduct[0].iProduct, routeGoBack: 'favorites'})}
            style={{ width: this.itemWidth }}>
                <View style={{ backgroundColor: '#fff', 
                 marginBottom: 5, flexDirection: 'row', padding: 5,}}>
                    <View style={{ flex: 0.5, backgroundColor: '#fff', marginTop: 5, marginLeft: 5}}>
                        <Image
                        style={{width: 80, height: 80, zIndex: 0}}
                        source={ resultProduct[0].chMainImage === "" ? require('../assets/noImage.jpg') : { uri: resultProduct[0].chMainImage } }
            
                        />
                    </View>
                    <View style={{ flexDirection: 'column', flex: 1,backgroundColor: '#fff',
                        marginLeft: 0,
                    }}>
                        <View style={{ flex: 1, }}>
                            <View style={{ flexDirection: 'row', marginTop: 20,}}>
                                <Text style={styles.textNameStyle}>{resultProduct[0].chName}</Text>
                            </View>
                            
                        </View>
                        <View style={{ marginBottom: 10,
                             flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'flex-end'}}>
                            <View style={{ flex: 1,  flexDirection: 'row', alignItems: 'flex-start',
                             justifyContent: 'flex-start',
                            }}>
                                <Text style={styles.textPriceStyle}> 
                                    {parseFloat(resultProduct[0].chPrice).toFixed(2) + " " + this.props.customers.chCurrency}
                                </Text>
                                {this.oldPrice(resultProduct[0].chOldPrice)}                    
                            </View>
                        </View>
                    </View>
                    <View>
                    <TouchableOpacity style={{elevation: 3, marginRight: 5, marginTop: 25,}}
                        onPress={() => { this.delToFavorite(idFavorite)}}>
                        <Image
                            style={ styles.imgFavStyle }
                            source={require('../assets/iconHeartFav.png')}
                        />  
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                {this.renderDivider(index)}
                </View>
                
                
            </TouchableOpacity>
            )
        }
        
    }
                        
    render() {

        var {navigate} = this.props.navigation;
        var {params} = this.props.navigation.state;
        return (
        <View style={ styles.container}> 
            <ImageBackground
            style={{ flex: 1, width: width, height: 170, marginTop:0, alignItems: 'center', justifyContent: 'flex-start'}}
            imageStyle={{ resizeMode: 'cover' }}
            source={require('../assets/main.png')}
            >
            {
                this.state.didFinishInitialAnimation === false ?
                <View style={{ alignItems: "center", justifyContent:'center'}}>
                    <View style={ [styles.circleIcone,{
                        marginTop: 84, zIndex: -10,
                    }] }>
                    <Image source={require('../assets/favoritesIcon.png')} style={ styles.imageIcon } />
                    <ActivityIndicator size="large" color="#583286" style={{marginTop: 50,}} />
                    </View>
                </View>
                :
                <View>
                {
                    this.props.favorites.length >  0 ?
                    this.renderViewListFavorites()
                    :
                    <View style={{ alignItems: "center", justifyContent:'center'}}>
                        <Text style={ styles.textNoItems }>Избранных товаров нет</Text>
                        <View style={ styles.circleIcone }>
                        <Image source={require('../assets/favoritesIcon.png')} style={ styles.imageIcon } />
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
        backgroundColor: '#fff',
    },
    circleIcone:
    {
        backgroundColor: '#fff',
        elevation: 2,
        width: 124,
        height: 124,
        borderRadius: 70,
        marginTop: 40,
    },
    textNoItems:{
        fontFamily: 'Roboto',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        color: '#FFFFFF',
        marginTop: 20,
    },
    imgFavStyle:
    {width: 24,  height: 20, zIndex: 0, justifyContent: 'flex-end', marginTop: 4,},
    viewCardStyle:{
        flex:1,
        elevation: 5,  
        borderRadius: 10, 
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#fff',
        width: 300,
        height: 50,
    },
    textOldPriceStyle:{
        fontSize: 10, 
        justifyContent: 'flex-end', 
        color: '#BDBDBD', 
        textDecorationLine: 'line-through', 
        marginTop: 6, 
        marginLeft: 5
        
    },
    textInputStyle: {
        height: 20, 
        borderWidth: 0, 
        color: '#4E4E4E',
        fontFamily: 'Roboto',
        fontWeight: "400",
        flex: 1, 
        marginLeft: 10, 
        paddingBottom: 0, 
        paddingTop: 0, 
        marginRight: 10,
        marginBottom: 0
    },
    imageIcon:{ 
        zIndex: 1,
        width: 71,
        height: 90,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 34,
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
    viewTextTitle:{
        backgroundColor: '#fff',
        borderRadius: 10,
        width: width - 48,
        zIndex: 1000,
        
    },
    buttonText:{
        borderWidth: 0,
        padding: 8,
        borderColor: '#6A3DA1',
        backgroundColor: '#6A3DA1',
        color: '#fff',
        fontWeight: "600",
        borderRadius: 4,
        textAlign: "center",
        width: 96,
        fontFamily: 'OswaldMedium',
        fontSize: 12,
    },
    textPriceStyle: {
        marginTop: 3,
        fontSize: 14, 
        justifyContent: 'flex-end', 
        color: '#4E4E4E',
        fontWeight: "600",
        fontFamily: 'Roboto',
        lineHeight: 24
    },
    textDescrStyle:{
        fontSize: 12, 
        flex: 1,  
        paddingRight: 10,
        fontFamily: 'Roboto',
        color: '#828282',
        lineHeight: 14,   
    },
    textNameStyle: { 
        flex: 1, 
        fontSize: 14, 
        fontWeight: "500", 
        color: '#4E4E4E',
        fontFamily: 'Roboto',
        lineHeight: 18,
    },
});
  
export default connect (
  state => ({
    cart: state.CartReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    favorites: state.FavoriteReducer,
    options: state.OptionReducer,
    customers: state.CustomersReducer,
  }),
  dispatch => ({
    loadFavorites: (index) => {
        dispatch({ type: 'LOAD_FAVORITES', payload: index})
    },
    clearFavorites: (index) => {
      dispatch({ type: 'CLEAR_FAVORITES', payload: index});
    },
    delFavorite: (index) => {
        dispatch({ type: 'DELETE_FAVORITE', payload: index});
      },
  })
)(Favorites);