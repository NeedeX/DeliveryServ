import React, { Component } from "react";
import { TouchableOpacity,  View, Text, Image, StyleSheet,  Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');
class CustomHeader extends Component {
    constructor(props){
        super(props);
        this.itemWidth = (Dimensions.get('window').width) / 2;
      }

    render() {
      return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={
                () => this.props.nav.navigate('Category', { iCategories: this.props.iCategory, title: this.props.chName})
            }
            style={styles.touchableOpacityStyle}>
                <View style={{elevation: 2,  borderRadius: 15}}>
                    <Image source={ this.props.chMainImage.length > 0 ? { uri: this.props.chMainImage } : require('./assets/noImageAvailable.png')} 
                    style={{  width: width/2 - 36,  height: 114*height/720, borderRadius: 15, }}
                    imageStyle={{ borderRadius: 15 }}/>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', borderRadius: 25, height: 50,}}>
                    <Text style={styles.textStyle}>{this.props.chName}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
export default CustomHeader;

const styles = StyleSheet.create({

    textStyle:
    {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'Roboto',
      color: '#4E4E4E',
      marginLeft: 8,
    },
    touchableOpacityStyle:
    {
        borderColor: '#fff', 
        borderRadius:15, 
        borderWidth: 0,
        height: 140,
        marginBottom: 16,
    }
    

  
  
});