import axios from 'axios'
import {_baseApiUrl} from 'src/configuration'

const SmartstoreApi = {
    createCart: (storeId, command) => { return axios.post(`${_baseApiUrl}/store/${storeId}/cart`, command)},
    addItem: (storeId, cartId, skuId) => { return axios.post(`${_baseApiUrl}/store/${storeId}/cart/${cartId}/item/${skuId}/add`, {})},
    removeItem: (storeId, cartId, skuId) => { return axios.post(`${_baseApiUrl}/store/${storeId}/cart/${cartId}/item/${skuId}/remove`, {})},
    checkout: (storeId, cartId, command) => { return axios.post(`${_baseApiUrl}/store/${storeId}/cart/${cartId}/checkout`, command)},
    processed: (storeId, cartId, command) => { return axios.post(`${_baseApiUrl}/store/${storeId}/cart/${cartId}/processed`, command)}
}

export { SmartstoreApi }