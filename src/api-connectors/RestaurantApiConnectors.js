/**
 * API connectors for restaurant module (list, detail, edit/create)
 */
import ajax from '../libs/ajax';
import config from '../app/config';

const { apiUrl } = config;

export default {
  getTotalRestaurantCount: () => ajax('GET', `${apiUrl}/restaurants/count`),

  getRestaurantList: () => ajax('GET', `${apiUrl}/restaurants`),

  getRestaurantDetail: id => ajax('GET', `${config.apiUrl}/restaurants/${id}`),
  
  createRestaurant: data => ajax('POST', `${config.apiUrl}/restaurants`, data),

  updateRestaurantDetail: (id, data) => ajax('PUT', `${config.apiUrl}/restaurants/${id}`, data),

  deleteRestaurant: id => ajax('DELETE', `${config.apiUrl}/restaurants/${id}`),

  createRestaurantCuisineType: (id, fk) => ajax('PUT', `${config.apiUrl}/restaurants/${id}/cuisineTypes/rel/${fk}`),

  deleteRestaurantCuisineType: (id, fk) => ajax('DELETE', `${config.apiUrl}/restaurants/${id}/cuisineTypes/rel/${fk}`),
};
