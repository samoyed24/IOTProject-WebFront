import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const FORM: AppRouteRecordRaw = {
  path: '/form',
  name: 'form',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.form',
    icon: 'icon-settings',
    requiresAuth: true,
    order: 3,
  },
  children: [
    {
      path: 'step',
      name: 'Step',
      component: () => import('@/views/form/step/index.vue'),
      meta: {
        locale: 'menu.form.step',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'group',
      name: 'Group',
      component: () => import('@/views/form/group/index.vue'),
      meta: {
        locale: 'menu.form.group',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'branch-template-create',
      name: 'BranchTemplateCreate',
      component: () => import('@/views/form/branch-template-create/index.vue'),
      meta: {
        locale: 'menu.form.branchTemplateCreate',
        requiresAuth: true,
        roles: ['branch-admin'],
      },
    },
    {
      path: 'warehouse-create',
      name: 'WarehouseCreate',
      component: () => import('@/views/form/warehouse-create/index.vue'),
      meta: {
        locale: 'menu.form.warehouseCreate',
        requiresAuth: true,
        roles: ['branch-admin'],
      },
    },
    {
      path: 'branch-employee-add',
      name: 'branchEmployeeAdd',
      component: () => import('@/views/form/branch-employee-add/index.vue'),
      meta: {
        locale: 'menu.form.branchEmployeeAdd',
        requiresAuth: true,
        roles: ['branch-admin'],
      },
    },
  ],
}

export default FORM
