import axios, { AxiosError, AxiosResponse} from 'axios';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { config } from 'process';
import { store } from '../../store/configureStore';

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
})

axios.interceptors.response.use(async response => {
  await sleep();
  return response 
}, (error: AxiosError) => {
  const {data, status} = error.response as AxiosResponse;
  switch (status) {
    case 400:
      if(data.errors) {
        const modelStateErrors: string[] = [];
        for (const key in data.errors) {
          if (data.errors[key]) {
            modelStateErrors.push(data.errors[key])
          }
        }
        throw modelStateErrors.flat();
      }
      toast.error(data.message);
      break;
    case 401:
      toast.error(data.message);
      break;
    case 404:
      toast.error(data.message);
      break;
    case 500:
      toast.error(data.message);
      break;
    default:
      break;
  }
  return Promise.reject(error.response);
})

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
}

const TestErrors = {
  getNotFound: () => requests.get('buggy/not-found'), 
  getBadRequest: () => requests.get('buggy/bad-request'), 
  getUnauthorised: () => requests.get('buggy/unauthorised'), 
  getValidationError: () => requests.get('buggy/validation-error'), 
  getServerError: () => requests.get('buggy/server-error'), 
}

const Account = {
  login: (values: any) => requests.post('login', values), 
  register: (values: any) => requests.post('register', values), 
  currentUser: () => requests.get('currentUser'),
  getAllUser: () => requests.get('getUser'),
}

const Zones = {
  saveZona: (values: any) => requests.post('saveZona', values),
  getZona: () => requests.get('getZona'),
  updateZona: (values: any) => requests.put('updateZona', values),
  deleteZona: (values: any) => requests.delete('deleteZona')
}

const api = {
  Account,
  TestErrors
}

export default api;


