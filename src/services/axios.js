import axios from "axios";

const { VUE_APP_BACKEND_URL } = process.env;

const baseURL = VUE_APP_BACKEND_URL;

const httpInstance = axios.create({ baseURL });

const setToken = (newToken) => {
  if (newToken) {
    httpInstance.defaults.headers.common["Authorization"] =
      "Bearer " + newToken;
  }
};

const defaultHeaders = {
  "Content-Type": "application/json",
};

console.log(baseURL);

const postRequest = async (resource, data, headers = null) => {
  return await httpInstance.post(`${resource}`, data, {
    headers: headers || defaultHeaders,
  });
};

const getRequest = async (resource, headers) => {
  return await httpInstance.get(`${resource}`, {
    headers: headers || defaultHeaders,
  });
};

const deleteRequest = async (resource) => {
  return await httpInstance.delete(`${resource}`);
};

const putRequest = async (resource, data) => {
  return await httpInstance.put(`${resource}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
  baseURL,
  setToken,
};
