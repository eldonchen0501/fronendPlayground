import ajax from '../libs/ajax';
import config from '../app/config';

const { apiUrl } = config;

export default {
  uploadPhoto: formData => ajax('POST', `${apiUrl}/storage/photos/upload`, null, {
    urlParams: { access_token: 'ADMIN_SUPER_TOKEN' },
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
  }),
  
  createPhotoModel: photo => ajax('POST', `${apiUrl}/photos`, photo),
  
  updatePhotoModel: photo => ajax('PUT', `${apiUrl}/photos/${photo.url.replace(/\//g, '%2F')}`, photo),
};
