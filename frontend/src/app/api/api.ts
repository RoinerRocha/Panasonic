import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { config } from "process";
import { store } from "../../store/configureStore";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = "http://localhost:5000/api/";

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    await sleep();
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
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
  }
);

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  download: (url: string) => axios.get(url, { responseType: 'arraybuffer' }).then((response) => response.data),
};

const TestErrors = {
  getNotFound: () => requests.get("buggy/not-found"),
  getBadRequest: () => requests.get("buggy/bad-request"),
  getUnauthorised: () => requests.get("buggy/unauthorised"),
  getValidationError: () => requests.get("buggy/validation-error"),
  getServerError: () => requests.get("buggy/server-error"),
};

const Account = {
  login: (values: any) => requests.post("login", values),
  register: (values: any) => requests.post("register", values),
  currentUser: () => requests.get("currentUser"),
  getAllUser: () => requests.get("getUser"),
  updateUser: (accountId: any, accountData: any) => 
    requests.put(`/updateUser/${accountId}`, accountData),
  deleteUser: (id:number) =>requests.delete(`/deleteUser/${id}`),
  sendEmail: (values: any) => requests.post("sendEmails", values),
  newPasword: (values: any) => requests.post("updatePasswordByEmail", values)
};

const Zones = {
  saveZona: (values: any) => requests.post("saveZona", values),
  getZona: () => requests.get("/getZona"),
  updateZona: (zonaId: any, zonaData: any) =>
    requests.put(`/zonas/${zonaId}`, zonaData),
  deleteZona: (id: number) => requests.delete(`deleteZona/${id}`),
  getZonaById: (id: number) => requests.get(`/zonas/${id}`),
};

const AcountingAccounts = {
  saveAccountingAccount: (values: any) =>
    requests.post("saveAccountingAccount", values),
  getAccountingAccounts: () => requests.get("/getAccountingAccounts"),
  updateAccountingAccount: (
    AccountingAccountId: any,
    AccountingAccountData: any
  ) =>
    requests.put(
      `/accountingAccounts/${AccountingAccountId}`,
      AccountingAccountData
    ),
  deleteAccountingAccount: (id: number) =>
    requests.delete(`deleteAccountingAccount/${id}`),
};

const statusAssets = {
  saveStatusAsset: (values: any) => requests.post("saveStatusAsset", values),
  getStatusAssets: () => requests.get("/getStatusAssets"),
  updateStatusAsset: (StatusAssetId: any, StatusAssetData: any) =>
    requests.put(`/statusAssets/${StatusAssetId}`, StatusAssetData),
  deleteStatusAsset: (id: number) => requests.delete(`deleteStatusAsset/${id}`),
};

const profiles = {
  saveProfile: (values: any) => requests.post("saveProfile", values),
  getProfiles: () => requests.get("/getProfiles"),
  updateProfile: (profileId: any, ProfileData: any) =>
    requests.put(`/profiles/${profileId}`, ProfileData),
  deleteProfile: (id: number) => requests.delete(`deleteProfile/${id}`),
};

const serviceLife = {
  saveServiceLife: (values: any) => requests.post("saveServiceLife", values),
  getServiceLifes: () => requests.get("/getServiceLifes"),
  updateServiceLife: (profileId: any, ProfileData: any) =>
    requests.put(`/serviceLifes/${profileId}`, ProfileData),
  deleteServiceLife: (id: number) => requests.delete(`deleteServiceLife/${id}`),
};

const newAsset = {
  saveNewAsset: (values: any) => requests.post("saveNewAsset", values),
  getNewAssets: () => requests.get("/getNewAssets"),
  updateNewAsset: (NewAssetId: any, NewAssetData: any) =>
    requests.put(`/newAssets/${NewAssetId}`, NewAssetData),
  deleteNewAsset: (id: number) => requests.delete(`deleteNewAsset/${id}`), //reviar x si da algun problema ya que en el back esta comentado esta funcion
  getNewAssetById:(id: number) => requests.get(`/searchIdNewAsset/${id}`),
  searchAssetsByZona: (zonaNombre: string) => requests.get(`/searchAssetsByZona?zonaNombre=${zonaNombre}`),  // Cambiado aquí
  getAssetByNumBoleta: (id: string) => requests.get(`/assetByNumBolet/boleta/${id}`),
  generateWordFile: (id: number) => requests.download(`/generateWord/${id}`),
  generatePDFFile: (id: number) => requests.download(`/generatePDF/${id}`),
  generateExcelFile: (id: number) => requests.download(`/generateExcelFile/${id}`),
  generateExcelFileForMultipleAssets: (ids: number[]) => requests.download(`/generateExcelFileMultipleAssets?ids=${ids.join(',')}`),
};

const assetRetirement = {
  saveAssetRetirement: (values: any) => requests.post("saveAssetRetirement", values),
  getAssetRetirements: () => requests.get("/getAssetRetirements"),
  updateAssetRetirement: (assetRetirementId: any, assetRetirementData: any) =>
    requests.put(`/assetRetirements/${assetRetirementId}`, assetRetirementData),
  deleteAssetRetirement: (id: number) => requests.delete(`deleteAssetRetirement/${id}`),
  getAssetRetirementByNumeroBoleta: (id: string) => requests.get(`/assetRetirements/boleta/${id}`),
};

const salesAssest = {
  saveSalesAsset: (values: any) => requests.post("saveSalesAsset", values),
  getSalesAssets: () => requests.get("/getSalesAssets"),
  updateSalesAsset: (assetSaleId: any, assetSaleData: any) =>
    requests.put(`/salesAssets/${assetSaleId}`, assetSaleData),//metodo comentado en el backend
  deleteSalesAsset: (id: number) => requests.delete(`deleteSalesAsset/${id}`),//metodo commentado en el backend
  getAssetSaleByNumeroBoleta: (id: string) => requests.get(`/salesAssets/boleta/${id}`),
};

const depreciations = {
  saveDepreciation: (values: any) => requests.post("/saveDepreciation", values),
  getDepreciations: () => requests.get("/getDepreciations"),
  updateDepreciation: (depreciationId: any, depreciationData: any) =>
    requests.put(`depreciations/${depreciationId}`, depreciationData ),
  deleteDepreciation: (id: number) => requests.delete(`/deleteDepreciation/${id}`)
}
const access = {
  saveAccess: (values: any) => requests.post("/addNewAccess", values), 
  getAccess: () => requests.get("/getAllAccesses"),
  updateAccess: (accessId: any, accessData: any) => 
    requests.put(`updateAccess/${accessId}`, accessData),
  deleteAccess: (id: number) => requests.delete(`deleteAccess/${id}`),
}

const history ={
  getHistory: ()=> requests.get("/getHistorial"),
  uploadDocumentByBoleta: (NumeroBoleta: string, formData: FormData) =>
    requests.post(`/uploadDocumentByBoleta/${NumeroBoleta}`, formData),
  searchHistoryByNumeroBoleta: (NumeroBoleta: string) =>
    requests.get(`/searchHistoryByNumeroBoleta/${NumeroBoleta}`),
  generateExcelFileByBoletas: async (boletas: string[]) => {
    const response = await axios.get(`/generateExcelByBoleta/${boletas.join(',')}`, {
      responseType: 'blob' // Esto asegura que la respuesta sea tratada como un archivo binario
    });
    return response.data; // Devuelve el archivo blob
  },
}
const api = {
  Account,
  TestErrors,
  Zones,
  AcountingAccounts,
  statusAssets,
  profiles,
  serviceLife,
  newAsset,
  assetRetirement,
  salesAssest,
  depreciations,
  access,
  history,
};

export default api;
