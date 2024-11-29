import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/dashboard/DashboardView.vue'
import LoginPage from "@/views/login/LoginView.vue";

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard,
            meta: { requiresAuth: true }
        }
    ]
})

export default router