import {Dropdown as DropdownElement} from 'react-native-element-dropdown';
import {StyleSheet, View, Text} from 'react-native';
import {colors} from '../styles/colors';
export const Dropdown = (props: any) => {
  return (
    <View style={styles.container}>
      {props.title && <Text style={styles.titleStyle}>{props.title}</Text>}
      <DropdownElement
        style={[
          styles.bottomButton,
          {
            backgroundColor: props.invertStyle ? colors.white : '#4285F4',
            borderWidth: props.invertStyle ? 1 : 0,
            borderColor: '#4285F4',
          },
        ]}
        placeholderStyle={[
          styles.bottomButtonText,
          {color: props.invertStyle ? '#4285F4' : colors.white},
        ]}
        selectedTextStyle={[
          styles.bottomButtonText,
          {color: props.invertStyle ? '#4285F4' : colors.white},
        ]}
        itemTextStyle={{color: 'black', textAlign: 'center'}}
        containerStyle={styles.dropdownContainerStyle}
        iconColor="white"
        placeholder={props.placeholder}
        mode={'modal'}
        data={props.data}
        labelField="title"
        valueField="value"
        value={props.value}
        onChange={props.onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleStyle: {
    fontSize: 12,
    color: colors.grey,
    paddingBottom: 10,
    paddingLeft: 5,
  },
  bottomButton: {
    textAlign: 'center',
    borderRadius: 10,
    padding: 10,
    width: 150,
  },
  bottomButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  dropdownContainerStyle: {width: 200, borderRadius: 10},
});
