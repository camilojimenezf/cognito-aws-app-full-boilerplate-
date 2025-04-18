import { createRouter, createWebHistory } from 'vue-router'

import { useAuth } from '../modules/auth/presentation/composables/useAuth'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../modules/home/presentation/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/auth',
      component: () => import('../modules/auth/presentation/layouts/AuthLayout.vue'),
      children: [
        {
          path: '/auth',
          name: 'auth',
          component: () => import('../modules/auth/presentation/pages/AuthPage.vue'),
        },
      ],
    },
    {
      path: '/todo',
      component: () => import('../modules/todo/presentation/pages/TodoPage.vue'),
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const { checkAuth } = useAuth()

  const isAuthenticated = await checkAuth()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
  } else {
    next()
  }
})
