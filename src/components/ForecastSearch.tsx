import React, { useEffect, useState } from 'react';
import { Avatar, Card, CardHeader, CardContent, Collapse, Button, TextField, Typography, InputAdornment } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import MapImage from './MapImage';
import getAxios from '../apiConnector';
import { CityWeather } from '../interfaces/cityWeather';
import { yellow, blue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1500,
    maxHeight: 1500,
    marginTop: '2%',
    marginLeft: '10%',
    alignItems: 'center',
  },
  media: {
    height: 0,
    paddingTop: '20.0%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(270deg)',
  },
  avatar: {
    backgroundColor: yellow[900],
  },
  input: {
    width: '300px',
    height: '30px',
  },
  btn: {
    width: 20,
    height: 20,
    border: '1px solid',
    fontSize: '8px',
    borderBlockColor: 'grey',
  },
  searchBtn: {
    width: '40px',
    height: '30px',
    border: '1px solid',
    fontSize: '8px',
    borderBlockColor: 'grey',
  },
  iconButton: {
    padding: 20,
  },
  divLeft: {
    float: 'left',
    width: '300px',
    textalign: 'right',
    margin: '2px 10px',
    display: 'inline',
  },
  divRight: {
    float: 'left',
    width: '300px',
    textalign: 'left',
    margin: '35px 10px',
    display: 'inline',
  },
  divMap: {
    float: 'left',
    width: '1500px',
    textalign: 'left',
    display: 'inline',
  },
}));

interface CityWeatherProps {
  cityWeathers: CityWeather;
}

const ForecastSearch: React.SFC<CityWeatherProps> = () => {
  const classes = useStyles();

  const [searchTerm] = useState('');

  const [mapCityList, setmapCityList] = useState([]);

  const [isCityNotfound, setCityNotfound] = useState(false);

  const [expanded] = React.useState(true);

  const [searchResults, setSearchResults] = useState<CityWeather>({
    cityName: '',
    coord: {
      lon: 0,
      lat: 0,
    },
    attributes: {
      temp: 0,
      feels_like: 0,
      temp_min: 0,
      temp_max: 0,
      pressure: 0,
      humidity: 0,
    },
    wind: {
      speed: 0,
      deg: 0,
    },
  });

  useEffect(() => {
    getCityFromLocalStorage();
  }, []);

  const getCityFromLocalStorage = () => {
    let recoveredData = localStorage.getItem('mapCity');

    if (recoveredData !== null) {
      let data = JSON.parse(recoveredData);
      const results = data.filter((city: any) => city.value.toLowerCase().includes(searchTerm));
      setmapCityList(results);
    }
  };

  const defaultCityProps = {
    options: mapCityList,
    getOptionLabel: (option: any) => option.value,
  };

  const saveInLocalStorage = (searchTerm: string) => {
    let mapCityList = [{ value: `${searchTerm.toLowerCase()}` }];

    let recoveredData = localStorage.getItem('mapCity');

    if (recoveredData === null) {
      localStorage.setItem('mapCity', JSON.stringify(mapCityList));
      setmapCityList(JSON.parse(JSON.stringify(mapCityList)));
    } else {
      let data = JSON.parse(recoveredData);
      if (data.find((index: any) => index.value === searchTerm.toLowerCase()) === undefined) {
        let newCity = { value: `${searchTerm.toLowerCase()}` };
        if (data.length === 5) {
          data.shift();
        }
        data.push(newCity);
        localStorage.setItem('mapCity', JSON.stringify(data));
      }
      setmapCityList(data);
    }
    console.log(`mapCity values in localstorage: ${localStorage.getItem('mapCity')}`);
  };

  const handleChange = (valueCity: any) => {
    if (valueCity !== null) {
      searchByCity(valueCity);
    }
  };

  const deleteCurrentCity = () => {
    let recoveredData = localStorage.getItem('mapCity');
    if (recoveredData !== null) {
      let data = JSON.parse(recoveredData);

      if (data.find((index: any) => index.value === searchTerm.toLowerCase()) !== undefined) {
        data = data.filter((index: any) => index.value !== searchTerm.toLowerCase());
        localStorage.setItem('mapCity', JSON.stringify(data));
        setmapCityList(data);
        alert(`city ${searchTerm}  has been deleted.`);
      }
    }
  };

  const searchByCity = (searchTerm: string) => {
    const customAPIKey = '0b60b687fc0fa2850e606e76c37da427';

    const urlBackend = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${customAPIKey}`;

    getAxios
      .instance('')
      .get(urlBackend)
      .then((result: any) => result.data)
      .then((itemWeather: any) => {
        let itemCity: CityWeather = {
          cityName: itemWeather.name,
          coord: {
            lon: parseFloat(itemWeather.coord.lon),
            lat: parseFloat(itemWeather.coord.lat),
          },
          attributes: {
            temp: itemWeather.main.temp,
            feels_like: itemWeather.main.feels_like,
            temp_min: itemWeather.main.temp_min,
            temp_max: itemWeather.main.temp_max,
            pressure: itemWeather.main.pressure,
            humidity: itemWeather.main.humidity,
          },
          wind: {
            speed: itemWeather.wind.speed,
            deg: itemWeather.wind.deg,
          },
        };

        setSearchResults(itemCity);
        saveInLocalStorage(searchTerm);
        setCityNotfound(false);
      })
      .catch((error: any) => {
        console.log('error: ', error);
        setCityNotfound(true);
        setSearchResults(error.message);
      });
  };

  const markers: any = [
    {
      photo_id: 1,
      longitude: isCityNotfound ? 0 : searchResults.coord.lon,
      latitude: isCityNotfound ? 0 : searchResults.coord.lat,
    },
  ];

  const myMap: any = {
    lng: isCityNotfound ? 0 : searchResults.coord.lon,
    lat: isCityNotfound ? 0 : searchResults.coord.lat,
    cityName: isCityNotfound ? '' : searchResults.cityName,
    windSpeed: isCityNotfound ? 0 : searchResults.wind.speed,
    windDeg: isCityNotfound ? 0 : searchResults.wind.deg,
    zoom: 15,
  };

  /* Visual design and components by https://material-ui.com/es/api/autocomplete/ */

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            CROWD
          </Avatar>
        }
        title="IT Crowd Search Geo Location"
        subheader={`${new Date().toUTCString()}`}
      />
      <CardContent>
        <div style={{}}>
          <div className={classes.divLeft}>
            <Autocomplete
              {...defaultCityProps}
              id="cityDropDown"
              value={mapCityList}
              onChange={(event: any, newValue: any) => (newValue !== null ? handleChange(newValue.value) : '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="For new city, write and press Enter"
                  margin="normal"
                  fullWidth
                  onKeyDown={(e: any) => {
                    if (e.keyCode === 13 && e.target.value) {
                      handleChange(e.target.value);
                    }
                  }}
                />
              )}
            />
          </div>
          <div className={classes.divRight}>
            <span> </span>
            <Button className={classes.searchBtn} onClick={deleteCurrentCity}>
              Delete this city
            </Button>
          </div>
        </div>
      </CardContent>
      <div className={classes.divMap}>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div>
              {isCityNotfound ? (
                <Typography paragraph>
                  <h1>
                    <p>City not found...</p>
                  </h1>{' '}
                </Typography>
              ) : (
                <div>
                  <Typography paragraph>
                    {` Weather information:  (Temperature: ${searchResults.attributes.temp} Pressure: ${searchResults.attributes.pressure} Humidity: ${searchResults.attributes.humidity} Max temperature: ${searchResults.attributes.temp_max} Min temperature: ${searchResults.attributes.temp_min} )`}
                  </Typography>
                  <MapImage markers={markers} maps={myMap} />
                </div>
              )}
            </div>
          </CardContent>
        </Collapse>
      </div>
    </Card>
  );
};

export default ForecastSearch;
