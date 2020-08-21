export default [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/dash',
    name: 'dash',
    component: () => import('@/views/Dash.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/citybeaches',
        name: 'citybeaches',
        component: () => import('@/views/Citybeaches.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/available',
        name: 'available',
        component: () => import('@/views/Available.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/Cart.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/shell',
        name: 'shell',
        component: () => import('@/views/Shell.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/invoices',
        name: 'invoices',
        component: () => import('@/views/Invoices.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/cash',
        name: 'cash',
        component: () => import('@/views/Cash.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/hello',
        name: 'hello',
        component: () => import('@/views/Hello.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tickets',
        name: 'tickets',
        component: () => import('@/views/Tickets.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
];
