import React from 'react';
import {CityWeather} from '../interfaces/cityWeather';


interface CityWeatherProps {
    cityWeathers?: CityWeather;
}

 const MapImage: React.SFC<CityWeatherProps> = (props: CityWeatherProps) => {

    const { cityWeathers } = props;
    
    return (
    <div>{`city : ${ cityWeathers?.cityName}`}</div>
    )

}

export default MapImage;