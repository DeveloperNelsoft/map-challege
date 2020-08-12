import React, { useState, useEffect} from 'react';
import { Accordion, Card, Button, Form, FormControl } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import MapImage from './MapImage';
import getAxios from '../apiConnector';
import {CityWeather} from '../interfaces/cityWeather';

interface CityWeatherProps {
    cityWeathers: CityWeather;
}


const ForecastSearch: React.SFC<CityWeatherProps> = () => {

  const [searchTerm, setSearchTerm] =  useState('');
//   const [searchResults, setSearchResults] = React.useState<Partial<CityWeatherProps>>([]);

//   const [searchResults, setSearchResults] = useState<CityWeatherProps>({
    const [searchResults, setSearchResults] = React.useState<CityWeather>({ 
    cityName: '',
    coord: {
        lon : 0,
        lat : 0,
    },
    attributes: {
        temp : 0,
        feels_like : 0,
        temp_min : 0,
        temp_max : 0,
        pressure : 0,
        humidity: 0,
    },
    wind: {
        speed : 0,
        deg : 0,
    },
});


  const [isCityNotfound, setCityNotfound] = useState(false);

  const handleChange = (event:any) => {
     setSearchTerm(event.target.value);
   };

    const onBtnSearchClick = (event: any) => {

    const customAPIKey = '0b60b687fc0fa2850e606e76c37da427';

    const urlBackend = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${customAPIKey}`;

    getAxios.instance('').get(urlBackend).then((result: any) => result.data)
    .then((itemWeather: any) => {

        let itemCity:CityWeather = {
            cityName: itemWeather.name,
            coord: {
                lon : itemWeather.coord.lon,
                lat : itemWeather.coord.lat,
            },
            attributes: {
                temp : itemWeather.main.temp,
                feels_like : itemWeather.main.feels_like,
                temp_min : itemWeather.main.temp_min,
                temp_max : itemWeather.main.temp_max,
                pressure : itemWeather.main.pressure,
                humidity: itemWeather.main.humidity,
            },
            wind: {
                speed : itemWeather.wind.speed,
                deg : itemWeather.wind.deg,
            },
        };

        setSearchResults(itemCity);

        setCityNotfound(false);
    }).catch((error:any) => {
        console.log('error: ', error);
        setCityNotfound(true);
        setSearchResults(error.message);
    });
  };

    return(
            <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header>
                        <Form inline className="mx-auto col-12">
                            <FormControl type="text" placeholder="Postulante" className="col-9 col-md-6"
                            value={searchTerm} onChange={handleChange} />
                            <Button className="col-3 col-md-3" variant="outline-primary" onClick={(event: any) => {onBtnSearchClick(event)}} ><Search /></Button>

                        </Form>
                    </Card.Header>
                    <h1> {isCityNotfound && <p>City not found...</p>}</h1>
                    <MapImage cityWeathers={searchResults}  />
                </Card>
            </Accordion>
   );
};

export default ForecastSearch;
