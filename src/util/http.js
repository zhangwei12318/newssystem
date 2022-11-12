import axios from "axios";
import {store} from "../redux/store";
import {changeLoading} from '../redux/actions/loading'
axios.defaults.baseURL = "http://localhost:5000";

axios.interceptors.request.use(
  function (config) {
    store.dispatch(changeLoading(true));
    return config;
  },function (error) {
    return Promise.reject(error);
  });

axios.interceptors.response.use(function (response) {
    store.dispatch(changeLoading(false));
    return response;
  },
  function (error) {
    store.dispatch(changeLoading(false));
    return Promise.reject(error);
  });
