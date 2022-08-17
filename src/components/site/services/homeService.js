import api from "../../../utils/helpers/api"

export const cookList = (data) => {
    return api.post("/home/cookList", data);
};

export const foodTypeList = (data) => {
    return api.post("/home/foodTypeList", data);
};

export const FoodList = (data) => {
    return api.post("/home/foodList", data);
};
