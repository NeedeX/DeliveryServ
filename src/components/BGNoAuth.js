import React from 'react';
import { StyleSheet, Dimensions, TouchableHighlight, Text, View, Button, TouchableOpacity, Image, ScrollView} from 'react-native';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
class BGNoAuth extends React.Component {
    render() {
        return(
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0, 0.5)',
                width: width,
                height: height,
                position: 'absolute',
                justifyContent: 'center',
            }}>
                <Text style={{
                        color: '#fff',
                        textAlign: 'center',
                        marginTop: 20,
                    }}>{this.props.text} </Text>
                    <TouchableOpacity  underlayColor='rgba(255,255,255,0.1)' style={{justifyContent: 'center', alignItems: 'center'}}
                    onPress={() =>  this.props.nav.navigate('Phone', { goBack: 'Addresses',}) }>
                    <Text style = {styles.buttonText}>
                        ВОЙТИ
                    </Text>
                    </TouchableOpacity>
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