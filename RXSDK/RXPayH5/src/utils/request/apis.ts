import { doRequest as request } from './request'

export function orderApi(data: any) {
  return request({
    url: '/v1/ke/order',
    method: 'POST',
    data
  }) as any
}

export function getH5PageApi(params: any) {
  return request({
    url: '/v1/ke/platform_h5/page',
    method: 'GET',
    params
  }) as any
}

export function getPayTypeApi(params: any) {
  return request({
    url: '/v1/ke/platform_h5/hw/pay_type',
    method: 'GET',
    params
  }) as any
}


export function getPayTypeUnLoginApi(params: any) {
  return request({
    url: '/v1/ke/platform_h5/hw/pay_type_unlogin',
    method: 'GET',
    params
  }) as any
}


export function getCardByClientTokenApi(client_token: any) {
  return request({
    url: '/v1/ke/platform_h5/hw/query_card_by_client_token',
    method: 'GET',
    params: { client_token }
  }) as any
}

export function deleteCardApi(data: any) {
  return request({
    url: '/v1/ke/platform_h5/hw/delete_card',
    method: 'POST',
    data
  }) as any
}
