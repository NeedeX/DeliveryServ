import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, StatusBar, BackHandler, ImageBackground} from 'react-native';
import { NavigationActions, StackActions} from 'react-navigation';
const { width } = Dimensions.get('window');

class CompletedOrder extends React.Component {
    constructor(props){
        super(props); 
        
        this.props.navigation.state.key = 'Home';   
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', function() {
          return true;
        });
    }

    render() {
        return (
        <View style={{backgroundColor: '#fff'}}> 
            <StatusBar
                hidden={false}
                backgroundColor="#583286"
                barStyle="light-content" />
            <ImageBackground
            style={{ flex: 1, width: width, height: 170, }}
            imageStyle={{ resizeMode: 'stretch' }}
            source={require('../assets/main.png')}
            >
            <Text style={styles.textTitleStyle}>Спасибо за заказ!</Text>
            <View style={{
                    backgroundColor: '#fff',
                    elevation: 4,
                    width: 124,
                    height: 124,
                    borderRadius: 70,
                    marginTop: 20,
                    
                }}>
                <Image 
                    source={require('../assets/iconCompliteOrder.png')}
                    style={{ 
                        width: 55,
                        height: 75,
                        marginTop: 25,
                        justifyContent: 'center',
                        alignItems: "center",
                        marginLeft: 34,
                    }}
                         />
                        
                </View>
                <View style={{flex: 1,
                        marginTop: -240,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',}}>
                
                <Text style={styles.textStyle}>В ближайшее время </Text>
                <Text style={styles.textStyle}>с вами свяжется оператор</Text>

                {/*
                <TouchableHighlight onPress={() => this.props.nav.navigate('Home')} >
                    <Text style = {styles.text}>
                    В КАТАЛОГ
                    </Text>
                </TouchableHighlight>
                */}
            </View>
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
        justifyContent: 'flex-start',
    },
    textTitleStyle: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: 'center', 
        fontSize: 24,
        fontFamily: 'OswaldSemiBold',
        color:'#F2F2F2',
        marginTop: 25,
        lineHeight: 36,
     },
    textStyle: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: 'center',
        fontWeight: '600', 
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto',
        color:'#4E4E4E',
     }
  
});

export default CompletedOrder;