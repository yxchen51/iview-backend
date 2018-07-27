export default {
    path: 'logs',
    component: resolve => require(['@/modules/Logs'], resolve),
    children: [
      {
        path: '/',
        component: resolve => require(['@/modules/Logs/Run'], resolve)
      },
      {
        path: 'method/:id?',
        component: resolve => require(['@/modules/Logs/Method'], resolve)
      },
      {
        path: 'case/:id?',
        component: resolve => require(['@/modules/Logs/Case'], resolve)
      },
      {
        path: 'step/:id?',
        component: resolve => require(['@/modules/Logs/Step'], resolve)
      }
    ]
  }
