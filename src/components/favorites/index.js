import React, { useEffect, useContext, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import Header from "../global/_children/Header";
import CardtemFavorite from "./_children/CardtemFavorite";
import IOMContext from "../../../context/iomData/iomContext";
import AsyncStorage from '@react-native-community/async-storage'
import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
const { SlideInMenu } = renderers;

const Favorites = (props) => {

  var {dataPoint,getDataPoint,dataMapeoService,getDataMapeoService,dataFavorite, getDataFavorite, deleteFavorite } = useContext(IOMContext);

  useEffect(() => {
    getDataFavorite();
  }, []);

  const deleteItemById = id => {
    deleteFavorite(id);
    dataFavorite=(dataFavorite.filter(item => item.id !== id));    
  }

  const awesomeChildListRenderItem = (item) => (
    <Menu style={styles.menu}>
      <CardtemFavorite {...props} id={item.item.id} />
      <MenuTrigger
        style={styles.trigger}>
        <Image source={require("../../resources/images/riMoreLine.png")} />
      </MenuTrigger>
      <MenuOptions optionsContainerStyle={{width:100}} customStyles={{ optionText: styles.text}}>
        <MenuOption  onSelect={() => deleteItemById(item.item.id)} text='Borrar' />
      </MenuOptions>
    </Menu>
  );

  const awesomeChildListKeyExtractor = (item) => item.id;

  return (
    
    <MenuProvider style={styles.container}>
      <View style={[styles.box, styles.box1]}>
        <Header {...props} showBack={false} title="Puntos favoritos" />
      </View>
      {dataFavorite !== null && (
        <View style={[styles.box, styles.box2]}>
          <FlatList
            data={dataFavorite}
            renderItem={awesomeChildListRenderItem}
            keyExtractor={awesomeChildListKeyExtractor}
          />
        </View>
      )}
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flex: 1,
    marginBottom: 15,
  },
  //header
  box1: {
    flex: 1,
  },
  //content
  box2: {
    flex: 10,
  },

  trigger: {
    //padding: 5,
    //margin: 25,
  },
  triggerText: {
    color: 'white',
  },
  disabled: {
    color: '#ccc',
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  logView: {
    flex: 1,
    flexDirection: 'column',
  },
  logItem: {
    flexDirection: 'row',
    padding: 8,
  },
  slideInOption: {
    padding: 5,
  },
  text: {
    fontSize: 15,
    lineHeight: 23,
    letterSpacing: 0.0015,
    fontWeight: "bold",
    color: "#003031",
  },
  menu:{
    marginTop: 12,
    display:'flex', 
    flexDirection:'row',
    borderBottomWidth: 3, 
    borderColor: "#E7EAEC"
  },
});

export default Favorites;
