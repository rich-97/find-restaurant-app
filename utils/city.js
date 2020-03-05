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
