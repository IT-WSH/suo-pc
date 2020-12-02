import Layout from '@/layouts'
// import EmptyLayout from '@/layouts/EmptyLayout'
export default [
  {
    path: '/test',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/test/index'),
        meta: {
          title: 'test',
          icon: 'marker',
          permissions: ['admin'],
        },
      },
    ],
  },
  {
    path: '/user',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/user/info'),
        meta: {
          title: '个人信息',
          icon: 'user-cog',
          permissions: ['admin'],
        },
      },
    ],
  },
]
