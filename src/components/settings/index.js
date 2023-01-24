import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, Platform, PermissionsAndroid, Dimensions } from "react-native";
import Header from "../global/_children/Header";
import LastUpdate from "../global/_children/LastUpdate";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import IOMContext from "../../../context/iomData/iomContext";
import AuthContext from "../../../context/auth/authContext";
import Icon from 'react-native-vector-icons/Ionicons';
import analytics from '@react-native-firebase/analytics';

const Settings = (props) => {
  const [position, setPosition] = useState({
    latitude: 4.570868,
    longitude: -74.297333,
    latitudeDelta: 1,
    longitudeDelta: 10,

  });
  const [marginBottomV, setMarginBottomV] = useState(0);
  const { dataPoint, getDataPoint, dataMapeoService, getDataMapeoService, dataMapeoState, getDataMapeoState } = useContext(IOMContext);
  const { config } = useContext(AuthContext);

  const mapRef = React.createRef();
  //Validamos que se tenga permisos de ubicacion en el dispositivo
  useEffect(async () => {
    try {
      await (hasLocationPermission())
    } catch (e) {
      console.log('Error: ', e);
    }
  }, []);


  useEffect(async () => {
    setMarginBottomV(1);
  }, []);

  useEffect(() => {
    if (dataPoint && dataPoint.length < 1) {
      getDataPoint(config.activeStates, config.activeVisible, config.activeType);
    }
    if (dataMapeoService && dataMapeoService.length < 1) {
      getDataMapeoService();
    }
    if (dataMapeoState && dataMapeoState.length < 1) {
      getDataMapeoState();
    }/*
    Geolocation.getCurrentPosition(
      ({coords}) => {
        setPosition({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        console.log('Posicion Obtenida',coords )
      },
      error => {
        console.log('Errorrrrrrrrr')
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );*/
  }, []);

  const mapMarkers = () => {
    if (dataPoint != null) {
      return dataPoint.map((item, index) => {
        var icon = (dataMapeoState.find((state) => state.id_estado == item.Estado_id));
        if (item.Coordenadas !== "") {
          let coor = item.Coordenadas.split(",");
          let latitude = parseFloat(coor[0]);
          let longitude = parseFloat(coor[1]);
          return (
            <Marker
              key={index}
              coordinate={{
                latitude,
                longitude,
              }}
              onPress={() => onPressOpenPoint(item.ID, latitude, longitude, icon?.img_estado_b64)}
            >
              <Image style={{ width: 28, height: 40 }} source={{ uri: icon?.img_estado_b64 }} />
            </Marker>
          );
        }
      });
    }
  };

  const onPressOpenPoint = (id, latitude, longitude, uri) => {
    analytics().logSelectContent({
      content_type: 'point_opened',
      item_id: id,
    })
    props.navigation.navigate("PointItem", { id, latitude, longitude, uri });
  };

  const onPressOpen = () => {
    props.navigation.navigate("FilterSetting");
  };

  var payments = [];
  for (let i = 0; i < 5; i++) {
    payments.push(
      <Image key={i} source={require("../../resources/images/hear.png")} />
    );
  }

  const hasLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permisos de ubicación',
          message: 'La aplicación requiere permisos de ubicación',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Si el usuario acepta los permisos de ubicación, obtenemos la posición del usuario
        console.log('entro 1 obtiene permisos');
        //await (getLocation())
      } else {
        //this.logIn();
        console.log('entro 2');
      }
      //return true;
    } else if (Platform.OS === 'ios') {
      await Geolocation.requestAuthorization('always');
      //getLocation(true);
      console.log('entro 3');
    }
    return true;
  };

  // metodo para hacer zoom a la posicion actual del usuario. Se llama desde el custom button del mapa.
  const getLocation = async () => {
    let wPos = Geolocation.getCurrentPosition(
      ({ coords }) => {

        mapRef.current?.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.001,
        },1000);
        
      },
      error => {
        
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
    )
    
  };

  const viewRegion = (region) => {

  }



  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.box1]}>
        <Header {...props} showBack={false} title="Puntos de servicio" />
        <LastUpdate />
      </View>
      <View style={{ flex: 1, flex: Platform.OS === "ios" ? 5.8 : 7.3, marginBottom: marginBottomV }}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={false}
          zoomControlEnabled={true}
          zoomEnabled
          initialRegion={{
            latitude: 4.570868,
            longitude: -74.297333,
            latitudeDelta: 1,
            longitudeDelta: 10,
          }}
          region={position}
          onRegionChange={region => viewRegion(region)}



        >
          {dataPoint !== null && mapMarkers()}
        </MapView>
        <View style={styles.overlayM}>
          <TouchableOpacity>
            <Icon
              name="locate-outline"
              onPress={getLocation}
              size={25}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlay2} onPress={onPressOpen}>
            <Image
              source={require("../../resources/images/riMapPinLine.png")}
            />
            <Text style={styles.textFilter}>Filtrar puntos de servicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flex: 1,
  },
  //header
  box1: {
    flex: 1,
  },
  //content
  box2: {
    flex: Platform.OS === "ios" ? 5.8 : 7.3,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    //marginTop: 10,
  },
  overlay: {
    position: "absolute",
    flexDirection: "row",
    bottom: 24,
    height: 48,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay2: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#132A3E",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 238,
    padding: 10,
  },
  textFilter: {
    fontSize: 15,
    lineHeight: 18,
    color: "#FFFFFF",
    letterSpacing: 0.0125,
    marginLeft: 5,
  },
  overlayM: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(232, 236, 237, 0.7)",
    height: 40,
    width: 40,
    justifyContent: 'center',
      alignItems: 'center'
    
  },
});

export default Settings;
