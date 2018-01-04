import api from '../core/api'
import React from 'react'
import { Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  StyleSheet
} from 'react-native'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }
  componentDidAppear () {
    console.log('mount Login')
  }
  componentWillMount () {
    this._loadInitialState()
  }

  async _loadInitialState () {
    try {
      const value = await AsyncStorage.getItem('user')
      if (value !== null) {
        this.me()
        console.log(value)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async me () {
    const navigation = this.props.navigation
    var data
    try {
      data = await api.get('user/me')
      await AsyncStorage.setItem('me', JSON.stringify(data))
      navigation.navigate('Home')
    } catch (e) {
      console.log(e)
    }
  }

  async login () {
    var data
    try {
      data = await api.post('user/login', { 'email': this.state.email, 'password': this.state.password })
      await AsyncStorage.setItem('user', JSON.stringify(data))
      await AsyncStorage.setItem('jwt', JSON.stringify(data.jwt))
      await this.me()
    } catch (e) {
      console.log(e)
    }
  }

  render () {
    return (
      <View behavior='padding' style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.header}>Login</Text>
          <TextInput style={styles.textInput} placeholder='Email' onChangeText={(email) => this.setState({email})} value={this.state.email} />
          <TextInput style={styles.textInput} placeholder='Password' onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry />
          <TouchableOpacity style={styles.btn} onPress={(e) => { this.login(e) }}>
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingLeft: 40,
    paddingRight: 40
  },
  header: {
    fontSize: 24,
    marginBottom: 60,
    color: '#fff',
    fontWeight: 'bold'
  },
  textInput: {
    alignSelf: 'stretch',
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#fff'
  },
  btn: {
    alignSelf: 'stretch',
    backgroundColor: '#00c4a7',
    padding: 20,
    alignItems: 'center'
  }
})

export default Login