import { DEFAULT_LAYOUT } from '../base'
import type { AppRouteRecordRaw } from '../types'

const CARGO: AppRouteRecordRaw = {
  path: '/cargo',
  name: 'cargo',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '货物管理',
    requiresAuth: true,
    icon: 'icon-archive',
    order: 2,
  },
  children: [
    {
      path: 'branch-template-create',
      name: 'BranchTemplateCreate',
      component: () => import('@/views/form/branch-template-create/index.vue'),
      meta: {
        locale: '货物模板创建',
        requiresAuth: true,
        icon: 'icon-plus',
        roles: ['branch-admin'],
      },
    },
    {
      path: 'BranchTemplateTable', // The midline path complies with SEO specifications
      name: 'BranchTemplateTable',
      component: () => import('@/views/list/branch-template-table/index.vue'),
      meta: {
        locale: '货物模板管理',
        requiresAuth: true,
        icon: 'icon-copy',
        roles: ['branch-admin'],
      },
    },
    {
      path: 'branchCargoList', // The midline path complies with SEO specifications
      name: 'branchCargoList',
      component: () => import('@/views/list/branch-cargo-list/index.vue'),
      meta: {
        locale: '货物录入信息',
        requiresAuth: true,
        icon: 'icon-unordered-list',
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
        icon: 'icon-clock-circle',
        roles: ['branch-admin'],
        hideInMenu: false,
      },
    },
  ],
}

export default CARGO
