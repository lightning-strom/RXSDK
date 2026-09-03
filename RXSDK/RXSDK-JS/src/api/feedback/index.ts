import { doRequest as request } from '../request'

export const getFeedbackApi = () =>
  request({
    url: '/v1/feedbackapi/kind/list',
    method: 'GET',
  })

export const createFeedbackApi = (data: IReqCreateFeedback) =>
  request({
    url: '/v1/feedbackapi/player/create',
    method: 'POST',
    data,
  })

export const feedbackEvalApi = (data: IReqFeedbackEval) =>
  request({
    url: '/v1/feedbackapi/pleased/update',
    method: 'POST',
    data
  })
