import { doRequest as request } from '../request'

// 获取帮助中心首页信息
export const getMainlayoutApi = () =>
  request({
    url: '/v1/service/helpcenter/mainlayout',
    method: 'GET',
  })

// 获取帮助中心问题一级列表页
export const getListlayoutApi = (params: any) =>
  request({
    url: '/v1/service/helpcenter/listlayout',
    method: 'GET',
    params,
  })

// 获取帮助中心问题详情
export const getInfolayoutApi = (params: any) =>
  request({
    url: '/v1/service/helpcenter/infolayout',
    method: 'GET',
    params,
  })

// 设置帮助中心问题解决状态
export const postResolutionApi = (data: any) =>
  request({
    url: '/v1/service/helpcenter/resolution',
    method: 'POST',
    data,
  })
