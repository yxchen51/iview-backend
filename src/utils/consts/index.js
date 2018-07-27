import MENUS from './menus'
import ROLES from './roles'

// 当前 host
const HOST = window.location.host

// 开发
const DEV = 'DEV'

// 生产
const PROD = 'PROD'

// 当前环境
const ENV = HOST === 'http://172.20.16.83:8080' ? DEV : PROD

// 基础地址
const BASE_URL = ENV === DEV ? 'http://172.20.16.83:8690' : 'http://172.20.16.83:8690'

// 接口地址
const API_URL = BASE_URL + '/api/'

// 分页大小
const PAGE_SIZE = 10

// 网站标题
const TITLE = '测试管理平台'

export default {
  MENUS,
  ROLES,
  BASE_URL,
  API_URL,
  PAGE_SIZE,
  TITLE
}
