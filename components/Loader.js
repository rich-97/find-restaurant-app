import React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'

const Loader = () => {
  return (
    <View style={styles.view}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }
})

export default Loader
