import api from "../../../utils/helpers/api";

export const Index = (data) => {
  return api.post("/admin/food", data, {
    'content-type': 'multipart/form-data'
  });
};

export const Store = (data) => {
  return api.post(`/admin/food/store`, data,{
    'content-type': 'multipart/form-data'
  });
};

export const Show = (id) => {
  return api.post(`/admin/food/show/${id}`);
};

export const Delete = (id) => {
  return api.post(`/admin/food/delete/${id}`);
};

export const documentDelete = (id) => {
  return api.post(`/admin/food/document/delete/${id}`);
};

export const foodTypeList = () => {
  return api.post(`/admin/food/foodTypeList`);
}

export const chefNameList = () => {
  return api.post(`/admin/food/chefNameList`);
}
export const UpdateFoodStatus =(id,foodstatus)=>{
  return api.post(`/admin/food/updateFoodStatus/${id}/${foodstatus}`);

}

