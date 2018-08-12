import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const shapeView = (props) => {
  const imgSrc = {
    'logo': require('./assets/approov_largelogo.png'),
    'hello': require('./assets/hello.png'),
    'confused': require('./assets/confused.png'),
  };
  
  return (
    <View style={props.style}>
      <Image source={imgSrc[props.shape]} style={styles.shapeImg} />
      <Text style={{fontSize: 24, marginTop: 10}}>{props.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shapeImg: {
      resizeMode: 'contain',
      height: 256,
      width: 256
  }
});

export default shapeView;

// end of file
