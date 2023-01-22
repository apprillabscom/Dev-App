import React, { useContext, useEffect }  from "react";
import { ImageBackground, Text, View, StyleSheet } from "react-native";
import { ItemMain } from "./_children/Card";
import LastUpdate from "./_children/LastUpdate";
import HeaderHome from "./_children/HeaderHome";
import AuthContext from "../../../context/auth/authContext";

const Main = (props) => {
  const { navigation } = props;
  const { user, signOut, config } = useContext(AuthContext);

  useEffect(() => {
    if (!config.anonymousAuth && user && !user.email) {
      signOut();
      navigation.navigate("Registre");
    }

  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        //source={require("../../resources/images/Background.png")}
        style={styles.image}
      >
        <HeaderHome />
        <Text style={styles.labelTitle}>¡Te damos la bienvenida!</Text>
        <Text style={styles.labelDescripcion}>
          Queremos brindarte la mejor ayuda, por eso hemos preparado las
          siguientes funciones para ti:
        </Text>
        <View style={styles.containerForm}>
          <ItemMain
            {...props}
            name="Settings"
            title="Puntos de servicio"
            image="1"
          />
          <ItemMain
            {...props}
            name="Directory"
            title="Líneas Telefónicas"
            image="2"
          />
        </View>
        <View style={styles.containerForm2}>
          <ItemMain
            {...props}
            name="Links"
            title="Contenido de interés"
            image="3"
          />
          <ItemMain
            {...props}
            name="Favorites"
            title="Puntos guardados"
            image="4"
          />
          {!config.anonymousAuth && (
          <ItemMain
            {...props}
            name="Profile"
            title="Mi Perfil"
            image="5"
          />
          )}
          
        </View>
        <View style={styles.containerFooter}>
          <LastUpdate />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  containerForm: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  containerForm2: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  labelTitle: {
    fontSize: 27,
    fontWeight: "bold",
    lineHeight: 34,
    letterSpacing: 0.0015,
    textAlign: "center",
    color: "#007681",
    marginTop: 240,
    marginBottom: 24,
  },
  labelDescripcion: {
    fontSize: 15,
    color: "#425565",
    lineHeight: 19,
    letterSpacing: 0.005,
    marginRight: 19,
    marginLeft: 13,
    marginBottom: 56,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  logo: {
    top: 25,
    width: 263,
    height: 140,
    resizeMode: "contain",
  },
  containerFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Main;
