import React, { useState, useEffect } from 'react'
import { View, Text, Button, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth'
import Loader from '../components/Loader'
import { signOut } from '../utils/auth'
import { searchCity, getCityCoords } from '../utils/city'
import { searchRestaurants, getRestaurants } from '../utils/restaurant'

const Restaurant = ({ name }) => {
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
  const [loading, setLoading] = useState(false)
 
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
      setRestaurants([])
      setLoading(true)
      searchCity(city)
        .then((response) => response.json()) 
        .then((json) => {
          const cityCoords = getCityCoords(json.results)
          
          return searchRestaurants(cityCoords)
        })
        .then((response) => response.json())
        .then(json => {
          const data = getRestaurants(json.results)

          setRestaurants(data)
          setLoading(false)
        })
    }
  }

  if (initializing) return <Loader />

  if (!user) {
    navigation.push('LogIn')

    return <Loader />
  }

  return (
    <View style={styles.view}>
      <Text style={styles.textHello}>Hello! {user.email}</Text>
      <Text style={styles.textSearch}>Search restaurants</Text>
      <View style={styles.viewInput}>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={(text) => setCity(text)}
          placeholder="Type a city name"
        />
        <TouchableOpacity>
          <Button
            title="Submit"
            style={styles.btnSearch}
            onPress={handleOnSearchRestaurants}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.restaurantsView}>
        {restaurants.length > 0 ? (
          <>
            <Text style={styles.titleRestaurants}>Restaurants</Text>
            <FlatList
              data={restaurants}
              renderItem={({ item }) => {
                return (
                  <Restaurant name={item.name} />
                )
              }}
              keyExtractor={(item => item.id)}
            />
          </>
        ) : null}
        {loading ? <Loader /> : null}
      </View>
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
    padding: 16,
  },
  input: {
    paddingLeft: 16,
    marginBottom: 16,
    width: '70%',
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
  textHello: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  textSearch: {
    marginBottom: 16,
  },
  viewInput: {
    flexDirection: 'row',
  },
  btnSearch: {
    width: '20%',
  },
  titleRestaurants: {
    marginBottom: 16,
  },
  restaurantsView: {
    height: 400
  },
})

export default Home
