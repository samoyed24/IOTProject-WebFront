import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const LIST: AppRouteRecordRaw = {
  path: '/list',
  name: 'list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.list',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'employee-check-table', // The midline path complies with SEO specifications
      name: 'EmployeeCheckTable',
      component: () => import('@/views/list/employee-check-table/index.vue'),
      meta: {
        locale: 'menu.list.employeeCheckTable',
        requiresAuth: true,
        roles: ['branch-admin'],
      },
    },
    {
      path: 'search-table', // The midline path complies with SEO specifications
      name: 'SearchTable',
      component: () => import('@/views/list/search-table/index.vue'),
      meta: {
        locale: 'menu.list.searchTable',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'card',
      name: 'Card',
      component: () => import('@/views/list/card/index.vue'),
      meta: {
        locale: 'menu.list.cardList',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'BranchTemplateTable', // The midline path complies with SEO specifications
      name: 'BranchTemplateTable',
      component: () => import('@/views/list/branch-template-table/index.vue'),
      meta: {
        locale: 'menu.list.branchTemplateTable',
        requiresAuth: true,
        roles: ['branch-admin'],
      },
    },
    {
      path: 'BranchEmployeeManagement', // The midline path complies with SEO specifications
      name: 'BranchEmployeeManagement',
      component: () => import('@/views/list/branch-employee-management/index.vue'),
      meta: {
        locale: 'menu.list.branchEmployeeManagement',
        requiresAuth: true,
        roles: ['branch-admin'],
      },
    },
    {
      path: 'branchCargoList', // The midline path complies with SEO specifications
      name: 'branchCargoList',
      component: () => import('@/views/list/branch-cargo-list/index.vue'),
      meta: {
        locale: 'menu.list.branchCargoList',
        requiresAuth: true,
        roles: ['branch-admin'],
      },
    },
    {
      path: 'cargoQuery', // The midline path complies with SEO specifications
      name: 'cargoQuery',
      component: () => import('@/views/list/cargo-query/index.vue'),
      meta: {
        locale: 'menu.list.cargoQuery',
        requiresAuth: true,
        roles: ['branch-admin'],
        hideInMenu: false
      },
    },
    {
      path: 'branch-warehouse-table', // The midline path complies with SEO specifications
      name: 'branchWarehouseTable',
      component: () => import('@/views/list/branch-warehouse-table/index.vue'),
      meta: {
        locale: 'menu.list.branchWarehouseTable',
        requiresAuth: true,
        roles: ['branch-admin'],
        hideInMenu: false
      },
    },
    {
      path: 'branch-device-table', // The midline path complies with SEO specifications
      name: 'branchDeviceTable',
      component: () => import('@/views/list/branch-device-table/index.vue'),
      meta: {
        locale: 'menu.list.branchDeviceTable',
        requiresAuth: true,
        roles: ['branch-admin'],
        hideInMenu: false
      },
    },
  ],
}

export default LIST
