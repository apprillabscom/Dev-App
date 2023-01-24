/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import { metrics } from "../../../utilities/Metrics";
import analytics from '@react-native-firebase/analytics';

const CardItemDirectory = (props) => {
  const { title = "", icon = "" } = props || {};
  const onPressOpen = () => {
    analytics().logSelectContent({
      content_type: 'directory_opened',
      item_id: title,
    })
    props.navigation.navigate("DirectoryItem", {
      otherParam: title,
    });
  };
  //var base64Icon = 'data:image/png;base64,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';
  var base64Icon = 'data:image/png;base64,'+icon.image;
  return (
    <View style={styles.mainView}>
      <TouchableOpacity onPress={onPressOpen} style={styles.card}>
        <Text style={styles.cardTitle}>{title.toUpperCase()}</Text>
      </TouchableOpacity>
      <Image style={styles.imageMap} source={{uri: base64Icon}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    height: metrics.HEIGHT * 0.066,
    backgroundColor: "#00AAAD33",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: metrics.HEIGHT * 0.028,
    marginLeft: metrics.WIDTH * 0.077,
    flex: 1
  },
  mainView: {
    //justifyContent: "center",
    //height: 56,
    flexDirection: 'row',
    marginTop: 10
    //backgroundColor: "red",
    //alignItems: "center",
    //flex: 0.2
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: 'bold',
    color: "#00AAAD",
    letterSpacing: 0.0015,
  },
  imageMap: {
    position: 'absolute',
    width: metrics.HEIGHT * 0.085, 
    height: metrics.HEIGHT * 0.085,
    marginTop: -metrics.WIDTH * 0.02
  }
});

export default CardItemDirectory;
