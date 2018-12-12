import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View, Dimensions} from 'react-native';
import Header from './components/Header';
const { width } = Dimensions.get('window');
export default class Pickups extends Component {
    static navigationOptions = ({ navigation  }) => {
        return {
          title: 'Home',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
          header: (props) => <Header title={'Адреса самовывоза'} nav={ navigation } {...props} />,
        };
      };
    render() {
    return (
    <View style={{backgroundColor: '#fff',}}> 
        <ImageBackground
          style={{ flex: 1, width: width, height: 170, }}
          imageStyle={{ resizeMode: 'stretch' }}
          source={require('../assets/main.png')}
        >
        <Text style={styles.welcome}>Адреса самовывоза!</Text>
        <Text>To get started, edit Pickups.js</Text>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
