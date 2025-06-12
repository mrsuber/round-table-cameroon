import React, { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';

const MapContainer = () => {
  const API_KEY = 'AIzaSyAEZ4XfqC6HKu21RLJ1g06rdGnNz4fKwIo' || '';
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });
  const mapStyles = {
    height: '642px',
    width: '100%',
    borderradius: '10px'
  };

  const defaultCenter = useMemo(() => ({ lat: 4.159302, lng: 9.243536 }), []);
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={mapStyles} zoom={10} center={defaultCenter}>
      <Marker position={defaultCenter} />
    </GoogleMap>
  );
};
export default MapContainer;
