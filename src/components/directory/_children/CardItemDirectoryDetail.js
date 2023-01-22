/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from "react";
import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import IOMContext from "../../../../context/iomData/iomContext";
import { metrics } from "../../../utilities/Metrics";
import _ from 'lodash';

const CardItemDirectoryDetail = (props) => {
  const { dataItemService, getDataDirectoryItemService } =
    useContext(IOMContext);
  const {
    title = "",
    subTitle = "",
    subTitle1 = "Humanity & Inclusion",
    subTitle2 = "3004255896 - 3148866747",
    subTitle3 = "Lunes - Viernes: 8:30 a.m. a 4:30 p.m.",
    lines = [],
  } = props || {};
  const [open, setOpen] = useState(false);

  const onPressOpen = () => {
    setOpen((prev) => !prev);
    getDataDirectoryItemService(subTitle);
  };
  const { descripcion = "" } = dataItemService || {};
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.containerItem} onPress={onPressOpen}>
        <Text style={styles.textTitle}>{title}</Text>
        <Image
          style={{marginRight:10}}
          source={
            !open
              ? require("../../../resources/images/riArrowDownsLine.png")
              : require("../../../resources/images/riArrowOpenLine.png")
          }
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.form}>
          {_.map(lines,(val,id) => {
            return <View>
              <Text style={styles.textDescripcion}>{descripcion}</Text>
              <View style={styles.textWrap}>
                <Text style={styles.textsubTitle1}>{val.NombreOrganizacion}</Text>
              </View>

              {val.telefono_.length > 0  && (
                <View style={styles.form1}>
                  <Image
                    source={require("../../../resources/images/phone.png")}
                    style={styles.image2}
                  />
                  <Text style={styles.textTitle2}>{val.telefono_.length>0?val.telefono_[0].value:''}</Text>
                </View>
              )}
              {val.horario.length > 0  && (
                <View style={styles.form1}>
                  <Image
                    source={require("../../../resources/images/riTimeFill.png")}
                    style={styles.image2}
                  />
                  <Text style={styles.textTitle2}>{val.horario}</Text>
                
                </View>
              )}
            </View>
          })}
        </View>
        
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.54,
    borderColor: "#A1AAB2",
    paddingLeft: metrics.WIDTH * 0.05,
  },
  containerItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 78,
  },
  textTitle: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.12,
    paddingRight: 20,
    color: "#003031",
  },
  form: {
    marginBottom: 10,
    //marginRight:10,
  },
  textDescripcion: {
    fontSize: 13,
    fontWeight: "normal",
    lineHeight: 16,
    letterSpacing: 0.0025,
    color: "#003031",
    textAlign: "justify",
    paddingBottom: 10,
  },
  textWrap: {
    flexDirection:'row'
  },
  textsubTitle1: {
    fontSize: 17,
    fontWeight: "bold",
    lineHeight: 23,
    letterSpacing: 0.0015,
    color: "#007681",
    flex: 0.95,
  },
  form1: {
    marginTop: 10,
    flexDirection: "row",
  },
  textTitle2: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 16,
    letterSpacing: 0.0025,
    color: "#003031",
    marginStart: 15,
    flex: 0.95,
  },
});

export default CardItemDirectoryDetail;
