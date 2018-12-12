import React from 'react';
import { StyleSheet, Dimensions, TouchableHighlight, Text, View, ImageBackground, TouchableOpacity, Image, ScrollView} from 'react-native';
const { width } = Dimensions.get('window');
class BGNoAuth extends React.Component {
    render() {
        return(
            <View style={{
                flex: 1,
                width: width,
                height: 600,
                position: 'absolute',
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0, 0.5)',
                marginTop: 0,
                alignItems:'center',
                elevation: 1,
            }}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 10,
                    marginBottom: 120,
                }}>
                    <Text style={{
                        color: '#fff',
                        textAlign: 'center'
                    }}>{this.props.text} </Text>
                
                    <TouchableHighlight  underlayColor='rgba(255,255,255,0.1)'
                    onPress={() =>  this.props.nav.navigate('Phone', { goBack: 'Addresses',}) }>
                    <Text style = {styles.buttonText}>
                        ВОЙТИ
                    </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    buttonText:{
        borderWidth: 1,
        padding: 10,
        borderColor: '#fff',
        color: '#fff',
        fontWeight: "600",
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: "center",
        width: 96,
        fontFamily: 'OswaldMedium',
        fontSize: 12,
        marginTop: 20,
    },
});
export default BGNoAuth;