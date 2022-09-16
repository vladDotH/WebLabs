import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/game',
        name: 'game',
        component: () => import('../views/GameView.vue')
    },
    {
        path: '/records',
        name: 'records',
        component: () => import('../views/RecordsView.vue')
    }
];

const router = new VueRouter({
    routes
});

export default router;
