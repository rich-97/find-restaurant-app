import { GOOGLE_API_KEY } from "../config"

export const searchRestaurants = (cityCoords) => {
  return fetch(makePlacesUrl(cityCoords.lat, cityCoords.lng, GOOGLE_API_KEY))
}

export const makePlacesUrl = (lat, lng, apiKey) => {
  const radius = 500

  return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&types=restaurant&key=${apiKey}`
}

export const getRestaurants = (results) => {
  return results.map(result => {
    return {
      id: result.id,
      name: result.name,
      rating: result.rating,
    }
  })
}
