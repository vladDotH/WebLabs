import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/book/:book_id",
    name: "book",
    component: () => import("../views/BookView.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
