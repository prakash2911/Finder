import { View, Text } from 'react-native'
import React from 'react'
import { ILatLng } from "../../utils"
import axios from 'axios';

const priority: any = async(array: ILatLng[], date: Date) => {

    const newdate = date.getFullYear() + "-" + (((date.getMonth() + 1) + '').length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + ((date.getDate() + '').length != 2 ? "0" + date.getDate() : date.getDate());
    // console.log(newdate);

    let stats: any = {coords: {latitude: 0, longitude: 0}, index: 0, score: 0, color: ""};
    let j = 0;
    // newarr.push({color: "yellow"})
    for(let item of array) {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude='+item.latitude+'&longitude='+item.longitude+'&hourly=weathercode&timezone=auto&start_date='+newdate+'&end_date='+newdate;
        await axios.get(url).then((response) => {
            const res = Math.max(...response.data.hourly.weathercode);
            if(res > stats.score) {
                stats.coords.latitude = item.latitude;
                stats.coords.longitude = item.longitude;
                stats.index = j;
                stats.score = res;
            }
            j++;
        }).catch((err) => {
            console.log("priority err: ", err);
        })
    }
    if(stats.score >= 90)
        stats.color = "red";
    else if(stats.score >= 80)
        stats.color = "orange";
    else if(stats.score >= 61)
        stats.color = "yellow";
    else
        stats.color = "green";

    console.log(stats);
  return (stats)
}

export default priority