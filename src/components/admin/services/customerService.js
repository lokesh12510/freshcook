import api from '../../../utils/helpers/api';

export const Index = (data) => {
  return api.post("/admin/customer", data);
};

export const Show = (id) => {
  return api.post(`/admin/customer/show/${id}`);
};

export const Delete = (id) => {
  return api.post(`/admin/customer/delete/${id}`);
};

export const customeraddressDelete = (id) => {
  return api.post(`/admin/customer/customeraddress/delete/${id}`);
};

