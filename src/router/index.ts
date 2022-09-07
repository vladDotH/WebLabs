import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import WelcomeView from "@/views/WelcomeView.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'welcome',
        component: WelcomeView
    },
    {
        path: '/game',
        name: 'game',
        component: () => import('../views/GameView.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
