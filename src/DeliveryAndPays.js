import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, ActivityIndicator, InteractionManager} from 'react-native';
import { connect } from 'react-redux';
import Header from './components/Header';

class DeliveryAndPays extends Component {
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
    header: (props) => <Header title={'Оплата и доставка'} nav={ navigation } {...props} />,
    
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
      {
        this.state.didFinishInitialAnimation === false ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <ActivityIndicator size="large" color="#583286" />
        </View>
        :
        <ScrollView>

            <View style={styles.viewTitleStyle}>
              <Text style={styles.textTitleStyle}>Условия доставки</Text>
            </View>
            <View style={styles.textStyle}>
              <Text style={styles.textStyle}>
                {this.props.customers.txtDeliveryTerms}
              </Text>
            </View>
            <View style={styles.viewTitleStyle}>
              <Text style={styles.textTitleStyle}>Условия оплаты</Text>
            </View>
            <View style={styles.viewTextStyle}>
              <Text style={styles.textStyle}>
                {this.props.customers.txtDeliveryTerms}
              </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  viewTitleStyle: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 20,
    marginBottom: 0,
    marginTop: 10,
  },
  textTitleStyle: {
    color: '#4E4E4E',
    lineHeight: 37,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Oswald',
  },
  viewTextStyle:{
    marginTop: 10, marginBottom: 10, marginLeft: 30, marginRight: 30,
  },
  textStyle:{
    fontSize: 12, fontFamily: 'Roboto',
  },

});
export default connect (
  state => ({
    cart: state.CartReducer,
    customers: state.CustomersReducer,
  }),
  /*dispatch => ({
    loadBanners: (bannersData) => {
      dispatch({ type: 'LOAD_BANNERS', payload: bannersData});
    },
  })*/
)(DeliveryAndPays);