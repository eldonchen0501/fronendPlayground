/**
 * API connectors for Card module (list, detail, edit/create)
 */
import ajax from '../libs/ajax';
import config from '../app/config';

const { apiUrl } = config;

export default {
  createCard: data => ajax('POST', `${apiUrl}/cards/`, data),

  rejectCard: id => ajax('POST', `${apiUrl}/cards/${id}/reject`),

  getCardList: () => ajax('GET', `${apiUrl}/cards`),

  approveCard: id => ajax('POST', `${apiUrl}/cards/${id}/approve`),

  deleteCard: id => ajax('POST', `${apiUrl}/cards/${id}/delete`),

  getCardDetail: id => ajax('GET', `${apiUrl}/cards/${id}`),

  updateCardDetail: (id, data) => ajax('PUT', `${apiUrl}/cards/${id}`, data),

  getTotalCardCount: () => ajax('GET', `${apiUrl}/cards/count`),
};
