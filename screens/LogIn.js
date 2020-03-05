import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import { logIn } from '../utils/auth'

const LogIn = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleOnPressLogIn = () => {
    navigation.navigate('Home')
    
    if (email !== '' && password !== '') {
      logIn(email, password)
      setEmail('')
      setPassword('')
    }
  }

  return (
    <View style={styles.view}>
      <Text style={styles.text}>Welcome!</Text>
      <TextInput
        value={email}
        placeholder="Email"
        style={styles.input}
        onChangeText={(value) => setEmail(value)}
        autoCapitalize="none"
        autoCompleteType="email"
      />
      <TextInput
        secureTextEntry
        value={password}
        style={styles.input}
        placeholder="Password"
        onChangeText={(value) => setPassword(value)}
      />
      <Button title="Log In" onPress={handleOnPressLogIn} />
      <Text>Or</Text>
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    marginBottom: 16,
  },
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    paddingLeft: 16,
    marginBottom: 16,
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  }
})

export default LogIn
