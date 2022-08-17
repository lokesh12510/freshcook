import api from '../../../utils/helpers/api';

export const Index = (data) => {
    return api.post("/admin/cook", data, {
        'content-type': 'multipart/form-data'
    });
};

export const Store = (data) => {
    return api.post(`/admin/cook/store`, data,{
        'content-type': 'multipart/form-data'
    });
};

export const Show = (id) => {
    return api.post(`/admin/cook/show/${id}`);
};

export const Delete = (id) => {
    return api.post(`/admin/cook/delete/${id}`);
};

export const documentDelete = (id) => {
    return api.post(`/admin/cook/document/delete/${id}`);
};

