/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import IOMContext from "../../../../context/iomData/iomContext";
import AuthContext from "../../../../context/auth/authContext";
import { SvgCssUri } from 'react-native-svg';
import _ from 'lodash';

const CardItemFavorite = (props) => {
  const { id = "" } = props || {};
  const { dataPoint, dataMapeoService, getDataPoint, dataMapeoState, getDataMapeoService } = useContext(IOMContext);
  const { config } = useContext(AuthContext);

  useEffect(() => {
    if(dataPoint && dataPoint.length < 1){
      getDataPoint(config.activeStates, config.activeVisible, config.activeType);
    }
    if(dataMapeoService && dataMapeoService.length < 1){
      getDataMapeoService();
    }
  }, []);

    /*const {
      Nombre_punto = "",
      Estado = "",
      time = "8:00am - 5:00pm",
      point = 5,
      Servicios = [],
    } = dataPoint !== null ? dataPoint.find((item) => item.ID == id) : {};*/
  const fav = dataPoint !== null ? dataPoint.find((item) => item.ID == id) : {};
  const onPressOpenPoint = (id) => {
    if (fav != undefined) {
      let coor = fav.Coordenadas.split(",");
      let latitude = parseFloat(coor[0]);
      let longitude = parseFloat(coor[1]);
      let icon = (dataMapeoState.find((state) => state.id_estado == fav.Estado_id));
      let uri = icon?.img_estado_b64;
      props.navigation.navigate("PointItem", { id, latitude, longitude, uri });
    }
  };

  const unique = [...new Set(fav?.Servicios.map(item => item.Servicio_id))];
  var services = [];

  _.map(unique,(val,id) => {
    var service = dataMapeoService.find((element) => {
      return element.id_servicio === val;
    });

    //let index = services.findIndex(item => item.b64 == service.img_servicio_b64);

    if(service && services.findIndex(item => item.b64 == service.img_servicio_b64) < 0){
      services.push({
        b64:service.img_servicio_b64,
        svg:<SvgCssUri
            key={service.id_servicio}
            height='32'
            width='32'
            uri={Platform.OS==='ios'?service.img_servicio_b64:'https://mapeo-de-servicios.gifmm-colombia.site'+service.img_servicio}
        />
      });
    }
  });
  let _Nombre_punto = fav?.Nombre_punto.substring(0, 30);

  const dayWeek = (id) => {
    switch(id) {
      case "1":
        return 'Lunes '
      case "2":
        return 'Martes '
      case "3":
        return 'Miercoles '
      case "4":
        return 'Jueves '
      case "5":
        return 'Viernes '
      default:
        return 'Sabado '
      }
  }

  return fav?.Nombre_punto !== "" ? (
    <TouchableOpacity key={id} style={styles.container} onPress={() => onPressOpenPoint(id)}>
      <View style={styles.containerFormTitle}>
        <Text style={styles.textTitle}>{(_Nombre_punto==undefined?'Punto no encontrado':_Nombre_punto) + "..."}</Text>
      </View>
      <View style={styles.containerForm}>{_.map(services,(val) => {
        return val.svg
      })}
      </View>
      <View style={styles.containerForm}>
        <Image source={require("../../../resources/images/riMapPinFill.png")} />
        <Text style={styles.textTitle2}>{fav?.Estado}</Text>
      </View>
{/*         {_.map(fav?.Horario,(val,id) => {
          return <View style={styles.containerForm}>
              <Image source={require("../../../resources/images/riTimeFill.png")} />
              <Text style={styles.textTitle2}>{dayWeek(val.day)}</Text>
              <Text style={styles.textTitle3}>{val?.starthours/100+':00'+' - '+val?.endhours/100+':00'}</Text>
            </View>
          })
        } */}
    </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    flex: 0.98
  },
  containerForm: {
    flexDirection: "row",
    marginBottom: 11,
  },
  containerFormTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
  },
  textTitle: {
    fontSize: 18,
    lineHeight: 23,
    letterSpacing: 0.0015,
    fontWeight: "bold",
    color: "#003031",
  },
  textTitle2: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 16,
    letterSpacing: 0.0025,
    color: "#003031",
    fontWeight: "bold",
    marginTop: 2,
    marginStart: 10.5,
  },
  textTitle3: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 16,
    letterSpacing: 0.0025,
    color: "#003031",
    marginTop: 2,
    marginStart: 10.5,
  },
});

export default CardItemFavorite;
