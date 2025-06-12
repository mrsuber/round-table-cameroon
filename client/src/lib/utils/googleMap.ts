export const loadMapAPI = () => {
  const googleMapsURL = `https://maps.googleapis.com/maps/api/js?key=${
    process.env.REACT_APP_GOOGLE_API_KEY !== undefined ? process.env.REACT_APP_GOOGLE_API_KEY : ''
  }&libraries=places&v=quarterly&callback=Function.prototype`

  const scripts = document.getElementsByTagName('script')

  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf(googleMapsURL) === 0) {
      return scripts[i]
    }
  }

  const googleMapScript = document.createElement('script')
  googleMapScript.src = googleMapsURL
  googleMapScript.async = true
  googleMapScript.defer = true

  if (typeof window !== undefined) {
    document.body.appendChild(googleMapScript)
  }

  return googleMapScript
}
