import React from 'react';
import { Text, StyleSheet, View, Dimensions, StatusBar, InteractionManager, ActivityIndicator, TouchableOpacity,Image, ScrollView, ImageBackground} from 'react-native';
import { connect } from 'react-redux';

import Header from './components/Header';

const { width } = Dimensions.get('window');
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
            backgroundColor="#583286"
            barStyle="light-content"
        />
        <ImageBackground
              style={{ flex: 1, width: width, height: 170, }}
              imageStyle={{ resizeMode: 'stretch' }}
              source={require('../assets/main.png')}
          >
          {
          this.state.didFinishInitialAnimation === false ?
          <ActivityIndicator size="large" color="#583286" />
          :
          <ScrollView>
          {
            this.props.banners.map((banners, index) => (

            <View key={index} style={{
              marginLeft: 5, marginRight: 5,
              marginBottom: 5,
              marginTop: 5,
              width: width - 10,
              elevation: 2,
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <TouchableOpacity style={{flex: 1, opacity: 1}} key={this.generateKey()} 
                onPress={() => this.props.navigation.navigate('StocksView', { bannersId: banners.iStock,})}>
                  <Image key={index} source={{ uri: banners.sImage }} style={styles.img}/> 
              </TouchableOpacity>
            </View>

            )
          )
          }
          </ScrollView>
          }
        </ImageBackground>
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
    height: 150,
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