import api from "../../../utils/helpers/api"



export const Store = (data) => {
    return api.post(`orderconfirm/store`, data,{
        'content-type': 'multipart/form-data'
    });
};

export const DeliveryAddressList = (id) => {
    return api.post(`orderconfirm/deliveryaddresslist/${id}`);

};




