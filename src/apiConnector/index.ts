import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

const LOG_AXIOS = false;


const getAxios = {


  instance: (token = '', url = '', proxyUrl = '') => {

    const config: AxiosRequestConfig = {
      headers: {},
    };

    config.baseURL = `${proxyUrl}${url}`;

    if (token !== '') {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    const instance = Axios.create(config);

    if (LOG_AXIOS) {
      instance.interceptors.request.use((request:any) => {
        // tslint:disable-next-line: no-console
        console.log('Starting Request to', request.url);
        // tslint:disable-next-line: no-console
        console.log('Request params', request.params);
        // tslint:disable-next-line: no-console
        console.log('Request data', request.data);
        return request;
      });

      instance.interceptors.response.use((response: any) => {
        // tslint:disable-next-line: no-console
        console.log('Response headers:', response.headers);
        // tslint:disable-next-line: no-console
        console.log('Response data:', response.data);
        return response;
      });
    }

    instance.interceptors.response.use((response) => response, (error) => {
      if (error.response && error.response.status === 403) {
        console.log('403');
        window.location.href = '/login/forbidden';
      }
      if (error.response && error.response.status === 401) {
        console.log('401');

        window.location.href = '/login/unauthorized';
      }

      throw (error);
    });

    return instance;
  },
  error: (error: AxiosError) => {
    if (error.response) {
      // tslint:disable-next-line: no-console
      console.log('Status', error.response.status, error.response.data);
      throw new Error(`${error.config.url}: ${error.response.status} ${error.response.data}`);
    } else if (error.request) {
      // tslint:disable-next-line: no-console
      console.log('Request', error.request);
    } else {
      // tslint:disable-next-line: no-console
      console.log('Error', error.message);
    }
  },
};

export default getAxios;
