import { DEFAULT_LAYOUT } from '../base'
import type { AppRouteRecordRaw } from '../types'

const ORDER: AppRouteRecordRaw = {
  path: '/order',
  name: 'order',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '订单管理',
    requiresAuth: true,
    icon: 'icon-file',
    order: 2,
  },
  children: [
    {
      path: 'orderManagement', // The midline path complies with SEO specifications
      name: 'orderManagement',
      component: () => import('@/views/order/order-management/order-management.vue'),
      meta: {
        locale: '订单管理',
        requiresAuth: true,
        icon: 'icon-file',
        roles: ['branch-admin'],
      },
    },
  ],
}

export default ORDER
