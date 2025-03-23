import { DEFAULT_LAYOUT } from '../base'
import type { AppRouteRecordRaw } from '../types'

const WAREHOUSE: AppRouteRecordRaw = {
  path: '/warehouse',
  name: 'warehouse',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '库房管理',
    requiresAuth: true,
    icon: 'icon-home',
    order: 2,
  },
  children: [
    {
      path: 'warehouse-create',
      name: 'WarehouseCreate',
      component: () => import('@/views/form/warehouse-create/index.vue'),
      meta: {
        locale: '库房注册',
        icon: 'icon-plus',
        requiresAuth: true,
        roles: ['branch-admin'],
      },
    },
    {
      path: 'branch-warehouse-table', // The midline path complies with SEO specifications
      name: 'branchWarehouseTable',
      component: () => import('@/views/list/branch-warehouse-table/index.vue'),
      meta: {
        locale: '库房管理',
        requiresAuth: true,
        icon: 'icon-settings',
        roles: ['branch-admin'],
        hideInMenu: false,
      },
    },
  ],
}

export default WAREHOUSE
