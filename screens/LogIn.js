import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, SafeAreaView, Alert } from 'react-native'
import { logIn } from '../utils/auth'
import Loader from '../components/Loader'

const LogIn = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const handleOnPressLogIn = () => {
    if (email !== '' && password !== '') {
      setLoading(true)
      logIn(email, password)
        .then(() => {
          setLoading(false)
          navigation.navigate('Home', { loadingUser: true })
        })
        .catch((e) => console.error(e.message))
      setEmail('')
      setPassword('')
    } else {
      Alert.alert(
        'Log In',
        'All the fields are required',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.view}>
        {loading ? <Loader /> : (
          <>
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
          </>
        )}
      </View>
    </SafeAreaView>
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
