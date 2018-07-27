export default [
  {
    name: 'articles',
    title: '用例管理',
    icon: 'compose',
    children: [
      {
        title: '用例列表',
        route: '/articles'
      }, {
        title: '编写用例',
        route: '/articles/categories'
      }
    ]
  }, {
    name: 'shops',
    title: '项目管理',
    icon: 'android-cart',
    children: [
      {
        title: '项目列表',
        route: '/mall/shops'
      }, {
        title: '环境管理',
        route: '/mall/products'
      }, {
        title: '参数管理',
        route: '/mall/orders'
      }
    ]
  }, {
    name: 'files',
    title: '日志管理',
    icon: 'document',
    children: [
      {
        title: '运行日志',
        route: '/logs/'
      }
    ]
  }, {
    name: 'users',
    title: '用户管理',
    icon: 'person',
    children: [
      {
        title: '用户管理',
        route: '/users'
      }
    ]
  }, {
    name: 'settings',
    title: '权限管理',
    icon: 'android-settings',
    children: [
      {
        title: '权限管理',
        route: '/settings'
      }
    ]
  }
]
