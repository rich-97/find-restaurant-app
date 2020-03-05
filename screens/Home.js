import React, { useState, useEffect } from 'react'
import { View, Text, Button, TextInput, StyleSheet, FlatList } from 'react-native'
import auth from '@react-native-firebase/auth'
import Loader from '../components/Loader'
import { signOut } from '../utils/auth'
import { searchCity, getCityCoords } from '../utils/city'
import { searchRestaurants, getRestaurants } from '../utils/restaurant'

const Restaurant = ({ name }) => {
  console.log(name)

  return (
    <View style={styles.item}>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const Home = ({ navigation }) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState(null)
  const [city, setCity] = useState('')
  const [restaurants, setRestaurants] = useState([]) 
 
  // Handle user state changes
  const onAuthStateChanged = (user) => {
    setUser(user)

    if (initializing) setInitializing(false)
  }
 
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)

    return subscriber // unsubscribe on unmount
  }, [])
  const handleOnSearchRestaurants = () => {
    if (city !== '') {
      searchCity(city)
        .then((response) => response.json()) 
        .then((json) => {
          const cityCoords = getCityCoords(json.results)
          
          return searchRestaurants(cityCoords)
        })
        .then((response) => response.json())
        .then(json => {
          const data = getRestaurants(json.results)

          console.log('restaurants', data)

          setRestaurants(data)
        })
    }
  }

  if (initializing) return <Loader />

  if (!user) {
    navigation.push('LogIn')

    return <Loader />
  }

  return (
    <View>
      <Text>Home {user.email}</Text>
      <Text>Search restaurants</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={(text) => setCity(text)}
        placeholder="City"
      />
      <Button title="Submit" onPress={handleOnSearchRestaurants} />
      <Text>Restaurants</Text>
      {restaurants.length > 0 ? (
        <FlatList
          data={restaurants}
          renderItem={({ item }) => {
            return (
              <Restaurant name={item.name} />
            )
          }}
          keyExtractor={(item => item.id)}
        />
      ) : null}
      <Button title="Log out" onPress={() => signOut()} />
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
  },
  item: {
    padding: 6,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 16,
  },
})

export default Home
