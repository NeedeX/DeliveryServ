import React from 'react';
import { ListView, 
  StyleSheet, Dimensions, Text, View, InteractionManager, ActivityIndicator, Image, ScrollView, ImageBackground} from 'react-native';
import { connect } from 'react-redux';
import Header from './components/Header';

const { width, height } = Dimensions.get('window');
class Stocks extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      didFinishInitialAnimation: false,
    };
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
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        didFinishInitialAnimation: true,
      });
    });
  }
  render() {
    var {navigate} = this.props.navigation;
    var {params} = this.props.navigation.state;
    return (
      <View style={{backgroundColor: '#FAFAFA'}}> 
      {
        this.state.didFinishInitialAnimation === false ?
        <ActivityIndicator size="large" color="#583286" />
        :
        <ScrollView>
            <View style={{flex: 1, opacity: 1,}}>
                <Image source={{ uri: this.props.banners.find(x => x.iStock ===  params.bannersId).sImage }} style={styles.img}/> 
            </View>
            <View style={styles.viewTitleStyle}>
              <Text style={styles.textTitleStyle}> {this.props.banners.find(x => x.iStock ===  params.bannersId).chName}</Text>
            </View>
            <View style={ styles.viewTextDescription }>
              <Text style={ styles.textDescription}> {this.props.banners.find(x => x.iStock ===  params.bannersId).sDescription}</Text>
            </View>
            <View style={ styles.viewTextDescriptionNotes }>
              <Text style={ styles.textDescription}> {this.props.banners.find(x => x.iStock ===  params.bannersId).chNotes}</Text>
            </View>
            
        </ScrollView>
      }
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
    height: 205*height/720,
    width: width-32,
    opacity: 1,
    borderRadius: 30,
    margin: 16,

  },
  viewTitleStyle: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 16,
  },
  textTitleStyle: {
    color: '#4E4E4E',
    fontSize: 20,
    fontFamily: 'OswaldRegular',
    fontWeight: 'bold',
  },
  viewTextDescription:{
    flex: 1,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 16,
  },
  viewTextDescriptionNotes:{
    flex: 1,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 16,
    
  },
  textDescription:{
    color: '#4E4E4E',
    fontSize: 12,
    fontFamily: 'Roboto',
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
    categories: state.CategoriesReducer,
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