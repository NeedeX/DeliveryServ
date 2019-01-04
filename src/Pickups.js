import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View, Dimensions, InteractionManager, ActivityIndicator} from 'react-native';
import Header from './components/Header';
import { connect } from 'react-redux';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
const { width } = Dimensions.get('window');
class Pickups extends Component {
    constructor(props){
        super(props);
        this.state = { 
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
          header: (props) => <Header title={'Пункты самовывоза'} nav={ navigation } {...props} />,
        };
    };
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
          this.setState({
            didFinishInitialAnimation: true,
          });
        });
    }
    render() {
    return (
    <View style={styles.container}> 
        <ImageBackground
          style={{ flex: 1, width: width, height: 170, }}
          imageStyle={{ resizeMode: 'stretch' }}
          source={require('../assets/main.png')}
        >
        {
            this.state.didFinishInitialAnimation === false ?
            <ActivityIndicator size="large" color="#583286" />
            :
            <View style={{ alignItems: 'center', justifyContent: 'center'}}>
              <View style={styles.viewTextTitle}>
                <Text style={ styles.textTitle}>Адреса самовывоза</Text>
              </View>
              <View style={{ backgroundColor: '#fff', borderRadius: 10, borderTopEndRadius: 0, borderTopStartRadius: 0, width: width - 40,  elevation: 2, }}>

                    {

                      this.props.locations.map((item, index) => (
                        <Text>{item.chAddress}</Text>
                        ))

                    }
    
    
              </View>
            </View>
        }
        </ImageBackground>
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
});
export default connect (
  state => ({
    banners: state.BannerReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    user: state.UserReducer,
    addresses: state.AddressReducer,
    favorite: state.FavoriteReducer,
    customers: state.CustomersReducer,
    options: state.OptionReducer,
    locations: state.LocationReducer,
  }),
  dispatch => ({
    /*
    loadLocation: (data) => {
      dispatch({ type: 'LOAD_LOCATION', payload: data});
    },*/
  })
)(Pickups);