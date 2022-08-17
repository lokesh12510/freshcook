import api from '../../../utils/helpers/api';

export const Index = (data) => {
  return api.post("/admin/employee", data, {
    'content-type': 'multipart/form-data'
  });
};

export const Store = (data) => {
  return api.post(`/admin/employee/store`, data,{
    'content-type': 'multipart/form-data'
  });
};

export const Show = (id) => {
  return api.post(`/admin/employee/show/${id}`);
};

export const Delete = (id) => {
  return api.post(`/admin/employee/delete/${id}`);
};

export const documentDelete = (id) => {
  return api.post(`/admin/employee/document/delete/${id}`);
};

