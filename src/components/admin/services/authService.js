import api from '../../../utils/helpers/api';

export const Login = (data) => {
  return api.post("/admin/auth/login", data);
};

export const Signup = (data) => {
  return api.post("/admin/auth/signup", data);
};
