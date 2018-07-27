import request from '@/utils/request'

let baseModulUrl = "/api"
export function queryRunLog(data) {
  return request({
    url: '/project/query',
    method: 'post',
    data: data
  })
}

export function queryMethodLog(data) {
  return request({
    url: '/module/query',
    method: 'post',
    data: data
  })
}

export function queryCaseLog(data) {
  return request({
    url: '/case/query',
    method: 'post',
    data: data
  })
}

export function queryStepLog(data) {
  return request({
    url: '/step/query',
    method: 'post',
    data: data
  })
}

export function getProjectLog(data) {
  return request({
    url: '/project/get?buildId='+data,
    method: 'get'
    // data: data
  })
}

const logsApi = {
  queryRunLog,
  queryMethodLog,
  queryCaseLog,
  queryStepLog,
  getProjectLog
}
export default logsApi