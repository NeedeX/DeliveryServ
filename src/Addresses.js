import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, ActivityIndicator, ImageBackground, InteractionManager} from 'react-native';
import { connect } from 'react-redux';
import Header from './components/Header';
import BGNoAuth from './components/BGNoAuth';
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
                this.props.addresses.length >  0 ?
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
            :null
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
    }
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