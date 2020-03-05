import React, { useState, useEffect } from 'react'
import { View, Text, Button, TextInput, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import auth from '@react-native-firebase/auth'
import Loader from '../components/Loader'
import { signOut } from '../utils/auth'
import { searchCity, getCityCoords, searchCityByCoords, getCurrentLocation } from '../utils/city'
import { searchRestaurants, getRestaurants } from '../utils/restaurant'
import Geolocation from '@react-native-community/geolocation'

const Restaurant = ({ name, rating }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.rating}>Rating: {rating}</Text>
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
    } else {
      Alert.alert(
        'City',
        'The city input is required',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }
  }
  const handleOnUseMyLocation = () => {
    setLoading(true)
    Geolocation.getCurrentPosition(info => {
      const { coords } = info;
      const latLng = {
        lat: coords.latitude,
        lng: coords.longitude,
      }

      searchCityByCoords(latLng)
        .then((response) => response.json())
        .then((json) => {
          const cityCoords = getCityCoords(json.results)
          const currentLocation = getCurrentLocation(json.results)

          setCity(currentLocation)
          
          return searchRestaurants(cityCoords)
        })
        .then((response) => response.json())
        .then(json => {
          const data = getRestaurants(json.results)

          setRestaurants(data)
          setLoading(false)
        })
    });
  }

  if (initializing) {
    return <Loader />
  }

  if (!user) {
    return (
      <SafeAreaView>
        <View style={styles.pleaseLoginView}>
          <Text style={styles.pleaseText}>Please, </Text>
          <Button style={styles.pleaseBtn} title="Log In" onPress={() => navigation.push('LogIn')} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>

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
        <TouchableOpacity>
          <Text style={styles.useMyLocationText} onPress={handleOnUseMyLocation}>Use my location</Text>
        </TouchableOpacity>
        <View style={styles.restaurantsView}>
          {restaurants.length > 0 ? (
            <>
              <Text style={styles.titleRestaurants}>Restaurants</Text>
              <FlatList
                data={restaurants}
                renderItem={({ item }) => {
                  return (
                    <Restaurant name={item.name} rating={item.rating} />
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
    </SafeAreaView>
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
    height: 380
  },
  useMyLocationText: {
    marginBottom: 16,
  },
  pleaseLoginView: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  pleaseText: {
    fontSize: 16,
  },
  pleaseBtn: {
    padding: 0,
    height: 10,
    fontSize: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500'
  }
})

export default Home
