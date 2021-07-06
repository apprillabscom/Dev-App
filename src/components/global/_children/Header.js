import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { metrics } from "../../../utilities/Metrics"

const Header = props => {
  const {
    form,
    setForm,
    navigation,
    showBack = true,
    title = 'Regístrate',
  } = props;
  const onPressBack = () => {
    if (form === null || form === 0) {
      navigation.navigate('Login');
    } else {
      setForm(form - 1);
    }
  };

  const onPressProfile = () => {
    navigation.navigate('Profile');
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerForm}>
        {showBack && (
          <TouchableOpacity onPress={onPressBack} style={styles.logo}>
            <Image  source={require('../../../resources/images/left.png')} />
          </TouchableOpacity>
        )}
        <Text style={styles.labelTitle}>{title}</Text>
        {!showBack && (
          <TouchableOpacity onPress={onPressProfile} style={styles.image}>
            <Image source={require('../../../resources/images/profile.png')} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    alignItems: 'center',
    backgroundColor: '#00AAAD',
    justifyContent: 'center',
  },
  containerForm: {
    flexDirection: 'row',
  },
  labelTitle: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 28,
    letterSpacing: 0.0015,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  logo: {
    position: 'absolute',
    right: metrics.WIDTH*0.53,
    //marginLeft:50,
  },
  image: {
    position: 'absolute',
    right: -metrics.WIDTH*0.22,
    top: -metrics.HEIGHT*0.007,
  },
});

export default Header;