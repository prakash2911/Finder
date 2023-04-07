import {LatLng} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

export interface ILatLng {
  latitude: number;
  longitude: number;
}
export interface IMarker {
  title: string;
  description: string;
  value: string;
  latlng: ILatLng;
}

export const defaultMarker: IMarker = {
  title: '',
  description: '',
  value: '0',
  latlng: {latitude: 0, longitude: 0},
};

export function generatePointsOnCurvedBezier(
  startPoint: LatLng,
  endPoint: LatLng,
  numberOfPoints: number,
) {
  var curvature = 0.3;
  var controlPoint1 = {
    latitude: startPoint.latitude,
    longitude:
      startPoint.longitude +
      (endPoint.longitude - startPoint.longitude) * curvature,
  };
  var controlPoint2 = {
    latitude: endPoint.latitude,
    longitude:
      endPoint.longitude -
      (endPoint.longitude - startPoint.longitude) * curvature,
  };

  var points = [];
  for (var i = 0; i < numberOfPoints; i++) {
    var t = i / (numberOfPoints - 1);
    var x =
      (1 - t) * (1 - t) * (1 - t) * startPoint.latitude +
      3 * (1 - t) * (1 - t) * t * controlPoint1.latitude +
      3 * (1 - t) * t * t * controlPoint2.latitude +
      t * t * t * endPoint.latitude;
    var y =
      (1 - t) * (1 - t) * (1 - t) * startPoint.longitude +
      3 * (1 - t) * (1 - t) * t * controlPoint1.longitude +
      3 * (1 - t) * t * t * controlPoint2.longitude +
      t * t * t * endPoint.longitude;
    points.push({latitude: x, longitude: y});
  }
  return points;
}

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const validatePassword = (password: string) => {
  return String(password)
    .toLowerCase()
    .match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,16}$/);
};

export const validateAlphabet = (value: string) => {
  return String(value)
    .toLowerCase()
    .match(/^[a-zA-Z][a-zA-Z ]+/);
};

export const airportData: IMarker[] = [
  {
    title: 'India',
    description: 'Chennai International Airport',
    value: '1',
    latlng: {latitude: 12.994164261312932, longitude: 80.17098481446678},
  },
  {
    title: 'Australia',
    description: 'Sydney International Airport',
    value: '2',
    latlng: {latitude: -33.949909782735425, longitude: 151.18206260137515},
  },
  {
    title: 'France',
    description: 'Paris Charles de Gaulle Airport',
    value: '3',
    latlng: {latitude: 49.009724, longitude: 2.547778},
  },
  {
    title: 'Canada',
    description: 'Ottawa Macdonald-Cartier International Airport',
    value: '4',
    latlng: {latitude: 45.31930250750994, longitude: -75.66921884615718},
  },
];

export const amatuerBuiltData = [
  {
    title: 'Yes',
    value: '1',
  },
  {
    title: 'No',
    value: '2',
  },
];

export const noOfEnginesData = [
  {
    title: '1',
    value: '1',
  },
  {
    title: '2',
    value: '2',
  },
  {
    title: '3',
    value: '3',
  },
  {
    title: '4',
    value: '4',
  },
  {
    title: '5',
    value: '5',
  },
  {
    title: '6',
    value: '6',
  },
  {
    title: '7',
    value: '7',
  },
  {
    title: '8',
    value: '8',
  },
];

export const engineTypeData = [
  {
    title: 'Reciprocating',
    value: '1',
  },
  {
    title: 'Other',
    value: '2',
  },
];

export const weatherConditiondata = [
  {
    title: 'VMC',
    value: '1',
  },
  {
    title: 'IMC',
    value: '2',
  },
];

export const requestLocation = async () => {
  let location;
  Geolocation.getCurrentPosition(
    position => {
      // location = position.coords;
      return position.coords;
    },
    error => {
      console.log(error.code, error.message);
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
  return location;
};
