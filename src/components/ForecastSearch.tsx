import React, { useState} from 'react';
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
  const [searchResults, setSearchResults] = useState<CityWeather>({ 
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
                lon : parseFloat(itemWeather.coord.lon),
                lat : parseFloat(itemWeather.coord.lat),
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


  const saveInLocalStorage = (searchTerm: string) => {

        // let carListFav = [
        //     {name:'car1', id:1},
        //     {name:'car2', id:2}
        // ]

        // let recoveredData = localStorage.getItem('car')

        // if(recoveredData == null){
        //     localStorage.setItem('car', JSON.stringify(carListFav))
        // } else {
        //     let data = JSON.parse(recoveredData)
        //     let newCar = {name:'car3', id:3}
        //     data.push(newCar)
        //     localStorage.setItem('car', JSON.stringify(data))
        // }

        // console.log(localStorage.getItem('car'))
  }


  const markers:any = [
    { 
        photo_id: 1, 
        longitude: searchResults.coord.lon, 
        latitude: searchResults.coord.lat, 
    }];

  const myMap:any = {
    lng: searchResults.coord.lon, 
    lat: searchResults.coord.lat,
    cityName: searchResults.cityName,
    windSpeed: searchResults.wind.speed,
    windDeg: searchResults.wind.deg,
    zoom: 15
  };


    return(
            <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header>
                        <Form inline className="mx-auto col-12">
                            <FormControl type="text" placeholder="City" className="col-9 col-md-6"
                            value={searchTerm} onChange={handleChange} />
                            <Button className="col-3 col-md-3" variant="outline-primary" onClick={(event: any) => {onBtnSearchClick(event)}} ><Search /></Button>
                           
                              
                        </Form>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            {isCityNotfound ? 
                                <h1><p>City not found...</p></h1> 
                                :  
                                <MapImage markers={markers} maps={myMap} />
                            }
                        </div>
                    </Card.Body>
                </Card>
            </Accordion>
   );
};

export default ForecastSearch;
