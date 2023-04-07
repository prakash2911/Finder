import {View, Text} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const Loading = (props: any) => {
  return (
    <LottieView
      source={require('../assets/loading.json')}
      autoPlay
      loop
      style={{width: props.size, height: props.size}}
    />
  );
};

export default Loading;
