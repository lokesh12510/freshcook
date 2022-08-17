import api from '../../../utils/helpers/api';

export const Index = (data) => {
  return api.post(`/admin/department`, data);
}

export const Store = (data) => {
  return api.post("/admin/department/store", data);
}

export const Show = (id) => {
  return api.post(`/admin/department/show/${id}`);
}

export const Delete = (id) => {
  return api.post(`/admin/department/delete/${id}`);
}

export const autoComplete = (data) => {
  return api.post(`/admin/department/autoComplete`, data);
}
export const departmentList = () => {
  return api.post(`/admin/department/departmentList`);
}
