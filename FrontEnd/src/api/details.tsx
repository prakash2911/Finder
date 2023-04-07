import axios from 'axios';

const details: any = async (latitude: number, longitude: number, date: Date) => {

    const dateFormat = date.getFullYear() + "-" + (((date.getMonth() + 1) + '').length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + ((date.getDate() + '').length != 2 ? "0" + date.getDate() : date.getDate());
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=weathercode,rain,showers,pressure_msl,windspeed_180m,winddirection_180m&daily=temperature_2m_max,temperature_2m_min,precipitation_hours,,rain_sum,showers_sum,precipitation_sum,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&timezone=auto&start_date=' + dateFormat + '&end_date=' + dateFormat;
    let obj;
    await axios.get(url).then((response) => {
        const tmp = new Date();
        const iter = tmp.getHours() % 12;
        obj = {
            weathercode: response.data.hourly.weathercode[iter],
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            maxTemp: response.data.daily.temperature_2m_max[0],
            minTemp: response.data.daily.temperature_2m_min[0],
            rain: response.data.hourly.rain[iter],
            rainSum: response.data.daily.rain_sum[0],
            showers: response.data.hourly.showers[iter],
            showersSum: response.data.daily.showers_sum[0],
            pressure_msl: response.data.hourly.pressure_msl[iter],
            windspeed: response.data.hourly.windspeed_180m[iter],
            windspeedMax: response.data.daily.windspeed_10m_max[0],
            winddirection: response.data.hourly.winddirection_180m[iter],
            winddirectionDominant: response.data.daily.winddirection_10m_dominant[0],
            precipitationHours: response.data.daily.precipitation_hours[0],
            precipitationSum: response.data.daily.precipitation_sum[0],
            precipitationProbabilityMax: response.data.daily.precipitation_probability_max[0]
        };
    }).catch((err) => {
        console.log("ERROR: ", err)
    });
    return obj;
}

export default details