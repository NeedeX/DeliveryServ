import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Dimensions, Image, ActivityIndicator, ImageBackground, InteractionManager} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import FAB from 'react-native-fab'
import Header from './components/Header';
import BGNoAuth from './components/BGNoAuth';
import CardAddress from './components/CardAddress';
const { width } = Dimensions.get('window');

class Addresses extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalVisible: false,
            AuthState: 0,
            routeGoBack: '',
            didFinishInitialAnimation: false,
        }  
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
        this.setState({
            didFinishInitialAnimation: true,
        });
        });
        var {params} = this.props.navigation.state;
        firebase.auth().onAuthStateChanged(user => {
            if (user)
                this.setState({ AuthState: 1 });
            else
                this.setState({ AuthState: 0 });
        });
        this.state.routeGoBack = params !== undefined ? params.routeGoBack : '';
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
                    elevation: 2, 
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
    return (
    <View style={styles.container}> 
        <ImageBackground
          style={{ flex: 1, width: width, height: 170, marginTop:0, alignItems: 'center', justifyContent: 'flex-start'}}
          imageStyle={{ resizeMode: 'cover' }}
          source={require('../assets/main.png')}
        >
        {
            this.state.didFinishInitialAnimation === false ?
            <View style={{ alignItems: "center", justifyContent:'center'}}>
                <View style={ [styles.circleIcone,{
                    marginTop: 84,
                }] }>
                <Image source={require('../assets/maps.png')} style={ styles.imageIcon } />
                <ActivityIndicator size="large" color="#583286" style={{marginTop: 50,}} />
                </View>
            </View>
            :
            <View>
            {
                this.props.addresses !== null ?
                this.renderViewListAddresses()
                :
                <View style={{ alignItems: "center", justifyContent:'center'}}>
                    <Text style={ styles.textNoItems}>Нет добаленных адресов</Text>
                    <View style={ styles.circleIcone }>
                    <Image source={require('../assets/maps.png')} style={ styles.imageIcon } />
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
            <FAB 
                buttonColor="#F891A9" 
                iconTextColor="#FFFFFF" 
                onClickAction={() => {this.props.navigation.navigate('AddAddress')}} 
                visible={true} 
                iconTextComponent={<Image source={require('../assets/addIcon.png')} />} 
            />
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
    imageIcon:{ 
        zIndex: 1,
        width: 82,
        height: 57,
        marginTop: 28,
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 24,
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

});
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
    })
  )(Addresses);