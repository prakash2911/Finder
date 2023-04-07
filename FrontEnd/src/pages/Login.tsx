import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  StatusBar,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import OctIcon from 'react-native-vector-icons/Octicons';

import {validateEmail} from '../../utils';
import BottomSheet, {BottomSheetRefProps} from '../components/BottomSheet';

import {colors} from '../styles/colors';
import RegInput from '../components/RegInput';

const Login = (props: any) => {
  const [personalDetails, setPersonalDetails] = useState({
    email: '',
    password: '',
  });

  const [isEmailValid, setIsEmailValid] = useState(false);

  const [error, setError] = useState('Please fill all the details!');

  const fillDetailsErrorBottomRef = useRef<BottomSheetRefProps>(null);

  const toggleErrorFillDetailsBottomSheet = useCallback((err: any) => {
    const isErrorFilleDetailsBottomActive =
      fillDetailsErrorBottomRef?.current?.isActive();
    if (isErrorFilleDetailsBottomActive) {
      fillDetailsErrorBottomRef?.current?.scrollTo(0);
    } else {
      fillDetailsErrorBottomRef?.current?.scrollTo(-220);
    }

    setError(err);
  }, []);

  const resetAllBottomSheets = () => {
    const isErrorFilleDetailsBottomActive =
      fillDetailsErrorBottomRef?.current?.isActive();
    if (isErrorFilleDetailsBottomActive) {
      fillDetailsErrorBottomRef?.current?.scrollTo(0);
    }
  };

  const checkIfAllEntriesFilled = () => {
    if (personalDetails.email === '' || personalDetails.password === '') {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <BottomSheet ref={fillDetailsErrorBottomRef}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Pressable onPress={resetAllBottomSheets}>
            <OctIcon name="x-circle" size={36} color={'red'} />
          </Pressable>
          <Text
            style={{
              marginTop: 20,
              color: colors.darkGrey,
              fontWeight: 600,
              fontSize: 18,
            }}>
            {error}
          </Text>
        </View>
      </BottomSheet>
      <View style={styles.container}>
        <Pressable onPress={resetAllBottomSheets}>
          <StatusBar
            backgroundColor={colors.backgroundColor}
            barStyle="dark-content"
          />
          <Text
            style={{
              marginTop: 35,
              color: colors.googleBlue,
              fontWeight: 800,
              fontSize: 36,
            }}>
            Welcome back!
          </Text>
          <Text style={{marginTop: 5, color: colors.grey}}>
            We're so excited to see you again!
          </Text>
          <View style={styles.card}>
            <RegInput
              containerStyle={{marginTop: 0}}
              title="Email"
              placeholder="abcd@gmail.com"
              value={personalDetails.email}
              onChange={(email: any) =>
                setPersonalDetails(state => ({...state, email}))
              }
              type="valid"
              validateWith={validateEmail}
              setIsValid={setIsEmailValid}
            />
            <RegInput
              title="Password"
              secureTextEntry={true}
              autoCorrect={false}
              value={personalDetails.password}
              onChange={(password: any) =>
                setPersonalDetails(state => ({...state, password}))
              }
            />
          </View>
          <Pressable
            onPress={() => {}}
            style={{alignItems: 'flex-end', marginTop: 5}}>
            <Text style={{color: colors.googleBlue, fontSize: 13}}>
              Forgot Password
            </Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              if (!isEmailValid) {
                toggleErrorFillDetailsBottomSheet(
                  'Please enter a valid Email!',
                );
                return;
              } else if (!checkIfAllEntriesFilled()) {
                toggleErrorFillDetailsBottomSheet(
                  'Please fill all the details!',
                );
              } else if (false) {
                // code for verification of account credentials here
              } else {
                if (
                  personalDetails.email === 'admin@gmail.com' &&
                  personalDetails.password === 'admin'
                ) {
                  props.navigation.navigate('GovernmentHome');
                } else if (
                  personalDetails.email === 'consumer@gmail.com' &&
                  personalDetails.password === 'consumer'
                ) {
                  props.navigation.navigate('ConsumerHome');
                } else {
                  toggleErrorFillDetailsBottomSheet(
                    'Entered email and password is invalid!',
                  );
                }
              }
            }}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <View style={{height: 50, width: '100%'}}></View>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
  },
  card: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 20,
  },
  button: {
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: colors.googleBlue,
    marginHorizontal: 0,
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: '12%',
    color: '#fff',
    backgroundColor: 'transparent',
  },
});

export default Login;
