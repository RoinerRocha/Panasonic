import axios, { AxiosError, AxiosResponse} from 'axios';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
  await sleep();
  return response 
}, (error: AxiosError) => {
  const {data, status} = error.response as AxiosResponse;
  console.log("Error object:", error);
  switch (status) {
    case 400:
      if (data.errors) {
        const modelStateErrors: string[] = [];
        for (const key in data.erors) {
          if (data.errors[key]){
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

const Account = {
  login: (values: any) => requests.post('login', values), 
  register: (values: any) => requests.post('register', values), 
  currentUser: () => requests.get('currentUser'), 
}

const agent = {
  Account 
}

export default agent;

