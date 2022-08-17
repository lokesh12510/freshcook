import api from '../../../utils/helpers/api';

export const getProfile = () => {
    return api.post(`/user/getProfile`);
};

