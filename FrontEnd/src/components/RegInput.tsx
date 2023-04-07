import React, {useState} from 'react';
import {View, TextInput, Text, Pressable} from 'react-native';
import OctIcon from 'react-native-vector-icons/Octicons';

import {colors} from '../styles/colors';

const RegInput = (props: any) => {
  const [valid, setValid] = useState(false);
  const [visible, setVisible] = useState(false);

  const checkValidity = (value: string) => {
    if (props.validateWith(value)) {
      setValid(true);
      props.setIsValid(true);
    } else {
      setValid(false);
      props.setIsValid(false);
    }
  };

  return (
    <View style={[{marginTop: 20}, props.containerStyle]}>
      {props.noTitle ? null : (
        <Text style={{color: colors.darkGrey, fontWeight: 800}}>{props.title}</Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.backgroundColor,
          paddingHorizontal: 10,
          marginTop: 10,
          borderRadius: 10,

        }}>
        <TextInput
          style={[props.textInputStyle, {width: '80%', color: colors.black}]}
          placeholderTextColor={colors.grey}
          placeholder={props.placeholder || props.title}
          value={props.value}
          onChangeText={value => {
            if (props.keyboardType === 'numeric') {
              props.onChange(value.replace(/[^0-9]/g, ''));
            } else if (props.keyboardType === 'ascii-capable') {
              props.onChange(value.replace(/[^a-z ]/gi, ''));
            } else {
              props.onChange(value);
            }
            if (props.type === 'valid') {
              checkValidity(value);
            }
          }}
          keyboardType={props.keyboardType}
          dataDetectorTypes={props.dataDetectorTypes}
          textContentType={props.textContentType}
          autoCorrect={props.autoCorrect}
          secureTextEntry={
            props.secureTextEntry ? (visible ? false : true) : false
          }
        />
        <View style={{flexDirection: 'row'}}>
          {props.secureTextEntry ? (
            <Pressable
              onPress={() => setVisible(state => !state)}
              style={{marginRight: 10}}>
              <OctIcon
                name="eye"
                size={18}
                color={visible ? colors.googleBlue : colors.grey}
              />
            </Pressable>
          ) : null}
          {props.type === 'valid' ? (
            valid ? (
              <OctIcon
                name="check-circle"
                size={18}
                color={colors.googleBlue}
              />
            ) : (
              <OctIcon name="x-circle" size={18} color={colors.red} />
            )
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default RegInput;
