import api from '../../../utils/helpers/api';

export const Login = (data) => {
  return api.post("/auth/login", data);
};

export const CustomerForgetPwd = (data) => {
  return api.post("/auth/customerForgetPwd", data);
};

export const CustomerResetPwd = (data) => {
  return api.post("/auth/CustomerResetPwd", data);
};


export const Signup = (data) => {
  return api.post("/auth/signup", data);
};

export const CookSignup = (data) => {
  return api.post(`/auth/cooksignup`, data, {
    'content-type': 'multipart/form-data'
  });
};

export const CustomerSignup = (data) => {
  return api.post(`/auth/customersignup`, data, {
    'content-type': 'multipart/form-data'
  });
};