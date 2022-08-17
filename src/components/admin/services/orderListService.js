import api from '../../../utils/helpers/api';

export const Index = (data) => {
  return api.post("/admin/orders", data);
};


export const Show = (id,chef_id) => {
  return api.post(`/admin/orders/show/${id}/${chef_id}`);
};
export const updateDeliveryStatus = (id,deliverystatus) => {
    return api.post(`/admin/orders/updateDeliveryStatus/${id}/${deliverystatus}`);
  };



