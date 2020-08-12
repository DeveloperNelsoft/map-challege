import React, {Component} from 'react';
import {CityWeather} from '../interfaces/cityWeather';
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    Marker

} from 'react-google-maps';

interface CityWeatherProps {
    cityWeathers: CityWeather;
}
// resource for google map setting and informtion: https://www.youtube.com/watch?v=PuwGdowtm5s

const MapImage: React.SFC<CityWeatherProps> = (props: CityWeatherProps) => {

    const { cityWeathers   } = props;

    const latlng = {
        lat: cityWeathers.coord.lat,
        lng: cityWeathers.coord.lon
      };

      console.log(`latlng.lat : ${latlng.lat} / latlng.lng : ${latlng.lng} `);
      const pos = {lat: latlng.lat, lng: latlng.lng};

      return (
        <GoogleMap defaultZoom={15}  defaultCenter={pos}  >
            <Marker key={1200}  position={pos} />
        </GoogleMap>
    );

};

export default withScriptjs(
    withGoogleMap( (props: CityWeatherProps) => <MapImage {...props}/> ));





// const MapImage  = withScriptjs(
//     withGoogleMap((props: CityWeatherProps) => {

//     const { cityWeathers } = props;

//         return (

//             <GoogleMap defaultZoom={15}  defaultCenter={{ lat: cityWeathers.coord.lat,
//                 lng: cityWeathers.coord.lon}}  > 
               
               
//                 <Marker key={1200}  position={{ lat: cityWeathers.coord.lat,
//                         lng: cityWeathers.coord.lon}} />
//             </GoogleMap>
//         );
//     })
// );

// export default  MapImage;

