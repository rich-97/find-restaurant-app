import { GOOGLE_API_KEY } from '../config'

export const searchCity = (city) => {
  return fetch(makeGeocodingUrl(city, GOOGLE_API_KEY))
}

export const makeGeocodingUrl = (address, apiKey) => {
  return `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
}

export const getCityCoords = (results) => {
  const result = results[0]
  const { geometry } = result

  return geometry.location
}

export const makeReverseGeocodingUrl = (lat, lng, apiKey) => {
  return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
}

export const searchCityByCoords = (coords) => {
  return fetch(makeReverseGeocodingUrl(coords.lat, coords.lng, GOOGLE_API_KEY))
}

export const getCurrentLocation = (results) => {
  const result = results[0]
  const address = result.formatted_address

  return address
}
