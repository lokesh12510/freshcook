import api from "../../../utils/helpers/api"

export const foodData = (data) => {
    return api.post("/cart/foodData", data);
};

export const relatedFoodList = (data) => {
    return api.post("/cart/relatedFoodList", data);
};
