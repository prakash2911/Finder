import {View, StyleSheet, Pressable, Text, TextInput} from 'react-native';
import React, {useState, useRef} from 'react';
import MapView, {
  enableLatestRenderer,
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  Circle,
} from 'react-native-maps';
import OctIcon from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {Dropdown} from '../../components/Dropdown';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import Loading from '../../components/Loading';

enableLatestRenderer();

import {
  IMarker,
  defaultMarker,
  generatePointsOnCurvedBezier,
  ILatLng,
  airportData,
  noOfEnginesData,
  weatherConditiondata,
} from '../../../utils';
import {colors} from '../../styles/colors';

const GovernmentHome = () => {
  const mapRef = useRef<MapView>(null);
  const [source, setSource] = useState<IMarker>(defaultMarker);
  const [destination, setDestination] = useState<IMarker>(defaultMarker);
  const [noOfEngines, setNoOfEngines] = useState({title: '', value: '0'});
  const [weatherCondition, setWeatherCondition] = useState({
    title: '',
    value: '0',
  });

  const [polyPoints, setPolyPoints] = useState<ILatLng[]>([]);
  const [accidentProneAreas, setAccidentProneAreas] = useState<ILatLng[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [lastKnownLocation, setLastKnownLocation] = useState({
    latitude: '0',
    longitude: '0',
  });

  const generateMarkers = (source: IMarker, destination: IMarker) => {
    setPolyPoints(
      generatePointsOnCurvedBezier(source.latlng, destination.latlng, 20),
    );
  };

  const sendAircraftInfo = () => {
    if (source.title !== '' && destination.title !== '') {
      setModalVisible(true);
      const dataToBeSent = {
        source: source.latlng,
        destination: destination.latlng,
        noOfEngines: noOfEngines.title,
        weatherCondition: weatherCondition.title,
        lastKnownLocation: lastKnownLocation,
      };
      console.log(dataToBeSent);
      // post request to backend
      // Assume that backend has sent data of type ILatLng[]
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            polyPoints[4],
            polyPoints[9],
            polyPoints[14],
            polyPoints[19],
          ]);
        }, 2000);
      }).then(data => {
        setAccidentProneAreas(data as ILatLng[]);
        setTimeout(() => {
          setModalVisible(false);
        }, 2000);
      });
      mapRef.current?.animateToRegion({
        latitude: 12.994164261312932,
        longitude: 80.17098481446678,
        latitudeDelta: 0.95,
        longitudeDelta: 0.921,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalContents}>
            {accidentProneAreas.length === 0 && <Loading size={100} />}
            {accidentProneAreas.length !== 0 && (
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <AntDesign name="warning" size={60} color={colors.red} />
                <Text
                  style={{
                    fontWeight: 'bold',
                    paddingTop: 15,
                    color: colors.grey,
                  }}>
                  Accident Prone Areas Detected!
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {source.title !== '' && source.description !== '' && (
          <Marker
            coordinate={source.latlng}
            title={source.title}
            description={source.description}
            pinColor={'blue'}
          />
        )}
        {destination.title !== '' && destination.description !== '' && (
          <Marker
            coordinate={destination.latlng}
            title={destination.title}
            description={destination.description}
            pinColor={'red'}
          />
        )}
        {source.title !== '' &&
          source.description !== '' &&
          destination.title !== '' &&
          destination.description !== '' && (
            <Polyline
              coordinates={polyPoints}
              strokeColor="#4285F4" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={5}
            />
          )}
        {accidentProneAreas &&
          accidentProneAreas.map((area, index) => (
            <Circle
              key={index}
              center={area}
              radius={250000}
              fillColor="rgba(255, 99, 71, 0.5)"
              strokeColor="rgba(255, 99, 71, 1)"
            />
          ))}
      </MapView>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomContainerRow}>
          <Dropdown
            data={airportData}
            placeholder="Source"
            value={source}
            onChange={(item: any) => {
              if (item === destination) {
                console.log("Can't be same as destination");
                setSource(defaultMarker);
                setDestination(defaultMarker);
              } else {
                setSource(item);
                mapRef.current?.animateToRegion({
                  ...item.latlng,
                  latitudeDelta: 0.95,
                  longitudeDelta: 0.921,
                });
              }
              generateMarkers(item, destination);
            }}
          />
          <Pressable
            onPress={() => {
              setSource(destination);
              setDestination(source);
              generateMarkers(source, destination);
            }}
            style={{padding: 10}}>
            <OctIcon name="arrow-switch" size={22} color="#4285F4" />
          </Pressable>
          <Dropdown
            data={airportData}
            placeholder="Destination"
            value={destination}
            onChange={(item: any) => {
              if (item === source) {
                console.log("Can't be same as source");
                setSource(defaultMarker);
                setDestination(defaultMarker);
              } else {
                setDestination(item);
                mapRef.current?.animateToRegion({
                  ...item.latlng,
                  latitudeDelta: 0.95,
                  longitudeDelta: 0.921,
                });
              }
              generateMarkers(source, item);
            }}
          />
        </View>
        <Text style={{color: colors.grey}}>
          Last Known Location Information
        </Text>
        <View
          style={[
            styles.bottomContainerRow,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <View style={{width: '42%'}}>
            <Text
              style={{
                color: colors.grey,
                paddingBottom: 10,
                paddingLeft: 5,
                fontSize: 13,
              }}>
              Latitude
            </Text>
            <TextInput
              value={lastKnownLocation.latitude}
              placeholder="Latitude"
              placeholderTextColor={colors.grey}
              keyboardType="numeric"
              style={{
                backgroundColor: colors.lightGoogleBlue,
                padding: 10,
                borderRadius: 10,
                color: colors.black,
              }}
              onChange={value => {
                !isNaN(value.nativeEvent.text) &&
                  setLastKnownLocation({
                    ...lastKnownLocation,
                    latitude: value.nativeEvent.text,
                  });
              }}
            />
          </View>
          <View style={{width: '42%'}}>
            <Text
              style={{
                color: colors.grey,
                paddingBottom: 10,
                paddingLeft: 5,
                fontSize: 13,
              }}>
              Longitude
            </Text>
            <TextInput
              value={lastKnownLocation.longitude}
              placeholder="Longitude"
              placeholderTextColor={colors.grey}
              keyboardType="numeric"
              style={{
                backgroundColor: colors.lightGoogleBlue,
                padding: 10,
                borderRadius: 10,
                color: colors.black,
              }}
              onChange={value => {
                !isNaN(value.nativeEvent.text) &&
                  setLastKnownLocation({
                    ...lastKnownLocation,
                    longitude: value.nativeEvent.text,
                  });
              }}
            />
          </View>
        </View>
        <View
          style={[
            styles.bottomContainerRow,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <Dropdown
            title="No. Of Engines"
            data={noOfEnginesData}
            placeholder="No. Of Engines"
            value={noOfEngines.value}
            onChange={(item: any) => {
              setNoOfEngines(item);
            }}
            invertStyle
          />
          <Dropdown
            title="Weather Condition"
            data={weatherConditiondata}
            placeholder="Weather"
            value={weatherCondition.value}
            onChange={(item: any) => {
              setWeatherCondition(item);
            }}
            invertStyle
          />
        </View>
        <View style={styles.bottomContainerRow}>
          <Pressable onPress={sendAircraftInfo} style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default GovernmentHome;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 840,
    width: 410,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 18,
    width: 380,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  bottomContainerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  bottomButton: {
    textAlign: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  dropdownContainerStyle: {width: 200, borderRadius: 10},
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContents: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
