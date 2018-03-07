import ajax from '../libs/ajax';
import config from '../app/config';

const { apiUrl } = config;

export default {
  getTotalCuisineTypeCount: () => ajax('GET', `${apiUrl}/cuisine-types/count`),

  getCuisineTypeList: () => ajax('GET', `${apiUrl}/cuisine-types`),

  createCuisineType: data => ajax('POST', `${apiUrl}/cuisine-types`, data),

  updateCuisineTypeList: (id, data) => ajax('PUT', `${apiUrl}/cuisine-types/${id}`, data),

  deleteCuisineType: id => ajax('DELETE', `${apiUrl}/cuisine-types/${id}`),
};

