import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import credentials from '../credentials';

const myGoogleMapUrl = `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${credentials.privateMapKey}`;


/* 
Getting some tips for consuming maps components from:
https://developers.google.com/maps/documentation/javascript/examples/map-latlng-literal */

const MapImage = compose<any,any>(
  withProps({
    googleMapURL: myGoogleMapUrl,
    loadingElement: <div style={{ height: '80%' }} />,
    containerElement: <div style={{ height: '300px' }} />,
    mapElement: <div style={{ height: '200%' }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    zoom={props.maps.zoom}
    center={{ lat: props.maps.lat, lng: props.maps.lng }}
    heading={5}
  >
      {props.markers.map((marker:any) => (
        <Marker key={marker.photo_id} position={{ lat: marker.latitude, lng: marker.longitude }} />
      ))}
    <Marker position={{ lat: props.maps.lat, lng: props.maps.lng }}>
      <InfoWindow>
      <p>{!props.maps.cityName.length ? 'city?' : `city: ${props.maps.cityName} - wind Speed: ${props.maps.windSpeed}  - wind Deg: ${props.maps.windDeg} `}</p>
      </InfoWindow>
    </Marker>
  </GoogleMap>
));

export default MapImage;