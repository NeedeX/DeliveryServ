import React from 'react';
import { Text, StyleSheet, View, Dimensions, StatusBar, InteractionManager, ActivityIndicator, TouchableOpacity,Image, ScrollView, ImageBackground} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Header from './components/Header';

const { width, height } = Dimensions.get('window');
class Stocks extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      didFinishInitialAnimation: false,
    };
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
    header: (props) => <Header title={'Акции'} nav={ navigation } {...props} />,
    
    };
  };
  generateKey = () => {
    return `${ new Date().getTime() }`;
  }
  render() {
    var {navigate} = this.props.navigation;
    console.log(this.props.banners);
    
    return (
      <View style={styles.container}> 
        <StatusBar
            hidden={false}
            backgroundColor={"#"+this.props.customers.chColorStatusBar}
            barStyle="light-content"
        />
         {/*
         <ImageBackground
              style={{ flex: 1, width: width, height: 135*height/640, }}
              imageStyle={{ resizeMode: 'stretch' }}
              source={require('../assets/main.png')}
          >
          */}
          
          {
          this.state.didFinishInitialAnimation === false ?
            <ActivityIndicator size="large" color="#583286" />

          :
          <ScrollView>
            <LinearGradient 
              colors={["#"+this.props.customers.chColorGR2, "#"+this.props.customers.chColorGR3]} 
              style={{ 
                width: width+20,
                height: 200,
                marginLeft: -10,
                borderBottomRightRadius: 350,
                borderBottomLeftRadius: 350,
              }}>

          </LinearGradient>
          <View style={{
            marginTop: -210,
          }}>
          {
            this.props.banners.map((banners, index) => (

            <View key={index} style={{
              marginLeft: 16, marginRight: 16,
              marginTop: 16,
              width: width,
              elevation: 2,
            }}>
              <TouchableOpacity  activeOpacity={0.9} style={{flex: 1, opacity: 1}} key={this.generateKey()} 
                onPress={() => this.props.navigation.navigate('StocksView', { bannersId: banners.iStock,})}>
                  <Image key={index} source={{ uri: banners.sImage }} style={styles.img}/> 
              </TouchableOpacity>
            </View>

            )
          )
          }
          </View>
          </ScrollView>
          }
        {/* </ImageBackground> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img:{

    justifyContent: 'center',
    alignItems: 'center',
    height: 208*height/720,
    width: width - 32,
    opacity: 1,
    borderRadius: 30,

  },

  
});
/*
const mapStateToProps = (state) => {
    const { friends } = state
    return { friends }
};
*/
  
//export default connect(mapStateToProps)(Home);

export default connect (
  state => ({
    customers: state.CustomersReducer,
    cart: state.CartReducer,
    banners: state.BannerReducer,
  }),
  /*dispatch => ({
    loadBanners: (bannersData) => {
      dispatch({ type: 'LOAD_BANNERS', payload: bannersData});
    },
    onAddCategory: (categoryData) => {
      dispatch({ type: 'ADD_CATEGORY', payload: categoryData});
    },
    onEditRootCategory: (categoryData) => {
      dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
    },    
    onEditCategory: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },
  })*/
)(Stocks);