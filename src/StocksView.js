import React from 'react';
import { ListView, 
  StyleSheet, Dimensions, Text, View, Button, TouchableOpacity,Image, ScrollView, ImageBackground} from 'react-native';
import { connect } from 'react-redux';
import Header from './components/Header';

class Stocks extends React.Component {
  constructor(props){
    super(props);
    
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
  render() {
    console.log(this.props.banners);
    var {navigate} = this.props.navigation;
    var {params} = this.props.navigation.state;
    return (
      <View style={{backgroundColor: '#FAFAFA'}}> 

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
   
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  viewTitleStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
 
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  textTitleStyle: {
    color: '#4E4E4E',
    fontSize: 20,
    fontFamily: 'OswaldSemiBold',
  },
  viewTextDescription:{
    marginLeft: 35,
    marginRight: 35,
  },
  viewTextDescriptionNotes:{
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
  },
  textDescription:{
    color: '#4E4E4E',
    fontSize: 12,
    fontFamily: 'Roboto'
  },
  iconBtnStyle: {
    width: 25,
    height: 25, 
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
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