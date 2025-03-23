// import { DEFAULT_LAYOUT } from '../base'
// import type { AppRouteRecordRaw } from '../types'
//
// const LIST: AppRouteRecordRaw = {
//   path: '/list',
//   name: 'list',
//   component: DEFAULT_LAYOUT,
//   meta: {
//     locale: 'menu.list',
//     requiresAuth: true,
//     icon: 'icon-list',
//     order: 2,
//   },
//   children: [
//     {
//       path: 'employee-check-table', // The midline path complies with SEO specifications
//       name: 'EmployeeCheckTable',
//       component: () => import('@/views/list/employee-check-table/index.vue'),
//       meta: {
//         locale: 'menu.list.employeeCheckTable',
//         requiresAuth: true,
//         roles: ['branch-admin'],
//       },
//     },
//     {
//       path: 'search-table', // The midline path complies with SEO specifications
//       name: 'SearchTable',
//       component: () => import('@/views/list/search-table/index.vue'),
//       meta: {
//         locale: 'menu.list.searchTable',
//         requiresAuth: true,
//         roles: ['admin'],
//       },
//     },
//     {
//       path: 'card',
//       name: 'Card',
//       component: () => import('@/views/list/card/index.vue'),
//       meta: {
//         locale: 'menu.list.cardList',
//         requiresAuth: true,
//         roles: ['admin'],
//       },
//     },
//   ],
// }
//
// export default LIST
