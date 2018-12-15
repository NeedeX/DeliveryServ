import React from 'react';
import { StyleSheet, Dimensions, TouchableHighlight, InteractionManager, ActivityIndicator, Text, View, ImageBackground, TouchableOpacity, Image, ScrollView} from 'react-native';
import { connect } from 'react-redux';
//import FAB from 'react-native-fab';
//import firebase from 'react-native-firebase';
import Header from './components/Header';
import CardAddress from './components/CardAddress';
import BGNoAuth from './components/BGNoAuth';
const { width } = Dimensions.get('window');

class Addresses extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isModalVisible: false,
            AuthState: 0,
            routeGoBack: '',
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
          header: (props) => <Header title={'Мои адреса'} nav={ navigation } {...props} />,
        };
      };
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
          this.setState({
            didFinishInitialAnimation: true,
          });
        });
      }
   /* componentDidMount()
    {
        
        var {params} = this.props.navigation.state;
        firebase.auth().onAuthStateChanged(user => {
            if (user)
                this.setState({ AuthState: 1 });
            else
                this.setState({ AuthState: 0 });
        });
        this.state.routeGoBack = params !== undefined ? params.routeGoBack : '';
        
    }*/
    loadingAddresses(uid)
    {
        return fetch('http://mircoffee.by/deliveryserv/app/LoadingAddresses.php',
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
            this.props.clearAddresses();
            //responseJson.addresses.map( (addresses) => {
                this.props.loadAddresses(responseJson.addresses);
            //});
        })
        .catch((error) => {
        console.error(error);
        });
    }

    renderNoAuth(){
        return <BGNoAuth 
            text={'Для просмотра и добавления адреса нужно войти в личный кабинет'}
            goBack={'Addresses'}
            nav={this.props.navigation} />
    }
    
    renderViewListAddresses(){
        return <View style={{ marginTop: 0, }}>
            <View style={{
                  backgroundColor: '#fff',
                  borderTopStartRadius: 10,
                  borderTopEndRadius: 10,
                  height: 500,
                }} >
                  <View style={styles.viewTextTitle}>
                      <Text style={ styles.textTitle}>Адреса доставки</Text>
                  </View>
                  <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    borderTopEndRadius: 0,
                    borderTopStartRadius: 0,
                    width: width - 40,
                    elevation: 3, 
                 }}>
                <ScrollView >
                    <View style={{ width: width - 40, marginBottom: 20,}}>
                    {
                      this.props.addresses.map((item, index) => (
                            <CardAddress 
                                key = {index}
                                idAddress = {item.idAddress}
                                iClient = {item.iClient}
                                chAddress = {item.chAddress}
                                chCity = {item.chCity}
                                chStreet = {item.chStreet}
                                chNumHome = {item.chNumHome}
                                chHousing = {item.chHousing}
                                chEntrance = {item.chEntrance}
                                chFloor = {item.chFloor}
                                chApartment = {item.chApartment}
                                nav={this.props.navigation}
                                routeGoBack = {this.state.routeGoBack}
                            />
                     
                        ))
                    }

                    </View>
                </ScrollView>
                  
                  </View>
                  
                </View>
                
            </View>
            
    }

    render() {

        var {navigate} = this.props.navigation;
        var {params} = this.props.navigation.state;
        return (
        <View style={{backgroundColor: '#fff',}}> 
            <ImageBackground
              style={{ flex: 1, width: width, height: 170, }}
              imageStyle={{ resizeMode: 'stretch' }}
              source={require('../assets/main.png')}
            >
            {
            this.state.didFinishInitialAnimation === false ?
            <ActivityIndicator size="large" color="#583286" />
            :
            <View style={{ alignItems: 'center',  }}>
                
            {
              this.props.addresses.length >  0 ?
                this.renderViewListAddresses()
                :
                <View style={{ alignItems: 'center', marginTop: 30, }}>
                    <Text style={{
                        fontFamily: 'Roboto',
                        fontWeight: '600',
                        fontSize: 14,
                        lineHeight: 24,
                        color: '#FFFFFF',
                        
                    }}>Нет добаленных адресов</Text>
                    <View style={{

                        backgroundColor: '#fff',
                        elevation: 1,
                        width: 124,
                        height: 124,
                        borderRadius: 70,
                        marginTop: 20,
                        
                        
                    }}>
                        <Image 
                            source={require('../assets/maps.png')}
                            style={ styles.imageIcon }
                        />
        
                    </View>

                    
                </View>
            }
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignContent: 'flex-end',
                    alignItems:'flex-end',
                    width: width,

                }}>
                {
                    /*
                        <FAB 
                        buttonColor="#F891A9" 
                        iconTextColor="#FFFFFF" 
                        onClickAction={() => {this.props.navigation.navigate('AddAddress')}} 
                        visible={true} />
                        */
                }
                    </View>   
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
        backgroundColor: '#F3F3F3',
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 10,
    },
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
        width: 82,
        height: 57,
        marginTop: 28,
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 24,
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
        width: width - 40,
        zIndex: 1000,
        
    },
    
  
});
  
//export default connect(mapStateToProps)(Home);

export default connect (
  state => ({
    addresses: state.AddressReducer,
    cart: state.CartReducer,
    banners: state.BannerReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    options: state.OptionReducer,
  }),
  dispatch => ({
    loadAddresses: (index) => {
        dispatch({ type: 'LOAD_ADDERESSES', payload: index})
    },
    
    clearAddresses: (index) => {
      dispatch({ type: 'CLEAR_ADDRESSES', payload: index});
    },
    
    /*
    onEditRootCategory: (categoryData) => {
      dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
    },    
    onEditCategory: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },*/
  })
)(Addresses);