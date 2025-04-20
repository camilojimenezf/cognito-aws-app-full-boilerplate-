import { createRouter, createWebHistory } from 'vue-router';

import { useAuth } from '../features/auth/presentation/composables/useAuth';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../features/home/presentation/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/auth',
      component: () => import('../features/auth/presentation/layouts/AuthLayout.vue'),
      beforeEnter: [],
      children: [
        {
          path: '/auth',
          name: 'auth',
          component: () => import('../features/auth/presentation/pages/AuthPage.vue'),
        },
      ],
    },
    {
      path: '/todo',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../features/todo/presentation/pages/TodoPage.vue'),
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const { checkAuth } = useAuth();

  const isAuthenticated = await checkAuth();

  if (to.path === '/auth' && isAuthenticated) {
    next('/');
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth');
  } else {
    next();
  }
});
