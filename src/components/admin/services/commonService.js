import api from '../../../utils/helpers/api';

export const getCountryDetails = () => {
  return api.post(`/admin/common/getCountryDetails`);
};

export const getStateDetails = (id) => {
  return api.post(`/admin/common/getStateDetails/${id}`);
};

export const getCityDetails = (id) => {
  return api.post(`/admin/common/getCityDetails/${id}`);
};

