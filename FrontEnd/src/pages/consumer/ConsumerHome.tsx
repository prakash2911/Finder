import {View, StyleSheet, Pressable, Text} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import MapView, {
  enableLatestRenderer,
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  Circle,
} from 'react-native-maps';
import OctIcon from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Geolocation from 'react-native-geolocation-service';

import {Dropdown} from '../../components/Dropdown';
import {colors} from '../../styles/colors';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import Loading from '../../components/Loading';
import priority from '../../api/priority';
import details from '../../api/details';

enableLatestRenderer();

import {
  IMarker,
  defaultMarker,
  generatePointsOnCurvedBezier,
  ILatLng,
  airportData,
} from '../../../utils';

const ConsumerHome = () => {
  const mapRef = useRef<MapView>(null);
  const [source, setSource] = useState<IMarker>(defaultMarker);
  const [destination, setDestination] = useState<IMarker>(defaultMarker);

  const [polyPoints, setPolyPoints] = useState<ILatLng[]>([]);
  const [accidentProneAreas, setAccidentProneAreas] = useState<ILatLng[]>([]);
  const [accidentColor, setAccidentColor] = useState<string>(
    'rgba(255, 99, 71, 0.5)',
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const [leftCol, setLeftCol] = useState('');
  const [rightCol, setRightCol] = useState('');
  const [lottieSource, setLottieSource] = useState(
    require('../../assets/73473-sunclouds.json'),
  );
  const [modalDetails, setModalDetails] = useState('Fetching data...');

  const generateMarkers = (source: IMarker, destination: IMarker) => {
    setPolyPoints(
      generatePointsOnCurvedBezier(source.latlng, destination.latlng, 20),
    );
  };

  const getRGBA = (color: string) => {
    if (color == 'red') return 'rgb(255, 0, 0, 0.5)';
    else if (color == 'green') return 'rgb(0, 128, 0, 0.5)';
    else if (color == 'yellow') return 'rgb(255,255,0, 0.5)';
    return 'rgb(255, 165, 0, 0.5)';
  };

  const toggleModal = () => {
    setSosModalVisible(!sosModalVisible);
  };

  const toggleConfirmModal = () => {
    setConfirmModalVisible(!confirmModalVisible);
  };

  const confirmSendSOS = () => {
    toggleConfirmModal();
    toggleModal();
    // Code for sending SOS signal
  };

  const getUserLocation = async () => {
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
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const sendAircraftInfo = () => {
    if (source.title !== '' && destination.title !== '') {
      updateModal();
      setModalVisible(true);
      const dataToBeSent = {
        source: source.latlng,
        destination: destination.latlng,
      };
      console.log(dataToBeSent);
      // post request to backend
      // Assume that backend has sent data of type ILatLng[]
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            {
              latitude: 12.994164261312932,
              longitude: 80.17098481446678,
            },
            {
              latitude: 18.994164261312932,
              longitude: 88.17098481446678,
            },
          ]);
        }, 2000);
      }).then(data => {
        setAccidentProneAreas(data as ILatLng[]);
      });
    }
  };

  const updateModal = async () => {
    let date = new Date();
    let point = await priority(
      generatePointsOnCurvedBezier(source.latlng, destination.latlng, 8),
      date,
    );
    setAccidentColor(getRGBA(point.color));
    console.log(getRGBA(point.color));
    mapRef.current?.animateToRegion({
      latitude: point.coords.latitude,
      longitude: point.coords.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    });
    setAccidentProneAreas([point.coords]);

    let dets = await details(
      point.coords.latitude,
      point.coords.longitude,
      date,
    );

    let msg = 'You should be good to go!';

    if (point.color == 'orange') {
      setLottieSource(require('../../assets/48424-cloudy-animation.json'));
      msg =
        'The weather conditions seem unfavorable, but it should still be safe.';
    } else if (point.color == 'red') {
      setLottieSource(require('../../assets/Thunder.json'));
      msg = 'We advice you consider rescheduling your journey.';
    } else if (point.color == 'green')
      setLottieSource(require('../../assets/73473-sunclouds.json'));
    else setLottieSource(require('../../assets/36240-rain-icon.json'));

    setModalDetails(msg + '\n\n');
    setLeftCol(
      'Min Temp: ' +
        '\nMax Temp: ' +
        '\nMax Wind Speed: ' +
        '\nDominant Wind Direction: ' +
        '\nRain: ',
    );
    setRightCol(
      dets.minTemp +
        '°C\n' +
        dets.maxTemp +
        '°C\n' +
        dets.windspeedMax +
        'km/hr\n' +
        dets.winddirectionDominant +
        '°\n' +
        dets.showersSum +
        'mm',
    );
  };

  return (
    <View style={styles.container}>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalContents}>
            {accidentProneAreas.length === 0 && <Loading size={100} />}
            {accidentProneAreas.length !== 0 && (
              <>
                <LottieView
                  source={lottieSource}
                  style={{width: 100, height: 100}}
                  autoPlay
                  loop
                />
                <Text
                  style={[
                    styles.bottomButtonText,
                    {color: 'black', fontWeight: 'bold', fontSize: 18},
                  ]}>
                  {modalDetails}
                </Text>

                <View style={{flexDirection: 'row', width: '100%'}}>
                  <Text
                    style={[
                      styles.bottomButtonText,
                      {
                        fontSize: 13,
                        color: 'black',
                        flex: 10,
                        textAlign: 'right',
                      },
                    ]}>
                    {leftCol}
                  </Text>
                  <View style={{flex: 1}}></View>
                  <Text
                    style={[
                      styles.bottomButtonText,
                      {
                        fontSize: 13,
                        color: 'black',
                        flex: 10,
                        textAlign: 'left',
                      },
                    ]}>
                    {rightCol}
                  </Text>
                </View>

                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.bottomButton}>
                  <Text style={styles.bottomButtonText}>Return to Map</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal isVisible={sosModalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalContents}>
            <Text style={styles.modalText}>SOS signal sent!</Text>
            <Text style={styles.description}>
              The authorities have been alerted, please provide the Source and
              Destination of your flight
            </Text>
            <View style={{flexDirection: 'row', paddingBottom: 20}}>
              <Dropdown
                style={styles.bottomButton}
                placeholderStyle={styles.bottomButtonText}
                selectedTextStyle={styles.bottomButtonText}
                itemTextStyle={{color: 'black', textAlign: 'center'}}
                containerStyle={styles.dropdownContainerStyle}
                iconColor="white"
                placeholder="Source"
                mode={'modal'}
                data={airportData}
                labelField="title"
                valueField="value"
                value={source}
                onChange={(item: any) => {
                  if (item === destination) {
                    console.log("Can't be same as destination");
                    setSource(defaultMarker);
                    setDestination(defaultMarker);
                  } else {
                    setSource(item);
                  }
                }}
              />
              <Pressable
                onPress={() => {
                  setSource(destination);
                  setDestination(source);
                }}
                style={{padding: 10}}>
                <OctIcon name="arrow-switch" size={22} color="#4285F4" />
              </Pressable>
              <Dropdown
                style={styles.bottomButton}
                placeholderStyle={styles.bottomButtonText}
                selectedTextStyle={styles.bottomButtonText}
                itemTextStyle={{color: 'black', textAlign: 'center'}}
                containerStyle={styles.dropdownContainerStyle}
                iconColor="white"
                placeholder="Destination"
                mode={'modal'}
                data={airportData}
                labelField="title"
                valueField="value"
                value={destination}
                onChange={(item: any) => {
                  if (item === source) {
                    console.log("Can't be same as source");
                    setSource(defaultMarker);
                    setDestination(defaultMarker);
                  } else {
                    setDestination(item);
                  }
                }}
              />
            </View>
            <Pressable style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal isVisible={confirmModalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalContents}>
            <Text style={styles.modalText}>
              Are you sure you want to send an SOS signal?
            </Text>
            <View style={styles.modalButtonGroup}>
              <Pressable
                style={styles.modalButton}
                onPress={toggleConfirmModal}>
                <Text style={styles.modalButtonText}>No</Text>
              </Pressable>
              <View>
                <Pressable style={styles.modalButton} onPress={confirmSendSOS}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </Pressable>
              </View>
            </View>
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
              radius={10000}
              fillColor={accidentColor}
              strokeColor="rgba(255, 99, 71, 1)"
            />
          ))}
      </MapView>
      <Pressable
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          backgroundColor: colors.red,
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={toggleConfirmModal}>
        <Text
          style={{textAlign: 'center', fontWeight: 800, color: colors.white}}>
          SOS
        </Text>
      </Pressable>
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
                setAccidentProneAreas([]);
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
                setAccidentProneAreas([]);
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
        <View style={styles.bottomContainerRow}>
          <Pressable
            onPress={() => {
              setAccidentProneAreas([]);
              sendAircraftInfo();
            }}
            style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ConsumerHome;

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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.googleBlue,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonText: {
    color: colors.googleBlue,
    fontSize: 16,
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
  modalText: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 20,
    color: colors.black,
    textAlign: 'center',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 30,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.googleBlue,
    borderRadius: 15,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#1e272e',
  },
});
