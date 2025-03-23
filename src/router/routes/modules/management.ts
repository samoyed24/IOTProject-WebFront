import { DEFAULT_LAYOUT } from '../base'
import type { AppRouteRecordRaw } from '../types'

const MANAGEMENT: AppRouteRecordRaw = {
  path: '/management',
  name: 'management',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '分支管理',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 2,
  },
  children: [
    {
      path: 'branch-employee-add',
      name: 'branchEmployeeAdd',
      component: () => import('@/views/form/branch-employee-add/index.vue'),
      meta: {
        locale: 'menu.form.branchEmployeeAdd',
        requiresAuth: true,
        icon: 'icon-user-add',
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
        icon: 'icon-list',
        roles: ['branch-admin'],
      },
    },
  ],
}

export default MANAGEMENT
