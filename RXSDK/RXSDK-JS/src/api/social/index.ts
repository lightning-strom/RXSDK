import { doRequest as request } from '../request'

export const setcustomApi = (data: { custom: string }) =>
  request({
    url: '/v1/social/user/setcustom',
    method: 'POST',
    data,
  })

export const addRelationApi = (data: any) =>
  request({
    url: '/v1/social/relation/add',
    method: 'POST',
    data,
  })

export const deleteRelationApi = (data: any) =>
  request({
    url: '/v1/social/relation/delete',
    method: 'POST',
    data,
  })

export const updateremarksApi = (data: any) =>
  request({
    url: '/v1/social/relation/updateremarks',
    method: 'POST',
    data,
  })

export const hasrelationApi = (data: any) =>
  request({
    url: '/v1/social/relation/hasrelation',
    method: 'POST',
    data,
  })

export const relationListApi = (data: any) =>
  request({
    url: '/v1/social/relation/list',
    method: 'POST',
    data,
  })

export const addfriendApi = (data: any) =>
  request({
    url: '/v1/social/relation/addfriend',
    method: 'POST',
    data,
  })

export const delfriendApi = (data: any) =>
  request({
    url: '/v1/social/relation/delfriend',
    method: 'POST',
    data,
  })

export const updatefriendremarksApi = (data: any) =>
  request({
    url: '/v1/social/relation/updatefriendremarks',
    method: 'POST',
    data,
  })

export const isfriendApi = (data: any) =>
  request({
    url: '/v1/social/relation/isfriend',
    method: 'POST',
    data,
  })

export const friendsApi = () =>
  request({
    url: '/v1/social/relation/friends',
    method: 'POST',
  })

export const addscoreApi = (data: any) =>
  request({
    url: '/v1/social/rank/addscore',
    method: 'POST',
    data,
  })

export const setscoreApi = (data: any) =>
  request({
    url: '/v1/social/rank/setscore',
    method: 'POST',
    data,
  })

export const queryuserrankApi = (data: any) =>
  request({
    url: '/v1/social/rank/queryuserrank',
    method: 'POST',
    data,
  })

export const getranklistApi = (data: any) =>
  request({
    url: '/v1/social/rank/getranklist',
    method: 'POST',
    data,
  })

export const friendsrankApi = (data: any) =>
  request({
    url: '/v1/social/rank/friendsrank',
    method: 'POST',
    data,
  })

export const opendataAesdecodeApi = (data: any) =>
  request({
    url: '/v1/social/wxrank/aesdecode',
    method: 'POST',
    data,
  })
