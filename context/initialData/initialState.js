import React, { useReducer } from "react";
import { GET_DATA, GET_DATA_ERROR, UPDATED_LAST_UPDATE } from "../../types";
import InitialReducer from "./initialReducer";
import InitialContext from "./initialContext";
import AsyncStorage from "@react-native-community/async-storage";
import API from "../../config/axios";
import moment from "moment";

const InitialState = (props) => {
  const initialState = {
    message: null,
    status: null,
    lastUpdate: null,
  };

  const [state, dispatch] = useReducer(InitialReducer, initialState);

  const getDataLink = async (apiName,baseURL) => {
    try {
      API.defaults.headers = {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      };
      //API.defaults.baseURL = baseURL;
      const response = await API.get(baseURL);
      if (response.status === 200) {
        AsyncStorage.setItem(apiName, JSON.stringify(response.data));
        dispatch({
          type: GET_DATA,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  const getLastUpdate = async () => {
    try {
        const response = await API.get('lastUpdate');
        dispatch({
          type: UPDATED_LAST_UPDATE,
          payload: response,
        });
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  const updateLastUpdate = async () => {
    try {
        var date = moment().format('DD/MM/YY, HH:mm:ss');
        AsyncStorage.setItem('lastUpdate', date);
        dispatch({
          type: UPDATED_LAST_UPDATE,
          payload: date,
        });
    } catch (error) {
      dispatch({
        type: GET_DATA_ERROR,
        payload: error,
      });
    }
  };

  return (
    <InitialContext.Provider
      value={{
        message: state.message,
        status: state.status,
        lastUpdate: state.lastUpdate,
        getDataLink,
        getLastUpdate,
        updateLastUpdate
      }}
    >
      {props.children}
    </InitialContext.Provider>
  );
};

export default InitialState;
