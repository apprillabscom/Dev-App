import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { metrics } from "../../../utilities/Metrics";

const Header = (props) => {
  const {
    form,
    setForm,
    navigation,
    showBack = true,
    title = "Regístrate",
  } = props;
  const onPressBack = () => {
    if (form === null || form === 0) {
      navigation.navigate("Login");
    } else {
      setForm(form - 1);
    }
  };

  const onPressProfile = () => {
    navigation.navigate("Profile");
  };
  return (
    <View>
      <View style={styles.statusBarBackground}>
      </View>
      <View style={styles.container}>
        <View style={styles.containerForm}>
          {showBack && (
            <TouchableOpacity onPress={onPressBack} style={styles.logo}>
              <Image source={require("../../../resources/images/left.png")} />
            </TouchableOpacity>
          )}
          <View style={{flex:0.2}}/>
          <View style={{flex:0.8}}> 
            <Text style={styles.labelTitle}>{title}</Text>
          </View>
          {!showBack && (
          <View style={{flex:0.2}}> 
            <TouchableOpacity onPress={onPressProfile} style={styles.image}>
              <Image 
                style={{
                  tintColor: "white",
                  height: 25,
                  width: 25
                }} 
                source={require("../../../resources/images/profile.png")} />
              <Text style={styles.textPerfil}>Mi Perfil</Text>
            </TouchableOpacity>
          </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: metrics.HEIGHT * 0.066,
    alignItems: "center",
    backgroundColor: "#00AAAD",
    justifyContent: "center",
  },
  containerForm: {
    flexDirection: "row",
  },
  statusBarBackground:{
    height: (Platform.OS === 'ios') ? metrics.WIDTH * 0.08 : 0,
    backgroundColor: "#00AAAD",
  },
  labelTitle: {
    fontSize: 22,
    fontWeight: "500",
    lineHeight: 28,
    letterSpacing: 0.0015,
    textAlign: "center",
    color: "#FFFFFF",
  },
  logo: {
    position: "absolute",
    right: metrics.WIDTH * 0.53,
  },
  image: {
    //position: "absolute",
    //flexDirection: "column",
    alignItems:'center',
    //right: -metrics.WIDTH * 0.24,
    //top: -metrics.HEIGHT * 0.007,
  },
  textPerfil:{
    color:'#FFFFFF',
    fontSize:13,
    letterSpacing:0.04,
    lineHeight:14,
    marginTop:3,
  },
});

export default Header;
