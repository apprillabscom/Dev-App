import React, { useReducer } from "react";
import {
  GET_DATA_POINT,
  GET_DATA_LINK,
  GET_DATA_DIRECTORY,
  GET_DATA_DIRECTORY_FILTER,
  GET_DATA_DIRECTORY_SERVICE,
  GET_DATA_DIRECTORY_SERVICE_ITEM,
  GET_DATA_FAVORITES,
  GET_DATA_ERROR,
  GET_DATA_DIRECTORY_ITEM,
  GET_DATA_POINT_ID,
  GET_DATA_MAPEO_SERVICE,
  GET_DATA_MAPEO_STATE,
  GET_USER_COMMENTS,
  NEW_COMMENT,
  NEW_FAVORITE,
  DELETE_COMMENT,
  GET_DATA_ENLACE,
  GET_DATA_SOCIO
} from "../../types";
import moment from 'moment';
import IOMReducer from "./iomReducer";
import IOMContext from "./iomContext";
import axios from "axios";
//import API from "../../config/axios";
import AsyncStorage from "@react-native-community/async-storage";
import database from "@react-native-firebase/database";
import _ from 'lodash';

const IOMState = (props) => {
  const initialState = {
    dataLink: null,
    dataLinkEtiquetas: null,
    dataPoint: [],
    dataPointState: null,
    dataPointDepartamento: null,
    dataPointMunicipio: null,
    dataPointFilter: null,
    dataDirectory: null,
    dataEnlace: null,
    dataSocio: null,
    dataDirectoryService: null,
    dataMapeoService: [],
    dataMapeoState: [],
    dataFavorite: [],
    dataItem: null,
    dataItemService: null,
    messageError: null,
    dataComments: null,
  };

  const [state, dispatch] = useReducer(IOMReducer, initialState);

  const getDataLink = async (item) => {
    try {
      const value = await AsyncStorage.getItem("api-enlaces-de-interes.json");
      if (value !== null) {
        dispatch({
          type: GET_DATA_LINK,
          value,
          item,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  const getDataPoint = async (state, visible, type) => {
    try {
      const data = await AsyncStorage.getItem("api-mapeo.json");
      const object = JSON.parse(data);
      const value = object.filter(function(item) {
        const textState = item.Estado_id;
        const textType = item.Tipo_ubicacion;
        const textVisible = item.Visible_publico;
        return (state.indexOf(textState) > -1 && type.indexOf(textType) > -1 && visible.indexOf(textVisible) > -1 && item.Departamento != undefined);
      });
      if (value !== null) {
        dispatch({
          type: GET_DATA_POINT,
          payload: value,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  const getDataMapeoService = async () => {
    try {
      const value = await AsyncStorage.getItem("api-mapeo-servicios.json");
      if (value !== null) {
        dispatch({
          type: GET_DATA_MAPEO_SERVICE,
          payload: value,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  const getDataPointById = (id) => {
    dispatch({
      type: GET_DATA_POINT_ID,
      payload: id,
    });
  };

  const getDataDirectory = async (item) => {
    try {
      const value = await AsyncStorage.getItem("api-lineas-telefonicas.json");
      getDataDirectoryService();
      if (value !== null) {
        dispatch({
          type: GET_DATA_DIRECTORY,
          value,
          item,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  const getDataPointFilter = (departamento, municipio, estado, typeService) => {
    dispatch({
      type: GET_DATA_DIRECTORY_FILTER,
      departamento,
      municipio,
      estado,
      typeService
    });
  }

  const getDataDirectoryService = async () => {
    try {
      const value = await AsyncStorage.getItem("api-lineas-telefonicas-servicios.json");
      if (value !== null) {
        dispatch({
          type: GET_DATA_DIRECTORY_SERVICE,
          payload: value,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  const getDataEnlace = async (item) => {
    try {
      const value = await AsyncStorage.getItem("api_enlaces.json");
      if (value !== null) {
        dispatch({
          type: GET_DATA_ENLACE,
          value,
          item,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };
  const getDataSocio = async (item) => {
    try {
      const value = await AsyncStorage.getItem("api_socios.json");
      if (value !== null) {
        dispatch({
          type: GET_DATA_SOCIO,
          value,
          item,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  const getDataDirectoryItemService = (id) => {
    dispatch({
      type: GET_DATA_DIRECTORY_SERVICE_ITEM,
      payload: id,
    });
  };

  const getDataByDepartId = (id) => {
    dispatch({
      type: GET_DATA_DIRECTORY_ITEM,
      payload: id,
    });
  };

  const getDataFavorite = async () => {
    try {
      const value = await AsyncStorage.getItem("favorites");
      if (value !== null) {
        dispatch({
          type: GET_DATA_FAVORITES,
          payload: value,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };


  const getDataMapeoState = async () => {
    try {
      const value = await AsyncStorage.getItem("api-mapeo-estados.json");
      if (value !== null) {
        dispatch({
          type: GET_DATA_MAPEO_STATE,
          payload: value,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  const getUserComments = (uid) => {
    database().ref('/comments/'+uid).on('value',snapshot => {
      let res = [];
      snapshot.forEach((value) => {
        const pointID= value.key;
        let comments = [];
        value.forEach((item) =>{
          comments.push({commentID:item.key,date:item.val().date,comment:item.val().comment});
        });
        res.push({pointID,comments});
      });
      dispatch({
        type: GET_USER_COMMENTS,
        payload: res
      });
    });
  };

  const createUserComment = async (user,id,comment,config) => {

    const dataV = { "entity_id": [{"target_id": id}],
    "uid": [{"target_id": config.apiDrupalUserUID}],
    "status": {"value": "1"},
    "entity_type": [{"value": "node"}],
    "comment_type": [{"target_id": "comment"}],
    "field_name": [{"value": "field_alertas"}],
    "field_usuario_app": [{"value": user.email}],
    "subject": [{"value": "Comentario desde APP GIFMM | "+user.email}],
    "comment_body": [{"value": comment,"format": "simple"}]};


    axios.post(config.apiDrupalLoginURL,
      {"name":"integrador", "pass":"oj*4^IQUE5r#"}).then(
        response => {
            throw error;
        }
      ).catch(error => {
        axios.get(config.apiDrupalTokenURL).then(
          response => {
            const headers = {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Csrf-Token': response.data
            }
            axios.post(config.apiDrupalCommentURL,
            dataV, 
            {headers: headers}).then(
              response => {
                //console.log('response apiDrupalCommentURL',response.data);
              }
            ).catch(error => {
              console.log('error comment',error);
            });
          }
        ).catch(error => {
          console.log('error apiDrupalTokenURL',error);
        });
      });

    

    var date = moment().format('YYYY-MM-DD, hh:mm:ss a');
    database().ref('/comments/'+user.uid+'/'+id).push({
      comment,
      date
    }).then(()=> 
      dispatch({
        type: NEW_COMMENT
      })
    );
  }


  const deleteUserComment = (uid,id,key) => {
    database().ref('/comments/'+uid+'/'+id+'/'+key).remove()
    .then(()=> 
      dispatch({
        type: DELETE_COMMENT
      })
    );
  }

  const createFavorite = async (point) => {
    try {
        var value = JSON.parse(await AsyncStorage.getItem("favorites"));
        if(!value)
          value=[];
        let index = value.findIndex(favorite => favorite.id == point.id);
        if(index == -1 && point.id >= 0) {
          value.push(point);
          AsyncStorage.setItem("favorites", JSON.stringify(value));
          dispatch({
            type: NEW_FAVORITE,
            payload: value,
          });
        }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  const deleteFavorite = async (point) => {

    //AsyncStorage.removeItem('favorites')
    try {
      const posts = await AsyncStorage.getItem('favorites');
      let postsFav = JSON.parse(posts);
const postsItems = postsFav.filter(function(e){ return e.id !== point});
      
      await AsyncStorage.setItem('favorites', JSON.stringify(postsItems));
      const value = await AsyncStorage.getItem("favorites");
      if (value !== null) {
        dispatch({
          type: GET_DATA_FAVORITES,
          payload: value,
        });
      }
    } catch(error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  return (
    <IOMContext.Provider
      value={{
        dataLink: state.dataLink,
        dataLinkEtiquetas: state.dataLinkEtiquetas,
        dataPoint: state.dataPoint,
        dataPointState: state.dataPointState,
        dataPointDepartamento: state.dataPointDepartamento,
        dataPointMunicipio: state.dataPointMunicipio,
        dataPointFilter: state.dataPointFilter,
        dataDirectory: state.dataDirectory,
        dataEnlace: state.dataEnlace,
        dataSocio: state.dataSocio,
        dataDirectoryService: state.dataDirectoryService,
        dataFavorite: state.dataFavorite,
        dataItem: state.dataItem,
        dataItemService: state.dataItemService,
        messageError: state.messageError,
        dataMapeoService: state.dataMapeoService,
        dataMapeoState: state.dataMapeoState,
        dataComments: state.dataComments,
        getDataLink,
        getDataPoint,
        getDataDirectory,
        getDataEnlace,
        getDataSocio,
        getDataFavorite,
        getDataPointById,
        getDataByDepartId,
        getDataDirectoryItemService,
        getDataPointFilter,
        getDataMapeoService,
        getDataMapeoState,
        getUserComments,
        createUserComment,
        createFavorite,
        deleteFavorite,
        deleteUserComment
      }}
    >
      {props.children}
    </IOMContext.Provider>
  );
};

export default IOMState;
