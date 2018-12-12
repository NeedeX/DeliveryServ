import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Button, Image} from 'react-native';

class EmptyCart extends React.Component {
    constructor(props){
        super(props);           
    }


    render() {
        return (
            <View style={{flex: 1,
                alignItems: 'center',}}>
                <Text style={{ 
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: 'center', 
                    fontFamily: 'Roboto',
                    fontWeight: "600",
                    fontSize: 14,
                    lineHeight: 24,
                    color: '#fff',

                }}>Ваша корзина пуста</Text>
                <View style={{
                    backgroundColor: '#fff',
                    elevation: 4,
                    width: 124,
                    height: 124,
                    borderRadius: 70,
                    marginTop: 40,
                    marginBottom: 30,
                }}>
                    <Image 
                        source={require('./assets/EmptyCart.png')}
                        style={{ 
                            marginBottom: 20,
                            width: 75,
                            height: 60,
                            marginTop: 28,
                            justifyContent: 'center',
                            alignItems: "center",
                            marginLeft: 27,
                        }}
                    />
                </View>
                
                <View>
                <TouchableOpacity style={{
                      marginTop: 10, 
                      alignItems: 'center',
                      marginBottom: 20,
                      justifyContent: 'center', }}
                      onPress={() => this.props.nav.navigate('Main')}
                      >
                      <Text style = {styles.text}>
                      В КАТАЛОГ
                      </Text>
                  </TouchableOpacity>
                </View>
            </View>
        );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        borderWidth: 1,
        textAlign: 'center',
        padding: 10,
        borderColor: '#6A3DA1',
        backgroundColor: '#fff',
        color: '#6A3DA1',
        borderRadius: 8,
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: 'OswaldMedium',
        width: 100,
        fontSize: 12,
        lineHeight: 18
     }
  
});

export default EmptyCart;