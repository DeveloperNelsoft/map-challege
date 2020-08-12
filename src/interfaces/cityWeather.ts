export interface CityWeather {
    cityName: string;
    coord: {
        lon : number;
        lat : number;
    };
    attributes: {
        temp : number;
        feels_like : number;
        temp_min : number;
        temp_max : number;
        pressure : number;
        humidity: number;
    };
    wind: {
        speed : number;
        deg : number;
    };

}