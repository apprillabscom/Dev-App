/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import CardItemDirectoryDetail from "./CardItemDirectoryDetail";
import HeaderItem from "../../global/_children/HeaderItem";
import IOMContext from "../../../../context/iomData/iomContext";
import _ from 'lodash';
/**
 * Componente que construye los Items del Directorio, itera sobre el objeto del JSON
 * @param {Object} this.props - objeto de propiedades heredados de la clase padre.
 * @return {Object} <View /> Item del Directorio
 */
const DirectoryItem = (props) => {
  const { dataItem, getDataByDepartId,dataDirectoryService } = useContext(IOMContext);
  const { otherParam = "" } = props.navigation.state.params || {};
  const awesomeChildListRenderItem = (item) => {
    if(item.item.tipo_de_linea_id != undefined && dataDirectoryService.some(val => val.id === item.item.tipo_de_linea_id)){
      return (
        <CardItemDirectoryDetail
          {...props}
          title={item.item.tipo_de_linea}
          subTitle1={item.item.NombreOrganizacion}
          subTitle2={item.item.telefono_}
          subTitle3={item.item.horario}
          subTitle={item.item.tipo_de_linea_id}
          lines={dataItem.LineasTelefonicas.filter(itemLine => itemLine.tipo_de_linea_id.includes(item.item.tipo_de_linea_id))}
        />
      )
    }
  };
  const awesomeChildListKeyExtractor = (item) => item.key;
  useEffect(() => {
    getDataByDepartId(otherParam);
  }, [otherParam]);
  return (
    <View style={styles.wrapper}>
      <HeaderItem {...props} title={otherParam} showSaveOpt={false} />
      {dataItem !== null && (
        <View style={[styles.box, styles.box2]}>
          <FlatList
            data={_.uniqBy(dataItem.LineasTelefonicas,'tipo_de_linea_id')}
            renderItem={awesomeChildListRenderItem}
            keyExtractor={awesomeChildListKeyExtractor}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
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
    flex: 10,
  },
});

export default DirectoryItem;
