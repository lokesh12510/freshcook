import api from '../../../utils/helpers/api';

export const getOrders =(data)=>{
    return api.post('myorders/getorders',data)
}
export const updateFoodRating =(data)=>{
    return api.post('myorders/updateFoodRating',data)
}
export const updateKitchenRating =(data)=>{
    return api.post('myorders/updateKitchenRating',data)
}
export const CancelOrder=(data)=>{
    return api.post('myorders/cancelOrder',data)

}
