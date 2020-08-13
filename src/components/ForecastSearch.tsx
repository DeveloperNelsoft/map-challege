import React, { useEffect, useState, Fragment} from 'react'; 
import { Accordion, 
         Avatar,
            Card, 
            CardHeader,
            CardMedia,
            CardContent,
            CardActions,
            Collapse,
            Button, 
            FormControl,
            Paper,
            InputBase,
            Divider,
            IconButton,
            Typography,

} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from "clsx";
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MapImage from './MapImage';
import getAxios from '../apiConnector';
import {CityWeather} from '../interfaces/cityWeather';
import { yellow, blue } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 1500,
      maxHeight: 1500,
      marginTop:'2%',
      marginLeft:'10%',
      alignItems: 'center',
    },
    media: {
      height: 0,
      paddingTop: "20.0%" // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(270deg)"
    },
    avatar: {
        backgroundColor: yellow[900],
      },
    input: {
        marginLeft: theme.spacing(1),
       flex: 1,
       width:500,
       height: '30px',
       border: '1px solid ',
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
  }));

interface CityWeatherProps {
    cityWeathers: CityWeather;
}

const ForecastSearch: React.SFC<CityWeatherProps> = () => {

 const classes = useStyles();

  const [searchTerm, setSearchTerm] =  useState('');

  const [mapCityList, setmapCityList] =  useState([]);

  const [isCityNotfound, setCityNotfound] = useState(false);

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

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };


    useEffect(() => {
       
        let recoveredData = localStorage.getItem('mapCity')

        if(recoveredData !== null){
            let data = JSON.parse(recoveredData);
            const results = data.filter((city:any) =>
                city.value.toLowerCase().includes(searchTerm)
              );
            setmapCityList(results);
        }

    }, [searchTerm]);


    const saveInLocalStorage = (searchTerm: string) => {

        let mapCityList = [{value:`${searchTerm}`} ];

        let recoveredData = localStorage.getItem('mapCity')

        if(recoveredData === null){
            localStorage.setItem('mapCity', JSON.stringify(mapCityList));
        } else {
            let data = JSON.parse(recoveredData)
            let newCity = {value: `${searchTerm}`};
            data.push(newCity)
            localStorage.setItem('mapCity', JSON.stringify(data))
            setmapCityList(data);
        }

        console.log(localStorage.getItem('mapCity'));
  }

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
        saveInLocalStorage(searchTerm);
        setCityNotfound(false);
    }).catch((error:any) => {
        console.log('error: ', error);
        setCityNotfound(true);
        setSearchResults(error.message);
    });
  };
 

  const markers:any = [
    { 
        photo_id: 1, 
        longitude: isCityNotfound ? 0 : searchResults.coord.lon, 
        latitude: isCityNotfound ? 0 : searchResults.coord.lat, 
    }];

  const myMap:any = {
    lng: isCityNotfound ? 0 : searchResults.coord.lon, 
    lat: isCityNotfound ? 0 : searchResults.coord.lat,
    cityName: isCityNotfound ? '' : searchResults.cityName,
    windSpeed: isCityNotfound ? 0 : searchResults.wind.speed,
    windDeg: isCityNotfound ? 0 : searchResults.wind.deg,
    zoom: 15
  };

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
                                    <InputBase
                                    className={classes.input}
                                    placeholder="Search IT Crowd Maps"
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                    value={searchTerm} onChange={handleChange}
                                    />
                                    <Button className={classes.searchBtn}  onClick={(event: any) => {onBtnSearchClick(event)}} >
                                        <SearchIcon />
                                    </Button>
                                    

                                <ul>
                                    {mapCityList.map((item: any) => (
                                    <li><Button   className={classes.btn} > Delete </Button> {item.value}</li>
                                    ))}
                                </ul>
                        </CardContent>
                        <CardActions disableSpacing>
                            Weather information! - below -
                            <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                            >
                            <ExpandMoreIcon />
                            </IconButton>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <div>
                                    {isCityNotfound ? 
                                        <Typography paragraph><h1><p>City not found...</p></h1> </Typography>
                                        :  
                                        <div>
                                             <Typography paragraph>
                                                    {` Temperature: ${searchResults.attributes.temp} Pressure: ${searchResults.attributes.pressure} Humidity: ${searchResults.attributes.humidity} Max temperature: ${searchResults.attributes.temp_max} Min temperature: ${searchResults.attributes.temp_min}`}
                                            </Typography>
                                            <MapImage markers={markers} maps={myMap} />
                                        </div>
                                    }
                                </div>
                            </CardContent>
                        </Collapse>
                        </Card>
                    );
};

export default ForecastSearch;
