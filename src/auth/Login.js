import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import firebase from 'react-native-firebase';

export default class Login extends React.Component {
    state = { email: '', password: '', errorMessage: null }

    handleLogin = () => {
        const { email, password } = this.state
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => this.props.navigation.navigate('Main'))
          .catch(error => this.setState({ errorMessage: error.message }))
    }
    userDB(user)
    {
      //console.log("UIDGoogleUser = ", user.uid);
      //console.log("chPhone = ", user.phoneNumber);
      //console.log("chUID = ", this.props.options.UIDClient);
    
      return fetch(this.props.options.URL+'InsertUser.php',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': "gzip, deflate",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UIDGoogleUser: user.uid,
          chPhone: user.phoneNumber,
          UIDClient: this.props.options.UIDClient,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
  
      })
      .catch((error) => {
        console.error(error);
      });
  
    }
    render() {
        return (
        <View style={styles.container}>
            <Text>Login</Text>
            {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
                {this.state.errorMessage}
            </Text>}
            <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            />
            <TextInput
            secureTextEntry
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            />
            <Button title="Войти" onPress={this.handleLogin} />
            <Button
            title="У вас нет учетной записи? Регистрация"
            onPress={() => this.props.navigation.navigate('SignUp')}
            />
        </View>
        )
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})