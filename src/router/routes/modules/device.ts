import { DEFAULT_LAYOUT } from '../base'
import type { AppRouteRecordRaw } from '../types'

const DEVICE: AppRouteRecordRaw = {
  path: '/device',
  name: 'device',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '设备管理',
    requiresAuth: true,
    icon: 'icon-mobile',
    order: 2,
  },
  children: [
    {
      path: 'branch-device-table', // The midline path complies with SEO specifications
      name: 'branchDeviceTable',
      component: () => import('@/views/list/branch-device-table/index.vue'),
      meta: {
        locale: 'menu.list.branchDeviceTable',
        requiresAuth: true,
        icon: 'icon-settings',
        roles: ['branch-admin'],
        hideInMenu: false,
      },
    },
  ],
}

export default DEVICE
