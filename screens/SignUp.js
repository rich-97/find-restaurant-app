import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import { register } from '../utils/auth'

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const handleOnPressSignUp = () => {
    if (
      email !== ''
      && password !== ''
      && confirmPassword !== ''
    ) {
      if (password === confirmPassword) {
        register(email, password)
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        navigation.navigate('LogIn')
      }
    }
  }

  return (
    <View style={styles.view}>
      <Text style={styles.text}>Register</Text>
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
      <TextInput
        secureTextEntry
        value={confirmPassword}
        style={styles.input}
        placeholder="Confirm password"
        onChangeText={(value) => setConfirmPassword(value)}
      />
      <Button title="Sign Up" onPress={handleOnPressSignUp} />
      <Text>Aleady have an account?</Text>
      <Button title="Log In" onPress={() => navigation.navigate('LogIn')} />
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

export default Login